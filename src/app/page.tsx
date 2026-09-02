import {
  Hero,
  Circle,
  HowItWorks,
  StampArc,
  StampsAndBriefs,
  AskTheHub,
  Privacy,
  Waitlist,
  SiteFooter,
} from "@/features/marketing/sections";

/*
 * The front door. The nav lives inside the hero frame, so it is rendered by
 * <Hero /> rather than here.
 */
export default function MarketingPage() {
  return (
    <>
      <main id="content">
        <Hero />
        <Circle />
        <HowItWorks />
        <StampArc />
        <StampsAndBriefs />
        <AskTheHub />
        <Privacy />
        <Waitlist />
      </main>
      <SiteFooter />
    </>
  );
}
