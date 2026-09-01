import Link from "next/link";
import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/login-form";
import { login, site } from "@/content/site";

export const metadata: Metadata = { title: login.title };

export default function LoginPage() {
  return (
    <main id="content" className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-5 py-16">
      <Link href="/" className="font-display text-xl">{site.name}</Link>
      <h1 className="mt-8 font-display text-3xl tracking-tight">{login.title}</h1>
      <p className="mt-2 text-ink-soft">{login.sub}</p>
      <div className="mt-8">
        <LoginForm />
      </div>
    </main>
  );
}
