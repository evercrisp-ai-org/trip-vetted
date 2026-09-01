import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { createInvite, revokeInvite } from "@/features/auth/actions";
import { MemberNav } from "@/features/profile/member-nav";
import { Avatar } from "@/features/profile/avatar";
import { CopyButton } from "@/features/profile/copy-button";
import { home } from "@/content/site";

export const metadata: Metadata = { title: "Your circle" };

type CircleProfile = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  home_city: string | null;
};

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: me } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url, home_city, taste_tags, created_at")
    .eq("id", user.id)
    .maybeSingle();
  if (!me) redirect("/onboarding");

  const { data: connections } = await supabase
    .from("connections")
    .select("user_a, user_b")
    .eq("status", "active");

  const circleIds = (connections ?? []).map((c) =>
    c.user_a === user.id ? c.user_b : c.user_a
  );

  let circle: CircleProfile[] = [];
  if (circleIds.length > 0) {
    const { data } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url, home_city")
      .in("id", circleIds)
      .order("display_name");
    circle = data ?? [];
  }

  const { data: invites } = await supabase
    .from("invites")
    .select("id, code, accepted_by, accepted_at, revoked_at, created_at")
    .eq("inviter_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <>
      <MemberNav />
      <main id="content" className="mx-auto max-w-3xl px-5 py-10">
        <div className="flex items-center gap-4">
          <Avatar name={me.display_name} url={me.avatar_url} size="h-16 w-16 text-2xl" />
          <div>
            <h1 className="font-display text-3xl tracking-tight">
              {home.welcomePrefix} {me.display_name}
            </h1>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-ink-soft">
              {home.memberSincePrefix}{" "}
              {new Date(me.created_at).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
              {" · "}
              <Link href={`/people/${me.id}`} className="text-accent underline underline-offset-2">
                {home.viewProfile}
              </Link>
            </p>
          </div>
        </div>

        <section aria-labelledby="circle-heading" className="mt-12">
          <h2 id="circle-heading" className="border-b border-line pb-2 font-display text-xl">
            {home.circleTitle}
          </h2>
          {circle.length === 0 ? (
            <p className="mt-4 text-sm text-ink-soft">{home.circleEmpty}</p>
          ) : (
            <ul className="divide-y divide-line">
              {circle.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/people/${p.id}`}
                    className="flex items-center gap-4 py-4 hover:bg-surface"
                  >
                    <Avatar name={p.display_name} url={p.avatar_url} />
                    <span className="flex-1">
                      <span className="block font-medium">{p.display_name}</span>
                      {p.home_city && (
                        <span className="block text-xs font-medium uppercase tracking-wider text-ink-faint">
                          {p.home_city}
                        </span>
                      )}
                    </span>
                    <span aria-hidden="true" className="text-ink-faint">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="invites-heading" className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-2">
            <div>
              <h2 id="invites-heading" className="font-display text-xl">
                {home.invitesTitle}
              </h2>
            </div>
            <form action={createInvite}>
              <button
                type="submit"
                className="rounded-full bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-accent-deep"
              >
                {home.newInviteButton}
              </button>
            </form>
          </div>
          <p className="mt-3 text-sm text-ink-soft">{home.invitesSub}</p>
          <ul className="mt-4 space-y-3">
            {(invites ?? []).map((inv) => {
              const status = inv.revoked_at
                ? home.inviteRevoked
                : inv.accepted_by
                  ? home.inviteAccepted
                  : home.inviteOpen;
              const open = !inv.revoked_at && !inv.accepted_by;
              return (
                <li
                  key={inv.id}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3"
                >
                  <code className={`font-mono text-sm ${open ? "" : "text-ink-faint line-through"}`}>
                    {inv.code}
                  </code>
                  <span
                    className={`text-[11px] font-medium uppercase tracking-[0.2em] ${
                      open ? "text-ok" : "text-ink-faint"
                    }`}
                  >
                    {status}
                  </span>
                  {open && (
                    <span className="ml-auto flex gap-2">
                      <CopyButton text={inv.code} />
                      <form action={revokeInvite}>
                        <input type="hidden" name="inviteId" value={inv.id} />
                        <button
                          type="submit"
                          className="rounded-full border border-line-strong px-3 py-1 text-xs font-medium uppercase tracking-wider text-ink-soft hover:border-error hover:text-error"
                        >
                          {home.revokeButton}
                        </button>
                      </form>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </>
  );
}
