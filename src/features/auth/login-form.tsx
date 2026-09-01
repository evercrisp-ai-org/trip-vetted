"use client";

import { useActionState } from "react";
import Link from "next/link";
import { sendMagicLink, type AuthFormState } from "./actions";
import { login } from "@/content/site";

const initial: AuthFormState = { status: "idle", message: "" };

export function LoginForm() {
  const [state, action, pending] = useActionState(sendMagicLink, initial);

  if (state.status === "sent") {
    return (
      <p role="status" className="border-2 border-ok px-4 py-3 text-sm text-ok">
        {state.message}
      </p>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="login-email" className="block font-mono text-xs uppercase tracking-wider text-ink-soft">
          {login.emailLabel}
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-2 w-full border-2 border-ink bg-paper-raised px-4 py-3 font-mono text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full border-2 border-stamp bg-stamp px-6 py-3 font-mono text-sm font-medium uppercase tracking-wider text-paper-raised hover:border-stamp-deep hover:bg-stamp-deep disabled:opacity-60"
      >
        {pending ? "…" : login.button}
      </button>
      {state.status === "error" && (
        <p role="alert" className="text-sm text-error">{state.message}</p>
      )}
      <p className="text-sm text-ink-soft">
        {login.notMember}{" "}
        <Link href="/join" className="text-stamp underline underline-offset-2">
          {login.notMemberLink}
        </Link>
      </p>
    </form>
  );
}
