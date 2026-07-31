import type Stripe from "stripe";
import { describe, expect, it } from "vitest";
import { parseStripeContributionEvent } from "./stripe-event";

function checkoutEvent(
  type:
    | "checkout.session.completed"
    | "checkout.session.async_payment_succeeded"
    | "checkout.session.async_payment_failed"
    | "checkout.session.expired",
  paymentStatus: Stripe.Checkout.Session.PaymentStatus = "paid",
) {
  return {
    id: `evt_${type}`,
    type,
    created: 1_800_000_000,
    livemode: false,
    data: {
      object: {
        id: "cs_test_example",
        amount_total: 10_000,
        payment_status: paymentStatus,
        payment_intent: "pi_test_example",
        metadata: {
          contribution_id: "019fb298-d014-7000-8000-000000000002",
        },
      },
    },
  } as unknown as Stripe.Event;
}

describe("Stripe contribution webhook events", () => {
  it("maps paid and pending Checkout completion states", () => {
    expect(
      parseStripeContributionEvent(
        checkoutEvent("checkout.session.completed", "paid"),
      )?.status,
    ).toBe("paid");
    expect(
      parseStripeContributionEvent(
        checkoutEvent("checkout.session.completed", "unpaid"),
      )?.status,
    ).toBe("pending");
  });

  it("maps asynchronous failure and expiration", () => {
    expect(
      parseStripeContributionEvent(
        checkoutEvent("checkout.session.async_payment_failed"),
      )?.status,
    ).toBe("failed");
    expect(
      parseStripeContributionEvent(
        checkoutEvent("checkout.session.expired"),
      )?.status,
    ).toBe("expired");
  });

  it("tracks partial and full refund amounts", () => {
    const partial = {
      id: "evt_refund_partial",
      type: "charge.refunded",
      created: 1_800_000_001,
      livemode: true,
      data: {
        object: {
          amount: 10_000,
          amount_refunded: 2_500,
          payment_intent: "pi_live_example",
          metadata: {
            contribution_id: "019fb298-d014-7000-8000-000000000002",
          },
        },
      },
    } as unknown as Stripe.Event;
    const full = {
      ...partial,
      id: "evt_refund_full",
      data: {
        object: {
          ...partial.data.object,
          amount_refunded: 10_000,
        },
      },
    } as unknown as Stripe.Event;

    expect(parseStripeContributionEvent(partial)).toMatchObject({
      status: "partially_refunded",
      refundedCents: 2_500,
    });
    expect(parseStripeContributionEvent(full)).toMatchObject({
      status: "refunded",
      refundedCents: 10_000,
    });
  });

  it("maps a successful charge and its reporting details", () => {
    const event = {
      id: "evt_charge_succeeded",
      type: "charge.succeeded",
      created: 1_800_000_001,
      livemode: true,
      data: {
        object: {
          id: "ch_live_example",
          amount: 10_000,
          amount_refunded: 0,
          balance_transaction: { fee: 320 },
          created: 1_800_000_000,
          paid: true,
          payment_intent: "pi_live_example",
          payment_method_details: {
            type: "card",
            card: { brand: "visa", wallet: null },
          },
          metadata: {
            contribution_id: "019fb298-d014-7000-8000-000000000002",
          },
        },
      },
    } as unknown as Stripe.Event;

    expect(parseStripeContributionEvent(event)).toMatchObject({
      status: "paid",
      grossAmountCents: 10_000,
      processingFeeCents: 320,
      paymentMethod: "Credit card (Visa)",
    });
  });

  it("ignores unrelated events and rejects missing contribution IDs", () => {
    expect(
      parseStripeContributionEvent({
        type: "customer.created",
      } as Stripe.Event),
    ).toBeNull();
    expect(() =>
      parseStripeContributionEvent({
        ...checkoutEvent("checkout.session.completed"),
        data: {
          object: {
            ...checkoutEvent("checkout.session.completed").data.object,
            metadata: {},
          },
        },
      } as Stripe.Event),
    ).toThrow(/missing contribution data/i);
  });
});
