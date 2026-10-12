import {
  Briefcase,
  ChevronRight,
  ChevronUp,
  ClipboardList,
  FileText,
  GraduationCap,
  HelpCircle,
  MapPin,
  Plus,
  ShieldCheck,
  Target,
  TrendingUp,
  UserCog,
} from "lucide-react";

import guidenceImg from "@/assets/home/assestment-resource.png";
import { HiOutlineLightBulb } from "react-icons/hi";
import FadeUp from "../Shared/Animation/FadeUp";
import PageHero from "../Shared/PageHero";
import Link from "next/link";

const helpFeatures = [
  {
    icon: HiOutlineLightBulb,
    title: "Understand your eligibility better",
  },
  {
    icon: MapPin,
    title: "Explore the right pathways",
  },
  {
    icon: Target,
    title: "Make informed decisions",
  },
  {
    icon: TrendingUp,
    title: "Identify Opportunities you qualify for",
  },
  {
    icon: ClipboardList,
    title: "Plan your Continues with confidence",
  },
  {
    icon: ShieldCheck,
    title: "Save time and avoid guesswork",
  },
];

export const resourcesData = [
  {
    id: 1,
    number: "01",
    title: "Sample Strategy Report",
    description:
      "See an example of the personalized insights and pathway recommendations you'll receive after completing your assessment.",
    buttonText: "View Sample Report",
    link: "#",
    buttonIcon: FileText,
    color: "#00A63E",
    type: "report",
  },

  {
    id: 2,
    number: "02",
    title: "Frequently Asked Questions",
    description:
      "Find answers to common questions about the assessment, eligibility, reports, and Continues.",
    buttonText: "View All FAQs",
    link: "#",
    buttonIcon: HelpCircle,
    color: "#2563EB",
    type: "faq",
    faqs: [
      {
        title: "What is the immigration assessment?",
        description:
          "Our assessment analyzes your profile and identifies immigration pathways that may match your background, goals, and eligibility factors.",
        open: true,
      },
      {
        title: "How accurate is the assessment?",
      },
      {
        title: "What information do I need?",
      },
      {
        title: "How long does it take to get the report?",
      },
    ],
  },

  {
    id: 3,
    number: "03",
    title: "Eligibility Factors",
    description:
      "Understand the key factors that may impact your eligibility and pathway Opportunities across Canadian immigration programs.",
    buttonText: "Explore Eligibility Factors",
    link: "/eligibility-factors",
    color: "#00A63E",
    type: "eligibility",
    factors: [
      {
        title: "Age & Long-Term Planning",
        icon: UserCog,
      },
      {
        title: "Education Background",
        icon: GraduationCap,
      },
      {
        title: "Work Experience",
        icon: Briefcase,
      },
    ],
    arrowIcon: ChevronRight,
  },
];

