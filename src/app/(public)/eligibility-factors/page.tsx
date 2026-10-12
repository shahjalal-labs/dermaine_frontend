import AssessmentReviews from "@/components/EligibilityFactor/AssessmentReviews";
import EligibilityHero from "@/components/EligibilityFactor/EligibilityHero";
import PlatformIdentify from "@/components/EligibilityFactor/PlatformIdentify";
import WhyApplicantsUse from "@/components/EligibilityFactor/WhyApplicantsUse";
import Review from "@/components/Home/Review";

export default function EligibilityFactorsPage() {
  return (
    <div>
      <EligibilityHero />
      <AssessmentReviews />
      <PlatformIdentify />
      <WhyApplicantsUse />
      <Review />
    </div>
  );
}
