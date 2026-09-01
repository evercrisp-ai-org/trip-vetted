"use client";

import { useActionState } from "react";
import { joinWaitlist, type WaitlistState } from "./actions";
import { waitlist } from "@/content/site";

const initial: WaitlistState = { status: "idle", message: "" };

export function WaitlistForm() {
  const [state, action, pending] = useActionState(joinWaitlist, initial);

  if (state.status === "ok") {
    return (
      <p
        role="status"
        className="border-2 border-ok px-4 py-3 font-mono text-sm text-ok"
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
        className="w-full border-2 border-ink bg-paper-raised px-4 py-3 font-mono text-sm text-ink placeholder:text-ink-faint"
      />
      <button
        type="submit"
        disabled={pending}
        className="shrink-0 border-2 border-stamp bg-stamp px-6 py-3 font-mono text-sm font-medium uppercase tracking-wider text-paper-raised hover:bg-stamp-deep hover:border-stamp-deep disabled:opacity-60"
      >
        {pending ? "…" : waitlist.button}
      </button>
      {(state.status === "invalid" || state.status === "error") && (
        <p role="alert" className="font-mono text-sm text-error sm:self-center">
          {state.message}
        </p>
      )}
    </form>
  );
}
