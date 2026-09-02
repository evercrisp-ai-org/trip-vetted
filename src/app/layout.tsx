import type { Metadata } from "next";
import { Outfit, Inter, IBM_Plex_Mono, Newsreader } from "next/font/google";
import { site, chrome } from "@/content/site";
import "./globals.css";

// next/font downloads at build time and self-hosts; no font CDN at runtime.
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Editorial serif for marketing headlines only. The app keeps Outfit.
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

/*
 * metadataBase makes the generated social-card URL absolute, which Slack,
 * iMessage and Twitter all require. Set NEXT_PUBLIC_SITE_URL in the hosting
 * environment; the localhost fallback only keeps local builds quiet.
 */
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: `${site.name}: ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name}: ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name}: ${site.tagline}`,
    description: site.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // The font variables MUST be on <html>, not <body>. The @theme tokens in
    // globals.css are declared on :root and reference them, and a custom
    // property is resolved where it is declared. On <body> they are out of
    // reach, every font token becomes invalid, and the whole site silently
    // falls back to the system font. It did, for a while.
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} ${newsreader.variable} ${plexMono.variable}`}
    >
      <body className="antialiased">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
        >
          {chrome.skipToContent}
        </a>
        {children}
      </body>
    </html>
  );
}
