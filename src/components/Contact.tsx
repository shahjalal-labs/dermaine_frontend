import contactImg from "@/assets/contact.png";
import Image from "next/image";
import {
  TbBrandFacebook,
  TbBrandInstagram,
  TbBrandLinkedin,
  TbBrandX,
} from "react-icons/tb";

const socialLinks = [
  {
    icon: TbBrandFacebook,
    href: "#",
  },
  {
    icon: TbBrandX,
    href: "#",
  },
  {
    icon: TbBrandInstagram,
    href: "#",
  },
  {
    icon: TbBrandLinkedin,
    href: "#",
  },
];

export default function Contact() {
  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Hero Section */}
      <section className="bg-[#E5F4E6] py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold caros  text-title">
            Contact Us
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 mt-12 md:mt-16 relative z-10">
        <div className="max-w-[1200px] mx-auto bg-white rounded-[32px] border-2 border-[#E8F5EB] p-8 md:p-12 relative shadow-sm">
          {/* Sticky Social Bar attached to the card */}
          <div className="absolute -right-[46px] top-2/3 -translate-y-1/2 bg-primary text-white p-2.5 py-4 rounded-r-md rounded-br-4xl flex flex-col gap-4 z-50 shadow-md hidden md:flex">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  href={social.href}
                  key={index}
                  className="hover:opacity-80 transition-opacity"
                >
                  <Icon size={25} strokeWidth={1.5} />
                </a>
              );
            })}
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-16 items-stretch">
            {/* Form Content (Left Column, Row 1) */}
            <div className="flex flex-col order-1">
              <h2 className="text-3xl md:text-[32px] font-bold caros  text-primary mb-1">
                Get in touch
              </h2>
              <p className="text-base md:text-lg text-description poppins  mb-6 opacity-70">
                We are here for you! How can we help you
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-base md:text-lg font-medium text-title mb-2 poppins ">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your Name"
                    className="w-full border border-black/10 rounded-md px-4 py-3 text-base md:text-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors poppins  placeholder:text-black/40"
                  />
                </div>
                <div>
                  <label className="block text-base md:text-lg font-medium text-title mb-2 poppins ">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full border border-black/10 rounded-md px-4 py-3 text-base md:text-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors poppins  placeholder:text-black/40"
                  />
                </div>
                <div>
                  <label className="block text-base md:text-lg font-medium text-title mb-2 poppins ">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full border border-black/10 rounded-md px-4 py-3 text-base md:text-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors poppins  placeholder:text-black/40"
                  />
                </div>
                <div>
                  <label className="block text-base md:text-lg font-medium text-title mb-2 poppins ">
                    How did you learn about us?
                  </label>
                  <div className="relative">
                    <select className="w-full border border-black/10 rounded-md px-4 py-3 text-base md:text-lg text-black/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors poppins  appearance-none bg-white">
                      <option value="">How did you learn about us?</option>
                      <option value="social">Social Media</option>
                      <option value="search">Search Engine</option>
                      <option value="friend">Friend/Family</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer -events-none text-black/40">
                      <svg
                        width="10"
                        height="6"
                        viewBox="0 0 10 6"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 1L5 5L9 1"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-base md:text-lg font-medium text-title mb-2 poppins ">
                    Message
                  </label>
                  <textarea
                    placeholder="Message"
                    rows={4}
                    className="w-full border border-black/10 rounded-md px-4 py-3 text-base md:text-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors poppins  resize-none placeholder:text-black/40"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Image Side (Right Column, Row 1) */}
            <div className="w-full relative rounded-2xl overflow-hidden h-full min-h-[300px] shadow-sm mt-8 md:mt-0 order-3 md:order-2">
              <Image
                src={contactImg}
                alt="Customer Support"
                fill
                className="object-cover object-center"
              />
            </div>

            {/* Submit Button (Left Column, Row 2) */}
            <div className="mt-6 order-2 md:order-3">
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/80 text-white font-medium py-3 px-6 cursor-pointer  rounded-md transition-colors text-base md:text-lg poppins "
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
