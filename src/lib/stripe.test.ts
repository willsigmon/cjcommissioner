import Stripe from "stripe";
import { afterEach, describe, expect, it, vi } from "vitest";
import { donationsAreEnabled } from "./stripe";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("Stripe webhook verification", () => {
  it("accepts a valid test signature and rejects a changed payload", () => {
    const stripe = new Stripe("sk_test_placeholder");
    const secret = "whsec_test_secret";
    const payload = JSON.stringify({
      id: "evt_test",
      object: "event",
      type: "checkout.session.completed",
      data: { object: { id: "cs_test" } },
    });
    const header = stripe.webhooks.generateTestHeaderString({
      payload,
      secret,
    });

    expect(() =>
      stripe.webhooks.constructEvent(payload, header, secret),
    ).not.toThrow();
    expect(() =>
      stripe.webhooks.constructEvent(`${payload} `, header, secret),
    ).toThrow();
  });
});

describe("Stripe production readiness", () => {
  function configureRequiredEnvironment() {
    vi.stubEnv("DONATIONS_ENABLED", "true");
    vi.stubEnv("TREASURER_COPY_APPROVED", "true");
    vi.stubEnv("CONTRIBUTION_HISTORY_RECONCILED", "true");
    vi.stubEnv("STRIPE_WEBHOOK_SECRET", "whsec_test");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.cjcommissioner.com");
    vi.stubEnv("VERCEL_DONATION_RATE_LIMIT_ID", "donation-session");
    vi.stubEnv("SUPABASE_URL", "https://campaign.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-role-key");
    vi.stubEnv(
      "DONATION_FINGERPRINT_SECRET",
      "test-secret-that-is-longer-than-32-characters",
    );
    vi.stubEnv("DONATION_ELECTION_SLUG", "2026-general");
    vi.stubEnv(
      "DONATION_EXPORT_TOKEN",
      "test-export-token-that-is-longer-than-32-characters",
    );
  }

  it("fails closed on test keys in Vercel production", () => {
    configureRequiredEnvironment();
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", "pk_test_example");
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_example");
    expect(donationsAreEnabled()).toBe(false);
  });

  it("opens only when every production gate and live key is present", () => {
    configureRequiredEnvironment();
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", "pk_live_example");
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_live_example");
    expect(donationsAreEnabled()).toBe(true);
  });

  it("stays closed when the protected treasurer export is not configured", () => {
    configureRequiredEnvironment();
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", "pk_live_example");
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_live_example");
    vi.stubEnv("DONATION_EXPORT_TOKEN", "");
    expect(donationsAreEnabled()).toBe(false);
  });

  it("stays closed until earlier contributions are reconciled", () => {
    configureRequiredEnvironment();
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", "pk_live_example");
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_live_example");
    vi.stubEnv("CONTRIBUTION_HISTORY_RECONCILED", "false");
    expect(donationsAreEnabled()).toBe(false);
  });
});
