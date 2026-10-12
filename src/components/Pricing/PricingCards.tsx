"use client";

import { cn } from "@/lib/utils";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { Check } from "lucide-react";
import { CiStar } from "react-icons/ci";
import { useAssessmentModal } from "@/context/AssessmentModalContext";

const PricingButton = ({
  variant = "primary",
  children,
  shouldReduceMotion,
  onClick,
}: {
  variant?: "primary" | "green";
  children: React.ReactNode;
  shouldReduceMotion: boolean | null;
  onClick?: () => void;
}) => {
  const baseStyles =
    "font-medium px-6 py-3 rounded-md poppins transition-colors duration-200 cursor-pointer text-base md:text-lg text-center w-full";

  const variants = {
    primary: "bg-primary hover:opacity-90 text-primary-foreground",
    green: "bg-[#54B75B1A] text-primary shadow-md",
  };

  return (
    <motion.button
      onClick={onClick}
      className={cn(baseStyles, variants[variant])}
      whileHover={!shouldReduceMotion ? { scale: 1.03 } : {}}
      whileTap={!shouldReduceMotion ? { scale: 0.98 } : {}}
      transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
    >
      {children}
    </motion.button>
  );
};

export default function PricingCards() {
  const shouldReduceMotion = useReducedMotion();
  const { openModal } = useAssessmentModal();

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const containerVariants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 25,
      scale: shouldReduceMotion ? 1 : 0.97,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const featureListVariants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.3,
      },
    },
  };

  const featureItemVariants: Variants = {
    hidden: { opacity: 0, x: shouldReduceMotion ? 0 : -10 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  };

  const checkIconVariants: Variants = {
    hidden: { scale: shouldReduceMotion ? 1 : 0 },
    show: {
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  const badgeVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    show: {
      opacity: 1,
      y: [0, -3, 0],
      transition: {
        opacity: { duration: 0.5 },
        y: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        },
      },
    },
  };

  return (
    <motion.section
      className="bg-white pb-16 md:pb-24"
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.3 }}
      variants={sectionVariants}
    >
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 mx-auto items-center"
          variants={containerVariants}
        >
          {/* Card 1: Free */}
          <motion.div
            variants={cardVariants}
            whileHover={
              !shouldReduceMotion
                ? { y: -8, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.05)" }
                : {}
            }
            transition={{ duration: 0.3 }}
            className="bg-[#F8FAFC] rounded-[24px] p-8 border border-black/5 flex flex-col h-full lg:h-150 relative"
          >
            <h3 className="text-base font-bold text-title uppercase tracking-wide mb-1 poppins ">
              FREE ASSESSMENT
            </h3>
            <p className="text-base text-description mb-6 poppins ">
              Basic eligibility check
            </p>

            <div className="mb-8">
              <span className="text-4xl md:text-5xl font-bold text-title caros ">
                Free
              </span>
            </div>

            <motion.div
              className="space-y-4 mb-8 flex-1"
              variants={featureListVariants}
            >
              {[
                "10-15 minute assessment",
                "Basic eligibility check",
                "General opportunity overview",
                "No account required",
                "Save assessment",
                "Return later and continue",
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-3"
                  variants={featureItemVariants}
                >
                  <motion.div
                    variants={checkIconVariants}
                    className="w-5 h-5 rounded-full bg-[#E8F5EB] flex items-center justify-center text-primary shrink-0 mt-0.5"
                  >
                    <Check size={12} strokeWidth={3} />
                  </motion.div>
                  <span className="text-base md:text-lg text-title font-medium poppins">
                    {feature}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            <PricingButton
              variant="green"
              shouldReduceMotion={shouldReduceMotion}
              onClick={openModal}
            >
              Get started{" "}
            </PricingButton>
          </motion.div>

          {/* Card 2: Strategy Report */}
          <motion.div
            variants={cardVariants}
            whileHover={
              !shouldReduceMotion
                ? {
                    y: -10,
                    scale: 1.02,
                    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)",
                  }
                : {}
            }
            transition={{ duration: 0.3 }}
            className="bg-white rounded-[24px] p-8 border-2 border-primary shadow-xl relative flex flex-col h-full lg:h-160 z-10 scale-100 lg:scale-105"
          >
            <motion.div
              variants={badgeVariants}
              className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 uppercase tracking-wide"
              style={{ x: "-50%" }}
            >
              <CiStar size={20} />
              MOST POPULAR
            </motion.div>

            <h3 className="text-base font-bold text-title uppercase tracking-wide mb-1 poppins ">
              STRATEGY REPORT
            </h3>
            <p className="text-sm text-description mb-6 poppins ">
              Personalized immigration report
            </p>

            <div className="mb-8 flex items-baseline gap-1">
              <span className="text-4xl md:text-5xl font-bold text-title caros ">
                $79
              </span>
              <span className="text-lg font-bold text-title caros ">CAD</span>
            </div>

            <motion.div
              className="space-y-4 mb-8 flex-1"
              variants={featureListVariants}
            >
              {[
                "Everything in Free",
                "Opportunity Match Analysis",
                "Visa Strength and Readiness Score",
                "Provincial & Regional Recommendations",
                "Instant report generation",
                "Action plan/roadmap",
                "PDF download",
                "Dynamic Report Analysis",
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-3"
                  variants={featureItemVariants}
                >
                  <motion.div
                    variants={checkIconVariants}
                    className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white shrink-0 mt-0.5"
                  >
                    <Check size={12} strokeWidth={3} />
                  </motion.div>
                  <span className="text-sm md:text-base text-title font-medium poppins ">
                    {feature}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            <PricingButton
              variant="primary"
              shouldReduceMotion={shouldReduceMotion}
              onClick={openModal}
            >
              Get started{" "}
            </PricingButton>
          </motion.div>

          {/* Card 3: Consulting */}
          <motion.div
            variants={cardVariants}
            whileHover={
              !shouldReduceMotion
                ? { y: -8, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.05)" }
                : {}
            }
            transition={{ duration: 0.3 }}
            className="bg-[#F8FAFC] rounded-[24px] p-8 border border-black/5 flex flex-col h-full lg:h-150 relative"
          >
            <h3 className="text-base font-bold text-title uppercase tracking-wide mb-1 poppins ">
              CONSULTING
            </h3>
            <p className="text-sm text-description mb-6 poppins ">
              Expert immigration guidance
            </p>

            <div className="mb-8 flex items-baseline gap-1">
              <span className="text-2xl md:text-3xl font-bold text-title caros  mr-1">
                From
              </span>
              <span className="text-4xl md:text-5xl font-bold text-title caros ">
                $49
              </span>
              <span className="text-lg font-bold text-title caros ">CAD</span>
            </div>

            <motion.div
              className="space-y-4 mb-8 flex-1"
              variants={featureListVariants}
            >
              {[
                "Everything in Report",
                "1 on 1 legal expert",
                "Review the report",
                "Application strategy",
                "Profile Assessment",
                "Ask Any Question",
                "Follow-up support",
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-3"
                  variants={featureItemVariants}
                >
                  <motion.div
                    variants={checkIconVariants}
                    className="w-5 h-5 rounded-full bg-[#E8F5EB] flex items-center justify-center text-primary shrink-0 mt-0.5"
                  >
                    <Check size={12} strokeWidth={3} />
                  </motion.div>
                  <span className="text-sm md:text-base text-title font-medium poppins ">
                    {feature}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            <PricingButton
              variant="green"
              shouldReduceMotion={shouldReduceMotion}
            >
              Book consultation
            </PricingButton>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
