import container from "@/assets/card/Container.svg";
import planning from "@/assets/card/plan.svg";
import lock from "@/assets/card/SVG (1).svg";
import { GraduationCap } from "lucide-react";
import Image from "next/image";
import { IoStarSharp } from "react-icons/io5";
import FadeUp from "../Shared/Animation/FadeUp";

const examples = [
  {
    icon: IoStarSharp,
    title: "Express Entry",
    description:
      "For skilled workers with strong human capital factors and work experience.",
  },
  {
    icon: container,
    title: "Provincial Nominee Program",
    description:
      "Province-specific pathways for in-demand occupations and regional needs.",
  },
  {
    icon: lock,
    title: "Work Permit Pathways",
    description:
      "Options to gain Canadian work experience and transition to PR.",
  },
  {
    icon: GraduationCap,
    title: "Study to PR Pathways",
    description: "Study in Canada and build a pathway to permanent residence.",
  },
  {
    icon: planning,
    title: "Family Sponsorship",
    description:
      "Sponsor your eligible family members to come and live in Canada.",
  },
];

export default function PathwaysExamples() {
  return (
    <section className="bg-background py-16 mb-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <FadeUp
            as="h2"
            className="text-3xl md:text-4xl lg:text-5xl font-bold caros  text-title"
          >
            Pathways You May Match With (Examples)
          </FadeUp>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
          {examples.map((example, idx) => {
            const Icon = example.icon;
            return (
              <FadeUp
                key={idx}
                delay={idx * 0.15}
                className="group relative bg-white rounded-2xl border border-gray-100 border-b-4 border-b-transparent p-6 flex flex-col items-start cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-[0.97] hover:bg-[#f4fbf5] hover:border-primary/20 hover:border-b-primary hover:shadow-sm"
              >
                <div className="w-10 h-10 text-primary flex items-center justify-start mb-4 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-x-3 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(0,176,80,0.4)]">
                  {typeof Icon === "string" ||
                  (Icon && typeof Icon === "object" && "src" in Icon) ? (
                    <Image
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      src={Icon as any}
                      alt={example.title}
                      width={32}
                      height={32}
                      className="transition-transform duration-500"
                    />
                  ) : (
                    <Icon
                      size={32}
                      strokeWidth={1.5}
                      className="transition-transform duration-500"
                    />
                  )}
                </div>

                <h3 className="text-lg md:text-xl font-bold text-title mb-3 playfair-display transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-x-2 group-hover:text-primary">
                  {example.title}
                </h3>

                <p className="text-description text-base md:text-lg leading-relaxed poppins transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-x-1 group-hover:opacity-80">
                  {example.description}
                </p>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}
