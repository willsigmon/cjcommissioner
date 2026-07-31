import { describe, expect, it } from "vitest";
import type { DonationSubmission } from "./validation";
import { fingerprintDonor } from "./contribution-store";

const donor: DonationSubmission = {
  clientAttemptId: "019fb298-d014-7000-8000-000000000001",
  fullName: "Jordan Neighbor",
  email: "jordan@example.com",
  phone: undefined,
  address: {
    line1: "123 Main Street",
    city: "Henderson",
    state: "NC",
    postalCode: "27537",
  },
  occupation: "Teacher",
  employer: "Vance County Schools",
  amountCents: 10_000,
  eligibilityConfirmed: true,
};

describe("contribution donor fingerprint", () => {
  const secret = "test-secret-that-is-longer-than-32-characters";

  it("normalizes harmless formatting differences", () => {
    const formatted = {
      ...donor,
      fullName: "  JORDAN   NEIGHBOR ",
      address: {
        ...donor.address,
        line1: "123 Main St.",
        postalCode: " 27537 ",
      },
    };

    expect(fingerprintDonor(formatted, secret)).toBe(
      fingerprintDonor(donor, secret),
    );
  });

  it("uses the complete mailing address for donor aggregation", () => {
    const differentCity = {
      ...donor,
      address: { ...donor.address, city: "Oxford" },
    };
    expect(fingerprintDonor(differentCity, secret)).not.toBe(
      fingerprintDonor(donor, secret),
    );

    const differentUnit = {
      ...donor,
      address: { ...donor.address, line2: "Apartment 4" },
    };
    expect(fingerprintDonor(differentUnit, secret)).not.toBe(
      fingerprintDonor(donor, secret),
    );
  });

  it("does not expose donor identity in the fingerprint", () => {
    const fingerprint = fingerprintDonor(donor, secret);
    expect(fingerprint).toMatch(/^[0-9a-f]{64}$/);
    expect(fingerprint).not.toContain("jordan");
    expect(fingerprint).not.toContain("27537");
  });
});
