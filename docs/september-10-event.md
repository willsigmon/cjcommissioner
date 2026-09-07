# September 10 event update

## Sources checked September 7, 2026

- Public Facebook post by Roy Brown Jr., dated August 31 at 10:17 a.m., in
  Henderson, NC Community Information:
  https://www.facebook.com/groups/371340270467020/posts/2151050845829278/

The Facebook post's body explicitly lists Thursday, September 10, 2026,
4:00 PM–7:00 PM, The Sidney, 184 Henry Ayscue Road, Henderson, NC 27537.
These details were read from the post itself, not Meta's AI-generated title or
a search-engine summary. Eastern is the venue's local time zone.

## Scope

- Add a text-only homepage listing of the sourced event logistics and a link to
  the public announcement, using existing site layout and button styles.
- No new campaign messaging, endorsements, RSVP requirements, admission claims,
  fundraising copy, QR codes, or changes to donation/volunteer integrations.
- The standalone flyer image was not found. The linked post contains a video;
  it must not be described as the original flyer. Add the original image only
  if it is located or supplied and checked against the event details.
- Keep the explicit date; do not describe this listing as upcoming indefinitely.
  Remove or archive the homepage listing after the event.

## Verification

- ESLint and TypeScript passed; all 62 tests passed, including two event checks.
- Production build passed after installing the missing matching-version Windows
  CSS native binaries locally. No package manifest or lockfile changes.
- Production-build browser checks at 320, 390, 768, 1024, and 1440 CSS pixels:
  event details and link present, no horizontal overflow; link height 52px.
- Desktop and mobile screenshots reviewed; keyboard Tab reaches the event link
  with the existing visible focus outline. No new styles or visual assets.
- Pre-update production rollback candidate:
  `dpl_6BYDiYUGLFHUtM5QCjJsRdHSpK5j` (commit `916ac98`).
