import type Stripe from "stripe";
import { recordStripeContributionEvent } from "./contribution-store";
import { getStripe } from "./stripe";
import type { StripeContributionUpdate } from "./stripe-event";
import { extractChargeReportingDetails } from "./stripe-payment";

type ReconciliationRow = {
  id: string;
  status: string;
  stripe_checkout_session_id: string;
};

export type ReconciliationSummary = {
  errors: number;
  expired: number;
  paid: number;
  reviewed: number;
  unchanged: number;
};

function getLedgerConfig() {
  const url = process.env.SUPABASE_URL?.trim().replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const electionSlug = process.env.DONATION_ELECTION_SLUG?.trim();
  if (!url || !serviceRoleKey || !electionSlug) {
    throw new Error("The contribution ledger is not configured.");
  }
  return { electionSlug, serviceRoleKey, url };
}

async function getReconciliationRows() {
  const { electionSlug, serviceRoleKey, url } = getLedgerConfig();
  const endpoint = new URL(`${url}/rest/v1/campaign_contributions`);
  const cutoff = new Date().toISOString();
  endpoint.searchParams.set(
    "select",
    "id,status,stripe_checkout_session_id",
  );
  endpoint.searchParams.set("election_slug", `eq.${electionSlug}`);
  endpoint.searchParams.set("stripe_checkout_session_id", "not.is.null");
  endpoint.searchParams.set("updated_at", `lte.${cutoff}`);
  endpoint.searchParams.set(
    "status",
    "in.(pending,paid,partially_refunded,refunded,requires_review)",
  );
  endpoint.searchParams.set("order", "created_at.asc,id.asc");

  const pageSize = 1_000;
  const rows: ReconciliationRow[] = [];
  let expectedTotal: number | null = null;
  for (let start = 0; ; ) {
    const response = await fetch(endpoint, {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Prefer: "count=exact",
        Range: `${start}-${start + pageSize - 1}`,
        "Range-Unit": "items",
      },
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(
        `Contribution reconciliation query failed with status ${response.status}.`,
      );
    }

    const contentRange = response.headers.get("content-range");
    const totalMatch = contentRange?.match(/\/(\d+)$/);
    if (!totalMatch) {
      throw new Error(
        "Contribution reconciliation response did not include an exact row count.",
      );
    }
    const responseTotal = Number(totalMatch[1]);
    if (expectedTotal === null) expectedTotal = responseTotal;
    if (responseTotal !== expectedTotal) {
      throw new Error(
        "Contribution records changed during reconciliation. Run it again.",
      );
    }

    const page = (await response.json()) as ReconciliationRow[];
    rows.push(...page);
    if (rows.length >= expectedTotal) break;
    if (page.length === 0) {
      throw new Error(
        "Contribution reconciliation ended before every row was received.",
      );
    }
    start += page.length;
  }
  return { electionSlug, rows };
}

export async function reconcileCampaignContributions(): Promise<ReconciliationSummary> {
  const stripe = getStripe();
  const { electionSlug, rows } = await getReconciliationRows();
  const summary: ReconciliationSummary = {
    errors: 0,
    expired: 0,
    paid: 0,
    reviewed: 0,
    unchanged: 0,
  };

  for (const row of rows) {
    try {
      const session = await stripe.checkout.sessions.retrieve(
        row.stripe_checkout_session_id,
        { expand: ["payment_intent.latest_charge.balance_transaction"] },
      );
      if (session.metadata?.contribution_id !== row.id) {
        throw new Error("Stripe session contribution metadata does not match.");
      }
      if (session.metadata.election_slug !== electionSlug) {
        throw new Error("Stripe session election metadata does not match.");
      }

      const outcome = await reconcileStripeSession(session, stripe);
      if (row.status === "requires_review") summary.reviewed += 1;
      if (outcome === "paid") summary.paid += 1;
      else if (outcome === "expired") summary.expired += 1;
      else summary.unchanged += 1;
    } catch (error) {
      summary.errors += 1;
      console.error("Contribution reconciliation failed.", {
        contributionId: row.id,
        error: error instanceof Error ? error.name : "UnknownError",
      });
    }
  }

  return summary;
}