export default function AssessmentResources() {
  return (
    <div className="bg-background min-h-screen mb-12 md:mb-20">
      {/* Hero Section */}
      <PageHero
        title="Assessment Resources"
        description="Explore sample reports, frequently asked questions, and key
eligibility insights to better understand your assessment and the
pathways that may fit you."
        image={guidenceImg}
      />

      {/* Cards Section */}
      <section className="container mx-auto px-4 md:px-8 pb-20 md:pb-28">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {resourcesData.map((item) => {
            const ButtonIcon = item.buttonIcon;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-black/10 p-6 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="px-3 py-1.5 rounded-full text-sm font-bold"
                    style={{
                      backgroundColor: `${item.color}15`,
                      color: item.color,
                    }}
                  >
                    {item.number}
                  </div>

                  <h3 className="text-xl font-bold text-title poppins ">
                    {item.title}
                  </h3>
                </div>

                <p className="text-description text-base md:text-base leading-relaxed mb-6 poppins ">
                  {item.description}
                </p>

                <div className="flex-1 mb-6">
                  {item.type === "faq" &&
                    item.faqs?.map((faq, index) => (
                      <div
                        key={index}
                        className={`border rounded-xl p-4 mb-3 ${
                          faq.open
                            ? "border-blue-100 bg-blue-50/50"
                            : "border-gray-100"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-title">
                            {faq.title}
                          </h4>

                          {faq.open ? (
                            <ChevronUp size={16} />
                          ) : (
                            <Plus size={16} />
                          )}
                        </div>

                        {faq.open && (
                          <p className="text-xs text-description mt-2">
                            {faq.description}
                          </p>
                        )}
                      </div>
                    ))}

                  {item.type === "eligibility" &&
                    item.factors?.map((factor, index) => {
                      const Icon = factor.icon;
                      const ArrowIcon = item.arrowIcon;

                      return (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-2 mb-3 group cursor-pointer "
                        >
                          <div className="w-10 h-10 rounded-full bg-[#eef8ef] text-[#00A63E] flex items-center justify-center">
                            <Icon size={20} />
                          </div>

                          <h4 className="flex-1 text-base font-medium text-title group-hover:text-[#00A63E] transition-colors">
                            {factor.title}
                          </h4>

                          {ArrowIcon && (
                            <ArrowIcon size={16} className="text-gray-400" />
                          )}
                        </div>
                      );
                    })}

                  {item.type === "report" && (
                    <div className="w-full bg-[#f8f9fa] rounded-xl border border-gray-100 p-4 h-full flex items-center justify-center">
                      <div className="w-full max-w-60 aspect-4/3 bg-white rounded shadow-sm border border-gray-200 p-3 flex flex-col justify-between">
                        <div className="flex justify-between items-center mb-4">
                          <div className="text-[10px] font-bold text-gray-500 w-1/2">
                            Your Immigration Strategy Report
                          </div>
                          <div className="text-[8px] font-bold text-[#00A63E] bg-[#eef8ef] px-1.5 py-0.5 rounded">
                            SAMPLE
                          </div>
                        </div>
                        <div className="flex gap-4 items-center">
                          <div className="w-12 h-12 rounded-full border-4 border-gray-100 border-t-[#00A63E] border-r-[#00A63E] border-b-[#00A63E] flex items-center justify-center text-[10px] font-extrabold text-[#00A63E]">
                            78%
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="text-[7px] font-bold text-gray-400">
                              TOP PATHWAY MATCHES
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#00A63E]"></div>
                              <div className="text-[8px] font-medium text-title">
                                Express Entry
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#00A63E]"></div>
                              <div className="text-[8px] font-medium text-title">
                                Provincial Nominee Program
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-sm mt-3"></div>
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  href={item.link}
                  className="w-full py-3 mt-auto rounded-xl border font-medium flex items-center justify-center gap-2"
                  style={{
                    borderColor: item.color,
                    color: item.color,
                  }}
                >
                  {ButtonIcon && <ButtonIcon size={18} />}
                  {item.buttonText} →
                </Link>
              </div>
            );
          })}
        </div>
      </section>
      {/* Features Section */}
      <section className="bg-[#F8FAFC] py-16 md:py-24 border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-8">
          <FadeUp
            as="h2"
            className="text-3xl md:text-4xl font-bold text-center text-title mb-16 caros "
          >
            How Assessment Resources Help You
          </FadeUp>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
            {helpFeatures.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <FadeUp
                  key={idx}
                  delay={idx * 0.1}
                  className="flex flex-col items-center text-center group cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-4 text-[#00A63E] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-2 group-hover:bg-[#00A63E] group-hover:text-white group-hover:shadow-[0_12px_24px_-8px_rgba(0,166,62,0.6)] group-hover:border-transparent">
                    <Icon
                      size={24}
                      strokeWidth={1.5}
                      className="transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12"
                    />
                  </div>
                  <p className="text-base md:text-lg font-medium text-title poppins leading-tight max-w-30 transition-all duration-500 group-hover:-translate-y-1 group-hover:text-[#00A63E]">
                    {feature.title}
                  </p>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
