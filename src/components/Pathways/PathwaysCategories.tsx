import FadeUp from "@/components/Shared/Animation/FadeUp";
import {
  Briefcase,
  Globe,
  GraduationCap,
  Plane,
  UserPlus,
  Users,
} from "lucide-react";

const categories = [
  {
    title: "Express Entry",
    description:
      "Fast-track immigration for skilled workers through Canada's points-based system.",
    tags: ["Skilled Workers", "Points-Based", "Permanent Residence"],
    icon: UserPlus,
    iconColor: "text-green-500",
    iconBg: "bg-green-50",
  },
  {
    title: "Provincial Nominee Program (PNPs)",
    description:
      "Province-specific pathways targeting applicants based on occupation, regional demand, work experience, or language ability.",
    tags: [
      "Permanent Residence",
      "Category Based Employment",
      "Occupational Residency",
    ],
    icon: Users,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
  },
  {
    title: "Work Permit Options",
    description:
      "Employer-supported and open work permit pathways that may help you work and gain Canadian experience.",
    tags: ["Employer-Specific", "Open Work Permit", "LMIA"],
    icon: Briefcase,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-50",
  },
  {
    title: "Study Pathways",
    description:
      "Study permit and study-to-PR Opportunities for applicants interested in education and future immigration options.",
    tags: ["Permanent Residency", "Study-to-PR", "Study Permit"],
    icon: GraduationCap,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-50",
  },
  {
    title: "Category-Based Selection",
    description:
      "Targeted immigration Opportunities for applicants in priority occupations and sectors identified by Canada.",
    tags: ["Province-Specific", "In-Demand Skills", "Regional Immigration"],
    icon: Globe,
    iconColor: "text-teal-500",
    iconBg: "bg-teal-50",
  },
  {
    title: "Alternative & Regional Pathways",
    description:
      "Alternative immigration pathways including regional programs, rural Opportunities, and francophone initiatives.",
    tags: ["Public Policy", "Atlantic", "Rural"],
    icon: Plane,
    iconColor: "text-pink-500",
    iconBg: "bg-pink-50",
  },
  {
    title: "Family Sponsorship",
    description:
      "Pathways for spouses, partners, parents, children, and eligible family members of Canadian citizens or permanent residents.",
    tags: ["Spousal", "Parent & Child"],
    icon: Users,
    iconColor: "text-green-500",
    iconBg: "bg-green-50",
  },
];

export default function PathwaysCategories() {
  return (
    <section className=" md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="text-center mb-16">
          <FadeUp as="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold caros text-title leading-[1.15]">
            Explore Pathway Categories
          </FadeUp>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div
                key={index}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex"
              >
                <div className="bg-white w-full rounded-[20px] border border-gray-200 p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-[0_20px_40px_-12px_rgba(34,197,94,0.15)] hover:border-green-500/30 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col group cursor-pointer">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 ${category.iconBg} ${category.iconColor} group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]`}
                  >
                    <Icon size={24} strokeWidth={2} />
                  </div>

                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 transition-colors duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:text-green-800">
                    {category.title}
                  </h3>

                  <p className="text-base md:text-lg text-description leading-[1.6] mb-8 grow">
                    {category.description}
                  </p>

                  <div className="flex flex-wrap gap-3 mt-auto">
                    {category.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="bg-[#F3F4F6] text-[#6B7280] text-sm md:text-base px-3 py-2 rounded-full font-medium group-hover:bg-green-50 group-hover:text-green-700 transition-colors duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
