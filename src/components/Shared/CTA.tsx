"use client";

import { usePathname } from "next/navigation";
import ActionButton from "./ActionButton";
import FadeUp from "./Animation/FadeUp";
import { useAssessmentModal } from "@/context/AssessmentModalContext";

export default function CTA() {
  const pathname = usePathname();
  const { openModal } = useAssessmentModal();

  const bgColorClass = pathname === "/" ? "bg-background" : "bg-[#F8FAFC]";

  return (
    <div
      className={` pb-16 md:py-24 text-center flex flex-col items-center justify-center px-4 ${bgColorClass}`}
    >
      <FadeUp
        as="h2"
        className="text-4xl md:text-4xl lg:text-5xl font-bold caros  text-title mb-4"
      >
        Ready to Start Your Canadian Journey?
      </FadeUp>
      <FadeUp
        as="p"
        delay={0.15}
        className="text-lg md:text-xl text-muted-foreground poppins mb-8"
      >
        Take the first step today with our free immigration assessment
      </FadeUp>
      <div className="flex flex-col sm:flex-row items-center gap-4 transition-all duration-300 hover:gap-8">
        <ActionButton variant="primary" className="poppins " onClick={openModal}>
          Get started
        </ActionButton>

        <ActionButton
          variant="green"
          link="/book-consultation"
          className="poppins hover:bg-[#d4ecd9]"
        >
          Book Consultation
        </ActionButton>
      </div>
    </div>
  );
}
