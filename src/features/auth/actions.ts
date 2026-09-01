"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { join, login, onboarding } from "@/content/site";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INVITE_COOKIE = "tv-invite-code";

export type AuthFormState = { status: "idle" | "sent" | "error"; message: string };

/**
 * Sends a magic sign-in link. Used by both /login (existing members) and
 * /join (invitees, after their code checks out). For invitees the code is
 * kept in an httpOnly cookie so onboarding can redeem it after the link
 * lands, without trusting anything client-side.
 */
export async function sendMagicLink(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const inviteCode = String(formData.get("inviteCode") ?? "").trim();
  const isJoin = inviteCode.length > 0;

  if (!EMAIL_RE.test(email)) {
    return { status: "error", message: isJoin ? join.emailInvalid : login.genericError };
  }

  if (isJoin) {
    const cookieStore = await cookies();
    cookieStore.set(INVITE_COOKIE, inviteCode, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/confirm?next=/onboarding`,
    },
  });

  if (error) {
    return { status: "error", message: isJoin ? join.genericError : login.genericError };
  }

  return { status: "sent", message: isJoin ? join.emailSent : login.sent };
}

export type OnboardingState = { status: "idle" | "error"; message: string };

/**
 * Finishes joining: redeems the invite (database-enforced), uploads the
 * avatar if one was provided, inserts the profile. The profiles insert
 * policy rejects any profile without a redeemed invite, so this function
 * cannot be talked into creating an uninvited member.
 */
export async function completeOnboarding(
  _prev: OnboardingState,
  formData: FormData
): Promise<OnboardingState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const displayName = String(formData.get("displayName") ?? "").trim();
  if (!displayName) {
    return { status: "error", message: onboarding.errors.nameRequired };
  }

  const cookieStore = await cookies();
  const code =
    String(formData.get("inviteCode") ?? "").trim() ||
    cookieStore.get(INVITE_COOKIE)?.value ||
    "";
  if (!code) {
    return { status: "error", message: onboarding.errors.codeRequired };
  }

  const { data: inviteId, error: redeemError } = await supabase.rpc(
    "redeem_invite",
    { invite_code: code }
  );
  if (redeemError || !inviteId) {
    return { status: "error", message: onboarding.errors.codeInvalid };
  }

  const { data: invite } = await supabase
    .from("invites")
    .select("inviter_id")
    .eq("id", inviteId)
    .single();
  if (!invite) {
    return { status: "error", message: onboarding.errors.generic };
  }

  let avatarUrl: string | null = null;
  const avatar = formData.get("avatar");
  if (avatar instanceof File && avatar.size > 0) {
    const ext = avatar.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${user.id}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, avatar, { upsert: true });
    if (!uploadError) {
      avatarUrl = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
    }
  }

  const tasteTags = String(formData.get("tasteTags") ?? "")
    .split(",")
    .map((t) => t.trim().toLowerCase().replace(/\s+/g, "-"))
    .filter(Boolean)
    .slice(0, 12);

  const { error: profileError } = await supabase.from("profiles").insert({
    id: user.id,
    display_name: displayName,
    avatar_url: avatarUrl,
    home_city: String(formData.get("homeCity") ?? "").trim() || null,
    taste_tags: tasteTags,
    bio: String(formData.get("bio") ?? "").trim() || null,
    invited_by: invite.inviter_id,
  });

  if (profileError && profileError.code !== "23505") {
    return { status: "error", message: onboarding.errors.generic };
  }

  cookieStore.delete(INVITE_COOKIE);
  redirect("/home");
}

/** Creates a fresh invite code for the signed-in member. */
export async function createInvite() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("invites").insert({ inviter_id: user.id });
  revalidatePath("/home");
}

/** Revokes one of the member's own unredeemed invites. */
export async function revokeInvite(formData: FormData) {
  const inviteId = String(formData.get("inviteId") ?? "");
  if (!inviteId) return;

  const supabase = await createClient();
  await supabase
    .from("invites")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", inviteId)
    .is("accepted_by", null);
  revalidatePath("/home");
}
