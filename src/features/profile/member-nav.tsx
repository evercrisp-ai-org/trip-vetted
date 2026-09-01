import Link from "next/link";
import { home, site } from "@/content/site";

export function MemberNav() {
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
        <Link href="/home" className="font-display text-xl tracking-tight">
          {site.name}
        </Link>
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="text-xs font-medium uppercase tracking-wider text-ink-soft hover:text-ink"
          >
            {home.signOut}
          </button>
        </form>
      </div>
    </header>
  );
}
