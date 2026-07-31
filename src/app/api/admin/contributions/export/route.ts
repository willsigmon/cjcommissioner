import {
  ContributionExportIncompleteError,
  getContributionExportRows,
  serializeContributionCsv,
} from "@/lib/contribution-export";
import { isDonationAdminAuthorized } from "@/lib/donation-admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isDonationAdminAuthorized(request)) {
    return Response.json(
      { ok: false, message: "Contribution export authorization failed." },
      {
        status: 401,
        headers: {
          "Cache-Control": "private, no-store, max-age=0",
          "WWW-Authenticate": "Bearer",
        },
      },
    );
  }

  try {
    const rows = await getContributionExportRows();
    const csv = serializeContributionCsv(rows);
    const exportDate = new Date().toISOString().slice(0, 10);
    return new Response(`\uFEFF${csv}`, {
      headers: {
        "Cache-Control": "private, no-store, max-age=0",
        "Content-Disposition": `attachment; filename="campaign-contributions-${exportDate}.csv"`,
        "Content-Type": "text/csv; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    const incomplete = error instanceof ContributionExportIncompleteError;
    console.error("Contribution export failed.", {
      error: error instanceof Error ? error.name : "UnknownError",
    });
    return Response.json(
      {
        ok: false,
        message: incomplete
          ? "The export is unavailable because one or more contribution records needs treasurer review."
          : "The contribution export is temporarily unavailable.",
      },
      {
        status: incomplete ? 409 : 503,
        headers: { "Cache-Control": "private, no-store, max-age=0" },
      },
    );
  }
}
