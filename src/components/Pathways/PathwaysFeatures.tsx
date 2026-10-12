import {
  Briefcase,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  FileText,
  Globe,
  GraduationCap,
  LineChart,
  MapPin,
  Meh,
  Route,
  Search,
  Smile,
  User,
  UserCheck,
  UserCog,
  Users,
  Wrench,
} from "lucide-react";
import FadeUp from "../Shared/Animation/FadeUp";

const card1Col1 = [
  { label: "Skilled Workers", icon: User },
  { label: "International Students", icon: GraduationCap },
  { label: "Temporary Foreign Worker", icon: UserCog },
  { label: "French-Speaking Applicants", icon: Globe },
  { label: "Trades Workers", icon: Wrench },
  { label: "Temporary Foreign Worker", icon: FileText },
];

const card1Col2 = [
  { label: "Professionals", icon: Users },
  { label: "Families", icon: Users },
  { label: "Applicants Inside Canada", icon: UserCheck },
  { label: "Applicants Outside Canada", icon: MapPin },
  { label: "Employers", icon: Briefcase },
];

const card2Items = [
  "Immigration pathways that fit your profile",
  "Provincial Opportunities",
  "Work permit options",
  "Study-to-PR Opportunities",
  "Alternative immigration pathways",
  "Missing eligibility factors",
  "Profile improvement Opportunities",
  "Regional immigration Opportunities",
  "Family sponsorship possibilities",
  "Category-based selection alignment",
];

const card3Items = [
  {
    label: "Understand possible immigration options before applying",
    icon: Smile,
  },
  { label: "Explore pathways beyond Express Entry", icon: Route },
  { label: "Discover province-specific Opportunities", icon: Compass },
  { label: "Identify possible Continues", icon: ClipboardCheck },
  { label: "Reduce confusion around immigration programs", icon: Meh },
  { label: "Understand what may improve eligibility", icon: LineChart },
  {
    label:
      "Explore work, study, sponsorship, PR & regional options in one place",
    icon: Search,
  },
];

export default function PathwaysFeatures() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <FadeUp
            as="h2"
            className="text-3xl md:text-4xl lg:text-5xl  text-title caros  font-bold"
          >
            Choose The Immigration Pathway That&apos;s Right For You
          </FadeUp>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] lg:col-span-2">
            <h3 className="text-xl  font-bold text-title mb-6 poppins ">
              Who This Platform Is Built For
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
              <div className="flex-1 space-y-4">
                {card1Col1.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <Icon
                        size={18}
                        className="text-primary mt-0.5 shrink-0"
                        strokeWidth={2}
                      />
                      <span className="text-base md:text-lg text-description poppins ">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex-1 space-y-4">
                {card1Col2.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <Icon
                        size={18}
                        className="text-primary mt-0.5 shrink-0"
                        strokeWidth={2}
                      />
                      <span className="text-base md:text-lg text-gray-600 poppins ">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)]">
            <h3 className="text-xl font-bold text-title mb-6 poppins ">
              What The Assessment May Help Identify
            </h3>
            <div className="space-y-4">
              {card2Items.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    className="text-primary mt-0.5 shrink-0"
                    strokeWidth={2}
                  />
                  <span className="text-base md:text-lg text-description poppins ">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)]">
            <h3 className="text-xl font-bold text-title mb-6 poppins ">
              Why Applicants Use Our Platform
            </h3>
            <div className="space-y-4">
              {card3Items.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <Icon
                      size={18}
                      className="text-primary mt-0.5 shrink-0"
                      strokeWidth={2}
                    />
                    <span className="text-base md:text-lg text-gray-600 poppins ">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
