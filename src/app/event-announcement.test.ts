import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const page = readFileSync(new URL("./page.tsx", import.meta.url), "utf8");

describe("September 10 event announcement", () => {
  it("includes the sourced event logistics and original public announcement", () => {
    expect(page).toContain("Meet the Candidate");
    expect(page).toContain("Thursday, September 10, 2026");
    expect(page).toContain('dateTime="2026-09-10T16:00:00-04:00"');
    expect(page).toContain('dateTime="2026-09-10T19:00:00-04:00"');
    expect(page).toContain("The Sidney");
    expect(page).toContain("184 Henry Ayscue Road, Henderson, NC 27537");
    expect(page).toContain(
      "https://www.facebook.com/groups/371340270467020/posts/2151050845829278/",
    );
  });

  it("puts the accessible event section before the homepage hero", () => {
    expect(page).toContain('aria-labelledby="meet-cj-heading"');
    expect(page).toContain('<h2 id="meet-cj-heading">');
    expect(page.indexOf('id="meet-cj"')).toBeLessThan(
      page.indexOf('className="home-hero"'),
    );
  });
});
