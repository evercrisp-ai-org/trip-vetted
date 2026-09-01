-- ============================================================================
-- SEED DATA. Local development and demo only. Never run against production
-- without deliberately deciding to. Every row below is fictional.
-- ============================================================================
--
-- What this seeds:
--   * Four demo members with a real invitation chain:
--       Maya (founding member, no inviter)
--       Maya invited Jonah and Priya
--       Jonah invited Sam
--   * Two open invite codes you can redeem when testing signup:
--       TV-DEMOFRIEND  (from Maya)
--       TV-DEMOCIRCLE  (from Priya)
--   * A handful of places and stamps, including one private stamp,
--     so RLS behavior is visible immediately.
--
-- Demo logins (local Supabase only; magic links land in Inbucket/Mailpit):
--   maya@demo.tripvetted.local
--   jonah@demo.tripvetted.local
--   priya@demo.tripvetted.local
--   sam@demo.tripvetted.local

-- ---------------------------------------------------------------------------
-- Auth users (local GoTrue accepts direct inserts when seeding as postgres)
-- ---------------------------------------------------------------------------

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data,
  confirmation_token, recovery_token, email_change, email_change_token_new
)
values
  ('00000000-0000-0000-0000-000000000000', '11111111-1111-4111-8111-111111111111',
   'authenticated', 'authenticated', 'maya@demo.tripvetted.local', crypt('demo-password', gen_salt('bf')),
   now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '22222222-2222-4222-8222-222222222222',
   'authenticated', 'authenticated', 'jonah@demo.tripvetted.local', crypt('demo-password', gen_salt('bf')),
   now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '33333333-3333-4333-8333-333333333333',
   'authenticated', 'authenticated', 'priya@demo.tripvetted.local', crypt('demo-password', gen_salt('bf')),
   now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '44444444-4444-4444-8444-444444444444',
   'authenticated', 'authenticated', 'sam@demo.tripvetted.local', crypt('demo-password', gen_salt('bf')),
   now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', '', '', '', '');

insert into auth.identities (
  id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
)
select gen_random_uuid(), u.id, u.id::text,
       jsonb_build_object('sub', u.id::text, 'email', u.email, 'email_verified', true),
       'email', now(), now(), now()
from auth.users u
where u.email like '%@demo.tripvetted.local';

-- ---------------------------------------------------------------------------
-- Founding member (no inviter; created by the operator, documented in OPERATIONS.md)
-- ---------------------------------------------------------------------------

insert into public.profiles (id, display_name, home_city, taste_tags, bio, invited_by)
values (
  '11111111-1111-4111-8111-111111111111', 'Maya Tan', 'Lisbon',
  array['food-obsessed', 'walkable-cities', 'small-hotels'],
  'Started Trip Vetted after one too many trips planned from strangers'' reviews.',
  null
);

-- ---------------------------------------------------------------------------
-- Invitation chain: redeemed invites, then profiles (trigger builds connections)
-- ---------------------------------------------------------------------------

insert into public.invites (id, inviter_id, code, accepted_by, accepted_at)
values
  ('aaaaaaaa-0000-4000-8000-00000000000a', '11111111-1111-4111-8111-111111111111',
   'TV-SEEDJONAH', null, null),
  ('aaaaaaaa-0000-4000-8000-00000000000b', '11111111-1111-4111-8111-111111111111',
   'TV-SEEDPRIYA', null, null),
  ('aaaaaaaa-0000-4000-8000-00000000000c', '22222222-2222-4222-8222-222222222222',
   'TV-SEEDSAM', null, null);

-- Jonah and Priya redeem Maya's invites.
update public.invites set accepted_by = '22222222-2222-4222-8222-222222222222', accepted_at = now()
  where code = 'TV-SEEDJONAH';
insert into public.profiles (id, display_name, home_city, taste_tags, bio, invited_by)
values ('22222222-2222-4222-8222-222222222222', 'Jonah Reyes', 'Mexico City',
        array['street-food', 'dive-bars', 'live-music'],
        'If the menu is laminated, I am already gone.',
        '11111111-1111-4111-8111-111111111111');

update public.invites set accepted_by = '33333333-3333-4333-8333-333333333333', accepted_at = now()
  where code = 'TV-SEEDPRIYA';
insert into public.profiles (id, display_name, home_city, taste_tags, bio, invited_by)
values ('33333333-3333-4333-8333-333333333333', 'Priya Nair', 'London',
        array['museums', 'coffee', 'long-walks'],
        'Plans the museum route before booking the flight.',
        '11111111-1111-4111-8111-111111111111');

-- Sam redeems Jonah's invite (second link in the chain).
update public.invites set accepted_by = '44444444-4444-4444-8444-444444444444', accepted_at = now()
  where code = 'TV-SEEDSAM';
insert into public.profiles (id, display_name, home_city, taste_tags, bio, invited_by)
values ('44444444-4444-4444-8444-444444444444', 'Sam Whitfield', 'Austin',
        array['hiking', 'bbq', 'road-trips'],
        'Will drive four hours for brisket and call it a day trip.',
        '22222222-2222-4222-8222-222222222222');

-- Open invite codes for testing the signup flow yourself.
insert into public.invites (inviter_id, code)
values
  ('11111111-1111-4111-8111-111111111111', 'TV-DEMOFRIEND'),
  ('33333333-3333-4333-8333-333333333333', 'TV-DEMOCIRCLE');

-- ---------------------------------------------------------------------------
-- Places
-- ---------------------------------------------------------------------------

insert into public.places (id, name, admin_area, country, lat, lng, slug)
values
  ('bbbbbbbb-0000-4000-8000-000000000001', 'Tokyo', 'Tokyo', 'Japan', 35.6762, 139.6503, 'tokyo-japan'),
  ('bbbbbbbb-0000-4000-8000-000000000002', 'Kyoto', 'Kyoto', 'Japan', 35.0116, 135.7681, 'kyoto-japan'),
  ('bbbbbbbb-0000-4000-8000-000000000003', 'Lisbon', 'Lisboa', 'Portugal', 38.7223, -9.1393, 'lisbon-portugal'),
  ('bbbbbbbb-0000-4000-8000-000000000004', 'Oaxaca', 'Oaxaca', 'Mexico', 17.0732, -96.7266, 'oaxaca-mexico');

-- ---------------------------------------------------------------------------
-- Stamps (mixed visibility so RLS is demonstrable out of the box)
-- ---------------------------------------------------------------------------

insert into public.stamps (id, author_id, place_id, visited_from, visited_to, headline, loved, avoided, taste_tags, rating, visibility)
values
  ('cccccccc-0000-4000-8000-000000000001', '22222222-2222-4222-8222-222222222222',
   'bbbbbbbb-0000-4000-8000-000000000001', '2026-03-02', '2026-03-09',
   'Tokyo eats itself and you get to watch',
   'Standing sushi at Uogashi before 9am. The yakitori alley under the tracks in Yurakucho.',
   'The robot restaurant. It is a bus tour with lasers.',
   array['street-food', 'late-nights'], 5, 'network'),
  ('cccccccc-0000-4000-8000-000000000002', '33333333-3333-4333-8333-333333333333',
   'bbbbbbbb-0000-4000-8000-000000000002', '2025-11-10', '2025-11-14',
   'Kyoto at 6am belongs to you',
   'Fushimi Inari before sunrise, completely empty. Tea at Ippodo.',
   'Arashiyama bamboo grove at midday. Shoulder to shoulder.',
   array['museums', 'long-walks'], 5, 'network'),
  ('cccccccc-0000-4000-8000-000000000003', '11111111-1111-4111-8111-111111111111',
   'bbbbbbbb-0000-4000-8000-000000000003', '2026-05-20', '2026-05-27',
   'Lisbon like a local, or close enough',
   'Dinner at a tasca in Alfama where the owner chooses for you.',
   'The tram 28 at any hour a tourist is awake.',
   array['food-obsessed', 'walkable-cities'], 4, 'community'),
  -- Private stamp: only Sam can ever read this row. RLS tests depend on it.
  ('cccccccc-0000-4000-8000-000000000004', '44444444-4444-4444-8444-444444444444',
   'bbbbbbbb-0000-4000-8000-000000000004', '2026-01-15', '2026-01-22',
   'Oaxaca notes I am not ready to share',
   'A mezcal palenque an hour out of town. Keeping it to myself for now.',
   null,
   array['road-trips'], 5, 'private');
