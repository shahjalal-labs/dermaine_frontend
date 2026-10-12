"use client";

import { CheckCircle2, ArrowRight, Home, Calendar } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function AssessmentCompletedPage() {
  const params = useParams();
  const rawId = params.assessmentId as string;

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-gray-100 shadow-xl p-8 md:p-12 text-center relative overflow-hidden">
        {/* Decorative background glow */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-40"
          style={{ background: "radial-gradient(circle, rgba(0,166,62,0.3) 0%, transparent 70%)" }}
        />

        {/* Success Icon */}
        <div className="relative inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-green-50 border-8 border-green-100/60 mb-8 animate-in zoom-in duration-500">
          <CheckCircle2
            className="w-10 h-10 md:w-12 md:h-12"
            style={{ color: "#00a63e" }}
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 caros">
          Assessment Submitted Successfully!
        </h1>

        {/* Description */}
        <p className="text-base md:text-lg text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed poppins">
          Thank you for completing your immigration assessment. Our team of experts will carefully evaluate your profile and contact you with your personalized pathways and eligibility results.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 poppins">
          <Link
            href="/book-consultation"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-medium text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
            style={{ backgroundColor: "#00a63e" }}
          >
            <Calendar className="w-4 h-4" />
            Book a Consultation
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <Home className="w-4 h-4" />
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
