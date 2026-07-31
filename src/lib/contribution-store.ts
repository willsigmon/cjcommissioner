import { createHmac } from "node:crypto";
import {
  DONATION_ELIGIBILITY_ATTESTATION,
  DONATION_MAX_CENTS,
} from "./donation-policy";
import type { DonationSubmission } from "./validation";

type ContributionStatus =
  | "pending"
  | "paid"
  | "failed"
  | "expired"
  | "refunded"
  | "partially_refunded"
  | "requires_review";

type ContributionRow = {
  id: string;
  amount_cents: number;
  election_slug: string;
  status: ContributionStatus;
  stripe_checkout_session_id: string | null;
};

type ReservationResponse = {
  ok: boolean;
  reason?:
    | "invalid_amount"
    | "eligibility_not_confirmed"
    | "attempt_terminal"
    | "request_conflict"
    | "contribution_limit_exceeded";
  remaining_cents?: number;
  reused?: boolean;
  contribution?: ContributionRow;
};

type WebhookResponse = {
  ok: boolean;
  duplicate?: boolean;
  reason?: "attach_conflict" | "contribution_not_found";
  status?: ContributionStatus;
};

export class ContributionLimitError extends Error {
  constructor(readonly remainingCents: number) {
    super("Contribution limit exceeded.");
    this.name = "ContributionLimitError";
  }
}

export class ContributionAttemptTerminalError extends Error {
  constructor() {
    super("Contribution attempt is no longer active.");
    this.name = "ContributionAttemptTerminalError";
  }
}

export class ContributionStoreError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContributionStoreError";
  }
}

function getConfig() {
  const url = process.env.SUPABASE_URL?.trim().replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const fingerprintSecret = process.env.DONATION_FINGERPRINT_SECRET?.trim();
  const electionSlug = process.env.DONATION_ELECTION_SLUG?.trim();

  if (
    !url ||
    !serviceRoleKey ||
    !fingerprintSecret ||
    fingerprintSecret.length < 32 ||
    !electionSlug
  ) {
    throw new ContributionStoreError(
      "The secure contribution ledger is not configured.",
    );
  }

  return { electionSlug, fingerprintSecret, serviceRoleKey, url };
}

export function contributionStoreIsConfigured() {
  try {
    getConfig();
    return true;
  } catch {
    return false;
  }
}

