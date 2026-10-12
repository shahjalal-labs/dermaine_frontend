/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCreateUserMutation } from "@/redux/api/userApi";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { z } from "zod";
import InputField from "../ui/InputField";
import AuthWrapper from "./AuthWrapper";

const registerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);

  const [createUser] = useCreateUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setApiError(null);
      setApiSuccess(null);

      const payload = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      };

      const result = await createUser(payload).unwrap();

      if (result) {
        setApiSuccess("Registration successful! ");
        Cookies.set("verifyEmail", data.email, { expires: 1 / 24 });
        router.push("/verify-otp");
      }
    } catch (error: any) {
      // Handle API errors (e.g., email already exists, invalid password)
      const errorMessage =
        error?.data?.message || error?.message || "Registration failed";
      setApiError(errorMessage);
    }
  };

  return (
    <AuthWrapper>
      <div className="flex flex-col gap-6 poppins ">
        <div className="flex bg-[#EEF8EF] p-1 rounded-lg w-3/4 mx-auto mb-2">
          <Link
            href="/login"
            className="w-1/2 text-center py-3 rounded-md text-base md:text-lg font-medium text-title"
          >
            Login
          </Link>
          <div className="w-1/2 bg-background shadow-sm text-center py-3 rounded-md text-base md:text-lg font-medium text-title">
            Sign-up
          </div>
        </div>

        <div className="text-left">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-title mb-2 tracking-tight caros ">
            Create Your Account
          </h1>
          <p className="text-base md:text-lg text-description poppins ">
            Create account and enjoy all services
          </p>
        </div>

        {apiError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center">
            {apiError}
          </div>
        )}
        {apiSuccess && (
          <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm text-center">
            {apiSuccess}
          </div>
        )}

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <InputField
            label="Name"
            type="text"
            placeholder="John Doe"
            error={errors.fullName?.message}
            {...register("fullName")}
          />

          <InputField
            label="Email Address"
            type="email"
            placeholder="name@legacy.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <InputField
            label="Password"
            type="password"
            placeholder="••••••••••••"
            error={errors.password?.message}
            {...register("password")}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full poppins  cursor-pointer  bg-primary text-primary-foreground rounded-lg py-3 text-base md:text-lg font-normal uppercase hover:opacity-90 transition-opacity mt-4 tracking-wider disabled:opacity-50"
          >
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className="space-y-12">
          <div className="relative mt-2 ">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-base">
              <span className="bg-[#EEF8EF] px-8 py-1 rounded text-title font-medium poppins ">
                Or
              </span>
            </div>
          </div>

          <button
            type="button"
            className="poppins  mt-4 w-full flex items-center justify-center gap-2 py-3 px-6 cursor-pointer  rounded-lg border border-border text-base md:text-lg font-medium hover:opacity-90 transition-opacity"
          >
            <FcGoogle size={28} />
            Continue with Google
          </button>
        </div>
      </div>
    </AuthWrapper>
  );
}
