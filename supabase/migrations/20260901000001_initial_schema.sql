-- Trip Vetted: initial schema.
-- Every table ships with row-level security enabled and policies defined here,
-- in the first migration. RLS is never retrofitted (BUILD-SPEC section 2, rule 4).
--
-- Two rules this file enforces at the database layer:
--   1. Emails are never exposed. Raw emails live only in auth.users and in the
--      waitlist table, which no client role can read. Invites store a hash.
--   2. Membership requires an invite. You cannot insert a profile unless an
--      unrevoked invite has been redeemed by your auth uid, and your invited_by
--      must be that invite's inviter. The invitation chain is a first-class record.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 80),
  avatar_url text,
  home_city text,
  taste_tags text[] not null default '{}',
  bio text check (char_length(bio) <= 1000),
  invited_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create table public.invites (
  id uuid primary key default gen_random_uuid(),
  inviter_id uuid not null references public.profiles (id) on delete cascade,
  code text not null unique,
  email_hash text,
  accepted_by uuid references public.profiles (id),
  accepted_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

-- One redeemed invite per member. This is the anchor of the invitation chain.
create unique index invites_accepted_by_key on public.invites (accepted_by)
  where accepted_by is not null;

create table public.connections (
  user_a uuid not null references public.profiles (id) on delete cascade,
  user_b uuid not null references public.profiles (id) on delete cascade,
  established_via_invite uuid references public.invites (id),
  status text not null default 'active' check (status in ('active', 'removed')),
  created_at timestamptz not null default now(),
  primary key (user_a, user_b),
  check (user_a < user_b)
);

create table public.places (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  admin_area text,
  country text,
  lat double precision,
  lng double precision,
  external_ref text,
  slug text unique,
  created_at timestamptz not null default now()
);

create table public.stamps (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  place_id uuid not null references public.places (id),
  visited_from date,
  visited_to date,
  headline text not null check (char_length(headline) between 1 and 200),
  loved text,
  avoided text,
  taste_tags text[] not null default '{}',
  rating smallint check (rating between 1 and 5),
  visibility text not null default 'network'
    check (visibility in ('network', 'private', 'community')),
  created_at timestamptz not null default now()
);

create table public.stamp_media (
  id uuid primary key default gen_random_uuid(),
  stamp_id uuid not null references public.stamps (id) on delete cascade,
  storage_path text not null,
  kind text not null default 'photo' check (kind in ('photo', 'video')),
  caption text,
  sort_order int not null default 0
);

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  asker_id uuid not null references public.profiles (id) on delete cascade,
  place_id uuid references public.places (id),
  body text not null,
  scope text not null default 'network' check (scope in ('network', 'community')),
  created_at timestamptz not null default now()
);

create table public.answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  promoted_to_stamp_id uuid references public.stamps (id),
  created_at timestamptz not null default now()
);

-- Briefs exist in the schema now so the citation rule (BUILD-SPEC section 2,
-- rule 1) is structural from day one, even though brief assembly ships in S5.
create table public.briefs (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles (id) on delete cascade,
  place_id uuid not null references public.places (id),
  date_from date,
  date_to date,
  taste_tags text[] not null default '{}',
  generated_at timestamptz not null default now(),
  model text,
  content_json jsonb not null default '{}'::jsonb
);

create table public.brief_citations (
  id uuid primary key default gen_random_uuid(),
  brief_id uuid not null references public.briefs (id) on delete cascade,
  stamp_id uuid not null references public.stamps (id),
  item_ref text not null
);

-- Marketing-site waitlist. Insert-only from the public site; no client role
-- can ever read it back. Emails stay server-side.
create table public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Helper functions
-- ---------------------------------------------------------------------------

-- Connection check used inside policies. SECURITY DEFINER so policies on other
-- tables can consult connections without recursive RLS evaluation.
create or replace function public.are_connected(a uuid, b uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.connections c
    where c.status = 'active'
      and c.user_a = least(a, b)
      and c.user_b = greatest(a, b)
  );
$$;

-- Human-friendly invite code, e.g. "TV-7K2M9QRD". No ambiguous characters.
create or replace function public.gen_invite_code()
returns text
language plpgsql
volatile
as $$
declare
  alphabet constant text := '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
  code text := 'TV-';
  i int;
