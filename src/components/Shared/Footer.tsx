import Link from "next/link";
import {
  FaFacebookSquare,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import CTA from "./CTA";

const footerLinks = [
  {
    title: "Program",
    links: [
      { label: "Express Entry programs", href: "#" },
      { label: "Provincial Nominee Programs", href: "#" },
      { label: "Category-based selection alignment", href: "#" },
      { label: "Family pathway detection signals", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Free Assessment", href: "#" },
      { label: "FAQ", href: "#" },
      { label: "Success Stories", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact Us", href: "/contact-us" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
];

const socialLinks = [
  { icon: FaFacebookSquare, href: "#" },
  { icon: FaYoutube, href: "#" },
  { icon: FaLinkedin, href: "#" },
  { icon: FaTwitter, href: "#" },
  { icon: FaXTwitter, href: "#" },
];

export default function Footer({ showCTA = true }: { showCTA?: boolean }) {
  return (
    <footer className="w-full">
      {showCTA && (
        <div className="bg-background ">
          <CTA />
        </div>
      )}
      {/* Dark Footer Area */}
      <div className="bg-[#1D4020] pt-20 pb-8 px-4 sm:px-6 lg:px-8 text-[#8E95A2] poppins ">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8 mb-16">
            {/* Brand Column */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="flex items-center gap-3 caros">
                <div className="w-10 h-10 bg-primary text-white font-bold flex items-center justify-center rounded-md text-lg shrink-0">
                  IM
                </div>
                <span className="font-bold text-xl text-white tracking-wide">
                  IMMICA
                </span>
              </div>
              <p className="text-base md:text-lg leading-relaxed max-w-sm poppins">
                Your trusted partner for Canadian immigration assessment and
                strategy planning.
              </p>
            </div>

            {/* Link Columns */}
            {footerLinks.map((section, idx) => (
              <div key={idx} className="flex flex-col gap-5 poppins">
                <h4 className="font-bold text-white text-base md:text-lg lg:text-xl">
                  {section.title}
                </h4>
                <ul className="flex flex-col gap-3.5 text-base md:text-lg">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <Link
                        href={link.href}
                        className="hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Social Media Column */}
            <div className="flex flex-col gap-5 poppins">
              <h4 className="font-bold text-white text-base md:text-lg lg:text-xl">
                Social media
              </h4>
              <div className="flex items-center gap-3">
                {socialLinks.map((social, idx) => {
                  const Icon = social.icon;
                  return (
                    <Link
                      key={idx}
                      href={social.href}
                      className=" hover:text-[#A5BBA8] transition-colors"
                    >
                      <Icon size={24} />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-base md:text-lg poppins">
            <p>© {new Date().getFullYear()} IMMICA. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
