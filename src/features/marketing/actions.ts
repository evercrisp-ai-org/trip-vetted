"use server";

import { createClient } from "@/lib/supabase/server";
import { waitlist } from "@/content/site";

export type WaitlistState = {
  status: "idle" | "ok" | "invalid" | "error";
  message: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Adds an email to the waitlist. The waitlist table is insert-only for the
 * anon role; nothing client-side can ever read it back. A duplicate email is
 * reported as success so the form does not become an address oracle.
 */
export async function joinWaitlist(
  _prev: WaitlistState,
  formData: FormData
): Promise<WaitlistState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!EMAIL_RE.test(email)) {
    return { status: "invalid", message: waitlist.invalid };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("waitlist_signups").insert({ email });

  if (error && error.code !== "23505") {
    return { status: "error", message: waitlist.error };
  }

  return { status: "ok", message: waitlist.success };
}
