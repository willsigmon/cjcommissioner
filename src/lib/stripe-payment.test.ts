import type Stripe from "stripe";
import { describe, expect, it } from "vitest";
import { extractChargeReportingDetails } from "./stripe-payment";

function charge(
  overrides: Partial<Stripe.Charge> = {},
): Stripe.Charge {
  return {
    id: "ch_test_example",
    amount: 10_000,
    created: 1_800_000_000,
    balance_transaction: {
      fee: 320,
    } as Stripe.BalanceTransaction,
    payment_method_details: {
      type: "card",
      card: {
        brand: "visa",
        wallet: null,
      },
    } as Stripe.Charge.PaymentMethodDetails,
    ...overrides,
  } as Stripe.Charge;
}

describe("Stripe reporting details", () => {
  it("extracts gross amount, processing fee, and card method", () => {
    expect(extractChargeReportingDetails(charge())).toEqual({
      chargeId: "ch_test_example",
      grossAmountCents: 10_000,
      paidAt: 1_800_000_000,
      processingFeeCents: 320,
      paymentMethod: "Credit card (Visa)",
    });
  });

  it("identifies wallet-backed card payments", () => {
    expect(
      extractChargeReportingDetails(
        charge({
          payment_method_details: {
            type: "card",
            card: {
              brand: "mastercard",
              wallet: { type: "apple_pay" },
            },
          } as Stripe.Charge.PaymentMethodDetails,
        }),
      ).paymentMethod,
    ).toBe("Credit card (Apple Pay)");
  });

  it("rejects a charge before Stripe exposes its fee", () => {
    expect(() =>
      extractChargeReportingDetails(charge({ balance_transaction: "txn_123" })),
    ).toThrow(/processing fee/i);
  });
});
