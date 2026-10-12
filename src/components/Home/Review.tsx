"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useState } from "react";
import { BiSolidQuoteAltRight } from "react-icons/bi";
import { VscVerifiedFilled } from "react-icons/vsc";
import FadeUp from "../Shared/Animation/FadeUp";

const reviews = [
  {
    name: "Garrell Steward",
    country: "Afghanistan",
    initials: "GS",
    review:
      "After completing the assessment, I realized I qualified for a provincial nominee pathway I never considered.",
    pathway: "WORK PERMIT",
  },
  {
    name: "Michael Chen",
    country: "China",
    initials: "MC",
    review:
      "The platform helped me understand why I was not receiving invitations and what improvements could strengthen my profile.",
    pathway: "STUDY PERMIT",
  },
  {
    name: "Sarah Martinez",
    country: "Mexico",
    initials: "SM",
    review:
      "I originally planned only for study but discovered work permit and permanent options that better matched my background.",
    pathway: "EXPRESS ENTRY",
  },
  {
    name: "Amina Yusuf",
    country: "Nigeria",
    initials: "AY",
    review:
      "The customized plan gave me exactly what I needed to focus on to increase my CRS score effectively.",
    pathway: "EXPRESS ENTRY",
  },
  {
    name: "David Silva",
    country: "Brazil",
    initials: "DS",
    review:
      "Incredible experience! The assessment provided clarity on the startup visa requirements I was completely missing.",
    pathway: "BUSINESS IMMIGRATION",
  },
  {
    name: "Elena Popova",
    country: "Russia",
    initials: "EP",
    review:
      "The step-by-step guidance made the complex permanent residency application process seem incredibly straightforward and manageable.",
    pathway: "PERMANENT RESIDENCE",
  },
];

export default function Review() {
  const [startIndex, setStartIndex] = useState(0);

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => Math.min(reviews.length - 3, prev + 1));
  };

  const visibleReviews = reviews.slice(startIndex, startIndex + 3);

  return (
    <section className="py-24 bg-[#FAFAFA]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-16 gap-8">
          <div className="max-w-150">
            <FadeUp
              as="h2"
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 caros  text-title"
            >
              Trusted By Applicants Exploring Canada
            </FadeUp>

            <FadeUp
              as="p"
              delay={0.15}
              className="text-base md:text-lg text-muted-foreground poppins  leading-relaxed"
            >
              Join thousands of successful applicants who discovered their path
              to Canada through our assessment platform.{" "}
            </FadeUp>
          </div>
          {/* Navigation Buttons */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={handlePrev}
              disabled={startIndex === 0}
              className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all shadow-sm ${
                startIndex === 0
                  ? "bg-white border-black/10 text-title opacity-50 cursor-not-allowed"
                  : "bg-primary border-transparent text-white hover:opacity-90"
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              disabled={startIndex >= reviews.length - 3}
              className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all shadow-sm ${
                startIndex >= reviews.length - 3
                  ? "bg-white border-black/10 text-title opacity-50 cursor-not-allowed"
                  : "bg-primary border-transparent text-white hover:opacity-90"
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleReviews.map((review, idx) => (
            <motion.div
              key={startIndex + idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.15, ease: "easeOut" }}
              className="bg-white rounded-3xl p-8 flex flex-col h-full shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-black/2 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] cursor-pointer group"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-6 ">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#E5F5EB]  text-primary flex items-center justify-center font-bold text-lg overflow-hidden shrink-0">
                    {review.initials}
                  </div>
                  <div className="flex flex-col">
                    <h4 className="font-bold text-title text-lg md:text-xl caros">
                      {review.name}
                    </h4>
                    <span className="text-base  md:text-lg text-muted-foreground">
                      {review.country}
                    </span>
                  </div>
                </div>
                <BiSolidQuoteAltRight className="w-10 h-10 text-primary/30 shrink-0 transition-colors duration-300 group-hover:text-primary" />
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-base md:text-lg text-muted-foreground poppins  leading-relaxed mb-8 flex-1">
                &quot;{review.review}&quot;
              </p>

              {/* Card Footer */}
              <div className="flex flex-wrap items-center justify-between gap-2 mt-auto pt-2">
                <span className="text-base font-bold text-description tracking-wider ">
                  {review.pathway}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold text-primary poppins">
                    Verified Assessment User
                  </span>
                  <VscVerifiedFilled
                    size={25}
                    className=" text-primary"
                    fill="currentColor"
                    stroke="white"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
