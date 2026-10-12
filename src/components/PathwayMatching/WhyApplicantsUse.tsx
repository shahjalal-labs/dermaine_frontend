import insigths from "@/assets/card/insigts.svg";
import planning from "@/assets/card/plan.svg";
import { Box, FileText, Lightbulb } from "lucide-react";
import Image from "next/image";
import FadeUp from "../Shared/Animation/FadeUp";

const reasons = [
  {
    icon: Box,
    title: "Top Matched Pathways",
    description:
      "Discover the immigration pathways that best match your profile.",
  },
  {
    icon: insigths,
    title: "Match Score & Insights",
    description:
      "See your match score and understand why each pathway is recommended.",
  },
  {
    icon: FileText,
    title: "Eligibility Overview",
    description:
      "Understand the key requirements and how well your profile aligns with each program.",
  },
  {
    icon: Lightbulb,
    title: "Improvement Suggestions",
    description:
      "Get personalized suggestions to strengthen your profile and increase Opportunities.",
  },
  {
    icon: planning,
    title: "Continues Roadmap",
    description:
      "Clear guidance on the Continues you can take for your preferred pathways.",
  },
];

export default function WhyApplicantsUse() {
  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <FadeUp
            as="h2"
            className="text-3xl md:text-4xl lg:text-5xl font-bold caros  text-title"
          >
            Why Applicants Use The Assessment
          </FadeUp>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
          {reasons.map((reason, idx) => {
            const Icon = reason.icon;
            return (
              <FadeUp
                key={idx}
                delay={idx * 0.15}
                className="group relative bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-start cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:-translate-y-2 hover:shadow-[0_20px_40px_-12px_rgba(0,176,80,0.15)] overflow-hidden"
              >
                {/* Unique top accent bar that sweeps across on hover */}
                <div className="absolute top-0 left-0 h-1 w-0 bg-primary transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] group-hover:w-full" />

                {/* Unique icon container shape-morph */}
                <div className="w-14 h-14 rounded-full bg-[#f4fbf5] text-primary flex items-center justify-center mb-6 transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] group-hover:bg-primary group-hover:text-white  group-hover:shadow-[0_8px_16px_-4px_rgba(0,176,80,0.4)] group-hover:-translate-y-1">
                  {typeof Icon === "string" ||
                  (Icon && typeof Icon === "object" && "src" in Icon) ? (
                    <Image
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      src={Icon as any}
                      alt={reason.title}
                      width={28}
                      height={28}
                      className="transition-all duration-500 group-hover:scale-110 group-hover:brightness-0 group-hover:invert"
                    />
                  ) : (
                    <Icon
                      size={28}
                      strokeWidth={2}
                      className="transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                </div>

                <h3 className="text-lg md:text-xl font-bold text-title mb-3 playfair-display transition-colors duration-500 group-hover:text-primary relative z-10">
                  {reason.title}
                </h3>

                <p className="text-description text-base md:text-[17px] leading-relaxed poppins relative z-10 transition-opacity duration-500 group-hover:opacity-90">
                  {reason.description}
                </p>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}
