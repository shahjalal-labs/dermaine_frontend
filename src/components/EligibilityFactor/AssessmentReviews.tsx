import strategy from "@/assets/card/analytics-up.svg";
import { Briefcase, GraduationCap } from "lucide-react";
import Image from "next/image";
import { LuUserRound } from "react-icons/lu";
import { PiMapPinArea, PiTree, PiUsersLight } from "react-icons/pi";
import { TbMessage } from "react-icons/tb";
import FadeUp from "../Shared/Animation/FadeUp";

const reviews = [
  {
    title: "Age & Family Factors (Planning)",
    description:
      "Some immigration pathways prioritize applicants based on age. adaptability, or long-term settlement potential.",

    icon: LuUserRound,
  },
  {
    title: "Educational Background",
    description:
      "Canadian and foreign education may influence pathway Opportunities, study options, and eligibility categories.",

    icon: GraduationCap,
  },
  {
    title: "Work Experience",
    description:
      "Your occupation. years of experience, industry background, and skilled work history may affect pathway matching,",

    icon: Briefcase,
  },
  {
    title: "Language Ability",
    description:
      "English and French language ability may impact eligibility for Express Entry. category-based selection, PNPS. and Francophone pathways.",

    icon: TbMessage,
  },
  {
    title: "Canadian Experience",
    description:
      "Canadian work, study, or family connections may create  additional immigration Opportunities.",

    icon: PiTree,
  },
  {
    title: "Occupation & Industry Demand",
    description:
      "Some pathways target applicants working in healthcare, trades, STEM, transport, education, agriculture. and other priority sectors.",

    icon: strategy,
  },
  {
    title: "Family Connections",
    description:
      "Family sponsorship and Canadian relatives may create alternative immigration options.",

    icon: PiUsersLight,
  },
  {
    title: "Regional & Provincial Opportunities",
    description:
      "Different provinces and regions may prioritize applicants based on occupation demand, language ability. or regional workforce shortages.",

    icon: PiMapPinArea,
  },
];

export default function AssessmentReviews() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <FadeUp
            as="h2"
            className="text-3xl md:text-4xl lg:text-5xl font-bold caros  text-title"
          >
            What The Assessment Reviews
          </FadeUp>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((item, idx) => {
            const Icon = item.icon;
            return (
              <FadeUp
                key={idx}
                delay={idx * 0.15}
                className="relative rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-2 hover:shadow-[0_20px_40px_-12px_rgba(34,197,94,0.15)] group cursor-pointer overflow-hidden p-0.5 bg-white border border-gray-100 hover:border-transparent h-full"
              >
                {/* Spinning Gradient Border */}
                <div
                  className="absolute -inset-full z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:animate-[spin_3s_linear_infinite] blur-[2px]"
                  style={{
                    background:
                      "conic-gradient(from 0deg, transparent 0%, transparent 60%, #10b981 75%, #00b050 85%, #14b8a6 95%, #06b6d4 100%)",
                  }}
                />

                {/* Inner Card Content */}
                <div className="relative z-10 flex flex-col items-center text-center p-6 md:p-8 bg-[#F8FAFC] rounded-[14px] w-full h-full">
                  <div className="w-14 h-14 rounded-full border-2 border-[#E5F5ED] bg-white flex items-center justify-center text-[#00b050] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110 group-hover:rotate-6 group-hover:bg-[#f0fbf5] mb-6">
                    {typeof Icon === "string" ? (
                      <Image src={Icon} alt="Icon" className="w-6 h-6" />
                    ) : typeof Icon === "object" &&
                      Icon !== null &&
                      "src" in Icon ? (
                      <Image src={Icon.src} alt="Icon" width={35} height={35} />
                    ) : (
                      <Icon size={35} strokeWidth={1.5} />
                    )}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-title mb-4 poppins transition-colors duration-500 group-hover:text-green-800">
                    {item.title}
                  </h3>
                  <p className="text-description text-base md:text-lg leading-relaxed poppins ">
                    {item.description}
                  </p>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}
