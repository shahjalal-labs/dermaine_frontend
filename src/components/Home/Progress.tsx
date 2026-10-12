"use client";
import { motion, Variants } from "framer-motion";
import { useState } from "react";

const steps = [
  { id: 1, title: "Personalized strategy\nrecommendations" },
  { id: 2, title: "100+ immigration\npathways analyzed" },
  { id: 3, title: "20+ years of industry\nexperience" },
  { id: 4, title: "Updated with current\nimmigration rules" },
];

export default function Progress() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.35 },
    },
  };

  const stepVariants: Variants = {
    hidden: {},
    visible: {},
  };

  const circleVariants: Variants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      y: [0, -4, 0],
      transition: {
        scale: { type: "spring", bounce: 0.5, duration: 0.8 },
        opacity: { duration: 0.4 },
        y: {
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut",
          delay: 0.8, // Start floating after entrance animation
        },
      },
    },
  };

  const pulseVariants: Variants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: [1, 1.4, 1],
      opacity: [0, 0.4, 0],
      transition: {
        repeat: Infinity,
        duration: 2.5,
        ease: "easeInOut",
        delay: 0.6,
      },
    },
  };

  const lineVariants: Variants = {
    hidden: { opacity: 0.3 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, ease: "easeInOut", delay: 0.2 },
    },
  };

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", bounce: 0.3, duration: 0.6, delay: 0.1 },
    },
  };

  return (
    <section className="w-full bg-white pt-16 md:pt-36 pb-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-2 gap-y-12 md:flex md:flex-row items-start w-full justify-between md:gap-0 relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-10%" }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className="flex flex-col items-center relative z-10 md:flex-1 cursor-default group"
              variants={stepVariants}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
            >
              {/* Circle Container */}
              <div className="relative">
                {/* Pulse Ring */}
                <motion.div
                  variants={pulseVariants}
                  className="absolute inset-0 rounded-full bg-emerald-400 blur-[6px] z-0 pointer-events-none"
                />

                {/* Circle */}
                <motion.div
                  variants={circleVariants}
                  whileHover={{
                    scale: 1.15,
                    y: -4,
                    boxShadow: "0 10px 25px rgba(34,197,94,0.4)",
                    transition: { duration: 0.2 },
                  }}
                  className="w-8 h-8 md:w-15 md:h-15 rounded-full flex items-center justify-center text-white text-base md:text-2xl font-bold bg-linear-to-br from-primary to-emerald-400 shadow-[0_4px_15px_rgba(34,197,94,0.25)] relative z-20"
                >
                  {step.id}
                </motion.div>
              </div>

              {/* Title */}
              <motion.p
                variants={textVariants}
                className={`mt-4 md:mt-6 text-sm md:text-lg font-bold md:font-semibold text-center leading-snug whitespace-pre-line transition-colors duration-300 px-1 md:px-2 ${
                  hoveredIndex === index ? "text-primary" : "text-title/70"
                }`}
              >
                {step.title}
              </motion.p>

              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <motion.div
                  variants={lineVariants}
                  className={`absolute top-2.5 md:top-5.5 left-[calc(50%+24px)] md:left-[calc(50%+42px)] w-[calc(100%-48px)] md:w-[calc(100%-84px)] h-4 z-10 items-center text-primary ${
                    index % 2 === 1 ? "hidden md:flex" : "flex"
                  }`}
                >
                  <svg
                    className="w-full h-full absolute left-0 top-0"
                    preserveAspectRatio="none"
                  >
                    <line
                      x1="0"
                      y1="50%"
                      x2="calc(100% - 6px)"
                      y2="50%"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeDasharray="12 10"
                    />
                  </svg>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 md:w-3 md:h-3 rotate-45 bg-current"></div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
