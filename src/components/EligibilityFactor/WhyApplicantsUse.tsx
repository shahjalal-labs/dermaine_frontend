import { BadgeCheck } from "lucide-react";
import FadeUp from "../Shared/Animation/FadeUp";

const reasons = [
  "Understand possible immigration options before applying",
  "Explore pathways beyond Express Entry",
  "Discover province-specific Opportunities",
  "Identify possible Continues",
  "Reduce confusion around immigration programs",
  "Understand what may improve eligibility",
  "Explore work, study, PR, sponsorship, and regional options",
  "Get clarity based on your unique profile and goals",
  "Make more informed decisions with confidence",
];

export default function WhyApplicantsUse() {
  return (
    <section className="bg-background py-16 mb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <FadeUp
            as="h2"
            className="text-3xl md:text-4xl lg:text-5xl font-bold caros  text-title"
          >
            Why Applicants Use The Assessment
          </FadeUp>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
          {reasons.map((reason, idx) => (
            <FadeUp
              key={idx}
              delay={idx * 0.1}
              className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-start cursor-pointer group transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-2 hover:shadow-[0_20px_45px_-10px_rgba(0,176,80,0.28)] hover:border-transparent"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-5 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110 ${
                  idx === 1
                    ? "bg-[#FFEDD5] text-[#F54900] group-hover:shadow-[0_10px_20px_-5px_rgba(245,73,0,0.3)] group-hover:bg-[#ffe0b2]"
                    : "bg-[#54B75B1A] text-primary group-hover:shadow-[0_10px_20px_-5px_rgba(84,183,91,0.3)] group-hover:bg-[#d4ecd9]"
                }`}
              >
                <BadgeCheck
                  size={28}
                  strokeWidth={2.5}
                  className="transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-rotate-12"
                />
              </div>
              <p className="text-title font-medium text-base md:text-lg leading-relaxed poppins transition-colors duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:text-primary">
                {reason}
              </p>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
