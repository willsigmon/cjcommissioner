import { afterEach, describe, expect, it, vi } from "vitest";
import { isDonationAdminAuthorized } from "./donation-admin-auth";

afterEach(() => vi.unstubAllEnvs());

function request(authorization?: string) {
  return new Request("https://www.cjcommissioner.com/api/admin/test", {
    headers: authorization ? { authorization } : undefined,
  });
}

describe("donation admin authorization", () => {
  it("accepts only the configured bearer token", () => {
    const token = "a-secure-token-with-at-least-32-characters";
    vi.stubEnv("DONATION_EXPORT_TOKEN", token);

    expect(isDonationAdminAuthorized(request(`Bearer ${token}`))).toBe(true);
    expect(isDonationAdminAuthorized(request("Bearer incorrect-token"))).toBe(
      false,
    );
    expect(isDonationAdminAuthorized(request())).toBe(false);
  });

  it("fails closed when the configured token is too short", () => {
    vi.stubEnv("DONATION_EXPORT_TOKEN", "too-short");
    expect(isDonationAdminAuthorized(request("Bearer too-short"))).toBe(false);
  });
});
