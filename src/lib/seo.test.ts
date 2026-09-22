import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import robots from "../app/robots";
import sitemap from "../app/sitemap";
import { SITE_URL, publicPageMetadata } from "./site";

describe("public search boundaries", () => {
  it("keeps inner-page social URLs and titles route-specific", () => {
    const metadata = publicPageMetadata("Privacy | CJ Turrentine", "Privacy details", "/privacy");
    expect(metadata.title).toEqual({ absolute: "Privacy | CJ Turrentine" });
    expect(metadata.alternates?.canonical).toBe("/privacy");
    expect(metadata.openGraph).toMatchObject({ url: "/privacy", images: ["/opengraph-image"] });
  });
  it("uses the production custom hostname", () => {
    expect(SITE_URL).toBe("https://www.cjcommissioner.com");
    expect(robots().sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });

  it("lists only public routes, not checkout status or APIs", () => {
    expect(sitemap().map(({ url }) => url)).toEqual([
      SITE_URL, `${SITE_URL}/my-story`, `${SITE_URL}/donate`, `${SITE_URL}/privacy`,
    ]);
    expect(robots().rules).toEqual({ userAgent: "*", allow: "/", disallow: "/api/" });
  });

  it("keeps payment-result pages out of search", () => {
    for (const route of ["success", "cancel"]) {
      const source = readFileSync(`src/app/donate/${route}/page.tsx`, "utf8");
      expect(source).toContain("robots: { index: false, follow: true }");
    }
  });
});
