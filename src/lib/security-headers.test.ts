import { describe, expect, it } from "vitest";
import nextConfig from "../../next.config";

describe("payment security headers", () => {
  it("allows only the Stripe origins required by embedded Checkout", async () => {
    const rules = await nextConfig.headers?.();
    const headers = rules?.[0]?.headers ?? [];
    const value = (key: string) =>
      headers.find((header) => header.key === key)?.value ?? "";

    const csp = value("Content-Security-Policy");
    expect(csp).toContain(
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://checkout.stripe.com",
    );
    expect(csp).toContain("img-src 'self' data: blob: https://*.stripe.com");
    expect(csp).toContain(
      "connect-src 'self' https://api.stripe.com https://r.stripe.com https://checkout.stripe.com",
    );
    expect(csp).toContain(
      "frame-src https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com",
    );

    expect(value("Permissions-Policy")).toContain(
      'payment=(self "https://js.stripe.com" "https://checkout.stripe.com")',
    );
  });
});
