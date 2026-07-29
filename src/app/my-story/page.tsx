import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import { PhotoLedger } from "@/components/photo-ledger";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { leadership } from "@/content/campaign";
import { storyPhotos } from "@/content/photos";

export const metadata: Metadata = {
  title: "My Story",
  description:
    "CJ Turrentine shares how military service, recovery, and community work shaped his campaign for Vance County Commissioner.",
};

export default function MyStoryPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="story-hero">
          <div className="shell story-hero-grid">
            <div>
              <p className="section-label section-label-gold">My story</p>
              <h1>Service did not end when I came home.</h1>
              <p className="story-deck">
                I am Charles “CJ” Turrentine Jr., a disabled U.S. Army combat
                veteran, a proud son of Henderson, and a candidate for Vance
                County Commissioner, District 3.
              </p>
            </div>
            <div className="story-portrait">
              <Image
                alt="CJ Turrentine"
                height={720}
                priority
                sizes="(max-width: 767px) 100vw, 38vw"
                src="/photos/public-service.webp"
                width={540}
              />
            </div>
          </div>
        </section>

        <article className="story-body">
          <div className="story-rule">
            <span>01</span>
            <p>Army service</p>
          </div>
          <div className="story-prose">
            <p className="story-lede">
              I served our country in the U.S. Army and the North Carolina
              National Guard, including combat service in Iraq. After surviving
              combat and a life-changing accident, I chose to dedicate my life
              to serving others.
            </p>
            <p>
              Recovery became part of my journey. It clarified what matters:
              time matters, people matter, and a life of service cannot stop
              with one chapter.
            </p>
          </div>

          <div className="story-quote">
            <blockquote>
              “This campaign is built on service, not politics.”
            </blockquote>
          </div>

          <div className="story-rule">
            <span>02</span>
            <p>Coming home</p>
          </div>
          <div className="story-prose">
            <p>
              I am Henderson&apos;s biggest cheerleader, and I proudly represent
              Vance County wherever I go because I believe deeply in our people
              and our potential. That belief has kept me showing up and doing
              the work before asking for an office.
            </p>
            <p>
              I kept showing up—with young people, neighborhood leaders,
              community partners, and residents working for safer streets and
              stronger places. I have seen what happens when people stop waiting
              for someone else to solve the problem and decide to build together.
            </p>
          </div>

          <div className="story-rule">
            <span>03</span>
            <p>Why I’m running</p>
          </div>
          <div className="story-prose">
            <p>
              I am running for Vance County Commissioner, District 3, to expand
              opportunity, support families, and help build a safer, stronger
              Vance County. Our community has a strong workforce, talented young
              people, deep roots, and more potential than the opportunities in
              front of us today.
            </p>
            <p>
              I will advocate for responsible growth that respects our
              community, protects our resources, and creates real value for
              local families. I will take the same approach that has moved local
              work forward: listen, bring people together, name the goal, and
              stay until the work is done.
            </p>
          </div>
        </article>

        <section className="section story-photo-section">
          <div className="shell">
            <header className="section-header split-header">
              <div>
                <p className="section-label">A life of showing up</p>
                <h2>Service is personal before it is political.</h2>
              </div>
              <p>
                These moments span public service, neighborhood relationships,
                youth encouragement, and the ties that keep CJ grounded in Vance
                County.
              </p>
            </header>
            <PhotoLedger photos={storyPhotos} />
          </div>
        </section>

        <section className="leadership-section">
          <div className="shell leadership-grid">
            <div>
              <p className="section-label section-label-light">Leadership</p>
              <h2>Roles are context. The work is the point.</h2>
              <p>
                These experiences widened CJ&apos;s view of the county and the
                people doing the daily work of serving it.
              </p>
            </div>
            <ol>
              {leadership.map((item, index) => (
                <li key={item}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="story-cta">
          <div className="shell story-cta-inner">
            <div>
              <p className="section-label">The next chapter</p>
              <h2>Help carry the work across District 3.</h2>
            </div>
            <Link className="button button-brick" href="/#get-involved">
              Volunteer
              <ArrowUpRight />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
