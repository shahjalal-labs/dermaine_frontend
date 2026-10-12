"use client";

import { motion } from "framer-motion";
import React from "react";

interface FadeUpProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  delay?: number;
}

export default function FadeUp({
  children,
  className,
  as = "div",
  delay = 0,
}: FadeUpProps) {
  const MotionComponent = motion[
    as as keyof typeof motion
  ] as React.ElementType;

  return (
    <MotionComponent
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: "easeOut", delay },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      className={className}
    >
      {children}
    </MotionComponent>
  );
}
