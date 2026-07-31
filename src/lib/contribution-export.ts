type ContributionExportRow = {
  id: string;
  election_slug: string;
  full_name: string;
  email: string;
  mailing_line1: string;
  mailing_line2: string | null;
  mailing_city: string;
  mailing_state: string;
  mailing_postal_code: string;
  occupation: string;
  employer: string;
  amount_cents: number;
  contribution_date: string;
  payment_method: string;
  gross_amount_cents: number;
  processing_fee_cents: number;
  refunded_cents: number;
  donor_running_total_cents: number;
  donor_election_total_cents: number;
  flagged_over_fifty: boolean;
  remaining_limit_cents: number;
  contribution_cap_reached: boolean;
  status: string;
};

const exportColumns = [
  "id",
  "election_slug",
  "full_name",
  "email",
  "mailing_line1",
  "mailing_line2",
  "mailing_city",
  "mailing_state",
  "mailing_postal_code",
  "occupation",
  "employer",
  "amount_cents",
  "contribution_date",
  "payment_method",
  "gross_amount_cents",
  "processing_fee_cents",
  "refunded_cents",
  "donor_running_total_cents",
  "donor_election_total_cents",
  "flagged_over_fifty",
  "remaining_limit_cents",
  "contribution_cap_reached",
  "status",
] as const;

const csvHeaders = [
  "Contribution ID",
  "Election",
  "Full Name",
  "Mailing Street",
  "Mailing Street 2",
  "Mailing City",
  "Mailing State",
  "Mailing ZIP",
  "Job Title or Profession",
  "Employer Name or Field of Business",
  "Amount",
  "Date",
  "Payment Method",
  "Gross Amount",
  "Processing Fee",
  "Refunded Amount",
  "Donor Running Total",
  "Donor Election Total",
  "Over $50 Reporting Flag",
  "Remaining Before $6,800 Cap",
  "$6,800 Cap Reached",
  "Status",
  "Email",
] as const;

export class ContributionExportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContributionExportError";
  }
}

export class ContributionExportIncompleteError extends ContributionExportError {
  constructor(message: string) {
    super(message);
    this.name = "ContributionExportIncompleteError";
  }
}

function getContributionStoreConfig() {
  const url = process.env.SUPABASE_URL?.trim().replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const electionSlug = process.env.DONATION_ELECTION_SLUG?.trim();
  if (!url || !serviceRoleKey || !electionSlug) {
    throw new ContributionExportError(
      "The secure contribution ledger is not configured.",
    );
  }
  return { electionSlug, serviceRoleKey, url };
}

export async function getContributionExportRows() {
  const { electionSlug, serviceRoleKey, url } = getContributionStoreConfig();
  const endpoint = new URL(`${url}/rest/v1/campaign_contribution_export`);
  const cutoff = new Date().toISOString();
  endpoint.searchParams.set("select", exportColumns.join(","));
  endpoint.searchParams.set("election_slug", `eq.${electionSlug}`);
  endpoint.searchParams.set("updated_at", `lte.${cutoff}`);
  endpoint.searchParams.set("order", "contribution_date.asc,id.asc");

  const pageSize = 1_000;
  const rows: ContributionExportRow[] = [];
  let expectedTotal: number | null = null;
  for (let start = 0; ; ) {
    const response = await fetch(endpoint, {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Prefer: "count=exact",
        Range: `${start}-${start + pageSize - 1}`,
        "Range-Unit": "items",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new ContributionExportError(
        `Contribution export request failed with status ${response.status}.`,
      );
    }

    const contentRange = response.headers.get("content-range");
    const totalMatch = contentRange?.match(/\/(\d+)$/);
    if (!totalMatch) {
      throw new ContributionExportError(
        "Contribution export response did not include an exact row count.",
      );
    }
    const responseTotal = Number(totalMatch[1]);
    if (expectedTotal === null) expectedTotal = responseTotal;
    if (responseTotal !== expectedTotal) {
      throw new ContributionExportError(
        "Contribution records changed during export. Run the export again.",
      );
    }

    const page = (await response.json()) as ContributionExportRow[];
    rows.push(...page);
    if (rows.length >= expectedTotal) break;
    if (page.length === 0) {
      throw new ContributionExportError(
        "Contribution export ended before every row was received.",
      );
    }
    start += page.length;
  }

  return rows;
}

function requireText(value: unknown, field: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new ContributionExportIncompleteError(
      `Contribution export contains a blank required field: ${field}.`,
    );
  }
  return value.trim();
}

