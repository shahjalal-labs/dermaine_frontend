import canadian from "@/assets/card/canadian.svg";
import planning from "@/assets/card/plan.svg";
import {
  Briefcase,
  Building2,
  FileText,
  GraduationCap,
  MapPin,
  MessageSquareText,
  UserCog,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import FadeUp from "../Shared/Animation/FadeUp";

const factors = [
  { icon: planning, title: "Age & Long-Term Planning" },
  { icon: GraduationCap, title: "Education Background" },
  { icon: Briefcase, title: "Work Experience" },
  { icon: MessageSquareText, title: "Language Ability" },
  { icon: canadian, title: "Canadian Experience" },
  { icon: Building2, title: "Occupation & Industry Demand" },
  { icon: Users, title: "Family Connections" },
  { icon: MapPin, title: "Province & Region Preferences" },
  { icon: Zap, title: "Adaptability Potential" },
  { icon: FileText, title: "Program Requirements" },
];

export default function KeyFactors() {
  return (
    <section className="bg-background py-16 poppins ">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <FadeUp
            as="h2"
            className="text-3xl md:text-4xl lg:text-5xl font-bold caros  text-title"
          >
            Key Factors We Consider
          </FadeUp>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {factors.map((factor, idx) => {
            const Icon = factor.icon;
            return (
              <FadeUp
                key={idx}
                delay={idx * 0.1}
                className="group bg-white rounded-lg border border-gray-100 p-4 flex items-center gap-3 cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:translate-x-1.5 hover:border-primary/30 relative overflow-hidden"
              >
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="text-primary shrink-0 relative z-10 transition-transform duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] group-hover:scale-110 group-hover:rotate-6">
                  {typeof Icon === "string" ||
                  (Icon && typeof Icon === "object" && "src" in Icon) ? (
                    <Image
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      src={Icon as any}
                      alt={factor.title}
                      width={28}
                      height={28}
                      className="transition-transform duration-500 group-hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                    />
                  ) : Icon === UserCog ? (
                    <Icon
                      size={28}
                      strokeWidth={2}
                      className="transition-transform duration-500 group-hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                    />
                  ) : (
                    <Icon
                      size={28}
                      strokeWidth={2}
                      className="transition-transform duration-500 group-hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                    />
                  )}
                </div>
                <p className="text-title text-base md:text-[17px] font-medium relative z-10 transition-colors duration-500 group-hover:text-primary">
                  {factor.title}
                </p>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}
