import permit from "@/assets/permit.jpg";
import pr from "@/assets/pr.jpg";
import workPermit from "@/assets/work-permit.jpg";
import { BookOpen, Briefcase } from "lucide-react";
import Image from "next/image";
import { FaGraduationCap } from "react-icons/fa";

export default function PricingAudiences() {
  return (
    <section className="bg-background pt-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* PR Applicants */}
          <div className="bg-background rounded-3xl border border-black/5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col">
            <div className="p-6 pb-4  flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8F5EB] flex items-center justify-center text-primary shrink-0">
                <BookOpen size={20} />
              </div>
              <h3 className="text-lg font-bold text-title poppins ">
                For PR Applicants
              </h3>
            </div>

            <div className="w-full aspect-4/3 relative ">
              {/* Placeholder image */}
              <Image
                src={pr}
                alt="PR Applicants"
                fill
                className="object-cover px-4 md:px-6 rounded-lg"
              />
            </div>

            <div className="p-6 relative">
              {/* Vertical Line */}
              <div className="absolute top-0 bottom-9 left-[28.5px] w-px bg-primary/40"></div>
              <div className="space-y-3.5">
                {[
                  "Assess & Improve Profile",
                  "Explore Pathways",
                  "Gather Documents",
                  "Submit & Follow Up",
                  "Prepare for Arrival",
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3.5 relative z-10"
                  >
                    <div className="w-2.5 h-2.5 rounded-full border-2 border-primary bg-white shrink-0"></div>
                    <span className="text-base md:text-lg text-title poppins  font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Study Permit */}
          <div className="bg-background rounded-3xl border border-black/5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col">
            <div className="p-6 pb-4  flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8F5EB] flex items-center justify-center text-primary shrink-0">
                <FaGraduationCap size={20} />
              </div>
              <h3 className="text-lg font-bold text-title poppins ">
                For Study Permit Applicants
              </h3>
            </div>

            <div className="w-full aspect-4/3 relative ">
              {/* Placeholder image */}
              <Image
                src={permit}
                alt="Study Permit Applicants"
                fill
                className="object-cover px-4 md:px-6 rounded-lg"
              />
            </div>

            <div className="p-6 relative">
              {/* Vertical Line */}
              <div className="absolute top-0 bottom-9 left-[28.5px] w-px bg-[#3B82F6]/40"></div>
              <div className="space-y-3.5">
                {[
                  "Choose the Right Program",
                  "Check Eligibility & Finances",
                  "Prepare Documents",
                  "Apply for a Study Permit",
                  "Plan Your Arrival",
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3.5 relative z-10"
                  >
                    <div className="w-2.5 h-2.5 rounded-full border-2 border-[#3B82F6] bg-white shrink-0"></div>
                    <span className="text-base md:text-lg text-title poppins  font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Work Permit */}
          <div className="bg-background rounded-3xl border border-black/5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col">
            <div className="p-6 pb-4  flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8F5EB] flex items-center justify-center text-primary shrink-0">
                <Briefcase size={20} />
              </div>
              <h3 className="text-lg font-bold text-title poppins ">
                For Work Permit Applicants
              </h3>
            </div>

            <div className="w-full aspect-4/3 relative rounded-2xl ">
              {/* Placeholder image */}
              <Image
                src={workPermit}
                alt="Work Permit Applicants"
                fill
                className="object-cover px-4 md:px-6 rounded-lg"
              />
            </div>

            <div className="p-6 relative">
              {/* Vertical Line */}
              <div className="absolute top-0 bottom-9 left-[28.5px] w-px bg-[#311B92]/40"></div>
              <div className="space-y-3.5">
                {[
                  "Explore Work Options",
                  "Find Job or LMIA Options",
                  "Prepare Documents",
                  "Apply for Work Permit",
                  "Start Your Journey",
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3.5 relative z-10"
                  >
                    <div className="w-2.5 h-2.5 rounded-full border-2 border-[#311B92] bg-white shrink-0"></div>
                    <span className="text-base md:text-lg text-title poppins  font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
