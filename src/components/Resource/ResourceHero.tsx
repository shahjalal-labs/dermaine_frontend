import heroImage from "@/assets/guidence.png";
import PageHero from "@/components/Shared/PageHero";
import { RefreshCw, ShieldCheck, UserSearch } from "lucide-react";
import { TbLockPassword } from "react-icons/tb";

const features = [
  {
    icon: ShieldCheck,
    title: "Expertly",
    subtitle: "Curated",
  },
  {
    icon: RefreshCw,
    title: "Always",
    subtitle: "Updated",
  },
  {
    icon: TbLockPassword,
    title: "Reliable &",
    subtitle: "Confidential",
  },
  {
    icon: UserSearch,
    title: "Build for",
    subtitle: "Applicants",
  },
];

export default function ResourceHero() {
  return (
    <PageHero
      title="Resources & Guidance"
      description="Explore practical guides, platform resources, and expert insights to help you make informed decisions about your Canadian immigration journey."
      image={heroImage}
    >
      <div className="flex flex-wrap items-center pt-8 md:pt-10 -ml-4 md:-ml-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <div
              key={index}
              className={`flex flex-col items-center px-4 md:px-10 mb-4 md:mb-0 ${
                index !== features.length - 1 ? "border-r border-black/10" : ""
              }`}
            >
              <Icon size={24} className="text-primary mb-3" strokeWidth={1.5} />

              <span className="text-sm md:text-base font-medium text-title text-center leading-tight poppins ">
                {feature.title}
                <br />
                {feature.subtitle}
              </span>
            </div>
          );
        })}
      </div>
    </PageHero>
  );
}
