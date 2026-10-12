import ConditionalFooter from "@/components/Shared/ConditionalFooter";
import Navbar from "@/components/Shared/Navbar";
import ReduxProvider from "@/redux/ReduxProvider";
import { AssessmentModalProvider } from "@/context/AssessmentModalContext";
import { Toaster } from "react-hot-toast";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Immica | Immigration Strategy Platform",
  description:
    "Immica helps individuals navigate immigration pathways with intelligent eligibility assessments, pathway recommendations, and strategic immigration planning.",
  keywords: [
    "immigration",
    "visa eligibility",
    "immigration strategy",
    "pathway intelligence",
    "eligibility engine",
    "global mobility",
  ],
  authors: [{ name: "Immica" }],
  openGraph: {
    title: "Immica | Immigration Strategy Platform",
    description:
      "Discover your best immigration pathways with AI-powered eligibility and strategy tools.",
    siteName: "Immica",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ReduxProvider>
          <AssessmentModalProvider>
            <Navbar />
            {children}
            <ConditionalFooter />
          </AssessmentModalProvider>
        </ReduxProvider>
        <Toaster />
      </body>
    </html>
  );
}
