"use client";

import analyze from "@/assets/home/analyze.png";
import ActionButton from "@/components/Shared/ActionButton";
import { motion } from "framer-motion";
import { ArrowRight, Cloud, Leaf, Star } from "lucide-react";
import Image from "next/image";

import { FaCanadianMapleLeaf } from "react-icons/fa";
import FadeUp from "../Shared/Animation/FadeUp";
import { useAssessmentModal } from "@/context/AssessmentModalContext";

export default function YourJourney() {
  const { openModal } = useAssessmentModal();
  return (
    <div className="md:py-24 bg-background">
      <div className=" flex flex-col md:gap-28">
        {/* Strategy Engine */}
        <section className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 container mx-auto  px-4 sm:px-6 lg:px-8  p-8 lg:p-10 caros ">
          <div className="lg:w-1/2 flex flex-col items-start gap-6">
            <FadeUp
              as="h2"
              className="text-3xl md:text-4xl lg:text-5xl font-bold caros text-title leading-[1.15]"
            >
              Immigration Assessment &amp; Strategy Engine
            </FadeUp>
            <FadeUp
              as="p"
              delay={0.15}
              className="text-base lg:text-lg text-muted-foreground poppins leading-relaxed"
            >
              Our assessment platform analyzes your background across Canadian
              immigration pathways including Express Entry, PNPs, work permits,
              study permits, sponsorship options, and alternative immigration
              strategies. Receive personalized pathway matches, eligibility
              insights, and improvement recommendations based on your profile.
            </FadeUp>
            <ActionButton variant="primary" className="mt-4 px-8 py-3.5" onClick={openModal}>
              Get Started
            </ActionButton>
          </div>

          <div className="lg:w-1/2 w-full relative">
            <div className="w-full relative shadow-2xl rounded-2xl overflow-hidden border border-black/5 transition-all duration-300 hover:shadow-[0_12px_35px_rgba(34,197,94,0.22)]">
              <Image
                src={analyze}
                alt="Immigration Pathway Analysis"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </section>

        {/* Explore Pathways  */}
        <section className="flex flex-col gap-12 pt-8 container mx-auto  px-4 sm:px-6 lg:px-8  p-8 lg:p-10 caros">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
            <div className="flex flex-col gap-4 ">
              <FadeUp
                as="h2"
                className="text-3xl md:text-4xl lg:text-5xl font-bold caros text-title "
              >
                Explore Pathways That Fit Your Profile
              </FadeUp>
              <FadeUp
                as="p"
                delay={0.15}
                className="text-base lg:text-lg text-muted-foreground  leading-relaxed max-w-162.5 poppins"
              >
                Discover Your Immigration Options, Immigration Pathway Analysis,
                explore Your Canadian Immigration Opportunities, personalized
                Pathway Matching.
              </FadeUp>
            </div>
            <ActionButton
              variant="primary"
              className="flex items-center gap-2 shrink-0 px-8 py-3.5"
              onClick={openModal}
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </ActionButton>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
            {[
              {
                title: "Express Entry",
                points: ["Skilled Worker Streams", "Category-based selection"],
                color: "text-[#2563EB]", // Blue
                position: "-bottom-6 -left-6",
                shapeIcon: (
                  <Star
                    className="w-full h-full"
                    fill="currentColor"
                    strokeWidth={0}
                  />
                ),
              },
              {
                title: "Provincial Opportunities",
                points: [
                  "Province-specific Opportunities",
                  "Regional pathway connection",
                  "Alternative destination stream",
                ],
                color: "text-[#15803D]",
                position: "-bottom-6 -left-6",
                shapeIcon: (
                  <FaCanadianMapleLeaf
                    className="w-full h-full"
                    fill="currentColor"
                    strokeWidth={0}
                  />
                ),
              },
              {
                title: "Work & Employer Options",
                points: ["LMIA", "LMIA-exempt", "Employer-supported pathways"],
                color: "text-[#EA580C]", // Orange
                position: "-bottom-8 left-0",
                shapeIcon: (
                  <Leaf
                    className="w-full h-full"
                    fill="currentColor"
                    strokeWidth={0}
                  />
                ),
              },
              {
                title: "Family Sponsorship",
                points: [
                  "Spouse, Parents, Children",
                  "Public policy Opportunities",
                ],
                color: "text-[#9333EA]", // Purple
                position: "-bottom-8 left-0",
                shapeIcon: (
                  <Cloud
                    className="w-full h-full"
                    fill="currentColor"
                    strokeWidth={0}
                  />
                ),
              },
            ].map((card, idx) => (
              <AnimatedJourneyCard key={idx} card={card} onClick={openModal} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

interface CardProps {
  title: string;
  points: string[];
  color: string;
  position: string;
  shapeIcon: React.ReactNode;
}

function AnimatedJourneyCard({ card, onClick }: { card: CardProps; onClick: () => void }) {
  return (
    <motion.div
      onClick={onClick}
      className="relative bg-white rounded-[2rem] p-6 md:p-8 flex flex-col h-full overflow-hidden group cursor-pointer border border-black/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
      whileHover="hover"
      initial="rest"
    >
      {/* Expanding Organic Background Shape */}
      <motion.div
        className={`absolute z-0 w-28 h-28 ${card.color} ${card.position}`}
        variants={{
          rest: { scale: 1, opacity: 0.8 },
          hover: { scale: 35, opacity: 1 },
        }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      >
        {card.shapeIcon}
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full pointer-events-none">
        <h3 className="text-lg md:text-xl font-bold text-title caros mb-6 group-hover:text-white transition-colors duration-500">
          {card.title}
        </h3>

        <ul className="flex flex-col gap-4 flex-1 poppins">
          {card.points.map((pt, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-base md:text-lg text-muted-foreground group-hover:text-white/90 transition-colors duration-500"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-description group-hover:bg-white mt-3 shrink-0 transition-colors duration-500"></div>
              <span className="leading-snug text-description group-hover:text-white/90 transition-colors duration-500">
                {pt}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex w-full items-center justify-between gap-2 text-green-900 font-medium text-base md:text-lg mt-8 group-hover:text-white transition-colors duration-500 poppins">
          <span>Get Started</span>
          <span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}
