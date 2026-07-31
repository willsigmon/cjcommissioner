import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { reconcileStripeSession } from "@/lib/contribution-reconciliation";
import { getStripe } from "@/lib/stripe";

type SuccessPageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function DonationSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const { session_id: sessionId } = await searchParams;
  let verified = false;
  let amount: string | null = null;

  if (sessionId?.startsWith("cs_")) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(sessionId);
      verified =
        session.payment_status === "paid" &&
        Boolean(session.metadata?.contribution_id) &&
        session.metadata?.election_slug ===
          process.env.DONATION_ELECTION_SLUG?.trim();
      if (verified && typeof session.amount_total === "number") {
        try {
          await reconcileStripeSession(session);
        } catch (error) {
          console.error("Paid contribution ledger reconciliation failed.", {
            contributionId: session.metadata?.contribution_id,
            error: error instanceof Error ? error.name : "UnknownError",
          });
        }
        amount = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(session.amount_total / 100);
      }
    } catch {
      verified = false;
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="state-page">
        <div className="shell narrow-shell">
          <p className="section-label">
            {verified ? "Contribution confirmed" : "Verification needed"}
          </p>
          <h1>
            {verified
              ? "Thank you for investing in District 3."
              : "We could not verify this contribution."}
          </h1>
          <p>
            {verified
              ? `${amount ?? "Your contribution"} was confirmed securely by Stripe. The campaign appreciates your support.`
              : "This page does not trust payment details from the URL. If you completed a contribution, contact the campaign and we will verify it in Stripe."}
          </p>
          <div className="button-row">
            <Link className="button button-blue" href="/">
              Return home
            </Link>
            <Link className="text-link" href="/#get-involved">
              Volunteer
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
