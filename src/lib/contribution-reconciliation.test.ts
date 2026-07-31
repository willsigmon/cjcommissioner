import type Stripe from "stripe";
import { describe, expect, it } from "vitest";
import {
  buildReconciledChargeUpdate,
  buildReconciledExpiredUpdate,
} from "./contribution-reconciliation";

const session = {
  id: "cs_test_reconcile",
  amount_total: 10_000,
  livemode: false,
  metadata: { contribution_id: "019fb298-d014-7000-8000-000000000099" },
  payment_intent: "pi_test_reconcile",
  payment_status: "paid",
  status: "complete",
} as unknown as Stripe.Checkout.Session;

function charge(overrides: Partial<Stripe.Charge> = {}) {
  return {
    id: "ch_test_reconcile",
    amount: 10_000,
    amount_refunded: 0,
    created: 1_800_000_000,
    paid: true,
    balance_transaction: { fee: 320 } as Stripe.BalanceTransaction,
    payment_method_details: {
      type: "card",
      card: { brand: "visa", wallet: null },
    } as Stripe.Charge.PaymentMethodDetails,
    ...overrides,
  } as Stripe.Charge;
}

describe("Stripe contribution reconciliation", () => {
  it("rebuilds a complete paid ledger update from Stripe", () => {
    expect(buildReconciledChargeUpdate(session, charge(), 1_800_000_100)).toMatchObject({
      stripeEventId: "reconcile:ch_test_reconcile:0",
      eventType: "reconcile.charge",
      eventCreatedAt: 1_800_000_100,
      contributionId: "019fb298-d014-7000-8000-000000000099",
      checkoutSessionId: "cs_test_reconcile",
      paymentIntentId: "pi_test_reconcile",
      chargeId: "ch_test_reconcile",
      amountCents: 10_000,
      refundedCents: 0,
      grossAmountCents: 10_000,
      processingFeeCents: 320,
      paymentMethod: "Credit card (Visa)",
      status: "paid",
    });
  });

  it("reconciles partial and full refunds without changing gross amount", () => {
    expect(
      buildReconciledChargeUpdate(
        session,
        charge({ amount_refunded: 2_500 }),
      ),
    ).toMatchObject({
      grossAmountCents: 10_000,
      refundedCents: 2_500,
      status: "partially_refunded",
    });
    expect(
      buildReconciledChargeUpdate(
        session,
        charge({ amount_refunded: 10_000 }),
      ),
    ).toMatchObject({
      grossAmountCents: 10_000,
      refundedCents: 10_000,
      status: "refunded",
    });
  });

  it("builds a terminal update for an expired unpaid session", () => {
    expect(
      buildReconciledExpiredUpdate(
        {
          ...session,
          payment_intent: null,
          payment_status: "unpaid",
          status: "expired",
        },
        1_800_000_100,
      ),
    ).toMatchObject({
      stripeEventId: "reconcile:cs_test_reconcile:expired",
      contributionId: "019fb298-d014-7000-8000-000000000099",
      amountCents: 10_000,
      status: "expired",
    });
  });

  it("rejects a Stripe amount mismatch", () => {
    expect(() =>
      buildReconciledChargeUpdate(session, charge({ amount: 9_999 })),
    ).toThrow(/does not match/i);
  });
});
