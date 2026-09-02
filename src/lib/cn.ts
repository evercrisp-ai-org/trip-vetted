/**
 * Join class names, dropping falsy entries. This is all the shadcn `cn`
 * helper does that we need; it is deliberately not clsx + tailwind-merge,
 * which would be two dependencies for one call site.
 */
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}