begin
  for i in 1..8 loop
    code := code || substr(alphabet, 1 + floor(random() * 31)::int, 1);
  end loop;
  return code;
end;
$$;

alter table public.invites alter column code set default public.gen_invite_code();

-- Pre-signup check: is this code redeemable, and who is inviting?
-- SECURITY DEFINER so the signup page can validate a code without any read
-- access to the invites table. Returns only the inviter's display name.
create or replace function public.check_invite_code(invite_code text)
returns table (valid boolean, inviter_name text)
language sql
stable
security definer
set search_path = public
as $$
  select true, p.display_name
  from public.invites i
  join public.profiles p on p.id = i.inviter_id
  where i.code = invite_code
    and i.revoked_at is null
    and i.accepted_by is null
  limit 1;
$$;

-- Post-auth redemption. Marks the invite as accepted by the caller. Called
-- during onboarding, before the profile row is inserted. The profiles insert
-- policy below requires this to have happened.
create or replace function public.redeem_invite(invite_code text)
returns uuid
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  invite public.invites;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  -- Already redeemed one? Return it (idempotent for onboarding retries).
  select * into invite from public.invites where accepted_by = auth.uid();
  if found then
    return invite.id;
  end if;

  select * into invite
  from public.invites
  where code = invite_code
    and revoked_at is null
    and accepted_by is null
  for update;

  if not found then
    raise exception 'invalid or already used invite code';
  end if;

  update public.invites
  set accepted_by = auth.uid(), accepted_at = now()
  where id = invite.id;

  return invite.id;
end;
$$;

-- When a profile is created, connect the new member to their inviter.
-- The invitation chain becomes a connection automatically.
create or replace function public.connect_on_profile_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  invite public.invites;
begin
  select * into invite from public.invites where accepted_by = new.id;
  if found and invite.inviter_id is not null then
    insert into public.connections (user_a, user_b, established_via_invite)
    values (
      least(invite.inviter_id, new.id),
      greatest(invite.inviter_id, new.id),
      invite.id
    )
    on conflict do nothing;
  end if;
  return new;
end;
$$;

create trigger profiles_connect_inviter
  after insert on public.profiles
  for each row execute function public.connect_on_profile_insert();

-- The invitation chain is a record. Once set, invited_by never changes.
create or replace function public.lock_invited_by()
returns trigger
language plpgsql
as $$
begin
  if new.invited_by is distinct from old.invited_by then
    raise exception 'invited_by is immutable';
  end if;
  return new;
end;
$$;

create trigger profiles_lock_invited_by
  before update on public.profiles
  for each row execute function public.lock_invited_by();

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.invites enable row level security;
alter table public.connections enable row level security;
alter table public.places enable row level security;
alter table public.stamps enable row level security;
alter table public.stamp_media enable row level security;
alter table public.questions enable row level security;
alter table public.answers enable row level security;
alter table public.briefs enable row level security;
alter table public.brief_citations enable row level security;
alter table public.waitlist_signups enable row level security;

-- profiles: any signed-in member can read profiles (the network is the
-- product; profiles carry no email). You can only insert or update your own,
-- and inserting requires a redeemed invite whose inviter matches invited_by.
create policy "profiles are readable by members"
  on public.profiles for select to authenticated
  using (true);

create policy "insert own profile with redeemed invite"
  on public.profiles for insert to authenticated
  with check (
    id = (select auth.uid())
    and exists (
      select 1 from public.invites i
      where i.accepted_by = (select auth.uid())
        and i.revoked_at is null
        and i.inviter_id = invited_by
    )
  );

create policy "update own profile"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- invites: you see the invites you sent and the one you redeemed. Nobody can
-- read anyone else's, so email hashes and unredeemed codes stay private.
create policy "read own invites"
  on public.invites for select to authenticated
  using (inviter_id = (select auth.uid()) or accepted_by = (select auth.uid()));

create policy "create invites as yourself"
  on public.invites for insert to authenticated
  with check (inviter_id = (select auth.uid()) and accepted_by is null);

