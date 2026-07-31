import { timingSafeEqual } from "node:crypto";
import {
  ContributionExportIncompleteError,
  getContributionExportRows,
  serializeContributionCsv,
} from "@/lib/contribution-export";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request: Request) {
  const expected = process.env.DONATION_EXPORT_TOKEN?.trim();
  const authorization = request.headers.get("authorization");
  if (!expected || expected.length < 32 || !authorization?.startsWith("Bearer ")) {
    return false;
  }

  const supplied = authorization.slice("Bearer ".length).trim();
  const suppliedBuffer = Buffer.from(supplied);
  const expectedBuffer = Buffer.from(expected);
  return (
    suppliedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(suppliedBuffer, expectedBuffer)
  );
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
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
