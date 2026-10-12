import PricingCards from "@/components/Pricing/PricingCards";
import PricingFAQ from "@/components/Pricing/PricingFAQ";
import PricingHero from "@/components/Pricing/PricingHero";
import PricingReportIncludes from "@/components/Pricing/PricingReportIncludes";

export default function PricingPage() {
  return (
    <main className="bg-background">
      <PricingHero />
      <PricingCards />
      <PricingReportIncludes />
      <PricingFAQ />
    </main>
  );
}
