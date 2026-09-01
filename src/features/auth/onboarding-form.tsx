"use client";

import { useActionState } from "react";
import { completeOnboarding, type OnboardingState } from "./actions";
import { onboarding } from "@/content/site";

const initial: OnboardingState = { status: "idle", message: "" };

const field =
  "mt-2 w-full rounded-xl border border-line-strong bg-surface px-4 py-3 text-sm";
const label =
  "block text-xs font-medium uppercase tracking-wider text-ink-soft";

export function OnboardingForm({ hasPendingCode }: { hasPendingCode: boolean }) {
  const [state, action, pending] = useActionState(completeOnboarding, initial);

  return (
    <form action={action} className="space-y-6">
      {!hasPendingCode && (
        <div>
          <label htmlFor="ob-code" className={label}>{onboarding.codeLabel}</label>
          <p className="mt-1 text-sm text-ink-faint">{onboarding.needCode}</p>
          <input id="ob-code" name="inviteCode" required autoComplete="off"
            autoCapitalize="characters" spellCheck={false}
            className={`${field} font-mono uppercase`} />
        </div>
      )}
      <div>
        <label htmlFor="ob-name" className={label}>{onboarding.nameLabel}</label>
        <input id="ob-name" name="displayName" required maxLength={80}
          placeholder={onboarding.namePlaceholder} autoComplete="name"
          className={field} />
      </div>
      <div>
        <label htmlFor="ob-city" className={label}>{onboarding.cityLabel}</label>
        <input id="ob-city" name="homeCity" maxLength={120}
          placeholder={onboarding.cityPlaceholder} className={field} />
      </div>
      <div>
        <label htmlFor="ob-tags" className={label}>{onboarding.tagsLabel}</label>
        <p className="mt-1 text-sm text-ink-faint">{onboarding.tagsSub}</p>
        <input id="ob-tags" name="tasteTags" placeholder={onboarding.tagsPlaceholder}
          className={field} />
      </div>
      <div>
        <label htmlFor="ob-avatar" className={label}>{onboarding.avatarLabel}</label>
        <p className="mt-1 text-sm text-ink-faint">{onboarding.avatarSub}</p>
        <input id="ob-avatar" name="avatar" type="file" accept="image/*"
          className="mt-2 w-full text-sm file:mr-4 file:rounded-full file:border file:border-ink file:bg-surface file:px-4 file:py-2 file:text-xs file:font-medium file:uppercase" />
      </div>
      <div>
        <label htmlFor="ob-bio" className={label}>{onboarding.bioLabel}</label>
        <input id="ob-bio" name="bio" maxLength={200}
          placeholder={onboarding.bioPlaceholder} className={field} />
      </div>
      <button type="submit" disabled={pending}
        className="w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-deep disabled:opacity-60">
        {pending ? "…" : onboarding.button}
      </button>
      {state.status === "error" && (
        <p role="alert" className="text-sm text-error">{state.message}</p>
      )}
    </form>
  );
}
