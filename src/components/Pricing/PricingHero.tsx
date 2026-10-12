/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreditCard, Globe2, Shield, UserCheck } from "lucide-react";
import FadeUp from "../Shared/Animation/FadeUp";

const trustBadges = [
  {
    icon: Shield,
    title: "Secure & Confidential",
    desc: "Your data is protected",
  },
  {
    icon: CreditCard,
    title: "One-time payment",
    desc: "No hidden fees",
  },
  {
    icon: UserCheck,
    title: "Personalized recommendations",
    desc: "Tailored to your profile",
  },
  {
    icon: Globe2,
    title: "Trusted Worldwide",
    desc: "Helping people achieve their immigration goals globally",
  },
];

export default function PricingHero() {
  return (
    <section className="bg-background">
      {/* Top Trust Badges Banner */}
      {/* <div className="border-b border-black/5 bg-[#F9FAFB]">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustBadges.map((badge, i) => {
              const Icon = badge.icon;
              return (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#E8F5EB] flex items-center justify-center text-primary shrink-0">
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-base md:text-lg font-bold text-title poppins  mb-1">
                      {badge.title}
                    </h4>
                    <p className="text-base  text-description poppins ">
                      {badge.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div> */}

      {/* Main Hero Header */}
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-20 text-center">
        <FadeUp
          as="h2"
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-title caros  mb-6"
        >
          Know Your Best Immigration Opportunities
        </FadeUp>
        <FadeUp
          delay={0.15}
          as="p"
          className="text-base md:text-lg text-description poppins  max-w-2xl mx-auto "
        >
          One-Time Payment. No Subscriptions. Instant Delivery. Helping people
          achieve their immigration goals globally.
        </FadeUp>
      </div>
    </section>
  );
}
