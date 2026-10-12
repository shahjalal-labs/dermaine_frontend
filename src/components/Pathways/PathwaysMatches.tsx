"use client";
import { motion, Variants } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import FadeUp from "../Shared/Animation/FadeUp";

const matches = [
  {
    name: "Sarah Brown",
    subtitle: "Software Engineer, 28",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100",
    bgColor: "bg-[#F2FBF4]",
    items: [
      "Express Entry category alignment",
      "Ontario Immigration Nominee Program Opportunities",
      "Work permit pathways available",
    ],
  },
  {
    name: "Michael Chen",
    subtitle: "Business Owner, 45",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100",
    bgColor: "bg-[#F8F5FE]",
    items: [
      "Start up visa to Investment Residency Stream identified",
      "Provincial Entrepreneur Program Opportunities",
      "Self-Employed Persons Program",
    ],
  },
  {
    name: "Jessica Martinez",
    subtitle: "Registered Nurse, 32",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100",
    bgColor: "bg-[#FFFAF2]",
    items: [
      "Express Entry to Healthcare Category alignment",
      "Provincial Nominee Programs for Healthcare",
      "Rural and Northern Immigration Pilot to Rural and Regional pathways available",
    ],
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

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

const listContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function PathwaysMatches() {
  return (
    <section className="py-16 md:py-24 bg-white poppins overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <FadeUp
            as="h2"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-title caros "
          >
            Example Pathway Matches
          </FadeUp>
        </div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
        >
          {matches.map((match, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{
                y: -8,
                boxShadow: "0 15px 30px rgba(0,0,0,0.06)",
                transition: { duration: 0.3 },
              }}
              className={`rounded-2xl p-6 lg:p-8 ${match.bgColor} border border-black/5 flex flex-col h-full cursor-default`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-12 h-12 md:w-14 md:h-14 overflow-hidden rounded-full shadow-sm ring-2 ring-white/60">
                  <Image
                    fill
                    src={match.image}
                    alt={match.name}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-title text-lg md:text-xl">
                    {match.name}
                  </h3>
                  <p className="text-base text-description">{match.subtitle}</p>
                </div>
              </div>

              <motion.div
                className="space-y-4 mt-auto"
                variants={listContainerVariants}
              >
                {match.items.map((item, i) => (
                  <motion.div
                    key={i}
                    variants={listItemVariants}
                    className="flex items-start gap-3 group"
                  >
                    <CheckCircle2
                      size={18}
                      className="text-primary mt-1 shrink-0 group-hover:scale-110 transition-transform duration-300"
                      strokeWidth={2}
                    />
                    <p className="text-base md:text-lg leading-relaxed text-description group-hover:text-title transition-colors duration-300">
                      {item}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
