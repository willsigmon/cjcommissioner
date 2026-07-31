create extension if not exists pgcrypto;

create table if not exists public.campaign_contributions (
  id uuid primary key default gen_random_uuid(),
  client_attempt_id uuid not null unique,
  election_slug text not null,
  source text not null default 'online'
    check (source in ('online', 'offline')),
  donor_fingerprint text not null,
  full_name text not null check (btrim(full_name) <> ''),
  email text not null check (btrim(email) <> ''),
  phone text,
  mailing_line1 text not null check (btrim(mailing_line1) <> ''),
  mailing_line2 text,
  mailing_city text not null check (btrim(mailing_city) <> ''),
  mailing_state text not null check (btrim(mailing_state) <> ''),
  mailing_postal_code text not null check (btrim(mailing_postal_code) <> ''),
  occupation text not null check (btrim(occupation) <> ''),
  employer text not null check (btrim(employer) <> ''),
  amount_cents integer not null check (amount_cents > 0),
  contribution_limit_cents integer not null
    check (contribution_limit_cents > 0),
  eligibility_attested boolean not null,
  eligibility_attestation_text text not null
    check (btrim(eligibility_attestation_text) <> ''),
  eligibility_attested_at timestamptz not null default now(),
  status text not null default 'pending'
    check (
      status in (
        'pending',
        'paid',
        'failed',
        'expired',
        'refunded',
        'partially_refunded',
        'requires_review'
      )
    ),
  pending_expires_at timestamptz,
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text unique,
  stripe_charge_id text unique,
  stripe_livemode boolean,
  gross_amount_cents integer check (gross_amount_cents >= 0),
  processing_fee_cents integer check (processing_fee_cents >= 0),
  payment_method text,
  refunded_cents integer not null default 0
    check (refunded_cents >= 0 and refunded_cents <= amount_cents),
  paid_at timestamptz,
  last_stripe_event_created_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    processing_fee_cents is null
    or gross_amount_cents is not null
       and processing_fee_cents <= gross_amount_cents
  ),
  check (
    status not in ('paid', 'partially_refunded', 'refunded')
    or (
      paid_at is not null
      and gross_amount_cents is not null
      and processing_fee_cents is not null
      and payment_method is not null
      and btrim(payment_method) <> ''
    )
  )
);

create index if not exists campaign_contributions_donor_limit_idx
  on public.campaign_contributions (election_slug, donor_fingerprint, status);

create index if not exists campaign_contributions_created_at_idx
  on public.campaign_contributions (created_at desc);

create table if not exists public.stripe_webhook_events (
  stripe_event_id text primary key,
  event_type text not null,
  event_created_at timestamptz not null,
  stripe_livemode boolean not null,
  contribution_id uuid references public.campaign_contributions (id),
  received_at timestamptz not null default now()
);

alter table public.campaign_contributions enable row level security;
alter table public.stripe_webhook_events enable row level security;

revoke all on public.campaign_contributions from anon, authenticated;
revoke all on public.stripe_webhook_events from anon, authenticated;
grant select, insert, update on public.campaign_contributions to service_role;
grant select, insert on public.stripe_webhook_events to service_role;

