"use client";

import hero from "@/assets/pathways/hero.png";
import Image from "next/image";
import ActionButton from "../Shared/ActionButton";
import FadeUp from "../Shared/Animation/FadeUp";
import { useAssessmentModal } from "@/context/AssessmentModalContext";

export default function PathwaysHero() {
  const { openModal } = useAssessmentModal();
  return (
    <section className="bg-white pt-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          {/* Left Column - Text */}
          <div className="flex-1 w-full flex flex-col justify-center lg:pr-8">
            <FadeUp
              as="h1"
              className="text-3xl md:text-4xl lg:text-5xl  text-title leading-[1.1] font-bold tracking-tight caros  "
            >
              Explore Canadian
              <br />
              Immigration Pathways
            </FadeUp>
            <FadeUp
              delay={0.15}
              className="mt-6 text-base md:text-lg text-description max-w-2xl poppins "
            >
              Discover personalized immigration routes tailored to your skills,
              experience, and goals. Our comprehensive assessment helps you
              navigate Canada&apos;s immigration system with confidence and
              clarity.
            </FadeUp>
            <div className="mt-8">
              <ActionButton variant="primary" className="poppins " onClick={openModal}>
                Get started
              </ActionButton>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="flex-1 w-full relative">
            <div
              className="relative h-100 md:h-125 lg:h-137.5 w-full rounded-xl overflow-hidden"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent 0%, black 20%, black 100%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, black 20%, black 100%)",
              }}
            >
              <Image
                src={hero}
                alt="Canadian City Skyline"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
