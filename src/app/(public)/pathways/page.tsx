import PathwaysCategories from "@/components/Pathways/PathwaysCategories";
import PathwaysFeatures from "@/components/Pathways/PathwaysFeatures";
import PathwaysGuidance from "@/components/Pathways/PathwaysGuidance";
import PathwaysHero from "@/components/Pathways/PathwaysHero";
import PathwaysMatches from "@/components/Pathways/PathwaysMatches";
import PathwaysProcess from "@/components/Pathways/PathwaysProcess";

export default function PathwaysPage() {
  return (
    <div>
      <PathwaysHero />
      <PathwaysCategories />
      <PathwaysProcess />
      <PathwaysFeatures />
      <PathwaysMatches />
      <PathwaysGuidance />
    </div>
  );
}