function normalizeIdentityPart(value: string) {
  return value
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeStreetIdentity(value: string) {
  const replacements = [
    ["avenue", "ave"],
    ["boulevard", "blvd"],
    ["circle", "cir"],
    ["court", "ct"],
    ["drive", "dr"],
    ["highway", "hwy"],
    ["lane", "ln"],
    ["parkway", "pkwy"],
    ["place", "pl"],
    ["road", "rd"],
    ["street", "st"],
    ["terrace", "ter"],
  ] as const;

  return replacements.reduce(
    (address, [word, abbreviation]) =>
      address.replace(new RegExp(`\\b${word}\\b`, "g"), abbreviation),
    normalizeIdentityPart(value),
  );
}

export function fingerprintDonor(
  donor: DonationSubmission,
  secret = getConfig().fingerprintSecret,
) {
  const identity = [
    normalizeIdentityPart(donor.fullName),
    normalizeStreetIdentity(donor.address.line1),
    normalizeIdentityPart(donor.address.city),
    normalizeIdentityPart(donor.address.state),
    normalizeIdentityPart(donor.address.postalCode),
  ].join("|");

  return createHmac("sha256", secret).update(identity).digest("hex");
}

async function rpc<T>(
  functionName: string,
  body: Record<string, unknown>,
): Promise<T> {
  const { serviceRoleKey, url } = getConfig();
  const response = await fetch(`${url}/rest/v1/rpc/${functionName}`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new ContributionStoreError(
      `Contribution ledger request failed with status ${response.status}.`,
    );
  }

  return (await response.json()) as T;
}

export async function reserveContribution(
  donor: DonationSubmission,
  clientAttemptId: string,
) {
  const { electionSlug } = getConfig();
  const result = await rpc<ReservationResponse>(
    "reserve_online_campaign_contribution",
    {
      p_client_attempt_id: clientAttemptId,
      p_election_slug: electionSlug,
      p_donor_fingerprint: fingerprintDonor(donor),
      p_full_name: donor.fullName,
      p_email: donor.email,
      p_phone: donor.phone ?? "",
      p_mailing_line1: donor.address.line1,
      p_mailing_line2: donor.address.line2 ?? "",
      p_mailing_city: donor.address.city,
      p_mailing_state: donor.address.state,
      p_mailing_postal_code: donor.address.postalCode,
      p_occupation: donor.occupation,
      p_employer: donor.employer,
      p_amount_cents: donor.amountCents,
      p_eligibility_attested: donor.eligibilityConfirmed,
      p_eligibility_attestation_text: DONATION_ELIGIBILITY_ATTESTATION,
      p_max_cents: DONATION_MAX_CENTS,
    },
  );

  if (!result.ok) {
    if (result.reason === "contribution_limit_exceeded") {
      throw new ContributionLimitError(result.remaining_cents ?? 0);
    }
    if (result.reason === "attempt_terminal") {
      throw new ContributionAttemptTerminalError();
    }
    throw new ContributionStoreError(
      `Contribution reservation failed: ${result.reason ?? "unknown"}.`,
    );
  }

  if (!result.contribution) {
    throw new ContributionStoreError(
      "Contribution reservation returned no record.",
    );
  }

  return result.contribution;
}

export async function attachStripeSession(
  contributionId: string,
  session: {
    id: string;
    livemode: boolean;
    expiresAt: number;
  },
) {
  const result = await rpc<WebhookResponse>(
    "attach_stripe_contribution_session",
    {
      p_contribution_id: contributionId,
      p_checkout_session_id: session.id,
      p_stripe_livemode: session.livemode,
      p_pending_expires_at: new Date(session.expiresAt * 1_000).toISOString(),
    },
  );

  if (!result.ok) {
    throw new ContributionStoreError(
      `Stripe session could not be attached: ${result.reason ?? "unknown"}.`,
    );
  }
}

export async function markContributionFailed(contributionId: string) {
  const result = await rpc<{ ok: boolean }>(
    "mark_campaign_contribution_failed",
    { p_contribution_id: contributionId },
  );

  if (!result.ok) {
    throw new ContributionStoreError(
      "Contribution attempt could not be marked as failed.",
    );
  }
}

export async function recordStripeContributionEvent(input: {
  stripeEventId: string;
  eventType: string;
  eventCreatedAt: number;
  livemode: boolean;
  contributionId: string;
  checkoutSessionId: string | null;
  paymentIntentId: string | null;
  chargeId: string | null;
  amountCents: number;
  refundedCents: number;
  status: ContributionStatus;
  paidAt: number | null;
  grossAmountCents: number | null;
  processingFeeCents: number | null;
  paymentMethod: string | null;
}) {
  const result = await rpc<WebhookResponse>(
    "record_stripe_contribution_event",
    {
      p_stripe_event_id: input.stripeEventId,
      p_event_type: input.eventType,
      p_event_created_at: new Date(input.eventCreatedAt * 1_000).toISOString(),
      p_stripe_livemode: input.livemode,
      p_contribution_id: input.contributionId,
      p_checkout_session_id: input.checkoutSessionId,
      p_payment_intent_id: input.paymentIntentId,
      p_charge_id: input.chargeId,
      p_amount_cents: input.amountCents,
      p_refunded_cents: input.refundedCents,
      p_status: input.status,
      p_paid_at: input.paidAt
        ? new Date(input.paidAt * 1_000).toISOString()
        : null,
      p_gross_amount_cents: input.grossAmountCents,
      p_processing_fee_cents: input.processingFeeCents,
      p_payment_method: input.paymentMethod,
    },
  );

  if (!result.ok) {
    throw new ContributionStoreError(
      `Stripe event could not be recorded: ${result.reason ?? "unknown"}.`,
    );
  }

  return result;
}
