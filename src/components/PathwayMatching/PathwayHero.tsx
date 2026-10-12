import heroImage from "@/assets/home/pathway-matching.png";
import PageHero from "../Shared/PageHero";

export default function PathwayHero() {
  return (
    <PageHero
      title="Pathway Matching Explained"
      description="Our platform analyzes your profile to match you with the most relevant Canadian immigration pathways and programs. Find options that align with your background, goals, and future plans."
      image={heroImage}
    />
  );
}
