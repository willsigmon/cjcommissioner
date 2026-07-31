# Stripe Contribution Launch Runbook

This checklist is intentionally fail-closed. Do not set the launch flags to
`true` until every production gate is complete.

## Human and account gates

- [ ] Treasurer confirms the exact registered committee name and disclosure.
- [ ] Treasurer confirms the committee is active and permitted to receive funds.
- [ ] Stripe account represents the registered committee, not an individual.
- [ ] Stripe has approved the account for political fundraising.
- [ ] Charges and payouts are enabled.
- [ ] The payout account is the committee's exclusive North Carolina account.
- [ ] Treasurer approves eligibility, privacy, refund, retention, and reporting
      language.
- [ ] Treasurer confirms the required contributor fields, exact state-law
      disclosure, exact eligibility attestation, $50 reporting threshold, and
      $6,800 per-election cap.
- [ ] Existing contributions for the 2026 general election are reconciled before
      relying on the online aggregate-limit check.

## Contribution ledger

1. Create separate campaign-dedicated Supabase projects in `us-east-1` for
   Preview/test data and Production/live data. Never point both Vercel
   environments at the same contribution ledger.
2. Apply
   `supabase/migrations/20260729190000_create_campaign_contribution_ledger.sql`.
3. Confirm Row Level Security is enabled and no `anon` or `authenticated`
   policies grant access.
4. Generate a random `DONATION_FINGERPRINT_SECRET` of at least 32 characters.
   Preserve it for the full election. Do not rotate or replace it without a
   migration that recomputes every stored donor fingerprint.
5. Add each Supabase URL and service-role key only to its matching Vercel
   environment as encrypted server-only variables. Never expose a service-role
   key with a `NEXT_PUBLIC_` prefix.
6. Import or reconcile earlier contributions for the election before launch.
7. Set `CONTRIBUTION_HISTORY_RECONCILED=true` only after the treasurer confirms
   those records are represented in the donor totals.
8. Set `RECONCILED_ELECTION_SLUG` to the exact reconciled
   `DONATION_ELECTION_SLUG`. A mismatch keeps contributions closed.
9. Keep `DONATION_ELECTION_SLUG` fixed for the election. Change it only at the
   treasurer-confirmed election boundary and reconcile the next election ledger
   before reopening contributions.

## Stripe test-mode rehearsal

1. Reauthenticate the Stripe connector and verify the intended account.
2. Add test publishable and secret keys to the Vercel Preview environment.
3. Create a test webhook destination:
   `https://<preview-host>/api/stripe/webhook`
4. Subscribe to:
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
   - `checkout.session.async_payment_failed`
   - `checkout.session.expired`
   - `charge.succeeded`
   - `charge.updated`
   - `charge.refunded`
5. Add the test endpoint's signing secret as `STRIPE_WEBHOOK_SECRET`.
6. Configure a Vercel Firewall rate-limit rule and set
   `VERCEL_DONATION_RATE_LIMIT_ID`.
7. Set the remaining Preview variables from `.env.example`.
   Use test Stripe keys and a Preview-only election slug such as
   `preview-2026-general`; the application rejects live Stripe keys outside
   Vercel Production.
8. Set `DONATIONS_ENABLED=true` in Preview. Set
   `TREASURER_COPY_APPROVED=true` only after the copy is approved, and set
   `CONTRIBUTION_HISTORY_RECONCILED=true` only for a reconciled test ledger.
   Set the matching `TREASURER_APPROVED_POLICY_VERSION` and
   `RECONCILED_ELECTION_SLUG` values too; the readiness check fails closed on a
   stale approval or different election.
9. Verify:
   - successful card contribution
   - declined card
   - duplicate form submission
   - cumulative limit rejection
   - expired session
   - full and partial refund event
   - webhook replay
   - mobile wallet visibility on an eligible device
   - contribution record contains reporting data but no card data
   - paid record contains contribution date, payment method category, gross
     amount, and processing fee
   - Stripe metadata contains only `contribution_id`, `election_slug`, and
     non-personal campaign context
   - protected CSV export contains every required field, donor running/election
     totals, the over-$50 flag, and the $6,800 cap columns

## Production activation

1. Create the production webhook destination at
   `https://www.cjcommissioner.com/api/stripe/webhook`.
2. Add production-only live Stripe keys and the production signing secret.
3. Add the production ledger, firewall, and a random 32+ character
   `DONATION_EXPORT_TOKEN`.
