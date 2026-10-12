import heroImage from "@/assets/home/eligibility-factor.png";
import PageHero from "../Shared/PageHero";

export default function EligibilityHero() {
  return (
    <PageHero
      title="Eligibility Factors"
      description="Understand the key factors that may influence immigration
pathways, program matches, and eligibility Opportunities
across Canadian immigration programs.
Our assessment platform analyzes multiple profile factors
to help identify pathways that may align with your
background and goals."
      image={heroImage}
    ></PageHero>
  );
}