create or replace function public.reserve_online_campaign_contribution(
  p_client_attempt_id uuid,
  p_election_slug text,
  p_donor_fingerprint text,
  p_full_name text,
  p_email text,
  p_phone text,
  p_mailing_line1 text,
  p_mailing_line2 text,
  p_mailing_city text,
  p_mailing_state text,
  p_mailing_postal_code text,
  p_occupation text,
  p_employer text,
  p_amount_cents integer,
  p_eligibility_attested boolean,
  p_eligibility_attestation_text text,
  p_max_cents integer
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_existing public.campaign_contributions;
  v_contribution public.campaign_contributions;
  v_reserved_cents integer;
  v_remaining_cents integer;
begin
  if p_amount_cents < 500
     or p_amount_cents > p_max_cents
     or p_max_cents <> 680000 then
    return jsonb_build_object('ok', false, 'reason', 'invalid_amount');
  end if;

  if not p_eligibility_attested
     or nullif(btrim(p_eligibility_attestation_text), '') is null then
    return jsonb_build_object(
      'ok',
      false,
      'reason',
      'eligibility_not_confirmed'
    );
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended(p_election_slug || ':' || p_donor_fingerprint, 0)
  );

  select *
    into v_existing
    from public.campaign_contributions
   where client_attempt_id = p_client_attempt_id;

  if found then
    if v_existing.donor_fingerprint <> p_donor_fingerprint
       or v_existing.amount_cents <> p_amount_cents then
      return jsonb_build_object('ok', false, 'reason', 'request_conflict');
    end if;

    if v_existing.status <> 'pending'
       or v_existing.pending_expires_at <= now() then
      return jsonb_build_object('ok', false, 'reason', 'attempt_terminal');
    end if;
  end if;

  select coalesce(
    sum(
      case
        when status = 'pending' then amount_cents
        when status in (
          'paid',
          'partially_refunded',
          'refunded',
          'requires_review'
        ) then amount_cents
        else 0
      end
    ),
    0
  )::integer
    into v_reserved_cents
    from public.campaign_contributions
   where election_slug = p_election_slug
     and donor_fingerprint = p_donor_fingerprint
     and (v_existing.id is null or id <> v_existing.id)
     and status in (
       'pending',
       'paid',
       'partially_refunded',
       'refunded',
       'requires_review'
     );

  v_remaining_cents := greatest(p_max_cents - v_reserved_cents, 0);
  if p_amount_cents > v_remaining_cents then
    return jsonb_build_object(
      'ok', false,
      'reason', 'contribution_limit_exceeded',
      'remaining_cents', v_remaining_cents
    );
  end if;

  if v_existing.id is not null then
    return jsonb_build_object(
      'ok', true,
      'contribution', to_jsonb(v_existing),
      'reused', true
    );
  end if;

  insert into public.campaign_contributions (
    client_attempt_id,
    election_slug,
    donor_fingerprint,
    full_name,
    email,
    phone,
    mailing_line1,
    mailing_line2,
    mailing_city,
    mailing_state,
    mailing_postal_code,
    occupation,
    employer,
    amount_cents,
    contribution_limit_cents,
    eligibility_attested,
    eligibility_attestation_text,
    pending_expires_at
  ) values (
    p_client_attempt_id,
    p_election_slug,
    p_donor_fingerprint,
    p_full_name,
    p_email,
    nullif(p_phone, ''),
    p_mailing_line1,
    nullif(p_mailing_line2, ''),
    p_mailing_city,
    p_mailing_state,
    p_mailing_postal_code,
    p_occupation,
    p_employer,
    p_amount_cents,
    p_max_cents,
    p_eligibility_attested,
    p_eligibility_attestation_text,
    now() + interval '30 minutes'
  )
  returning * into v_contribution;

  return jsonb_build_object(
    'ok', true,
    'contribution', to_jsonb(v_contribution),
    'reused', false
  );
end;
$$;

