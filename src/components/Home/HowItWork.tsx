import asseessmentProgress from "@/assets/home/asseessment-progress.png";
import asseessment from "@/assets/home/asseessment.png";
import dashboard from "@/assets/home/dashboard.png";
import backgroundImage from "@/assets/home/progress.png";
import reportSample from "@/assets/home/report.png";
import {
  Clock,
  Eye,
  FileCheck,
  FileText,
  ListChecks,
  Map,
  Target,
  Zap,
} from "lucide-react";
import Image from "next/image";
import FadeUp from "../Shared/Animation/FadeUp";

export default function HowItWork() {
  const steps = [
    {
      num: 1,
      title: "Complete Assessment",
      desc: "Answer a few questions about your background, education, work experience, language skills, and goals.",
      icon: <FileCheck className="w-8 h-8 text-primary" strokeWidth={1.5} />,
      image: asseessment,
      badgeIcon: <Clock className="w-4 h-4 text-primary shrink-0" />,
      badgeText: "Takes 5-10 minutes",
    },
    {
      num: 2,
      title: "View Your Results",
      desc: "Get an instant overview of your profile and see which immigration pathways may be the best fit for you.",
      icon: <Eye className="w-8 h-8 text-primary" strokeWidth={1.5} />,
      image: dashboard,
      badgeIcon: <Zap className="w-4 h-4 text-primary shrink-0" />,
      badgeText: "Instant overview",
    },
    {
      num: 3,
      title: "Unlock Strategy Report",
      desc: "Unlock a comprehensive report with detailed analysis, pathway options, and your complete roadmap.",
      icon: <FileText className="w-8 h-8 text-primary" strokeWidth={1.5} />,
      image: reportSample,
      badgeIcon: <FileCheck className="w-4 h-4 text-primary shrink-0" />,
      badgeText: "Comprehensive report with your complete roadmap",
    },
    {
      num: 4,
      title: "Follow Your Roadmap",
      desc: "Follow your personalized action plan with clear Continues to improve your chances and move forward.",
      icon: <Map className="w-8 h-8 text-primary" strokeWidth={1.5} />,
      image: asseessmentProgress,
      badgeIcon: <ListChecks className="w-4 h-4 text-primary shrink-0" />,
      badgeText: "Clear Continues tailored to you",
    },
    {
      num: 5,
      title: "Achieve Your Goal",
      desc: "Take action with confidence and get closer to your dream of living, studying, or working in Canada.",
      icon: <Zap className="w-8 h-8 text-primary" strokeWidth={1.5} />,
      image: backgroundImage,
      badgeIcon: <Target className="w-4 h-4 text-primary shrink-0" />,
      badgeText: "Your future, our guidance",
    },
  ];

  return (
    <section id="how-it-works" className="md:py-24 bg-white relative md:mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <FadeUp
            as="h2"
            className="text-4xl md:text-5xl font-bold mb-6 caros  text-title"
          >
            How It Works
          </FadeUp>
          <FadeUp
            as="p"
            delay={0.15}
            className="text-lg text-muted-foreground poppins  leading-relaxed"
          >
            Complete your assessment, discover potential immigration pathways,
            and unlock personalized strategy recommendations based on your
            profile.
          </FadeUp>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {steps.map((step, idx) => (
            <FadeUp
              key={step.num}
              delay={idx * 0.15}
              className="flex flex-col items-center text-center"
            >
              <div className="flex flex-col items-center mb-6">
                <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mb-5 shadow-sm">
                  {step.num}
                </div>
                <div className="w-18 h-18 rounded-2xl bg-[#F8FAFC] border border-black/5 flex items-center justify-center transition-all duration-300 hover:shadow-[0_12px_35px_rgba(34,197,94,0.15)] hover:scale-105">
                  {step.icon}
                </div>
              </div>

              <div className="mb-6 h-auto lg:h-35 flex flex-col items-center">
                <h3 className="text-lg md:text-xl font-bold text-title mb-2.5 caros">
                  {step.title}
                </h3>
                <p className="text-base xl:text-lg text-muted-foreground leading-relaxed poppins px-1">
                  {step.desc}
                </p>
              </div>

              <div className="w-full aspect-4/3 relative rounded-xl overflow-hidden border border-black/5 mb-4 shadow-sm mt-6">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-contain md:object-cover"
                />
              </div>

              <div className="w-full bg-[#F8FAFC] rounded-xl px-6 py-3 flex flex-row items-center justify-center gap-3 border border-black/5 min-h-16">
                {step.badgeIcon}
                <span className="text-base font-medium text-title text-left leading-snug poppins">
                  {step.badgeText}
                </span>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