export async function reconcileStripeSession(
  session: Stripe.Checkout.Session,
  stripe = getStripe(),
) {
  if (
    !session.metadata?.contribution_id ||
    typeof session.amount_total !== "number"
  ) {
    throw new Error("Stripe session is missing contribution data.");
  }

  if (session.payment_status === "paid") {
    const charge = await getSessionCharge(session, stripe);
    await recordStripeContributionEvent(
      buildReconciledChargeUpdate(session, charge),
    );
    return "paid" as const;
  }

  if (session.status === "expired") {
    await recordStripeContributionEvent(buildReconciledExpiredUpdate(session));
    return "expired" as const;
  }

  return "unchanged" as const;
}

async function getSessionCharge(
  session: Stripe.Checkout.Session,
  stripe: Stripe,
) {
  let paymentIntent: Stripe.PaymentIntent;
  if (typeof session.payment_intent === "string") {
    paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent, {
      expand: ["latest_charge.balance_transaction"],
    });
  } else if (session.payment_intent) {
    paymentIntent = session.payment_intent;
  } else {
    throw new Error("Paid Stripe session is missing its PaymentIntent.");
  }

  const latestCharge = paymentIntent.latest_charge;
  if (!latestCharge) {
    throw new Error("Paid Stripe session is missing its charge.");
  }
  if (typeof latestCharge === "string") {
    return stripe.charges.retrieve(latestCharge, {
      expand: ["balance_transaction"],
    });
  }
  if (typeof latestCharge.balance_transaction === "string") {
    return stripe.charges.retrieve(latestCharge.id, {
      expand: ["balance_transaction"],
    });
  }
  return latestCharge;
}

export function buildReconciledChargeUpdate(
  session: Stripe.Checkout.Session,
  charge: Stripe.Charge,
  eventCreatedAt = Math.floor(Date.now() / 1_000),
): StripeContributionUpdate {
  const contributionId = session.metadata?.contribution_id;
  if (!contributionId || typeof session.amount_total !== "number") {
    throw new Error("Stripe session is missing contribution data.");
  }

  const details = extractChargeReportingDetails(charge);
  if (details.grossAmountCents !== session.amount_total) {
    throw new Error("Stripe reconciliation amount does not match the session.");
  }
  const status =
    charge.amount_refunded >= charge.amount
      ? "refunded"
      : charge.amount_refunded > 0
        ? "partially_refunded"
        : "paid";

  return {
    stripeEventId: `reconcile:${charge.id}:${charge.amount_refunded}`,
    eventType: "reconcile.charge",
    eventCreatedAt,
    livemode: session.livemode,
    contributionId,
    checkoutSessionId: session.id,
    paymentIntentId:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null,
    amountCents: charge.amount,
    refundedCents: charge.amount_refunded,
    status,
    ...details,
  };
}

export function buildReconciledExpiredUpdate(
  session: Stripe.Checkout.Session,
  eventCreatedAt = Math.floor(Date.now() / 1_000),
): StripeContributionUpdate {
  const contributionId = session.metadata?.contribution_id;
  if (!contributionId || typeof session.amount_total !== "number") {
    throw new Error("Stripe session is missing contribution data.");
  }

  return {
    stripeEventId: `reconcile:${session.id}:expired`,
    eventType: "reconcile.checkout_session.expired",
    eventCreatedAt,
    livemode: session.livemode,
    contributionId,
    checkoutSessionId: session.id,
    paymentIntentId:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null,
    chargeId: null,
    amountCents: session.amount_total,
    refundedCents: 0,
    status: "expired",
    paidAt: null,
    grossAmountCents: null,
    processingFeeCents: null,
    paymentMethod: null,
  };
}
