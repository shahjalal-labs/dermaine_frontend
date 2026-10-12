import Hero from "@/components/Home/Hero";
import HowItWork from "@/components/Home/HowItWork";
import PlatformAnalyzes from "@/components/Home/PlatformAnalyzes";
import Progress from "@/components/Home/Progress";
import Review from "@/components/Home/Review";
import YourJourney from "@/components/Home/YourJourney";
import Frequently from "@/components/Shared/Frequently";

export default function Home() {
  return (
    <main className="">
      <Hero />
      <Progress />
      <HowItWork />
      <YourJourney />
      <PlatformAnalyzes />
      <Frequently />
      <Review />
    </main>
  );
}