create policy "revoke own unredeemed invites"
  on public.invites for update to authenticated
  using (inviter_id = (select auth.uid()) and accepted_by is null)
  with check (inviter_id = (select auth.uid()));

-- connections: visible to their two participants only.
create policy "read own connections"
  on public.connections for select to authenticated
  using (user_a = (select auth.uid()) or user_b = (select auth.uid()));

-- places: shared reference data for members.
create policy "places readable by members"
  on public.places for select to authenticated
  using (true);

create policy "members can add places"
  on public.places for insert to authenticated
  with check (true);

-- stamps: author always; community stamps to all members; network stamps to
-- the author's connections. Private stamps never leave the author.
create policy "read stamps by visibility"
  on public.stamps for select to authenticated
  using (
    author_id = (select auth.uid())
    or visibility = 'community'
    or (visibility = 'network' and public.are_connected(author_id, (select auth.uid())))
  );

create policy "write own stamps"
  on public.stamps for insert to authenticated
  with check (author_id = (select auth.uid()));

create policy "update own stamps"
  on public.stamps for update to authenticated
  using (author_id = (select auth.uid()))
  with check (author_id = (select auth.uid()));

create policy "delete own stamps"
  on public.stamps for delete to authenticated
  using (author_id = (select auth.uid()));

-- stamp_media: access follows the stamp.
create policy "read media via stamp access"
  on public.stamp_media for select to authenticated
  using (
    exists (
      select 1 from public.stamps s
      where s.id = stamp_id
        and (
          s.author_id = (select auth.uid())
          or s.visibility = 'community'
          or (s.visibility = 'network' and public.are_connected(s.author_id, (select auth.uid())))
        )
    )
  );

create policy "write media for own stamps"
  on public.stamp_media for insert to authenticated
  with check (
    exists (
      select 1 from public.stamps s
      where s.id = stamp_id and s.author_id = (select auth.uid())
    )
  );

create policy "delete media for own stamps"
  on public.stamp_media for delete to authenticated
  using (
    exists (
      select 1 from public.stamps s
      where s.id = stamp_id and s.author_id = (select auth.uid())
    )
  );

-- questions and answers: asker plus their network, or all members when the
-- question is community-scoped.
create policy "read questions in scope"
  on public.questions for select to authenticated
  using (
    asker_id = (select auth.uid())
    or scope = 'community'
    or (scope = 'network' and public.are_connected(asker_id, (select auth.uid())))
  );

create policy "ask as yourself"
  on public.questions for insert to authenticated
  with check (asker_id = (select auth.uid()));

create policy "read answers via question access"
  on public.answers for select to authenticated
  using (
    exists (
      select 1 from public.questions q
      where q.id = question_id
        and (
          q.asker_id = (select auth.uid())
          or q.scope = 'community'
          or (q.scope = 'network' and public.are_connected(q.asker_id, (select auth.uid())))
        )
    )
  );

create policy "answer as yourself"
  on public.answers for insert to authenticated
  with check (author_id = (select auth.uid()));

-- briefs: private to the requester.
create policy "read own briefs"
  on public.briefs for select to authenticated
  using (requester_id = (select auth.uid()));

create policy "create own briefs"
  on public.briefs for insert to authenticated
  with check (requester_id = (select auth.uid()));

create policy "read citations via own briefs"
  on public.brief_citations for select to authenticated
  using (
    exists (
      select 1 from public.briefs b
      where b.id = brief_id and b.requester_id = (select auth.uid())
    )
  );

create policy "cite into own briefs"
  on public.brief_citations for insert to authenticated
  with check (
    exists (
      select 1 from public.briefs b
      where b.id = brief_id and b.requester_id = (select auth.uid())
    )
  );

-- waitlist: the public site may add a row. No client role may ever read,
-- update, or delete. Only the service role (server-side) sees emails.
create policy "anyone may join the waitlist"
  on public.waitlist_signups for insert to anon, authenticated
  with check (true);

-- ---------------------------------------------------------------------------
-- Storage: avatars bucket (public read, owners write within their own folder)
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatar images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "members upload avatars to their own folder"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "members update their own avatars"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
