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
  clientAttemptId: "019fb298-d014-7000-8000-000000000001",
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
  eligibilityConfirmed: true,
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
      eligibilityConfirmed: false,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fields.occupation).toBeTruthy();
      expect(result.fields.eligibilityConfirmed).toBeTruthy();
    }
  });

  it.each([
    ["fullName", { fullName: "" }],
    ["line1", { address: { ...donor.address, line1: "" } }],
    ["city", { address: { ...donor.address, city: "" } }],
    ["state", { address: { ...donor.address, state: "" } }],
    ["postalCode", { address: { ...donor.address, postalCode: "" } }],
    ["occupation", { occupation: "" }],
    ["employer", { employer: "" }],
  ])("rejects a blank required donor field: %s", (field, override) => {
    const result = validateDonationPayload({ ...donor, ...override });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.fields[field]).toBeTruthy();
  });

  it("rejects anonymous and placeholder reporting values", () => {
    const result = validateDonationPayload({
      ...donor,
      fullName: "Anonymous",
      employer: "N/A",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fields.fullName).toBeTruthy();
      expect(result.fields.employer).toBeTruthy();
    }
  });

  it("requires a valid client attempt ID", () => {
    const result = validateDonationPayload({
      ...donor,
      clientAttemptId: "not-a-uuid",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.fields.form).toBeTruthy();
  });
});
