/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useOtpVerificationMutation } from "@/redux/api/authApi";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import AuthWrapper from "./AuthWrapper";

export default function VerifyOtp() {
  const router = useRouter();
  const [otpVerification] = useOtpVerificationMutation();
  const [otp, setOtp] = useState(["", "", "", ""]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(0, 1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim().slice(0, 4);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      if (i < 4) newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    // Auto-focus next empty input or the last input
    const nextIndex = Math.min(pastedData.length, 3);
    const nextInput = document.getElementById(`otp-${nextIndex}`);
    nextInput?.focus();
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalOtp = otp.join("");
    if (finalOtp.length < 4) {
      toast.error("Please enter a 4-digit code");
      return;
    }

    const email = Cookies.get("verifyEmail");
    if (!email) {
      toast.error("Session expired or email not found. Please try again.");
      return;
    }

    try {
      const result = await otpVerification({ email, otp: finalOtp }).unwrap();
      if (result?.result?.forgetToken) {
        Cookies.set("forgetToken", result.result.forgetToken);
      }
      toast.success(result?.message || "Verified successfully");
      router.push("/new-password");
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.message || "Failed to verify OTP"
      );
    }
  };

  return (
    <AuthWrapper>
      <div className="flex flex-col gap-6 poppins ">
        <div className="">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-title mb-2 tracking-tight caros ">
            Verification Code
          </h1>
          <p className="text-base md:text-lg text-description poppins ">
            Enter the 4-digit code sent to your email address.
          </p>
        </div>

        <form onSubmit={handleOtpVerification} className="flex flex-col gap-6">
          <div className="flex justify-center w-full gap-4 md:gap-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-14 h-14 md:w-16 md:h-16 text-center text-2xl md:text-3xl font-bold rounded-xl border-2 border-gray-200 bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200 text-title shadow-sm hover:border-gray-300"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full poppins  cursor-pointer  bg-primary text-primary-foreground rounded-lg py-3 text-base md:text-lg font-normal uppercase hover:opacity-90 transition-opacity mt-4 tracking-wider disabled:opacity-50"
          >
            Verify
          </button>
        </form>

        <p className="text-center text-base text-description">
          Didn&apos;t receive a code?{" "}
          <button
            type="button"
            className="text-primary font-medium hover:underline"
          >
            Resend
          </button>
        </p>
      </div>
    </AuthWrapper>
  );
}