create or replace function public.attach_stripe_contribution_session(
  p_contribution_id uuid,
  p_checkout_session_id text,
  p_stripe_livemode boolean,
  p_pending_expires_at timestamptz
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_contribution public.campaign_contributions;
begin
  update public.campaign_contributions
     set status = case
           when status in (
             'paid',
             'refunded',
             'partially_refunded',
             'requires_review'
           ) then status
           else 'pending'
         end,
         stripe_checkout_session_id = coalesce(
           stripe_checkout_session_id,
           p_checkout_session_id
         ),
         stripe_livemode = coalesce(stripe_livemode, p_stripe_livemode),
         pending_expires_at = case
           when status in (
             'paid',
             'refunded',
             'partially_refunded',
             'requires_review'
           ) then pending_expires_at
           else p_pending_expires_at
         end,
         updated_at = now()
   where id = p_contribution_id
     and (
       stripe_checkout_session_id is null
       or stripe_checkout_session_id = p_checkout_session_id
     )
     and (
       stripe_livemode is null
       or stripe_livemode = p_stripe_livemode
     )
  returning * into v_contribution;

  if not found then
    return jsonb_build_object('ok', false, 'reason', 'attach_conflict');
  end if;

  return jsonb_build_object(
    'ok', true,
    'status', v_contribution.status
  );
end;
$$;

create or replace function public.mark_campaign_contribution_failed(
  p_contribution_id uuid
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_updated_id uuid;
begin
  update public.campaign_contributions
     set status = 'failed',
         updated_at = now()
   where id = p_contribution_id
     and status = 'pending'
     and stripe_checkout_session_id is null
  returning id into v_updated_id;

  return jsonb_build_object(
    'ok', true,
    'updated', v_updated_id is not null
  );
end;
$$;

create or replace function public.record_stripe_contribution_event(
  p_stripe_event_id text,
  p_event_type text,
  p_event_created_at timestamptz,
  p_stripe_livemode boolean,
  p_contribution_id uuid,
  p_checkout_session_id text,
  p_payment_intent_id text,
  p_charge_id text,
  p_amount_cents integer,
  p_refunded_cents integer,
  p_status text,
  p_paid_at timestamptz,
  p_gross_amount_cents integer,
  p_processing_fee_cents integer,
  p_payment_method text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_event_id text;
  v_contribution public.campaign_contributions;
  v_payment_owner_id uuid;
  v_payment_conflict boolean := false;
  v_status text;
begin
  insert into public.stripe_webhook_events (
    stripe_event_id,
    event_type,
    event_created_at,
    stripe_livemode,
    contribution_id
  ) values (
    p_stripe_event_id,
    p_event_type,
    p_event_created_at,
    p_stripe_livemode,
    p_contribution_id
  )
  on conflict (stripe_event_id) do nothing
  returning stripe_event_id into v_event_id;

  if v_event_id is null then
    return jsonb_build_object('ok', true, 'duplicate', true);
  end if;

  select *
    into v_contribution
    from public.campaign_contributions
   where id = p_contribution_id
   for update;

  if not found then
    return jsonb_build_object('ok', false, 'reason', 'contribution_not_found');
  end if;

  select id
    into v_payment_owner_id
    from public.campaign_contributions
   where id <> p_contribution_id
     and (
       (
         p_checkout_session_id is not null
         and stripe_checkout_session_id = p_checkout_session_id
       )
       or (
         p_payment_intent_id is not null
         and stripe_payment_intent_id = p_payment_intent_id
       )
       or (
         p_charge_id is not null
         and stripe_charge_id = p_charge_id
       )
     )
   limit 1;
  v_payment_conflict := found;

  v_status := p_status;
  if v_payment_conflict
     or v_contribution.amount_cents <> p_amount_cents
     or p_refunded_cents < 0
     or p_refunded_cents > p_amount_cents
     or (
       p_status in ('paid', 'partially_refunded', 'refunded')
       and (
         p_paid_at is null
         or p_gross_amount_cents is null
         or p_processing_fee_cents is null
         or nullif(btrim(p_payment_method), '') is null
       )
     )
     or (
       p_gross_amount_cents is not null
       and p_gross_amount_cents <> p_amount_cents
     )
     or (
       p_processing_fee_cents is not null
       and (
         p_processing_fee_cents < 0
         or p_gross_amount_cents is null
         or p_processing_fee_cents > p_gross_amount_cents
       )
     )
     or (
       v_contribution.gross_amount_cents is not null
       and p_gross_amount_cents is not null
       and v_contribution.gross_amount_cents <> p_gross_amount_cents
     )
     or (
       v_contribution.processing_fee_cents is not null
       and p_processing_fee_cents is not null
       and v_contribution.processing_fee_cents <> p_processing_fee_cents
     )
     or (
       v_contribution.payment_method is not null
       and p_payment_method is not null
       and v_contribution.payment_method <> p_payment_method
     )
     or (
       v_contribution.stripe_checkout_session_id is not null
       and p_checkout_session_id is not null
       and v_contribution.stripe_checkout_session_id <> p_checkout_session_id
     )
     or (
       v_contribution.stripe_payment_intent_id is not null
       and p_payment_intent_id is not null
       and v_contribution.stripe_payment_intent_id <> p_payment_intent_id
     )
     or (
       v_contribution.stripe_charge_id is not null
       and p_charge_id is not null
       and v_contribution.stripe_charge_id <> p_charge_id
     )
     or (
       v_contribution.stripe_livemode is not null
       and v_contribution.stripe_livemode <> p_stripe_livemode
     ) then
    v_status := 'requires_review';
  end if;

  if v_contribution.last_stripe_event_created_at is not null
     and p_event_created_at < v_contribution.last_stripe_event_created_at then
    return jsonb_build_object(
      'ok', true,
      'duplicate', false,
      'stale', true,
      'status', v_contribution.status
    );
  end if;

  if v_contribution.status = 'requires_review' then
    v_status := 'requires_review';
  elsif v_status <> 'requires_review'
        and greatest(v_contribution.refunded_cents, p_refunded_cents)
        >= v_contribution.amount_cents then
    v_status := 'refunded';
  elsif v_status <> 'requires_review'
        and greatest(v_contribution.refunded_cents, p_refunded_cents) > 0
        then
    v_status := 'partially_refunded';
  elsif v_contribution.status = 'paid'
        and v_status in ('pending', 'failed', 'expired') then
    v_status := 'paid';
  end if;

  update public.campaign_contributions
     set status = v_status,
         stripe_checkout_session_id = case
           when v_payment_conflict then stripe_checkout_session_id
           else coalesce(stripe_checkout_session_id, p_checkout_session_id)
         end,
         stripe_payment_intent_id = case
           when v_payment_conflict then stripe_payment_intent_id
           else coalesce(stripe_payment_intent_id, p_payment_intent_id)
         end,
         stripe_charge_id = case
           when v_payment_conflict then stripe_charge_id
           else coalesce(stripe_charge_id, p_charge_id)
         end,
         stripe_livemode = coalesce(stripe_livemode, p_stripe_livemode),
         gross_amount_cents = case
           when v_payment_conflict then gross_amount_cents
           else coalesce(gross_amount_cents, p_gross_amount_cents)
         end,
         processing_fee_cents = case
           when v_payment_conflict then processing_fee_cents
           else coalesce(processing_fee_cents, p_processing_fee_cents)
         end,
         payment_method = case
           when v_payment_conflict then payment_method
           else coalesce(payment_method, p_payment_method)
         end,
         refunded_cents = case
           when v_payment_conflict then refunded_cents
           else least(
             amount_cents,
             greatest(refunded_cents, p_refunded_cents)
           )
         end,
         paid_at = case
           when v_payment_conflict then paid_at
           when p_status in ('paid', 'partially_refunded', 'refunded')
             then coalesce(p_paid_at, paid_at)
           else paid_at
         end,
         last_stripe_event_created_at = p_event_created_at,
         updated_at = now()
   where id = p_contribution_id;

  return jsonb_build_object(
    'ok', true,
    'duplicate', false,
    'status', v_status
  );
end;
$$;

create or replace view public.campaign_contribution_export
with (security_invoker = true)
as
with accepted_contributions as (
  select
    contribution.*,
    sum(contribution.amount_cents) over (
      partition by contribution.election_slug, contribution.donor_fingerprint
      order by contribution.paid_at, contribution.id
      rows between unbounded preceding and current row
    )::integer as donor_running_total_cents,
    sum(contribution.amount_cents) over (
      partition by contribution.election_slug, contribution.donor_fingerprint
    )::integer as donor_election_total_cents
  from public.campaign_contributions contribution
  where contribution.status in (
    'paid',
    'partially_refunded',
    'refunded',
    'requires_review'
  )
    and (
      contribution.status = 'requires_review'
      or contribution.paid_at is not null
    )
)
select
  id,
  election_slug,
  full_name,
  email,
  mailing_line1,
  mailing_line2,
  mailing_city,
  mailing_state,
  mailing_postal_code,
  occupation,
  employer,
  amount_cents,
  paid_at as contribution_date,
  payment_method,
  gross_amount_cents,
  processing_fee_cents,
  refunded_cents,
  donor_running_total_cents,
  donor_election_total_cents,
  donor_election_total_cents > 5000 as flagged_over_fifty,
  greatest(
    contribution_limit_cents - donor_running_total_cents,
    0
  )::integer as remaining_limit_cents,
  donor_running_total_cents >= contribution_limit_cents as contribution_cap_reached,
  status,
  updated_at
from accepted_contributions;

revoke all on table public.campaign_contribution_export
from public, anon, authenticated;
grant select on public.campaign_contribution_export to service_role;

revoke all on function public.reserve_online_campaign_contribution(
  uuid, text, text, text, text, text, text, text, text, text, text, text, text,
  integer, boolean, text, integer
) from public, anon, authenticated;

revoke all on function public.record_stripe_contribution_event(
  text, text, timestamptz, boolean, uuid, text, text, text, integer, integer, text,
  timestamptz, integer, integer, text
) from public, anon, authenticated;

revoke all on function public.attach_stripe_contribution_session(
  uuid, text, boolean, timestamptz
) from public, anon, authenticated;

revoke all on function public.mark_campaign_contribution_failed(
  uuid
) from public, anon, authenticated;

grant execute on function public.reserve_online_campaign_contribution(
  uuid, text, text, text, text, text, text, text, text, text, text, text, text,
  integer, boolean, text, integer
) to service_role;

grant execute on function public.record_stripe_contribution_event(
  text, text, timestamptz, boolean, uuid, text, text, text, integer, integer, text,
  timestamptz, integer, integer, text
) to service_role;

grant execute on function public.attach_stripe_contribution_session(
  uuid, text, boolean, timestamptz
) to service_role;

grant execute on function public.mark_campaign_contribution_failed(
  uuid
) to service_role;
