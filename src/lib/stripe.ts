import Stripe from "stripe";

let stripe: Stripe | undefined;

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey) {
    throw new Error("Stripe is not configured.");
  }
  stripe ??= new Stripe(secretKey, {
    appInfo: {
      name: "CJ Turrentine Campaign Website",
      version: "1.0.0",
    },
  });
  return stripe;
}

export function getCanonicalSiteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!value) throw new Error("Canonical site URL is not configured.");
  return new URL(value).origin;
}

export function donationsAreEnabled() {
  return (
    process.env.DONATIONS_ENABLED === "true" &&
    process.env.TREASURER_COPY_APPROVED === "true"
  );
}

export type WebhookOutcome =
  | "completed"
  | "failed"
  | "expired"
  | "ignored";

export function classifyWebhookEvent(event: Stripe.Event): WebhookOutcome {
  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
      return "completed";
    case "checkout.session.async_payment_failed":
      return "failed";
    case "checkout.session.expired":
      return "expired";
    default:
      return "ignored";
  }
}
