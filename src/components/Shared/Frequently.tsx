"use client";
import { cn } from "@/lib/utils";
import { motion, Variants } from "framer-motion";
import { Plus, X } from "lucide-react";
import { useState } from "react";

import bg from "@/assets/home/Ellipse.png";
import Image from "next/image";
import FadeUp from "./Animation/FadeUp";

const faqs = [
  {
    q: "Is the assessment really free?",
    a: "Yes! The initial assessment is completely free. The free assessment analyzes your profile against multiple Canadian immigration pathways including Express Entry, PNPs, work permits, study permits, and family pathways. You'll receive a preliminary eligibility breakdown, pathway matches, and strategic insights based on your profile.",
  },
  {
    q: "How does the platform work?",
    a: "Our platform matches your unique profile against Canada's immigration programs to find the best pathways for you.",
  },
  {
    q: "Can the platform help if I don't qualify yet?",
    a: "Absolutely. We provide strategic recommendations on how you can improve your eligibility over time.",
  },
  {
    q: "Does the assessment include PNP pathways?",
    a: "Yes, we analyze your eligibility across various Provincial Nominee Programs alongside federal pathways.",
  },
  {
    q: "Will I receive recommendations on how to improve my immigration options?",
    a: "Yes, our strategy report includes actionable steps to help strengthen your profile and improve your chances.",
  },
  {
    q: "How long does the assessment take?",
    a: "The assessment is quick and straightforward, typically taking only 5 to 10 minutes to complete.",
  },
  {
    q: "What do I get in the Strategy Report?",
    a: "You'll receive a detailed breakdown of your pathway options, scoring insights, and personalized Continues.",
  },
  {
    q: "Is my information secure?",
    a: "Yes, we use industry-standard encryption and security practices to ensure your data remains private and protected.",
  },
  {
    q: "Can I update my profile later?",
    a: "Of course! You can always update your profile if your situation changes, like getting a new degree or job.",
  },
];

export default function Frequently() {
  const [openIndex, setOpenIndex] = useState<number>(-1);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-250 h-225 md:w-375 md:h-250 pointer -events-none -z-10">
        <Image
          src={bg}
          alt="Background"
          fill
          className="object-contain object-center"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Left Column */}
          <div className="lg:w-1/3 flex flex-col gap-6">
            <FadeUp
              as="h2"
              className="text-3xl md:text-4xl lg:text-5xl font-bold caros text-title leading-[1.15]"
            >
              Frequently Asked
              <br className="hidden lg:block" /> Questions
            </FadeUp>

            <FadeUp
              as="p"
              delay={0.15}
              className="text-base md:text-lg text-muted-foreground poppins leading-relaxed"
            >
              Got questions? We&apos;ve got answers. Everything you need to know
              about starting your Canadian immigration journey.{" "}
            </FadeUp>
          </div>

          {/* Right Column (Accordion) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.5 }}
            className="lg:w-2/3 flex flex-col gap-5 caros "
          >
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <motion.div
                  variants={itemVariants}
                  key={idx}
                  className={cn(
                    "flex flex-col px-4 sm:px-6 rounded-2xl transition-colors bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
                  )}
                >
                  <button
                    className="flex justify-between items-center py-3 text-left group w-full"
                    onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  >
                    <h3 className="text-xl md:text-2xl font-bold text-title caros  pr-8 leading-snug">
                      {faq.q}
                    </h3>
                    <div className="text-muted-foreground group-hover:text-primary transition-colors shrink-0">
                      {isOpen ? (
                        <X className="w-5 h-5" strokeWidth={1.5} />
                      ) : (
                        <Plus className="w-5 h-5" strokeWidth={1.5} />
                      )}
                    </div>
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300 ease-in-out",
                      isOpen
                        ? "max-h-125 opacity-100 pb-6"
                        : "max-h-0 opacity-0"
                    )}
                  >
                    <p className="text-base md:text-lg text-muted-foreground poppins  leading-relaxed pr-8">
                      {faq.a}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
