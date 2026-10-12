"use client";

import hand from "@/assets/card/hand.png";
import { motion, useReducedMotion, Variants } from "framer-motion";
import {
  Check,
  ClipboardCheck,
  FileDown,
  GitBranch,
  Lightbulb,
  Lock,
  Play,
  Shuffle,
  Target,
} from "lucide-react";
import Image from "next/image";

export default function PricingReportIncludes() {
  const shouldReduceMotion = useReducedMotion();

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const leftContentVariants: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.08 },
    },
  };

  const leftItemVariants: Variants = {
    hidden: { opacity: 0, x: shouldReduceMotion ? 0 : -15 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const leftIconBoxVariants: Variants = {
    hidden: { scale: shouldReduceMotion ? 1 : 0.9 },
    show: { scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const cardsContainerVariants: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.12, delayChildren: 0.3 },
    },
  };

  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 30,
      scale: shouldReduceMotion ? 1 : 0.97,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const listContainerVariants: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.05, delayChildren: 0.4 },
    },
  };

  const listItemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  const smallIconVariants: Variants = {
    hidden: { scale: shouldReduceMotion ? 1 : 0.8 },
    show: { scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
  };

  return (
    <motion.section
      className="bg-white py-16 md:py-24 overflow-hidden"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionVariants}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 lg:gap-16 items-start container mx-auto">
          {/* Left Sidebar */}
          <motion.div
            className="flex flex-col xl:col-span-4"
            variants={leftContentVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div className="mb-8" variants={leftItemVariants}>
              <div className="flex items-center gap-2 mb-4">
                <Lock size={16} className="text-primary" />
                <span className="text-primary text-base font-bold uppercase tracking-wide poppins ">
                  SEE WHATS INCLUDED
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-title caros  mb-6 leading-tight">
                See What Your Strategy Report Included
              </h2>
              <p className="text-base text-description poppins  leading-relaxed">
                Your report is customized to your profile and includes in-depth
                insights, pathway matches, and a personalized action plan.
              </p>
            </motion.div>

            <motion.div
              className="space-y-8 mt-2"
              variants={leftContentVariants}
            >
              {[
                {
                  icon: GitBranch,
                  title: "Top Pathway Matches",
                  desc: "See the programs and streams that best fit your profile.",
                },
                {
                  icon: ClipboardCheck,
                  title: "Eligibility Insights",
                  desc: "Understand your strengths, gaps, and eligibility score.",
                },
                {
                  icon: Lightbulb,
                  title: "Improvement Opportunities",
                  desc: "Personalized recommendations to strengthen your profile.",
                },
                {
                  icon: Target,
                  title: "Personalized Action Roadmap",
                  desc: "Step-by-step plan to achieve your goal.",
                },
                {
                  icon: Shuffle,
                  title: "Alternative Options",
                  desc: "Explore additional pathways and provinces you may qualify for.",
                },
                {
                  icon: FileDown,
                  title: "Downloadable PDF Report",
                  desc: "A clear, detailed report you can keep, share, and reference anytime.",
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    className="flex items-start gap-5"
                    variants={leftItemVariants}
                  >
                    <motion.div
                      variants={leftIconBoxVariants}
                      className="w-12 h-12 rounded-xl bg-[#54B75B1A] flex items-center justify-center text-primary shrink-0"
                    >
                      <Icon size={24} strokeWidth={1.5} />
                    </motion.div>
                    <div>
                      <h4 className="text-base font-bold text-title poppins  mb-1.5">
                        {item.title}
                      </h4>
                      <p className="text-base md:text-lg text-description poppins  leading-relaxed pr-4">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Right Side: Mock Dashboard */}
          <motion.div
            className="xl:col-span-8 rounded-xl p-4"
            variants={cardsContainerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 xl:gap-6">
              {/* Card A: Top Pathway Matches */}
              <motion.div
                variants={cardVariants}
                whileHover={
                  !shouldReduceMotion
                    ? { y: -6, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)" }
                    : {}
                }
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-4 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] border border-black/5 flex flex-col h-full"
              >
                <h5 className="text-lg md:text-xl font-bold text-title poppins  mb-6">
                  Top Pathway Matches
                </h5>
                <motion.div
                  className="space-y-4 flex-1"
                  variants={listContainerVariants}
                >
                  {[
                    { label: "Express Entry", score: "Very strong" },
                    { label: "Provincial Nominee", score: "Very strong" },
                    { label: "Atlantic Immigration", score: "Very strong" },
                    { label: "Rural & Northern", score: "Very strong" },
                  ].map((p, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center justify-between"
                      variants={listItemVariants}
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          variants={smallIconVariants}
                          className="w-8 h-8 rounded-lg bg-[#EAF5F0] flex items-center justify-center shrink-0 p-2"
                        >
                          <Image src={hand} alt="hand" width={24} height={24} />
                        </motion.div>
                        <span className="text-sm text-title font-bold poppins ">
                          {p.label}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-primary bg-[#E8F5EB] px-3 py-1 rounded-full">
                        {p.score}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Card B: Eligibility Overview */}
              <motion.div
                variants={cardVariants}
                whileHover={
                  !shouldReduceMotion
                    ? { y: -6, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)" }
                    : {}
                }
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-4 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] border border-black/5 flex flex-col items-center text-center justify-center h-full"
              >
                <h5 className="text-base md:text-lg font-bold text-title poppins  w-full text-left mb-6">
                  Eligibility Overview
                </h5>
                <motion.div
                  initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                  className="relative w-35 h-35 mb-6"
                >
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 36 36"
                  >
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9155"
                      fill="none"
                      stroke="#8B8B9B"
                      strokeWidth="4"
                      strokeDasharray="16.6 83.4"
                      strokeDashoffset="0"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9155"
                      fill="none"
                      stroke="#00b050"
                      strokeWidth="4"
                      strokeDasharray="20.8 79.2"
                      strokeDashoffset="-16.6"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9155"
                      fill="none"
                      stroke="#86C597"
                      strokeWidth="4"
                      strokeDasharray="12.5 87.5"
                      strokeDashoffset="-37.4"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9155"
                      fill="none"
                      stroke="#D1D5DB"
                      strokeWidth="4"
                      strokeDasharray="16.6 83.4"
                      strokeDashoffset="-49.9"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9155"
                      fill="none"
                      stroke="#00b050"
                      strokeWidth="4"
                      strokeDasharray="20.8 79.2"
                      strokeDashoffset="-66.5"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9155"
                      fill="none"
                      stroke="#000000"
                      strokeWidth="4"
                      strokeDasharray="12.7 87.3"
                      strokeDashoffset="-87.3"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-[32px] text-title tracking-tight caros ">
                      86%
                    </span>
                  </div>
                </motion.div>
                <h6 className="text-base md:text-lg font-bold text-title mb-1.5">
                  Rural & Northern
                </h6>
                <p className="text-base md:text-lg text-description">
                  Based on current profile analysis
                </p>
              </motion.div>

              {/* Card C: Improvement Opportunities */}
              <motion.div
                variants={cardVariants}
                whileHover={
                  !shouldReduceMotion
                    ? { y: -6, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)" }
                    : {}
                }
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-4 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] border border-black/5 flex flex-col h-full"
              >
                <h5 className="text-base md:text-lg font-bold text-title poppins  mb-6">
                  Improvement Opportunities
                </h5>
                <motion.div
                  className="space-y-5 flex-1"
                  variants={listContainerVariants}
                >
                  {[1, 2, 3, 4].map((o, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-3"
                      variants={listItemVariants}
                    >
                      <motion.div
                        variants={smallIconVariants}
                        className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5 shadow-sm"
                      >
                        <Check
                          size={12}
                          strokeWidth={3}
                          className="text-white"
                        />
                      </motion.div>
                      <div>
                        <p className="text-sm font-bold text-title mb-1 blur-[2px] opacity-70">
                          Rural & Northern
                        </p>
                        <p className="text-sm text-description blur-[2px] opacity-70">
                          Based on current profile analysis
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 xl:gap-6 mt-5 xl:mt-6">
              {/* Card D: Personalized Action Roadmap */}
              <motion.div
                variants={cardVariants}
                whileHover={
                  !shouldReduceMotion
                    ? { y: -6, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)" }
                    : {}
                }
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-4 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] border border-black/5 lg:col-span-2 flex flex-col h-full"
              >
                <h5 className="text-base md:text-lg font-bold text-title poppins  mb-8">
                  Personalized Action Roadmap
                </h5>
                <motion.div
                  className="space-y-6 flex-1 flex flex-col justify-center"
                  variants={listContainerVariants}
                >
                  {[
                    { label: "Intermediate (0-3months)" },
                    { label: "Short term (3-6months)" },
                    { label: "Mid term (6-12months)" },
                    { label: "Long term (12+months)" },
                  ].map((r, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-4"
                      variants={listItemVariants}
                    >
                      <span className="text-base text-title w-40 md:w-50 shrink-0 poppins ">
                        {r.label}
                      </span>
                      <span className="text-base text-primary font-medium shrink-0 w-16">
                        Ontrack
                      </span>
                      <div className="w-full bg-[#E8F5EB] rounded-full h-2 hidden sm:block relative overflow-hidden">
                        <motion.div
                          className="bg-primary h-full rounded-full absolute left-0 top-0"
                          initial={{ width: "0%" }}
                          whileInView={{ width: "95%" }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 1,
                            ease: "easeOut",
                            delay: 0.5 + i * 0.1,
                          }}
                        />
                      </div>
                      <span className="text-base text-primary font-medium shrink-0">
                        95%
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Card E: Program Fit Summary */}
              <motion.div
                variants={cardVariants}
                whileHover={
                  !shouldReduceMotion
                    ? { y: -6, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)" }
                    : {}
                }
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-4 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] border border-black/5 flex flex-col h-full"
              >
                <h5 className="text-base md:text-lg font-bold text-title poppins  mb-6">
                  Program Fit Summary
                </h5>
                <motion.div
                  className="space-y-4 flex-1"
                  variants={listContainerVariants}
                >
                  {[
                    {
                      label: "Express Entry",
                      score: "Good fit",
                      tagColor: "bg-[#E8F5EB]",
                      textColor: "text-primary",
                      iconColor: "bg-[#51A8B1]",
                    },
                    {
                      label: "Provincial Nominee",
                      score: "Strong fit",
                      tagColor: "bg-[#E8F5EB]",
                      textColor: "text-primary",
                      iconColor: "bg-[#85859E]",
                    },
                    {
                      label: "Atlantic Pathway",
                      score: "Great Fit",
                      tagColor: "bg-[#E8F5EB]",
                      textColor: "text-primary",
                      iconColor: "bg-[#A3B858]",
                    },
                    {
                      label: "Rural & Northern",
                      score: "Good fit",
                      tagColor: "bg-[#E8F5EB]",
                      textColor: "text-primary",
                      iconColor: "bg-[#A3B858]",
                    },
                    {
                      label: "Caregiver Programs",
                      score: "Great Fit",
                      tagColor: "bg-[#E8F5EB]",
                      textColor: "text-primary",
                      iconColor: "bg-[#A3B858]",
                    },
                  ].map((p, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center justify-between"
                      variants={listItemVariants}
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          variants={smallIconVariants}
                          className={`w-8 h-8 rounded ${p.iconColor} flex items-center justify-center shrink-0 text-white shadow-sm`}
                        >
                          <Play size={14} fill="currentColor" />
                        </motion.div>
                        <span className="text-sm text-title font-bold poppins ">
                          {p.label}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-medium ${p.textColor} ${p.tagColor} px-3 py-1 rounded-full`}
                      >
                        {p.score}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>

            {/* Card F: Provincial Opportunities */}
            <motion.div
              variants={cardVariants}
              whileHover={
                !shouldReduceMotion
                  ? { y: -6, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)" }
                  : {}
              }
              transition={{ duration: 0.3 }}
              className="bg-background rounded-2xl p-4 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] border border-black/5 mt-5 xl:mt-6 poppins "
            >
              <h5 className="text-lg md:text-xl font-bold text-title poppins  mb-6">
                Provincial Opportunities
              </h5>
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-6"
                variants={listContainerVariants}
              >
                {[
                  { name: "Ontario" },
                  { name: "British Columbia" },
                  { name: "Alberta" },
                  { name: "Saskatchewan" },
                ].map((prov, i) => (
                  <motion.div
                    key={i}
                    className="flex flex-col items-start"
                    variants={listItemVariants}
                  >
                    <span className="text-base font-bold text-title mb-3 poppins ">
                      {prov.name}
                    </span>
                    <div className="flex items-center gap-1.5 bg-[#E8F5EB] px-2.5 py-1 rounded-md mb-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      <span className="text-sm text-primary font-bold">
                        Good fit
                      </span>
                    </div>
                    <p className="text-base text-description leading-relaxed blur-[2.5px] opacity-60">
                      Answer a few questions about your background, education,
                      work experience, and goals.
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