function requireCents(value: unknown, field: string, minimum = 0) {
  if (!Number.isSafeInteger(value) || (value as number) < minimum) {
    throw new ContributionExportIncompleteError(
      `Contribution export contains an invalid amount: ${field}.`,
    );
  }
  return value as number;
}

function requireBoolean(value: unknown, field: string) {
  if (typeof value !== "boolean") {
    throw new ContributionExportIncompleteError(
      `Contribution export contains an invalid flag: ${field}.`,
    );
  }
  return value;
}

function formatCampaignDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new ContributionExportIncompleteError(
      "Contribution export contains an invalid contribution date.",
    );
  }

  const parts = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "America/New_York",
    year: "numeric",
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

function dollars(cents: number) {
  return (cents / 100).toFixed(2);
}

function csvCell(value: string | number | boolean) {
  let text = String(value);
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export function serializeContributionCsv(rows: ContributionExportRow[]) {
  const records = rows.map((row) => {
    const fullName = requireText(row.full_name, "full name");
    const street = requireText(row.mailing_line1, "mailing street");
    const city = requireText(row.mailing_city, "mailing city");
    const state = requireText(row.mailing_state, "mailing state");
    const postalCode = requireText(row.mailing_postal_code, "mailing ZIP");
    const occupation = requireText(row.occupation, "job title or profession");
    const employer = requireText(
      row.employer,
      "employer name or field of business",
    );
    const paymentMethod = requireText(row.payment_method, "payment method");
    const amountCents = requireCents(row.amount_cents, "amount", 1);
    const grossAmountCents = requireCents(
      row.gross_amount_cents,
      "gross amount",
      1,
    );
    const processingFeeCents = requireCents(
      row.processing_fee_cents,
      "processing fee",
    );
    if (
      grossAmountCents !== amountCents ||
      processingFeeCents > grossAmountCents
    ) {
      throw new ContributionExportIncompleteError(
        "Contribution export contains payment amounts that require review.",
      );
    }
    const refundedCents = requireCents(row.refunded_cents, "refunded amount");
    const runningTotalCents = requireCents(
      row.donor_running_total_cents,
      "donor running total",
    );
    const electionTotalCents = requireCents(
      row.donor_election_total_cents,
      "donor election total",
    );
    const remainingLimitCents = requireCents(
      row.remaining_limit_cents,
      "remaining contribution limit",
    );

    return [
      requireText(row.id, "contribution ID"),
      requireText(row.election_slug, "election"),
      fullName,
      street,
      row.mailing_line2?.trim() ?? "",
      city,
      state,
      postalCode,
      occupation,
      employer,
      dollars(amountCents),
      formatCampaignDate(requireText(row.contribution_date, "date")),
      paymentMethod,
      dollars(grossAmountCents),
      dollars(processingFeeCents),
      dollars(refundedCents),
      dollars(runningTotalCents),
      dollars(electionTotalCents),
      requireBoolean(row.flagged_over_fifty, "over $50 reporting flag")
        ? "YES"
        : "NO",
      dollars(remainingLimitCents),
      requireBoolean(row.contribution_cap_reached, "contribution cap")
        ? "YES"
        : "NO",
      requireText(row.status, "status"),
      requireText(row.email, "email"),
    ];
  });

  return [
    csvHeaders.map(csvCell).join(","),
    ...records.map((record) => record.map(csvCell).join(",")),
  ].join("\r\n");
}
