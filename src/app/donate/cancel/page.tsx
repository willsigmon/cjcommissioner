import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function DonationCancelPage() {
  return (
    <>
      <SiteHeader />
      <main className="state-page">
        <div className="shell narrow-shell">
          <p className="section-label">No charge made</p>
          <h1>Your contribution was canceled.</h1>
          <p>
            No payment was completed. You can return to the contribution page or
            choose another way to get involved.
          </p>
          <div className="button-row">
            <Link className="button button-brick" href="/donate">
              Return to donate
            </Link>
            <Link className="text-link" href="/#get-involved">
              Volunteer instead
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
