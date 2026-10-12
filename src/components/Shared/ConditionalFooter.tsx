"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();

  const isAuthFlow =
    pathname?.includes("/login") ||
    pathname?.includes("/register") ||
    pathname?.includes("/reset-password") ||
    pathname?.includes("/new-password") ||
    pathname?.includes("/verify-otp");

  if (pathname?.includes("/assessment") || isAuthFlow) {
    return null;
  }

  return <Footer />;
}
