import mapping from "@/assets/card/mapping.svg";
import {
  ClipboardCheck,
  FileSearch,
  SlidersVertical,
  User,
} from "lucide-react";
import Image from "next/image";
import FadeUp from "../Shared/Animation/FadeUp";

const steps = [
  {
    icon: User,
    number: "1",
    title: "Profile Analysis",
    description:
      "We analyze your personal, education, work experience, language ability, and other key factors.",
  },
  {
    icon: mapping,
    number: "2",
    title: "Pathway Mapping",
    description:
      "Our system maps your profile to Canadian immigration programs and streams.",
  },
  {
    icon: SlidersVertical,
    number: "3",
    title: "Match Calculation",
    description:
      "Each pathway is scored based on eligibility alignment and program requirements.",
  },
  {
    icon: FileSearch,
    number: "4",
    title: "Personalized Ranking",
    description:
      "You receive a ranked list of pathways with match levels and key insights.",
  },
  {
    icon: ClipboardCheck,
    number: "5",
    title: "Actionable Continues",
    description:
      "Get clear recommendations on what you can do next to move forward.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <FadeUp
            as="h2"
            className="text-3xl md:text-4xl lg:text-5xl font-bold caros text-title"
          >
            How Pathway Matching Works
          </FadeUp>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 relative z-20">
            {steps.map((step, idx) => {
              const Icon = step.icon;
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
                  <div className="relative z-10 flex flex-col items-center text-center p-6 bg-white rounded-[14px] w-full h-full">
                    <div
                      className="absolute top-13 -left-6 -right-6 border-t-[1.5px] border-dotted border-[#8EB5E6] z-0 hidden lg:block"
                      style={{ display: "none" }}
                    ></div>
                    <div className="w-12 h-12 rounded-full bg-[#eef8ef] text-primary flex items-center justify-center mb-5 relative z-10 ring-8 ring-white transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110 group-hover:rotate-6">
                      {typeof Icon === "string" ||
                      (Icon && typeof Icon === "object" && "src" in Icon) ? (
                        <Image
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          src={Icon as any}
                          alt={step.title}
                          width={25}
                          height={25}
                          className="object-contain"
                        />
                      ) : (
                        <Icon size={30} strokeWidth={1.5} />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-3 relative z-10 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105">
                      <div className="w-5 h-5 bg-primary rounded-full text-white flex items-center justify-center text-xs">
                        {step.number}
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-title poppins transition-colors duration-500 group-hover:text-green-800">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-description text-sm md:text-base leading-relaxed poppins relative z-10">
                      {step.description}
                    </p>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
