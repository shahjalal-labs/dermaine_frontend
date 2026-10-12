import Image, { StaticImageData } from "next/image";
import { ReactNode } from "react";
import FadeUp from "./Animation/FadeUp";

interface PageHeroProps {
  title: string;
  description: string;
  image: StaticImageData | string;
  imageAlt?: string;
  children?: ReactNode;
}

export default function PageHero({
  title,
  description,
  image,
  imageAlt = "Hero Illustration",
  children,
}: PageHeroProps) {
  return (
    <div className="container mx-auto px-4 md:px-8 py-12 md:py-20 bg-background">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
        <div className="flex-1 w-full">
          <FadeUp
            as="h1"
            className="text-3xl md:text-4xl lg:text-6xl font-bold caros text-title mb-6 leading-[1.2]"
          >
            {title}
          </FadeUp>

          <FadeUp
            as="p"
            delay={0.15}
            className="text-description text-base md:text-lg whitespace-pre-line"
          >
            {description}
          </FadeUp>

          {/* Optional extra content below description (e.g. icons, buttons) */}
          {children && (
            <FadeUp delay={0.3} className="mt-8">
              {children}
            </FadeUp>
          )}
        </div>

        <div className="flex-1 w-full flex justify-center lg:justify-end">
          <FadeUp delay={0.2} className="w-full max-w-150 group">
            <Image
              src={image}
              alt={imageAlt}
              className="w-full h-auto object-contain transition-transform duration-1500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-3 group-hover:scale-[1.02]"
              priority
            />
          </FadeUp>
        </div>
      </div>
    </div>
  );
}
