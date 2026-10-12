"use client";

import { motion, Variants } from "framer-motion";

export default function TextReveal({ text }: { text: string }) {
  const words = text.split(" ");

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const childVariants: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
    },
  };

  return (
    <motion.p
      className="text-base md:text-lg font-normal poppins flex flex-wrap"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
    >
      {words.map((word, index) => (
        <motion.span variants={childVariants} key={index} className="mr-[0.25em]">
          {word}
        </motion.span>
      ))}
    </motion.p>
  );
}
