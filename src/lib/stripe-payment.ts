import type Stripe from "stripe";
import {
  formatStripePaymentMethod,
  type StripeContributionUpdate,
} from "./stripe-event";

type ChargeReportingDetails = Pick<
  StripeContributionUpdate,
  | "chargeId"
  | "grossAmountCents"
  | "paidAt"
  | "processingFeeCents"
  | "paymentMethod"
>;

export function extractChargeReportingDetails(
  charge: Stripe.Charge,
): ChargeReportingDetails {
  const balanceTransaction = charge.balance_transaction;
  if (
    !balanceTransaction ||
    typeof balanceTransaction === "string" ||
    !Number.isSafeInteger(balanceTransaction.fee) ||
    balanceTransaction.fee < 0
  ) {
    throw new Error("Stripe charge is missing its processing fee.");
  }

  const paymentMethod = formatStripePaymentMethod(
    charge.payment_method_details,
  );
  if (!paymentMethod) {
    throw new Error("Stripe charge is missing its payment method.");
  }

  return {
    chargeId: charge.id,
    grossAmountCents: charge.amount,
    paidAt: charge.created,
    processingFeeCents: balanceTransaction.fee,
    paymentMethod,
  };
}

export async function enrichStripeContributionUpdate(
  stripe: Stripe,
  update: StripeContributionUpdate,
): Promise<StripeContributionUpdate> {
  if (
    !["paid", "partially_refunded", "refunded"].includes(update.status)
  ) {
    return update;
  }

  let charge: Stripe.Charge | null = null;
  if (update.chargeId) {
    const retrieved = await stripe.charges.retrieve(update.chargeId, {
      expand: ["balance_transaction"],
    });
    charge = retrieved;
  } else if (update.paymentIntentId) {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      update.paymentIntentId,
      { expand: ["latest_charge.balance_transaction"] },
    );
    if (
      paymentIntent.latest_charge &&
      typeof paymentIntent.latest_charge !== "string"
    ) {
      charge = paymentIntent.latest_charge;
    }
  }

  if (!charge) {
    throw new Error("Stripe payment is missing its charge details.");
  }

  const details = extractChargeReportingDetails(charge);
  if (details.grossAmountCents !== update.amountCents) {
    throw new Error("Stripe payment amount does not match the contribution.");
  }

  return { ...update, ...details };
}
