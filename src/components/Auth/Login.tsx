/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useUserLoginMutation } from "@/redux/api/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/ReduxFunction";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { z } from "zod";
import InputField from "../ui/InputField";
import AuthWrapper from "./AuthWrapper";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be at most 32 characters")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const [loginUser] = useUserLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const dispatch = useAppDispatch();
  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await loginUser(data).unwrap();
      const token = response?.data?.accessToken;

      console.log(response);
      console.log("token",token);


      if (token) {
        Cookies.set("token", token, { path: "/" });
        dispatch(
          setUser({
            role: response?.result?.role || "",
            token: token,
            email: response?.result?.email || data.email,
            me: response?.result?.me || null,
          })
        );
      }
      toast.success("Logged in successfully");
      window.location.href = "/";
    } catch (error: any) {
      if (error?.data?.message) {
        toast.error(error.data.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Invalid credentials or login failed.");
      }
    }
  };

  return (
    <AuthWrapper>
      <div className="flex flex-col gap-6 ">
        <div className="flex bg-[#EEF8EF] p-1 rounded-lg w-3/4 mx-auto mb-2 poppins ">
          <div className="w-1/2 bg-background shadow-sm text-center py-3 rounded-md text-base md:text-lg font-medium text-title">
            Login
          </div>
          <Link
            href="/register"
            className="w-1/2 text-center py-3 rounded-md text-base md:text-lg font-medium text-title"
          >
            Sign-up
          </Link>
        </div>

        <div className="text-left">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-title mb-2 tracking-tight caros ">
            Welcome back to your legacy
          </h1>
          <p className="text-base md:text-lg text-description poppins ">
            Please authenticate to access your private vault.
          </p>
        </div>

        <form
          className="flex flex-col gap-4 poppins "
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

          <InputField
            label="Password"
            type="password"
            placeholder="••••••••••••"
            error={errors.password?.message}
            {...register("password")}
            rightElement={
              <Link
                href="/reset-password"
                className="text-sm font-semibold text-red-500 hover:underline relative z-10"
              >
                Forgot Password?
              </Link>
            }
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full poppins  cursor-pointer bg-primary text-primary-foreground rounded-lg py-3 text-base md:text-lg font-normal uppercase hover:opacity-90 transition-opacity mt-4 tracking-wider disabled:opacity-50"
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="space-y-12">
          <div className="relative mt-2 ">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-base">
              <span className="bg-[#EEF8EF] px-3 py-1 rounded text-title font-medium poppins ">
                Or Secure Login via
              </span>
            </div>
          </div>

          <button
            type="button"
            className="poppins  mt-4 w-full flex items-center justify-center gap-2 py-3 px-6 cursor-pointer rounded-lg border border-border text-base md:text-lg font-medium hover:opacity-90 transition-opacity"
          >
            <FcGoogle size={28} />
            Continue with Google
          </button>
        </div>
      </div>
    </AuthWrapper>
  );
}
