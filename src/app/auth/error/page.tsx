import Link from "next/link";
import { authErrors, site } from "@/content/site";

export default function AuthErrorPage() {
  return (
    <main id="content" className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-5 py-16">
      <p className="font-display text-xl">{site.name}</p>
      <p className="mt-6 rounded-xl border border-error bg-surface px-4 py-3 text-sm text-error">
        {authErrors.linkExpired}
      </p>
      <Link
        href="/login"
        className="mt-6 inline-block rounded-full border border-ink px-5 py-2.5 text-center text-sm font-medium uppercase tracking-wider hover:bg-ink hover:text-white"
      >
        {authErrors.tryAgain}
      </Link>
    </main>
  );
}
