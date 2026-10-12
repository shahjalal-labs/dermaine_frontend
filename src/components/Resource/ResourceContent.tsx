import Link from "next/link";
import { CiFileOn } from "react-icons/ci";

import analytic from "@/assets/card/analytics-down.svg";
import compass from "@/assets/card/compass.svg";
import file from "@/assets/card/document-validation.svg";
import flowchart from "@/assets/card/flowchart-01.svg";
import tress from "@/assets/card/trees.svg";
import Image from "next/image";
import { FiFileText } from "react-icons/fi";
import { PiCalendarCheckLight } from "react-icons/pi";
import { TbUserStar } from "react-icons/tb";
import FadeUp from "../Shared/Animation/FadeUp";

const categories = [
  {
    title: "Eligibility Factors",
    description: "Learn how our assessment works and what you'll receive.",
    icon: file,
    link: "/eligibility-factors",
  },
  {
    title: "Pathway Matching Explained",
    description:
      "Understand pathways, programs, and important immigration topics.",
    icon: compass,
    link: "/pathway-matching",
  },
  {
    title: "Assessment Resources",
    description: "Explore sample reports, FAQs, eligibility factors, and more.",
    icon: CiFileOn,
    link: "/assessment-resources",
  },
];

const featured = [
  {
    title: "How the Assessment Works",
    description:
      "Understand how the platform analyzes your profile and identifies potential immigration pathways.",
    icon: flowchart,
    colorClass: "text-primary bg-[#54B75B1A]",
  },
  {
    title: "Sample Strategy Report",
    description:
      "Preview example pathway recommendations, eligibility insights, and personalized strategy guidance.",
    icon: analytic,
    colorClass: "text-[#F54900] bg-[#F549001A]",
  },
  {
    title: "Pathway Matching Explained",
    description:
      "Learn how the platform evaluates work permits, PR pathways, study options, PNPs, sponsorship, and regional programs.",
    icon: tress,
    colorClass: "text-primary bg-[#54B75B1A]",
    link: "/pathway-matching",
  },
  {
    title: "Eligibility Factors",
    description:
      "Understand the key factors that may impact immigration eligibility and pathway Opportunities.",
    icon: FiFileText,
    colorClass: "text-primary bg-[#54B75B1A]",
  },
  {
    title: "Success Stories",
    description:
      "See how applicants used the platform to discover pathway Opportunities and improve their immigration strategy.",
    icon: TbUserStar,
    colorClass: "text-primary bg-[#54B75B1A]",
  },
  {
    title: "Book Consultation",
    description:
      "Speak with an immigration professional for personalized guidance after completing your assessment.",
    icon: PiCalendarCheckLight,
    colorClass: "text-primary bg-[#54B75B1A]",
  },
];

export default function ResourceContent() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8 ">
        {/* Browse by category */}
        <div className="mb-20 md:mb-28">
          <FadeUp
            as="h2"
            className="text-3xl md:text-4xl lg:text-6xl font-bold caros  text-title text-center mb-10 md:mb-14"
          >
            Browse by category
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <FadeUp
                  key={idx}
                  delay={idx * 0.15}
                  className="relative rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-2 hover:shadow-[0_20px_40px_-12px_rgba(34,197,94,0.15)] group cursor-pointer overflow-hidden p-0.5 bg-white border border-gray-100 hover:border-transparent h-full"
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
                  <div className="relative z-10 flex flex-col items-start p-6 md:p-8 bg-white rounded-[14px] w-full h-full">
                    <div className="w-12 h-12 rounded-full border-2 border-[#E5F5ED] bg-white flex items-center justify-center text-[#00b050] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110 group-hover:rotate-6 group-hover:bg-[#f0fbf5] mb-6">
                      {typeof Icon === "string" ? (
                        <Image
                          src={Icon}
                          width={50}
                          height={50}
                          alt="Icon"
                          className="w-7 h-7 md:w-8 md:h-8"
                        />
                      ) : typeof Icon === "object" &&
                        Icon !== null &&
                        "src" in Icon ? (
                        <Image
                          src={Icon.src}
                          alt="Icon"
                          width={50}
                          height={50}
                          className="w-7 h-7 md:w-8 md:h-8"
                        />
                      ) : (
                        <Icon size={26} strokeWidth={1.5} />
                      )}
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-title mb-3 poppins transition-colors duration-500 group-hover:text-green-800">
                      {cat.title}
                    </h3>
                    <p className="text-description text-base md:text-lg leading-relaxed mb-6 flex-1 poppins">
                      {cat.description}
                    </p>
                    <Link
                      href={cat.link}
                      className="text-primary font-medium text-base md:text-lg flex items-center gap-1 transition-all duration-300 poppins"
                    >
                      Explore{" "}
                      <span className="ml-1 text-xl leading-none transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1">
                        &rarr;
                      </span>
                    </Link>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>

        {/* Featured Resources */}
        <div>
          <FadeUp
            as="h2"
            className="text-3xl md:text-4xl lg:text-6xl font-bold caros  text-title text-center mb-10 md:mb-14"
          >
            Featured Resources
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {featured.map((item, idx) => {
              const Icon = item.icon;
              return (
                <FadeUp
                  key={idx}
                  delay={idx * 0.15}
                  className="relative rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-2 hover:shadow-[0_20px_40px_-12px_rgba(34,197,94,0.15)] group cursor-pointer overflow-hidden p-0.5 bg-white border border-gray-100 hover:border-transparent h-full"
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
                  <div className="relative z-10 flex flex-col items-start p-6 md:p-8 bg-white rounded-[14px] w-full h-full">
                    <div
                      className={`w-12 h-12 rounded-full border-2 border-[#E5F5ED] bg-white flex items-center justify-center text-[#00b050] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110 group-hover:rotate-6 group-hover:bg-[#f0fbf5] mb-6`}
                    >
                      {typeof Icon === "string" ? (
                        <Image
                          src={Icon}
                          alt="Icon"
                          width={50}
                          height={50}
                          className="w-7 h-7 md:w-8 md:h-8"
                        />
                      ) : typeof Icon === "object" &&
                        Icon !== null &&
                        "src" in Icon ? (
                        <Image
                          src={Icon.src}
                          alt="Icon"
                          width={50}
                          height={50}
                          className="w-7 h-7 md:w-8 md:h-8"
                        />
                      ) : (
                        <Icon size={26} strokeWidth={1.5} />
                      )}
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-title mb-3 poppins transition-colors duration-500 group-hover:text-green-800">
                      {item.title}
                    </h3>
                    <p className="text-description text-base md:text-lg leading-relaxed flex-1 poppins ">
                      {item.description}
                    </p>

                    {item.link && (
                      <Link
                        href={item.link}
                        className="text-primary font-medium text-base md:text-lg flex items-center gap-1 mt-6 transition-all duration-300 poppins"
                      >
                        Read more{" "}
                        <span className="ml-1 text-xl leading-none transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1">
                          &rarr;
                        </span>
                      </Link>
                    )}
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
