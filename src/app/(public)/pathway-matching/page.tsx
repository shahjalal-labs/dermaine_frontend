import HowItWorks from "@/components/PathwayMatching/HowItWorks";
import KeyFactors from "@/components/PathwayMatching/KeyFactors";
import PathwayHero from "@/components/PathwayMatching/PathwayHero";
import PathwaysExamples from "@/components/PathwayMatching/PathwaysExamples";
import WhyApplicantsUse from "@/components/PathwayMatching/WhyApplicantsUse";

export const metadata = {
  title: "Pathway Matching Explained",
  description:
    "Our platform analyzes your profile to match you with the most relevant Canadian immigration pathways and programs.",
};

export default function PathwayMatchingPage() {
  return (
    <div className="bg-background min-h-screen">
      <PathwayHero />
      <HowItWorks />
      <KeyFactors />
      <WhyApplicantsUse />
      <PathwaysExamples />
    </div>
  );
}
