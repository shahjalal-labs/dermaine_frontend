import Review from "@/components/Home/Review";
import ResourceContent from "@/components/Resource/ResourceContent";
import ResourceHero from "@/components/Resource/ResourceHero";
import Frequently from "@/components/Shared/Frequently";

export default function ResourcePage() {
  return (
    <main>
      <ResourceHero />
      <ResourceContent />
      <Review />
      <Frequently />
    </main>
  );
}
