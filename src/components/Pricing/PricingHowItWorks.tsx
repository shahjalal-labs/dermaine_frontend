import FadeUp from "@/components/Shared/Animation/FadeUp";
import { Eye, FileText } from "lucide-react";
import { TbTargetArrow } from "react-icons/tb";

import analytics from "@/assets/card/analytics-down.svg";
import road from "@/assets/card/road-wayside.svg";
import Image from "next/image";

export default function PricingHowItWorks() {
  const steps = [
    {
      num: 1,
      title: "Complete Assessment",
      desc: "Answer a few questions about your background, education, work experience, and goals.",
      icon: <FileText className="w-9 h-9 text-primary" strokeWidth={1.5} />,
    },
    {
      num: 2,
      title: "View Your Results",
      desc: "See your general eligibility overview and potential pathways that may fit you.",
      icon: <Eye className="w-9 h-9 text-primary" strokeWidth={1.5} />,
    },
    {
      num: 3,
      title: "Unlock Strategy Report",
      desc: "Purchase your report to get in-depth analysis and personalized insights.",
      icon: <Image src={analytics} alt="analytics" width={40} height={40} />,
    },
    {
      num: 4,
      title: "Follow Your Roadmap",
      desc: "Use your personalized action plan to take the right steps with confidence.",
      icon: <Image src={road} alt="road" width={40} height={40} />,
    },
    {
      num: 5,
      title: "Achieve Your Goal",
      desc: "Move closer to your dream of living, studying, or working in Canada.",
      icon: (
        <TbTargetArrow className="w-9 h-9 text-primary" strokeWidth={1.5} />
      ),
    },
  ];

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <FadeUp as="h2" className="text-4xl md:text-5xl font-bold mb-6 caros  text-title">
            How it works?
          </FadeUp>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4 xl:gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="flex flex-col items-center text-center"
            >
              <div className="flex flex-col items-center relative">
                <div className="w-18 h-18 rounded-full bg-[#EAFFF5]  flex items-center justify-center">
                  {step.icon}
                </div>
                <div className="w-10 h-10 mt-4 rounded-full bg-primary text-white flex items-center justify-center text-base font-bold shadow-sm z-10 mb-4 border border-white">
                  {step.num}
                </div>
              </div>

              <div>
                <h3 className="text-lg md:text-xl font-bold text-title mb-2.5 poppins">
                  {step.title}
                </h3>
                <p className="text-base  md:text-lg text-description leading-relaxed poppins px-1">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
