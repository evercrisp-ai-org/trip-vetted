"use client";

import { useActionState, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { sendMagicLink, type AuthFormState } from "./actions";
import { join } from "@/content/site";

const initial: AuthFormState = { status: "idle", message: "" };

/**
 * Two steps: check the invite code (a SECURITY DEFINER function that leaks
 * nothing but validity and the inviter's first name), then take an email
 * and send the magic link. The code itself is re-verified at redemption,
 * so this check is a courtesy, not the security boundary.
 */
export function JoinFlow() {
  const [code, setCode] = useState("");
  const [inviterName, setInviterName] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [state, action, pending] = useActionState(sendMagicLink, initial);

  async function checkCode(e: React.FormEvent) {
    e.preventDefault();
    setChecking(true);
    setCodeError(null);
    const supabase = createClient();
    const { data, error } = await supabase.rpc("check_invite_code", {
      invite_code: code.trim().toUpperCase(),
    });
    setChecking(false);
    const row = Array.isArray(data) ? data[0] : data;
    if (error || !row?.valid) {
      setCodeError(join.codeInvalid);
      setInviterName(null);
      return;
    }
    setInviterName(row.inviter_name ?? "");
  }

  if (state.status === "sent") {
    return (
      <p role="status" className="border-2 border-ok px-4 py-3 text-sm text-ok">
        {state.message}
      </p>
    );
  }

  if (inviterName !== null) {
    return (
      <form action={action} className="space-y-4">
        <p className="border-2 border-ok px-4 py-3 font-mono text-sm text-ok">
          {join.invitedByPrefix} {inviterName}
        </p>
        <input type="hidden" name="inviteCode" value={code.trim().toUpperCase()} />
        <div>
          <label htmlFor="join-email" className="block font-mono text-xs uppercase tracking-wider text-ink-soft">
            {join.emailLabel}
          </label>
          <p className="mt-1 text-sm text-ink-faint">{join.emailSub}</p>
          <input
            id="join-email"
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
          {pending ? "…" : join.emailButton}
        </button>
        {state.status === "error" && (
          <p role="alert" className="text-sm text-error">{state.message}</p>
        )}
      </form>
    );
  }

  return (
    <form onSubmit={checkCode} className="space-y-4">
      <div>
        <label htmlFor="join-code" className="block font-mono text-xs uppercase tracking-wider text-ink-soft">
          {join.codeLabel}
        </label>
        <input
          id="join-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          placeholder={join.codePlaceholder}
          className="mt-2 w-full border-2 border-ink bg-paper-raised px-4 py-3 font-mono text-sm uppercase placeholder:text-ink-faint"
        />
      </div>
      <button
        type="submit"
        disabled={checking}
        className="w-full border-2 border-ink px-6 py-3 font-mono text-sm uppercase tracking-wider hover:bg-ink hover:text-paper disabled:opacity-60"
      >
        {checking ? "…" : join.codeButton}
      </button>
      {codeError && (
        <p role="alert" className="text-sm text-error">{codeError}</p>
      )}
    </form>
  );
}
