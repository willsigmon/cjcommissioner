import {
  reconcileCampaignContributions,
  reconciliationIsComplete,
} from "@/lib/contribution-reconciliation";
import { isDonationAdminAuthorized } from "@/lib/donation-admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isDonationAdminAuthorized(request)) {
    return Response.json(
      { ok: false, message: "Contribution reconciliation authorization failed." },
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
    const summary = await reconcileCampaignContributions();
    const complete = reconciliationIsComplete(summary);
    return Response.json(
      { ok: complete, summary },
      {
        status: complete ? 200 : 409,
        headers: { "Cache-Control": "private, no-store, max-age=0" },
      },
    );
  } catch (error) {
    console.error("Contribution reconciliation could not start.", {
      error: error instanceof Error ? error.name : "UnknownError",
    });
    return Response.json(
      {
        ok: false,
        message: "Contribution reconciliation is temporarily unavailable.",
      },
      {
        status: 503,
        headers: { "Cache-Control": "private, no-store, max-age=0" },
      },
    );
  }
}
