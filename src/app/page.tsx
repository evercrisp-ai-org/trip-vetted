import {
  SiteNav,
  Hero,
  Circle,
  HowItWorks,
  StampsAndBriefs,
  Privacy,
  Waitlist,
  SiteFooter,
} from "@/features/marketing/sections";

export default function MarketingPage() {
  return (
    <>
      <SiteNav />
      <main id="content">
        <Hero />
        <Circle />
        <HowItWorks />
        <StampsAndBriefs />
        <Privacy />
        <Waitlist />
      </main>
      <SiteFooter />
    </>
  );
}
