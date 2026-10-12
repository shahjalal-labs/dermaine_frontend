/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useResetPasswordMutation } from "@/redux/api/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import InputField from "../ui/InputField";
import AuthWrapper from "./AuthWrapper";

const newPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type NewPasswordFormValues = z.infer<typeof newPasswordSchema>;

export default function NewPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordSchema),
    mode: "onChange",
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [resetPassword] = useResetPasswordMutation();
  const router = useRouter();

  const onSubmit = async (data: NewPasswordFormValues) => {
    try {
      const token = Cookies.get("forgetToken");

      if (!token) {
        toast.error("Session expired. Please verify OTP again.");
        router.push("/reset-password");
        return;
      }

      const res = await resetPassword({
        data: { newPassword: data.newPassword },
        token,
      }).unwrap();

      if (res) {
        toast.success(res?.message || "Password reset successfully!");
        Cookies.remove("forgetToken");
        router.push("/login");
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.message || "Failed to reset password"
      );
    }
  };

  return (
    <AuthWrapper>
      <div className="flex flex-col gap-6 poppins ">
        <div className="">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-title mb-2 tracking-tight caros ">
            Create New Password
          </h1>
          <p className="text-base md:text-lg text-description poppins ">
            Your password must be different from previous used password
          </p>
        </div>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <InputField
            label="New Password"
            type="password"
            placeholder="••••••••••••"
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />

          <InputField
            label="Confirm Password"
            type="password"
            placeholder="••••••••••••"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full poppins  cursor-pointer  bg-primary text-primary-foreground rounded-lg py-3 text-base md:text-lg font-normal uppercase hover:opacity-90 transition-opacity mt-4 tracking-wider disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>

        <p className="text-center text-base text-description mt-2">
          <Link
            href="/login"
            className="text-description font-normal hover:underline"
          >
            Back to Log in
          </Link>
        </p>
      </div>
    </AuthWrapper>
  );
}
