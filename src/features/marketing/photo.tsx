import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

/**
 * An image slot. Renders the file from /public/images when it exists, and
 * the branded placeholder (teal gradient with grain) when it does not, so
 * the site never looks broken while imagery is being produced.
 *
 * Every slot is documented in IMAGERY.md. Dropping a correctly named file
 * into public/images is the whole deployment; no code changes.
 *
 * Renders edge to edge inside a `relative` parent that owns the aspect
 * ratio and rounding.
 *
 * `position` is a CSS object-position value. The photographs here are real
 * travel shots at their own crops, so each slot names the part of the frame
 * that must survive being cropped. Tune this rather than re-exporting files.
 */
export function Photo({
  file,
  alt,
  sizes,
  priority = false,
  position,
}: {
  file: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  position?: string;
}) {
  if (!hasFile(file)) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="img-placeholder absolute inset-0"
      />
    );
  }

  return (
    <Image
      src={`/images/${file}`}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover"
      style={position ? { objectPosition: position } : undefined}
    />
  );
}


function hasFile(file: string) {
  return fs.existsSync(path.join(process.cwd(), "public", "images", file));
}