4. Set `NEXT_PUBLIC_SITE_URL=https://www.cjcommissioner.com`.
5. Set
   `ALLOWED_ORIGINS=https://cjcommissioner.com,https://www.cjcommissioner.com`.
6. Deploy with all launch flags still `false`.
7. Verify the closed state and production configuration.
8. Set `TREASURER_COPY_APPROVED=true` and
   `TREASURER_APPROVED_POLICY_VERSION=2026-07-31-v1` only after the treasurer
   approves that exact policy copy. Any copy change requires a new version and
   approval.
9. Set `CONTRIBUTION_HISTORY_RECONCILED=true` and
   `RECONCILED_ELECTION_SLUG=2026-general` only after reconciling that exact
   election.
10. Set `DONATIONS_ENABLED=true` last and redeploy.
11. Complete one treasurer-authorized lawful live contribution.
12. Verify the Stripe payment, webhook delivery, contribution ledger, donor
    receipt, success page, and payout status.

## Treasurer CSV export

The export endpoint requires the bearer token and never accepts it in a query
string. Run:

```bash
curl --fail --show-error \
  -H "Authorization: Bearer $DONATION_EXPORT_TOKEN" \
  https://www.cjcommissioner.com/api/admin/contributions/export \
  --output "campaign-contributions-$(date +%F).csv"
```

The CSV includes full name; mailing street, city, state, and ZIP; job title or
profession; employer name or field of business; amount; contribution date;
payment method; gross amount; processing fee; donor running total; donor
election total; over-$50 reporting flag; and remaining/reached status for the
$6,800 cap. It also includes contribution ID, election, refund amount, status,
and email for reconciliation. The endpoint returns an error rather than
exporting a completed record with a blank required field.

The over-$50 flag follows the statute's “exceed fifty dollars” wording: it
becomes `YES` when the donor's election total is greater than $50.00.

Running totals and the automatic cap use gross accepted contributions. Refunds
are exported separately and do not automatically restore online contribution
capacity; any adjustment requires treasurer review and authoritative campaign
ledger reconciliation.

The automatic $6,800 hold groups records by a keyed, normalized combination of
the submitted legal name and mailing address. This blocks concurrent and repeat
online contributions for the same normalized identity, but it cannot prove that
two materially different names or addresses belong to the same legal person.
The treasurer must review identity variants and all other contribution channels;
the website check supplements rather than replaces that review.

Pending Checkout amounts remain reserved until a verified Stripe terminal event
marks them paid, failed, or expired. This fail-closed behavior prevents a delayed
payment webhook from reopening capacity and allowing a donor over the cap. If a
terminal webhook is missed, reconcile the Stripe session before manually changing
the ledger; do not release a pending hold based on wall-clock age alone.

## Stripe ledger reconciliation

The paid success page attempts an idempotent repair from Stripe, but it is not a
substitute for webhook monitoring. Run the protected reconciliation before every
export and after any webhook outage or Stripe/ledger discrepancy:

```bash
curl --fail --show-error -X POST \
  -H "Authorization: Bearer $DONATION_EXPORT_TOKEN" \
  https://www.cjcommissioner.com/api/admin/contributions/reconcile
```

The endpoint retrieves the current election's Checkout Sessions and charges
directly from Stripe, then repairs paid, expired, and refunded ledger state with
idempotent synthetic event IDs. A `409` response means at least one record could
not be reconciled and requires campaign review; do not export or alter the ledger
manually until every error is resolved.

## Legal references

- [N.C.G.S. Article 22A](https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/ByArticle/Chapter_163/Article_22A.html)
  defines the contributor identity, occupation/employer, date, amount, and
  over-$50 reporting requirements.
- [NCSBE contribution-limit notice](https://www.ncsbe.gov/news/press-releases/2024/12/31/campaign-contribution-limit-increases-6800-per-election)
  states the $6,800 per-election limit effective January 1, 2025.
- [NCSBE registered committee reporting forms](https://www.ncsbe.gov/campaign-finance/reporting-forms/registered-political-committee-disclosure-reporting-forms)
  identifies CRO-1210 as the individual-contribution form requiring occupation
  and employment information.

This implementation supports the campaign's treasurer; it does not replace
treasurer review or legal advice.

## Rollback

Set `DONATIONS_ENABLED=false` and redeploy. This immediately stops new Checkout
Sessions without deleting contribution records or disabling webhook processing.
