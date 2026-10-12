import {
  Briefcase,
  GraduationCap,
  Landmark,
  LineChart,
  MapPin,
  Route,
  Search,
} from "lucide-react";

import alphabet from "@/assets/card/alphabet-chinese.svg";
import immigration from "@/assets/card/directions-01.svg";
import Image from "next/image";
import FadeUp from "../Shared/Animation/FadeUp";

const identifies = [
  {
    title: "Immigration pathways that may fit your profile",
    icon: immigration,
  },
  {
    title: "Provincial Opportunities matching your background",
    icon: Landmark,
  },
  {
    title: "Work permit pathways",
    icon: Briefcase,
  },
  {
    title: "Study-to-PR Opportunities",
    icon: GraduationCap,
  },
  {
    title: "Alternative immigration options",
    icon: Route,
  },
  {
    title: "Missing eligibility factors",
    icon: Search,
  },
  {
    title: "Potential improvement Opportunities",
    icon: LineChart,
  },
  {
    title: "Regional immigration streams",
    icon: MapPin,
  },
  {
    title: "Category-based selection alignment",
    icon: alphabet,
  },
];

export default function PlatformIdentify() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <FadeUp
            as="h2"
            className="text-3xl md:text-4xl lg:text-5xl font-bold caros  text-title"
          >
            What The Platform May Help Identify
          </FadeUp>
        </div>

        <div className="flex flex-wrap justify-center lg:flex-nowrap lg:justify-between items-start">
          {identifies.map((item, idx) => {
            return (
              <FadeUp
                key={idx}
                delay={idx * 0.1}
                className="flex flex-col items-center text-center w-1/2 sm:w-1/3 lg:w-full lg:border-r border-gray-200 last:border-0 px-2 mb-8 lg:mb-0 mt-12 group cursor-pointer"
              >
                <div className="text-primary mb-4 flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-1">
                  {typeof item.icon === "string" ? (
                    <Image
                      src={item.icon}
                      alt={item.title}
                      className="w-10 h-10"
                    />
                  ) : item.icon &&
                    typeof item.icon === "object" &&
                    "src" in item.icon ? (
                    <Image
                      src={item.icon.src}
                      alt={item.title}
                      width={35}
                      height={35}
                    />
                  ) : (
                    <item.icon size={35} strokeWidth={1.5} />
                  )}
                </div>
                <p className="font-medium text-description text-base md:text-lg poppins max-w-25 leading-tight transition-colors duration-300 group-hover:text-primary">
                  {item.title}
                </p>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}
