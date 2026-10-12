import FadeUp from "@/components/Shared/Animation/FadeUp";
import { CheckCircle, FileText, TrendingUp, UserCheck } from "lucide-react";
import { FiFileText } from "react-icons/fi";

const steps = [
  {
    num: 1,
    title: "Complete Assessment",
    description: "Answer questions about your background, education, and goals",
    icon: FileText,
  },
  {
    num: 2,
    title: "We Analyze Your Profile",
    description: "Our system evaluates your profile against all pathways",
    icon: TrendingUp,
  },
  {
    num: 3,
    title: "Review Insights & Matches",
    description: "Receive ranked pathway recommendations",
    icon: CheckCircle,
  },
  {
    num: 4,
    title: "Review Report",
    description: "Download your detailed pathway analysis",
    icon: FiFileText,
  },
  {
    num: 5,
    title: "Take Action",
    description: "Follow your personalized roadmap",
    icon: UserCheck,
  },
];

export default function PathwaysProcess() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="text-center mb-16">
          <FadeUp
            as="h2"
            className="text-3xl md:text-4xl lg:text-5xl text-title caros font-bold"
          >
            What Happens After You Complete the Assessment?
          </FadeUp>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <FadeUp
                key={index}
                delay={index * 0.15}
                className="relative rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-2 hover:shadow-[0_20px_40px_-12px_rgba(34,197,94,0.15)] group cursor-pointer overflow-hidden p-0.5 bg-white border border-gray-100 hover:border-transparent"
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
                <div className="relative z-10 flex flex-col items-center text-center p-2 md:p-6 bg-white rounded-[14px] w-full h-full">
                  <div className="relative mb-6">
                    <div className="w-12 h-12 md:w-20 md:h-20 rounded-full border-2 border-[#E5F5ED] bg-white flex items-center justify-center text-[#00b050] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110 group-hover:rotate-6 group-hover:bg-[#f0fbf5]">
                      <Icon className="md:hidden" size={20} strokeWidth={1.5} />
                      <Icon
                        className="hidden md:block"
                        size={32}
                        strokeWidth={1.5}
                      />
                    </div>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm border-2 border-white transition-transform duration-500 group-hover:scale-110 group-hover:bg-green-700">
                      {step.num}
                    </div>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-title mb-2 poppins transition-colors duration-500 group-hover:text-green-800">
                    {step.title}
                  </h3>
                  <p className="text-base md:text-lg text-description leading-relaxed poppins ">
                    {step.description}
                  </p>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}
