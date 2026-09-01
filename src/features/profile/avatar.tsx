/* eslint-disable @next/next/no-img-element */

/** Square avatar plate. Falls back to the member's initial, set like type. */
export function Avatar({
  name,
  url,
  size = "h-12 w-12 text-lg",
}: {
  name: string;
  url: string | null;
  size?: string;
}) {
  if (url) {
    return (
      <img
        src={url}
        alt=""
        className={`${size} shrink-0 rounded-full border border-line object-cover`}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`${size} flex shrink-0 items-center justify-center rounded-xl border border-line-strong bg-surface-sunk font-display`}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}
