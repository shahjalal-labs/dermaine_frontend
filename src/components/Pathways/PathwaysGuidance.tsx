"use client";
import guidence from "@/assets/pathways/guidence.png";
import { motion, Variants } from "framer-motion";
import { Calendar, CheckCircle2, Clock, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const sessionInfo = [
  {
    icon: Clock,
    label: "Duration",
    value: "45 minutes",
  },
  {
    icon: Phone,
    label: "Format",
    value: "Call",
  },
  {
    icon: Calendar,
    label: "Availability",
    value: "Book at your convenience",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const imageVariants: Variants = {
  hidden: { scale: 1.05, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const listContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -15 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function PathwaysGuidance() {
  return (
    <section className="pt-16 md:py-24 bg-white poppins overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="bg-[#F8FAFC] rounded-2xl p-6 lg:p-12 border border-slate-100 shadow-[0_4px_30px_rgba(0,0,0,0.02)]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-10%" }}
          variants={containerVariants}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Side */}
            <div className="flex flex-col h-full">
              <motion.div
                variants={imageVariants}
                className="overflow-hidden mb-8 rounded-xl shadow-sm"
              >
                <Image
                  src={guidence}
                  alt="Expert Consultation"
                  className="w-full h-70 lg:h-80 object-cover transition-transform duration-700 hover:scale-105"
                />
              </motion.div>

              <motion.div
                variants={fadeUpVariants}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 poppins "
              >
                <h3 className="text-xl font-bold text-title">
                  Session Summary
                </h3>
                <span className="font-bold text-[#4B7258] caros text-lg">
                  From $150 CAD
                </span>
              </motion.div>

              <div className="space-y-4">
                {sessionInfo.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      variants={fadeUpVariants}
                      key={index}
                      className="bg-[#EEF8EF] rounded-xl p-4 flex items-center gap-4 group cursor-default transition-colors hover:bg-[#e4f3e6]"
                    >
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shrink-0 border border-primary/10 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                        <Icon size={18} />
                      </div>

                      <div>
                        <p className="text-base font-bold text-primary uppercase tracking-wide mb-0.5">
                          {item.label}
                        </p>
                        <p className="font-bold text-title text-sm">
                          {item.value}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Right Side */}
            <div className="flex flex-col h-full lg:pt-8 poppins">
              <motion.div variants={fadeUpVariants} className="mb-6">
                <span className="inline-block bg-[#E8F5EB] text-title text-xs md:text-sm font-medium px-3 py-1.5 rounded-md shadow-sm">
                  Optional Expert Support
                </span>
              </motion.div>

              <motion.h2
                variants={fadeUpVariants}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-title caros mb-6 leading-tight"
              >
                Need Personalized Guidance?
              </motion.h2>

              <motion.p
                variants={fadeUpVariants}
                className="text-description text-base md:text-lg mb-10 leading-relaxed poppins"
              >
                After reviewing your strategy report, book a one-on-one
                consultation with our licensed experts to navigate your unique
                immigration journey with total confidence.
              </motion.p>

              <motion.div
                variants={listContainerVariants}
                className="space-y-5 mb-12 poppins text-base md:text-lg"
              >
                {[
                  "Consultations are a separate purchase",
                  "Available after completing assessment or purchasing report",
                  "Optional Continue for personalized support",
                  "Expert immigration guidance tailored to your profile",
                ].map((item, i) => (
                  <motion.div
                    variants={listItemVariants}
                    key={i}
                    className="flex items-start gap-3 group cursor-default"
                  >
                    <CheckCircle2
                      size={20}
                      className="text-primary mt-0.5 shrink-0 group-hover:scale-110 transition-transform duration-300"
                      strokeWidth={2}
                    />
                    <p className="text-base md:text-lg text-title font-medium group-hover:text-primary transition-colors duration-300">
                      {item}
                    </p>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                variants={fadeUpVariants}
                className="mt-auto flex lg:justify-end"
              >
                <Link href={"/book-consultation"}>
                  <button className="w-full lg:w-auto bg-[#54B75B1A] hover:bg-[#d4ecd9] text-primary font-bold cursor-pointer poppins py-3.5 px-8 rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                    Book Consultation
                  </button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
