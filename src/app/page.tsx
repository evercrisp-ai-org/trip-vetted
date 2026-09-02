import {
  Hero,
  Circle,
  HowItWorks,
  StampArc,
  StampsAndBriefs,
  AskTheHub,
  Privacy,
  SiteFooter,
} from "@/features/marketing/sections";

/*
 * The front door. Runs on the dark theme scope (ADR 0008); the app pages do
 * not. The nav lives inside the hero frame, so <Hero /> renders it. The
 * waitlist is the top of the footer.
 */
export default function MarketingPage() {
  return (
    <div className="theme-night">
      <main id="content">
        <Hero />
        <Circle />
        <HowItWorks />
        <StampArc />
        <StampsAndBriefs />
        <AskTheHub />
        <Privacy />
      </main>
      <SiteFooter />
    </div>
  );
}
