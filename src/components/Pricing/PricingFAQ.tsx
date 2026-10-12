"use client";

import bg from "@/assets/home/Ellipse.png";
import { cn } from "@/lib/utils";
import { motion, Variants } from "framer-motion";
import { Plus, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import FadeUp from "../Shared/Animation/FadeUp";

const faqs = [
  {
    question: "Can I update my report later?",
    answer:
      "Yes. Immigration programs, policies, and your personal circumstances may change over time. You can generate a new report whenever you need updated recommendations based on the latest immigration rules and your current profile.",
  },
  {
    question: "Do I need a consultation?",
    answer:
      "No. The Strategy Report is designed as a self-service planning tool that provides personalized pathway recommendations, immigration analysis, and an action roadmap. If you would like professional guidance, consultations are available separately.",
  },
  {
    question: "Can I download my report?",
    answer:
      "Yes. Strategy Reports can be downloaded as a PDF and accessed from your dashboard during your report access period.",
  },
  {
    question: "How long can I access my report?",
    answer:
      "Your report remains available in your dashboard for 90 days from the date of purchase. After that period, you may purchase an updated report to receive the latest recommendations and program information.",
  },
  {
    question: "Can recommendations change?",
    answer:
      "Yes. Immigration programs, selection criteria, and government policies are updated regularly. Recommendations may also change as your profile evolves, such as improving language scores, gaining work experience, or obtaining a job offer.",
  },
  {
    question: "Is my information secure?",
    answer:
      "Yes. Your information is encrypted and stored securely. We do not share your personal information with third parties without your consent.",
  },
  {
    question: "Does purchasing a report guarantee approval?",
    answer:
      "No. Reports are intended for informational and planning purposes only and do not guarantee approval, invitations to apply, or immigration outcomes.",
  },
  {
    question: "How long does it take to receive my report?",
    answer:
      "Most reports are generated instantly after payment and assessment completion.",
  },
  {
    question: "Can I upgrade from a Free Assessment later?",
    answer:
      "Yes. You can upgrade at any time to unlock detailed pathway recommendations, immigration analysis, missing requirements, and your personalized roadmap.",
  },
  {
    question:
      "What makes the Strategy Report different from a free assessment?",
    answer:
      "The free assessment provides a general overview of your opportunities. The Strategy Report provides exact program matches, missing requirements, improvement suggestions, and a personalized action plan.",
  },
];

export default function PricingFAQ() {
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
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-250 h-225 md:w-375 md:h-250 pointer-events-none z-0">
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
              Have questions? We&apos;re here to help. Everything you need to
              know about our reports.
            </FadeUp>
          </div>

          {/* Right Column (Accordion) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.5 }}
            className="lg:w-2/3 flex flex-col gap-5 caros"
          >
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <motion.div
                  variants={itemVariants}
                  key={index}
                  className={cn(
                    "flex flex-col px-4 sm:px-6 rounded-2xl transition-colors bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
                  )}
                >
                  <button
                    className="flex justify-between items-center py-5 text-left group w-full"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  >
                    <h3 className="text-xl md:text-2xl font-bold text-title caros pr-8 leading-snug">
                      {faq.question}
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
                    <p className="text-base md:text-lg text-muted-foreground poppins leading-relaxed pr-8">
                      {faq.answer}
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
