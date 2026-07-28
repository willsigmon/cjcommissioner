import { describe, expect, it } from "vitest";
import {
  DONATION_MAX_CENTS,
  DONATION_MIN_CENTS,
  validateDonationPayload,
  validateVolunteerPayload,
} from "./validation";

const volunteer = {
  name: "Jordan Neighbor",
  email: "jordan@example.com",
  phone: "",
  zip: "27537",
  interests: ["Canvassing"],
  message: "",
  consent: true,
  sourcePath: "/?utm_source=sign",
  utm: { source: "sign" },
  website: "",
  startedAt: 1_000,
};

const donor = {
  fullName: "Jordan Neighbor",
  email: "jordan@example.com",
  phone: "",
  address: {
    line1: "123 Main Street",
    line2: "",
    city: "Henderson",
    state: "NC",
    postalCode: "27537",
  },
  occupation: "Teacher",
  employer: "Vance County Schools",
  amountCents: 10_000,
  attestations: {
    personalFunds: true,
    ownName: true,
    lawfulSource: true,
    limitAcknowledged: true,
  },
};

describe("validateVolunteerPayload", () => {
  it("accepts a complete submission after the minimum completion time", () => {
    const result = validateVolunteerPayload(volunteer, 4_000);
    expect(result.ok).toBe(true);
  });

  it("rejects bots and unrealistically fast submissions", () => {
    const fast = validateVolunteerPayload(volunteer, 2_000);
    const trap = validateVolunteerPayload(
      { ...volunteer, website: "https://spam.example" },
      4_000,
    );
    expect(fast.ok).toBe(false);
    expect(trap.ok).toBe(false);
  });

  it("returns field-safe errors", () => {
    const result = validateVolunteerPayload(
      { ...volunteer, email: "invalid", zip: "123" },
      4_000,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fields.email).toBeTruthy();
      expect(result.fields.zip).toBeTruthy();
      expect(JSON.stringify(result)).not.toContain("jordan@example.com");
    }
  });
});

describe("validateDonationPayload", () => {
  it.each([DONATION_MIN_CENTS, DONATION_MAX_CENTS])(
    "accepts the inclusive amount boundary %i",
    (amountCents) => {
      expect(validateDonationPayload({ ...donor, amountCents }).ok).toBe(true);
    },
  );

  it.each([DONATION_MIN_CENTS - 1, DONATION_MAX_CENTS + 1])(
    "rejects an out-of-range amount %i",
    (amountCents) => {
      const result = validateDonationPayload({ ...donor, amountCents });
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.fields.amountCents).toBeTruthy();
    },
  );

  it("requires all reporting and eligibility fields", () => {
    const result = validateDonationPayload({
      ...donor,
      occupation: "",
      attestations: { ...donor.attestations, ownName: false },
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fields.occupation).toBeTruthy();
      expect(result.fields.attestations).toBeTruthy();
    }
  });
});
