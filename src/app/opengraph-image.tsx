import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { site, hero } from "@/content/site";

/*
 * The social preview card. This link's whole job is being forwarded, so an
 * unfurl with no image is a real loss, not a polish item.
 *
 * Runs on the Node runtime because it reads the photograph off disk and
 * inlines it: satori cannot fetch a relative URL. public/og-source.jpg is a
 * small, lower-quality copy of the hero frame that exists only for this card,
 * so the 1 MB original is not base64'd into every build.
 *
 * Two satori limits learned the hard way here. Do not undo either one:
 *   1. backgroundSize "cover" is not honoured. A CSS background photograph
 *      tiles instead of filling, which puts a hard seam down the card. The
 *      photograph is therefore a positioned <img> with explicit pixel size.
 *   2. The "inset" shorthand is ignored, and percentage widths resolve
 *      against the wrong box. Every absolute box below names top/left and
 *      explicit pixel width and height.
 *
 * Type is set by the file name, so Next serves this at /opengraph-image and
 * wires the tags automatically. Twitter reuses it (see layout.tsx).
 */
export const runtime = "nodejs";
export const alt = `${site.name}: ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PHOTO_W = 1200;
const PHOTO_H = 801;
// Show the street rather than the sky: bias the crop down the frame.
const PHOTO_TOP = -Math.round((PHOTO_H - size.height) * 0.58);

export default async function OpengraphImage() {
  const file = path.join(process.cwd(), "public", "og-source.jpg");
  const photo = fs.existsSync(file)
    ? `data:image/jpeg;base64,${fs.readFileSync(file).toString("base64")}`
    : null;

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: size.width,
          height: size.height,
          padding: 64,
          backgroundColor: "#071820",
        }}
      >
        {photo ? (
          <img
            src={photo}
            alt=""
            width={PHOTO_W}
            height={PHOTO_H}
            style={{ position: "absolute", top: PHOTO_TOP, left: 0 }}
          />
        ) : null}

        {/* Same scrim discipline as the page: a light base wash plus a heavy
            bottom gradient where the words actually sit. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: size.width,
            height: size.height,
            backgroundColor: "rgba(7, 24, 32, 0.45)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: size.height - 470,
            left: 0,
            width: size.width,
            height: 470,
            backgroundImage:
              "linear-gradient(to top, rgba(7,24,32,0.94), rgba(7,24,32,0.6), rgba(7,24,32,0))",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            fontSize: 30,
            fontWeight: 600,
            color: "#ffffff",
            letterSpacing: -0.5,
          }}
        >
          {site.name}
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 74,
              fontWeight: 700,
              lineHeight: 1.04,
              color: "#ffffff",
              letterSpacing: -2,
            }}
          >
            {hero.lines.map((line, i) => (
              <div
                key={line}
                style={{
                  display: "flex",
                  color: i === hero.lines.length - 1 ? "#d8ecf0" : "#ffffff",
                }}
              >
                {line}
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 26,
              color: "#d8ecf0",
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            {site.tagline}
          </div>
        </div>
      </div>
    ),
    size
  );
}
