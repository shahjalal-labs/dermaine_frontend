import { TbBulbFilled, TbTargetArrow } from "react-icons/tb";

import file from "@/assets/card/file-attachment.svg";
import analysis from "@/assets/card/navigator-02.svg";
import FadeUp from "@/components/Shared/Animation/FadeUp";
import Image from "next/image";

export default function PlatformAnalyzes() {
  const cards = [
    {
      icon: <TbTargetArrow className="w-6 h-6" strokeWidth={1.5} />,
      title: "Immigration Pathway Matching",
      desc: "Analyze your profile across PR, PNP, work permit, study permit, sponsorship, and alternative immigration pathways.",
    },
    {
      icon: (
        <Image
          src={analysis}
          alt="Analysis"
          width={24}
          height={24}
          className="w-6 h-6"
        />
      ),
      title: "Eligibility & Gap Analysis",
      desc: "Understand what requirements may be missing and what factors could improve your immigration options.",
    },
    {
      icon: <TbBulbFilled className="w-6 h-6" strokeWidth={1.5} />,
      title: "Personalized Recommendations",
      desc: "Receive profile-specific recommendations that may strengthen eligibility for Canadian immigration programs.",
    },
    {
      icon: (
        <Image
          src={file}
          alt="File"
          width={24}
          height={24}
          className="w-6 h-6"
        />
      ),
      title: "Strategy Report Preview",
      desc: "Preview personalized pathway matches, strategic recommendations, profile improvement Opportunities, and next-step guidance before unlocking your full report.",
    },
  ];

  return (
    <section className="py-10 md:py-20 bg-white relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <FadeUp
            as="h2"
            className="text-3xl md:text-4xl lg:text-5xl font-bold caros text-title"
          >
            What The Platform Analyzes?
          </FadeUp>

          <FadeUp
            as="p"
            delay={0.15}
            className="text-base md:text-lg text-description poppins  leading-relaxed mt-7"
          >
            Our platform analyzes your profile across Canadian immigration
            pathways to identify possible options, eligibility gaps, and
            improvement Opportunities based on your personal background.{" "}
          </FadeUp>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="group bg-[#F8F8F8] hover:bg-white rounded-[2rem] p-8 flex flex-col items-center text-center h-full border border-black/3 hover:border-primary/50 hover:border-4 shadow-sm hover:shadow-xl transition-all duration-500 ease-out hover:-translate-y-2"
            >
              <div className="w-14 h-14 rounded-full bg-[#E5F5EB] group-hover:bg-primary text-primary group-hover:text-white flex items-center justify-center mb-6 shrink-0 transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-3 [&_img]:transition-all [&_img]:duration-500 [&_img]:ease-out group-hover:[&_img]:brightness-0 group-hover:[&_img]:invert">
                {card.icon}
              </div>
              <h3 className="text-lg md:text-xl font-bold text-title group-hover:text-primary transition-colors duration-500 ease-out caros mb-4 leading-snug">
                {card.title}
              </h3>
              <p className="text-base md:text-lg text-description group-hover:text-gray-900 transition-colors duration-500 ease-out poppins leading-relaxed flex-1">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
