"use client";

import hero from "@/assets/home/hero.png";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import HeroButtons from "./HeroButtons";

import line from "@/assets/home/line.png";
import TextReveal from "../Shared/Animation/TextReveal";

export default function Hero() {
  return (
    <section className="relative w-full bg-[radial-gradient(ellipse_at_top_left,#CCE9CE_0%,#FFFFFF_50%)] flex flex-col lg:block overflow-hidden">
      {/* Decorative Background Grid */}
      <div
        className="absolute inset-0 pointer -events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
          backgroundSize: "6rem 6rem",
        }}
      ></div>

      {/* Decorative Squiggly Lines */}
      <div className="absolute top-[18%] lg:top-[15%] left-[2%] lg:left-[5%] pointer -events-none z-0">
        <Image
          src={line}
          alt="Decorative line"
          width={80}
          height={120}
          className="opacity-80"
        />
      </div>
      <div className="absolute bottom-[10%] lg:bottom-[15%] right-[5%] lg:right-[48%] pointer -events-none z-0">
        <Image
          src={line}
          alt="Decorative line"
          width={80}
          height={120}
          className="opacity-80"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full relative z-10 lg:min-h-[calc(100vh-80px)] flex flex-col justify-center pb-5">
        <div className="w-full lg:w-[55%] relative z-10 lg:pr-12 flex flex-col gap-6 pt-12 lg:pt-0">
          {/* Pill */}
          <div className="inline-flex items-center gap-2 bg-[#F3F4F6]/60 backdrop-blur-md rounded-full px-4 py-2 w-fit border border-black/5">
            <CheckCircle2 className="w-4 h-4 text-black" strokeWidth={2.5} />
            <span className="text-sm md:text-base lg:text-lg font-medium text-black poppins ">
              Immigration strategy platform, pathway intelligence, eligibility
              engine
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold leading-[1.1] caros text-title">
            Discover Your Best
            <br />
            Immigration Opportunities
          </h1>

          {/* Subtitle */}
          <TextReveal text="Complete your immigration assessment in minutes and discover which Canadian immigration pathways may match your profile. " />

          {/* Buttons */}
          <HeroButtons />

          {/* Features List */}
          {/* <div className="flex flex-col gap-5 mt-8 poppins ">
            {[
              "IRCC-aligned scoring",
              "50+ immigration pathways analyzed",
              "Updated with current immigration rules",
              "Personalized strategy recommendations",
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3">
                <Image src={checkmark} height={22} width={22} alt="checkmark" />
                <span className="text-black font-medium text-base md:text-lg">
                  {text}
                </span>
              </div>
            ))}
          </div> */}
        </div>
      </div>

      {/* Right Column (Image) */}
      <div className="w-full lg:absolute lg:top-0 lg:right-0 lg:w-[36%] lg:h-full relative min-h-100 flex justify-end items-start pt-12 lg:pt-0">
        <Image
          src={hero}
          alt="Canadian Immigration"
          fill
          className="object-cover object-top-left"
          priority
        />
      </div>
    </section>
  );
}
