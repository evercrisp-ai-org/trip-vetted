"use client";

import { useActionState } from "react";
import { joinWaitlist, type WaitlistState } from "./actions";
import { waitlist } from "@/content/site";

const initial: WaitlistState = { status: "idle", message: "" };

/** Lives at the top of the footer; every colour is a token, so it follows the theme scope. */
export function WaitlistForm() {
  const [state, action, pending] = useActionState(joinWaitlist, initial);

  if (state.status === "ok") {
    return (
      <p
        role="status"
        className="rounded-full bg-surface px-5 py-3.5 text-sm font-medium text-ok"
      >
        {state.message}
      </p>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-3 sm:flex-row">
      <label htmlFor="waitlist-email" className="sr-only">
        {waitlist.placeholder}
      </label>
      <input
        id="waitlist-email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder={waitlist.placeholder}
        className="w-full rounded-full border border-line-strong bg-surface px-5 py-3.5 text-sm text-ink placeholder:text-ink-faint focus:border-accent"
      />
      <button
        type="submit"
        disabled={pending}
        className="shrink-0 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-night hover:bg-accent-wash disabled:opacity-60"
      >
        {pending ? "…" : waitlist.button}
      </button>
      {(state.status === "invalid" || state.status === "error") && (
        <p
          role="alert"
          className="rounded-full bg-error px-4 py-2 text-sm font-medium text-white sm:self-center"
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
