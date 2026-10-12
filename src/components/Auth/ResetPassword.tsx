/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useSendOtpMutation } from "@/redux/api/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import InputField from "../ui/InputField";
import AuthWrapper from "./AuthWrapper";

const resetSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

type ResetFormValues = z.infer<typeof resetSchema>;

export default function ResetPassword() {
  const router = useRouter();
  const [sendOtp] = useSendOtpMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ResetFormValues) => {
    try {
      const res = await sendOtp(data).unwrap();

      if (res) {
        toast.success("OTP sent successfully");
        Cookies.set("verifyEmail", data.email);
        router.push("/verify-otp");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <AuthWrapper>
      <div className="flex flex-col gap-6 poppins ">
        <div className="">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-title mb-2 tracking-tight caros ">
            Reset Your Password
          </h1>
          <p className="text-base md:text-lg text-description poppins ">
            Enter your email to get a verification code.
          </p>
        </div>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <InputField
            label="Email Address"
            type="email"
            placeholder="name@legacy.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full poppins  cursor-pointer  bg-primary text-primary-foreground rounded-lg py-3 text-base md:text-lg font-normal uppercase hover:opacity-90 transition-opacity mt-4 tracking-wider disabled:opacity-50"
          >
            {isSubmitting ? "Sending..." : "Send Code"}
          </button>
        </form>
      </div>
    </AuthWrapper>
  );
}
