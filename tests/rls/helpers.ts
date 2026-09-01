/**
 * Helpers for the RLS suite. These tests run against a real local Supabase
 * (npx supabase start) with the seed loaded, and prove the policies do what
 * ARCHITECTURE.md claims. They are the security regression net: if a policy
 * change breaks isolation, this suite is what catches it.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://127.0.0.1:54331";
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!ANON_KEY || !SERVICE_KEY) {
  throw new Error(
    "RLS tests need NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY " +
      "in .env.local. Run `npx supabase start` and copy the keys it prints."
  );
}

const opts = { auth: { persistSession: false, autoRefreshToken: false } };

/** Unauthenticated client: what a visitor to the marketing site wields. */
export function anonClient(): SupabaseClient {
  return createClient(SUPABASE_URL, ANON_KEY, opts);
}

/** Service-role client. Bypasses RLS. Test fixtures only, never app code. */
export function serviceClient(): SupabaseClient {
  return createClient(SUPABASE_URL, SERVICE_KEY, opts);
}

/** Signs in as one of the seeded demo members (password auth, local only). */
export async function memberClient(email: string): Promise<SupabaseClient> {
  const client = createClient(SUPABASE_URL, ANON_KEY, opts);
  const { error } = await client.auth.signInWithPassword({
    email,
    password: "demo-password",
  });
  if (error) throw new Error(`could not sign in ${email}: ${error.message}`);
  return client;
}

/** Creates a throwaway confirmed auth user and returns a signed-in client. */
export async function freshUser(): Promise<{
  client: SupabaseClient;
  id: string;
  email: string;
}> {
  const email = `test-${crypto.randomUUID()}@test.tripvetted.local`;
  const admin = serviceClient();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: "demo-password",
    email_confirm: true,
  });
  if (error || !data.user) throw new Error(`createUser failed: ${error?.message}`);
  const client = createClient(SUPABASE_URL, ANON_KEY, opts);
  const { error: signInError } = await client.auth.signInWithPassword({
    email,
    password: "demo-password",
  });
  if (signInError) throw new Error(signInError.message);
  return { client, id: data.user.id, email };
}

/* Seeded fixture ids (supabase/seed.sql) */
export const SEED = {
  maya: { id: "11111111-1111-4111-8111-111111111111", email: "maya@demo.tripvetted.local" },
  jonah: { id: "22222222-2222-4222-8222-222222222222", email: "jonah@demo.tripvetted.local" },
  priya: { id: "33333333-3333-4333-8333-333333333333", email: "priya@demo.tripvetted.local" },
  sam: { id: "44444444-4444-4444-8444-444444444444", email: "sam@demo.tripvetted.local" },
  stamps: {
    jonahTokyoNetwork: "cccccccc-0000-4000-8000-000000000001",
    priyaKyotoNetwork: "cccccccc-0000-4000-8000-000000000002",
    mayaLisbonCommunity: "cccccccc-0000-4000-8000-000000000003",
    samOaxacaPrivate: "cccccccc-0000-4000-8000-000000000004",
  },
  openInviteFromMaya: "TV-DEMOFRIEND",
} as const;
