import { readFile } from "node:fs/promises";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

type ReservationResult = {
  ok: boolean;
  reason?: string;
  remaining_cents?: number;
  reused?: boolean;
  contribution?: { id: string };
};

type WebhookResult = {
  ok: boolean;
  duplicate?: boolean;
  reason?: string;
  status?: string;
};

const migrationPath = path.join(
  process.cwd(),
  "supabase/migrations/20260729190000_create_campaign_contribution_ledger.sql",
);

describe("campaign contribution ledger migration", () => {
  let database: PGlite;

  beforeEach(async () => {
    database = new PGlite({ extensions: { pgcrypto } });
    await database.exec(`
      create role anon;
      create role authenticated;
      create role service_role;
    `);
    await database.exec(await readFile(migrationPath, "utf8"));
  });

  afterEach(async () => {
    await database.close();
  });

  it("releases failed and expired attempts without releasing gross refunded contributions", async () => {
    const failedAttempt = "00000000-0000-4000-8000-000000000001";
    const paidAttempt = "00000000-0000-4000-8000-000000000002";
    const nextAttempt = "00000000-0000-4000-8000-000000000003";

    expect((await reserve(failedAttempt, 680_000)).ok).toBe(true);
    await database.query(
      "update public.campaign_contributions set status = 'failed' where client_attempt_id = $1::uuid",
      [failedAttempt],
    );

    const paidReservation = await reserve(paidAttempt, 680_000);
    expect(paidReservation.ok).toBe(true);
    await database.query(
      `update public.campaign_contributions
          set status = 'refunded',
              paid_at = now(),
              gross_amount_cents = amount_cents,
              processing_fee_cents = 0,
              payment_method = 'Credit card',
              refunded_cents = amount_cents
        where client_attempt_id = $1::uuid`,
      [paidAttempt],
    );

    const blocked = await reserve(nextAttempt, 500);
    expect(blocked).toMatchObject({
      ok: false,
      reason: "contribution_limit_exceeded",
      remaining_cents: 0,
    });

    const totals = await database.query<{
      donor_election_total_cents: number;
      flagged_over_fifty: boolean;
      refunded_cents: number;
    }>(
      `select donor_election_total_cents, flagged_over_fifty, refunded_cents
         from public.campaign_contribution_export
        where id = $1::uuid`,
      [paidReservation.contribution?.id],
    );
    expect(totals.rows[0]).toEqual({
      donor_election_total_cents: 680_000,
      flagged_over_fifty: true,
      refunded_cents: 680_000,
    });
  });

  it("requires a new client attempt after a terminal payment attempt", async () => {
    const reusableAttempt = "00000000-0000-4000-8000-000000000010";
    const otherAttempt = "00000000-0000-4000-8000-000000000011";

    expect((await reserve(reusableAttempt, 500)).ok).toBe(true);
    await database.query(
      "update public.campaign_contributions set status = 'failed' where client_attempt_id = $1::uuid",
      [reusableAttempt],
    );

    expect((await reserve(otherAttempt, 680_000)).ok).toBe(true);

    const reused = await reserve(reusableAttempt, 500);
    expect(reused).toMatchObject({
      ok: false,
      reason: "attempt_terminal",
    });
  });

  it("rechecks the cap before reusing an otherwise active attempt", async () => {
    const activeAttempt = "00000000-0000-4000-8000-000000000015";
    const importedAttempt = "00000000-0000-4000-8000-000000000016";

    expect((await reserve(activeAttempt, 500)).ok).toBe(true);
    await insertPaidContribution(importedAttempt, 680_000);

    expect(await reserve(activeAttempt, 500)).toMatchObject({
      ok: false,
      reason: "contribution_limit_exceeded",
      remaining_cents: 0,
    });
  });

  it("holds pending amounts until a signed terminal event changes their status", async () => {
    const stalePendingAttempt = "00000000-0000-4000-8000-000000000020";
    const blockedAttempt = "00000000-0000-4000-8000-000000000021";
    const releasedAttempt = "00000000-0000-4000-8000-000000000022";

    expect((await reserve(stalePendingAttempt, 680_000)).ok).toBe(true);
    await database.query(
      `update public.campaign_contributions
          set pending_expires_at = now() - interval '1 day'
        where client_attempt_id = $1::uuid`,
      [stalePendingAttempt],
    );

    expect(await reserve(blockedAttempt, 500)).toMatchObject({
      ok: false,
      reason: "contribution_limit_exceeded",
      remaining_cents: 0,
    });

    await database.query(
      "update public.campaign_contributions set status = 'expired' where client_attempt_id = $1::uuid",
      [stalePendingAttempt],
    );
    expect((await reserve(releasedAttempt, 680_000)).ok).toBe(true);
  });

  it("denies anonymous table and RPC access", async () => {
    await database.exec("set role anon");

    await expect(
      database.query("select * from public.campaign_contributions"),
    ).rejects.toThrow();
    await expect(
      reserve("00000000-0000-4000-8000-000000000030", 500),
    ).rejects.toThrow();
  });

  it("records a paid Stripe event once and preserves its payment audit fields", async () => {
    const reservation = await reserve(
      "00000000-0000-4000-8000-000000000040",
      10_000,
    );
    const contributionId = reservation.contribution?.id;
    expect(contributionId).toBeTruthy();

    await attachStripeSession(contributionId!, "cs_test_paid");
    const recorded = await recordStripeEvent({
      amountCents: 10_000,
      contributionId: contributionId!,
      eventId: "evt_paid_once",
      feeCents: 320,
    });
    expect(recorded).toMatchObject({ ok: true, duplicate: false, status: "paid" });

    const duplicate = await recordStripeEvent({
      amountCents: 10_000,
      contributionId: contributionId!,
      eventId: "evt_paid_once",
      feeCents: 999,
    });
    expect(duplicate).toMatchObject({ ok: true, duplicate: true });

    const stored = await database.query<{
      payment_method: string;
      processing_fee_cents: number;
      status: string;
    }>(
      `select payment_method, processing_fee_cents, status
         from public.campaign_contributions
        where id = $1::uuid`,
      [contributionId],
    );
    expect(stored.rows[0]).toEqual({
      payment_method: "Credit card (Visa)",
      processing_fee_cents: 320,
      status: "paid",
    });
  });

  it("does not consume a webhook event before its contribution exists", async () => {
    const contributionId = "00000000-0000-4000-8000-000000000050";
    await expect(
      recordStripeEvent({
        amountCents: 500,
        contributionId,
        eventId: "evt_missing_contribution",
        feeCents: 15,
      }),
    ).rejects.toThrow();

    const events = await database.query<{ count: number }>(
      "select count(*)::integer as count from public.stripe_webhook_events where stripe_event_id = 'evt_missing_contribution'",
    );
    expect(events.rows[0].count).toBe(0);
  });

  it("surfaces incomplete review rows so the export fails closed", async () => {
    const reservation = await reserve(
      "00000000-0000-4000-8000-000000000060",
      500,
    );
    await database.query(
      `update public.campaign_contributions
          set status = 'requires_review'
        where id = $1::uuid`,
      [reservation.contribution?.id],
    );

    const reviewRows = await database.query<{ count: number }>(
      `select count(*)::integer as count
         from public.campaign_contribution_export
        where id = $1::uuid`,
      [reservation.contribution?.id],
    );
    expect(reviewRows.rows[0].count).toBe(1);
  });

  async function reserve(clientAttemptId: string, amountCents: number) {
    const result = await database.query<{ result: ReservationResult }>(
      `select public.reserve_online_campaign_contribution(
        $1::uuid,
        '2026-general',
        'same-donor-fingerprint',
        'Jamie Donor',
        'jamie@example.com',
        '',
        '100 Main Street',
        '',
        'Henderson',
        'NC',
        '27536',
        'Teacher',
        'Public education',
        $2::integer,
        true,
        'Required eligibility attestation',
        680000
      ) as result`,
      [clientAttemptId, amountCents],
    );

    return result.rows[0].result;
  }

  async function insertPaidContribution(
    clientAttemptId: string,
    amountCents: number,
  ) {
    await database.query(
      `insert into public.campaign_contributions (
        client_attempt_id,
        election_slug,
        source,
        donor_fingerprint,
        full_name,
        email,
        mailing_line1,
        mailing_city,
        mailing_state,
        mailing_postal_code,
        occupation,
        employer,
        amount_cents,
        contribution_limit_cents,
        eligibility_attested,
        eligibility_attestation_text,
        status,
        gross_amount_cents,
        processing_fee_cents,
        payment_method,
        paid_at
      ) values (
        $1::uuid,
        '2026-general',
        'offline',
        'same-donor-fingerprint',
        'Jamie Donor',
        'jamie@example.com',
        '100 Main Street',
        'Henderson',
        'NC',
        '27536',
        'Teacher',
        'Public education',
        $2::integer,
        680000,
        true,
        'Imported campaign record',
        'paid',
        $2::integer,
        0,
        'Imported payment',
        now()
      )`,
      [clientAttemptId, amountCents],
    );
  }

  async function attachStripeSession(contributionId: string, sessionId: string) {
    await database.query(
      `select public.attach_stripe_contribution_session(
        $1::uuid,
        $2::text,
        false,
        now() + interval '30 minutes'
      )`,
      [contributionId, sessionId],
    );
  }

  async function recordStripeEvent(input: {
    amountCents: number;
    contributionId: string;
    eventId: string;
    feeCents: number;
  }) {
    const result = await database.query<{ result: WebhookResult }>(
      `select public.record_stripe_contribution_event(
        $1::text,
        'charge.succeeded',
        now(),
        false,
        $2::uuid,
        null,
        $3::text,
        $4::text,
        $5::integer,
        0,
        'paid',
        now(),
        $5::integer,
        $6::integer,
        'Credit card (Visa)'
      ) as result`,
      [
        input.eventId,
        input.contributionId,
        `pi_${input.contributionId}`,
        `ch_${input.contributionId}`,
        input.amountCents,
        input.feeCents,
      ],
    );
    return result.rows[0].result;
  }
});
