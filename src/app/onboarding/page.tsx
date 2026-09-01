import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { OnboardingForm } from "@/features/auth/onboarding-form";
import { onboarding, site } from "@/content/site";

export const metadata: Metadata = { title: onboarding.title };

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();
  if (profile) redirect("/home");

  const cookieStore = await cookies();
  const hasPendingCode = Boolean(cookieStore.get("tv-invite-code")?.value);

  return (
    <main id="content" className="mx-auto max-w-md px-5 py-16">
      <p className="font-display text-xl">{site.name}</p>
      <h1 className="mt-8 font-display text-3xl tracking-tight">{onboarding.title}</h1>
      <p className="mt-2 text-ink-soft">{onboarding.sub}</p>
      <div className="mt-8">
        <OnboardingForm hasPendingCode={hasPendingCode} />
      </div>
    </main>
  );
}
