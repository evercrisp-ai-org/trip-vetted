"use client";

import { useState } from "react";
import { home } from "@/content/site";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // Clipboard unavailable; the code is on screen to copy by hand.
        }
      }}
      className="border-2 border-ink px-3 py-1 font-mono text-xs uppercase tracking-wider hover:bg-ink hover:text-paper"
    >
      {copied ? home.copiedNote : home.copyButton}
    </button>
  );
}
