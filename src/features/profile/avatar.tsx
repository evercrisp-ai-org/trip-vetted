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
        className={`${size} shrink-0 border-2 border-ink object-cover`}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`${size} flex shrink-0 items-center justify-center border-2 border-ink bg-paper-sunk font-display`}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}
