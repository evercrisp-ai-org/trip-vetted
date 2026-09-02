import Link from "next/link";
import { site, nav } from "@/content/site";

/**
 * The nav pill. Rendered inside the hero frame rather than over the page,
 * so it sits on the photograph the way the reference layout does.
 */
export function SiteNav() {
  return (
    <header className="relative z-20">
      <div className="flex items-center justify-between gap-4 rounded-full bg-night/65 px-4 py-2.5 text-white backdrop-blur-md sm:px-5 sm:py-3">
        <Link
          href="/"
          className="whitespace-nowrap font-display text-base font-semibold tracking-tight sm:text-lg"
        >
          {site.name}
        </Link>
        <nav aria-label="Site" className="flex items-center gap-4 sm:gap-6">
          <a
            href="#how-it-works"
            className="hidden text-sm text-white hover:text-accent-wash sm:block"
          >
            {nav.howItWorks}
          </a>
          <a
            href="#stamps"
            className="hidden text-sm text-white hover:text-accent-wash sm:block"
          >
            {nav.stamps}
          </a>
          <a
            href="#privacy"
            className="hidden text-sm text-white hover:text-accent-wash lg:block"
          >
            {nav.privacy}
          </a>
          <Link
            href="/login"
            className="hidden whitespace-nowrap text-sm text-white hover:text-accent-wash sm:block"
          >
            {nav.memberSignIn}
          </Link>
          <Link
            href="/join"
            className="whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm font-semibold text-night hover:bg-accent-wash"
          >
            {nav.haveAnInvite}
          </Link>
        </nav>
      </div>
    </header>
  );
}
