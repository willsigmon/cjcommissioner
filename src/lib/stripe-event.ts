import type Stripe from "stripe";

export type StripeContributionUpdate = {
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
  status:
    | "pending"
    | "paid"
    | "failed"
    | "expired"
    | "refunded"
    | "partially_refunded";
  paidAt: number | null;
  grossAmountCents: number | null;
  processingFeeCents: number | null;
  paymentMethod: string | null;
};

export function parseStripeContributionEvent(
  event: Stripe.Event,
): StripeContributionUpdate | null {
  switch (event.type) {
    case "charge.succeeded":
    case "charge.updated":
    case "charge.refunded":
      return parseCharge(event);
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
    case "checkout.session.async_payment_failed":
    case "checkout.session.expired":
      return parseCheckoutSession(event);
    default:
      return null;
  }
}

function parseCheckoutSession(
  event:
    | Stripe.CheckoutSessionCompletedEvent
    | Stripe.CheckoutSessionAsyncPaymentSucceededEvent
    | Stripe.CheckoutSessionAsyncPaymentFailedEvent
    | Stripe.CheckoutSessionExpiredEvent,
): StripeContributionUpdate {
  const session = event.data.object;
  const contributionId = session.metadata?.contribution_id;
  if (!contributionId || typeof session.amount_total !== "number") {
    throw new Error("Stripe Checkout Session is missing contribution data.");
  }

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  let status: StripeContributionUpdate["status"];
  switch (event.type) {
    case "checkout.session.completed":
      status = session.payment_status === "paid" ? "paid" : "pending";
      break;
    case "checkout.session.async_payment_succeeded":
      status = "paid";
      break;
    case "checkout.session.async_payment_failed":
      status = "failed";
      break;
    case "checkout.session.expired":
      status = "expired";
      break;
  }

  return {
    stripeEventId: event.id,
    eventType: event.type,
    eventCreatedAt: event.created,
    livemode: event.livemode,
    contributionId,
    checkoutSessionId: session.id,
    paymentIntentId,
    chargeId: null,
    amountCents: session.amount_total,
    refundedCents: 0,
    status,
    paidAt: status === "paid" ? event.created : null,
    grossAmountCents: session.amount_total,
    processingFeeCents: null,
    paymentMethod: null,
  };
}

function parseCharge(
  event:
    | Stripe.ChargeSucceededEvent
    | Stripe.ChargeUpdatedEvent
    | Stripe.ChargeRefundedEvent,
): StripeContributionUpdate {
  const charge = event.data.object;
  const contributionId = charge.metadata?.contribution_id;
  if (!contributionId) {
    throw new Error("Stripe refund is missing a contribution ID.");
  }

  const status =
    event.type === "charge.refunded"
      ? charge.amount_refunded >= charge.amount
        ? "refunded"
        : "partially_refunded"
      : charge.paid
        ? "paid"
        : "pending";

  return {
    stripeEventId: event.id,
    eventType: event.type,
    eventCreatedAt: event.created,
    livemode: event.livemode,
    contributionId,
    checkoutSessionId: null,
    paymentIntentId:
      typeof charge.payment_intent === "string"
        ? charge.payment_intent
        : charge.payment_intent?.id ?? null,
    chargeId: charge.id,
    amountCents: charge.amount,
    refundedCents: charge.amount_refunded,
    status,
    paidAt: charge.paid ? charge.created : null,
    grossAmountCents: charge.amount,
    processingFeeCents:
      charge.balance_transaction &&
      typeof charge.balance_transaction !== "string"
        ? charge.balance_transaction.fee
        : null,
    paymentMethod: formatStripePaymentMethod(charge.payment_method_details),
  };
}

export function formatStripePaymentMethod(
  details: Stripe.Charge.PaymentMethodDetails | null,
) {
  if (!details) return null;

  if (details.type === "card" && details.card) {
    const walletType = details.card.wallet?.type;
    if (walletType) {
      const walletNames: Record<string, string> = {
        apple_pay: "Apple Pay",
        google_pay: "Google Pay",
        link: "Link",
        samsung_pay: "Samsung Pay",
      };
      return `Credit card (${walletNames[walletType] ?? walletType})`;
    }

    const brand = details.card.brand;
    return brand
      ? `Credit card (${brand.charAt(0).toUpperCase()}${brand.slice(1)})`
      : "Credit card";
  }

  const names: Record<string, string> = {
    ach_credit_transfer: "ACH credit transfer",
    ach_debit: "ACH debit",
    cashapp: "Cash App",
    link: "Link",
    paypal: "PayPal",
    us_bank_account: "ACH bank transfer",
  };
  return names[details.type] ?? details.type.replaceAll("_", " ");
}
