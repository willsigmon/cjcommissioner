# Release Checklist

The current production deployment stays unchanged until every required gate is
checked and the campaign explicitly authorizes launch.

## Content and campaign approval

- [ ] Every row in `docs/content-claims.md` is marked Approved
- [x] Owner-supplied original photographs received
- [x] EXIF removed; optimized WebP derivatives prepared
- [ ] District map boundaries and labeling reverified
- [ ] Exact committee name and “Paid for by” disclosure confirmed
- [ ] Privacy, contribution eligibility/source, limit, and refund language
      approved by the treasurer
- [ ] No petition or petition-deadline language remains

## Volunteer integration

- [ ] Campaign-owned production Sheet and tab exist
- [ ] Service account has append-only access to that Sheet
- [ ] Preview points to the test tab; Production points to the live tab
- [ ] Vercel Firewall rule ID is configured at 5 submissions/IP/10 minutes
- [ ] Success append and forced-failure fallback tested
- [ ] No submission PII appears in Vercel logs

## Stripe and campaign finance

- [ ] Stripe approves the campaign’s political fundraising use
- [ ] Payout bank account configured only inside Stripe
- [ ] Live card payments enabled
- [ ] Apple Pay and Google Pay enabled; production domain registered
- [ ] PayPal tested when available, or recorded as a non-blocking exception
- [ ] Webhook endpoint and signing secret configured
- [ ] Test card success, decline, cancel, and duplicate webhook delivery pass
- [ ] Live-mode `$5` test session creation verified without completing an
      unapproved real contribution
- [ ] No bank data exists in source, Vercel variables, metadata, markup, or logs

## Engineering and design

- [ ] `npm run verify`
- [ ] `npm audit --audit-level=high` reports zero high/critical findings
- [ ] Keyboard, focus, form errors, screen-reader names, and reduced motion pass
- [ ] Responsive QA at 320, 390, 768, 1024, and 1440 pixels
- [ ] Mobile Lighthouse: performance 90+, accessibility 95+
- [ ] Security headers verified on Preview
- [ ] QR assets scan at 1-inch and 2-inch sizes on iPhone and Android
- [ ] Desktop and mobile screenshots approved by client and treasurer

## Deployment

- [ ] Push `cdx/proof-in-the-work` and review a Vercel Preview with test services
- [ ] Explicit production launch authorization received
- [ ] Merge only after every blocking gate passes
- [ ] Production deployment reports `READY`
- [ ] `cjcommissioner.com` and `www.cjcommissioner.com` return HTTP 200
- [ ] Production volunteer submission reaches the production Sheet
- [ ] `/donate` creates a live-mode Checkout Session
- [ ] QR resolves to `https://cjcommissioner.com/donate`
- [ ] Previous production deployment retained and identified for rollback
