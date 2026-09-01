import Link from "next/link";
import type { Metadata } from "next";
import { JoinFlow } from "@/features/auth/join-flow";
import { join, site } from "@/content/site";

export const metadata: Metadata = { title: join.title };

export default function JoinPage() {
  return (
    <main id="content" className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-5 py-16">
      <Link href="/" className="font-display text-xl">{site.name}</Link>
      <h1 className="mt-8 font-display text-3xl tracking-tight">{join.title}</h1>
      <p className="mt-2 text-ink-soft">{join.sub}</p>
      <div className="mt-8">
        <JoinFlow />
      </div>
    </main>
  );
}
