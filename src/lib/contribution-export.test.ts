import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ContributionExportError,
  getContributionExportRows,
  serializeContributionCsv,
} from "./contribution-export";

const completeRow = {
  id: "019fb298-d014-7000-8000-000000000002",
  election_slug: "2026-general",
  full_name: "Jordan Neighbor",
  email: "jordan@example.com",
  mailing_line1: "123 Main Street",
  mailing_line2: null,
  mailing_city: "Henderson",
  mailing_state: "NC",
  mailing_postal_code: "27537",
  occupation: "Teacher",
  employer: "Vance County Schools",
  amount_cents: 5_100,
  contribution_date: "2026-07-31T03:30:00.000Z",
  payment_method: "Credit card (Visa)",
  gross_amount_cents: 5_100,
  processing_fee_cents: 178,
  refunded_cents: 0,
  donor_running_total_cents: 5_100,
  donor_election_total_cents: 5_100,
  flagged_over_fifty: true,
  remaining_limit_cents: 674_900,
  contribution_cap_reached: false,
  status: "paid",
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("treasurer contribution CSV", () => {
  it("exports every required field, fee, threshold flag, and donor totals", () => {
    const csv = serializeContributionCsv([completeRow]);

    expect(csv).toContain('"Full Name"');
    expect(csv).toContain('"Job Title or Profession"');
    expect(csv).toContain('"Employer Name or Field of Business"');
    expect(csv).toContain('"Payment Method"');
    expect(csv).toContain('"Gross Amount"');
    expect(csv).toContain('"Processing Fee"');
    expect(csv).toContain('"Donor Running Total"');
    expect(csv).toContain('"Over $50 Reporting Flag"');
    expect(csv).toContain('"51.00"');
    expect(csv).toContain('"1.78"');
    expect(csv).toContain('"YES"');
    expect(csv).toContain('"2026-07-30"');
  });

  it("fails closed instead of exporting a blank required field", () => {
    expect(() =>
      serializeContributionCsv([{ ...completeRow, payment_method: "" }]),
    ).toThrow(ContributionExportError);
  });

  it("neutralizes spreadsheet formulas in donor-entered values", () => {
    const csv = serializeContributionCsv([
      { ...completeRow, full_name: "=HYPERLINK(\"https://example.com\")" },
    ]);
    expect(csv).toContain(
      '"\'=HYPERLINK(""https://example.com"")"',
    );
  });

  it("paginates from the returned row count instead of assuming server page size", async () => {
    vi.stubEnv("SUPABASE_URL", "https://campaign.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-role-key");
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json(
          [
            completeRow,
            {
              ...completeRow,
              id: "019fb298-d014-7000-8000-000000000003",
            },
          ],
          { headers: { "Content-Range": "0-1/3" } },
        ),
      )
      .mockResolvedValueOnce(
        Response.json(
          [
            {
              ...completeRow,
              id: "019fb298-d014-7000-8000-000000000004",
            },
          ],
          { headers: { "Content-Range": "2-2/3" } },
        ),
      );
    vi.stubGlobal("fetch", fetchMock);

    const rows = await getContributionExportRows();

    expect(rows).toHaveLength(3);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0]?.[1]?.headers.Range).toBe("0-999");
    expect(fetchMock.mock.calls[1]?.[1]?.headers.Range).toBe("2-1001");
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain("updated_at=lte.");
  });
});
