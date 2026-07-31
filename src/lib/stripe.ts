import Stripe from "stripe";
import { contributionStoreIsConfigured } from "./contribution-store";
import { DONATION_POLICY_VERSION } from "./donation-policy";

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
  const electionSlug = process.env.DONATION_ELECTION_SLUG?.trim();
  const enabled =
    process.env.DONATIONS_ENABLED === "true" &&
    process.env.TREASURER_COPY_APPROVED === "true" &&
    process.env.CONTRIBUTION_HISTORY_RECONCILED === "true" &&
    process.env.TREASURER_APPROVED_POLICY_VERSION?.trim() ===
      DONATION_POLICY_VERSION &&
    Boolean(
      electionSlug &&
        process.env.RECONCILED_ELECTION_SLUG?.trim() === electionSlug,
    ) &&
    Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim()) &&
    Boolean(process.env.STRIPE_SECRET_KEY?.trim()) &&
    Boolean(process.env.STRIPE_WEBHOOK_SECRET?.trim()) &&
    Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim()) &&
    Boolean(process.env.VERCEL_DONATION_RATE_LIMIT_ID?.trim()) &&
    Boolean(
      process.env.DONATION_EXPORT_TOKEN?.trim() &&
        process.env.DONATION_EXPORT_TOKEN.trim().length >= 32,
    ) &&
    contributionStoreIsConfigured();

  if (!enabled) return false;

  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const liveMode = process.env.VERCEL_ENV === "production";

  return liveMode
    ? publishableKey?.startsWith("pk_live_") === true &&
        secretKey?.startsWith("sk_live_") === true
    : publishableKey?.startsWith("pk_test_") === true &&
        secretKey?.startsWith("sk_test_") === true;
}
