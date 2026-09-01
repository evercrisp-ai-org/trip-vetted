import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MemberNav } from "@/features/profile/member-nav";
import { Avatar } from "@/features/profile/avatar";
import { profilePage } from "@/content/site";

/**
 * A member's page. The invitation chain is a displayed, first-class record:
 * who invited this member, and who they have invited, both as links.
 */
export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url, home_city, taste_tags, bio, invited_by, created_at")
    .eq("id", id)
    .maybeSingle();
  if (!profile) notFound();

  const [{ data: inviter }, { data: invitees }] = await Promise.all([
    profile.invited_by
      ? supabase
          .from("profiles")
          .select("id, display_name")
          .eq("id", profile.invited_by)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    supabase
      .from("profiles")
      .select("id, display_name, home_city")
      .eq("invited_by", profile.id)
      .order("created_at"),
  ]);

  return (
    <>
      <MemberNav />
      <main id="content" className="mx-auto max-w-3xl px-5 py-10">
        <Link
          href="/home"
          className="text-xs font-medium uppercase tracking-wider text-ink-soft hover:text-ink"
        >
          ← {profilePage.backToCircle}
        </Link>

        <div className="mt-8 flex items-start gap-5">
          <Avatar name={profile.display_name} url={profile.avatar_url} size="h-20 w-20 text-3xl" />
          <div>
            <h1 className="font-display text-3xl tracking-tight">{profile.display_name}</h1>
            <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-accent">
              {profile.invited_by && inviter ? (
                <>
                  {profilePage.invitedByPrefix}{" "}
                  <Link href={`/people/${inviter.id}`} className="underline underline-offset-2">
                    {inviter.display_name}
                  </Link>
                </>
              ) : (
                profilePage.foundingMember
              )}
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-ink-faint">
              {profilePage.memberSincePrefix}{" "}
              {new Date(profile.created_at).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {profile.bio && <p className="mt-6 max-w-xl leading-relaxed">{profile.bio}</p>}

        <dl className="mt-8 grid gap-6 sm:grid-cols-2">
          {profile.home_city && (
            <div className="border-t border-line pt-3">
              <dt className="text-xs font-medium uppercase tracking-[0.2em] text-ink-faint">
                {profilePage.homeCityLabel}
              </dt>
              <dd className="mt-1 font-display text-lg">{profile.home_city}</dd>
            </div>
          )}
          {profile.taste_tags?.length > 0 && (
            <div className="border-t border-line pt-3">
              <dt className="text-xs font-medium uppercase tracking-[0.2em] text-ink-faint">
                {profilePage.tagsLabel}
              </dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {profile.taste_tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-full bg-accent-wash px-2.5 py-0.5 text-xs font-medium text-accent-deep"
                  >
                    {tag}
                  </span>
                ))}
              </dd>
            </div>
          )}
        </dl>

        <section aria-labelledby="invited-heading" className="mt-12">
          <h2
            id="invited-heading"
            className="border-b border-line pb-2 font-display text-xl"
          >
            {profilePage.invitedListTitle}
          </h2>
          {!invitees || invitees.length === 0 ? (
            <p className="mt-4 text-sm text-ink-soft">{profilePage.invitedNobody}</p>
          ) : (
            <ul className="divide-y divide-line">
              {invitees.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/people/${p.id}`}
                    className="flex items-center gap-3 py-3 hover:bg-surface"
                  >
                    <span className="flex-1 font-medium">{p.display_name}</span>
                    {p.home_city && (
                      <span className="text-xs font-medium uppercase tracking-wider text-ink-faint">
                        {p.home_city}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}
