import Link from "next/link";
import { campaign } from "@/content/campaign";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <p className="footer-mark">CJ Turrentine</p>
          <p className="footer-office">For Vance County Commissioner · District 3</p>
        </div>
        <div className="footer-contact">
          <a href={`tel:${campaign.phoneHref}`}>{campaign.phoneDisplay}</a>
          <a href={`mailto:${campaign.email}`}>{campaign.email}</a>
          <address>{campaign.address}</address>
        </div>
        <div className="footer-legal">
          <p>{campaign.disclaimer}</p>
          <Link href="/privacy">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
