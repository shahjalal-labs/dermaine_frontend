"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAssessmentModal } from "@/context/AssessmentModalContext";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logOut, setUser } from "@/redux/ReduxFunction";
import Cookies from "js-cookie";
import ActionButton from "./ActionButton";

// navItems
const navItems = [
  { label: "Home", href: "/" },
  { label: "Pathways", href: "/pathways" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Resources", href: "/resources" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();
  const { openModal } = useAssessmentModal();
  const ifUser = !!token;
  const activeClass = "border-b-2 border-primary ";

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const cookieToken = Cookies.get("token");
    if (cookieToken && !token) {
      try {
        // Fallback: decode JWT if redux state was cleared but cookie remains
        const decoded = JSON.parse(atob(cookieToken.split(".")[1]));
        dispatch(
          setUser({
            token: cookieToken,
            role: decoded.role || "",
            email: decoded.email || null,
          })
        );
      } catch {
        dispatch(setUser({ token: cookieToken, role: "", email: null }));
      }
    }
  }, [dispatch, token]);

  const logout = () => {
    dispatch(logOut());
    Cookies.remove("token");
    router.push("/login");
  };

  return (
    <header className="w-full bg-background py-2 sticky top-0 z-50 backdrop-md border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/">
            <div className="shrink-0 flex items-center gap-2 cursor-pointer">
              <div className="bg-primary text-white rounded-md w-9 h-9 flex items-center justify-center font-bold text-base">
                IM
              </div>
              <span className="font-extrabold text-xl tracking-wide text-foreground">
                IMMICA
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-12 h-full">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (pathname.startsWith(item.href) && item.href !== "/");

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center h-full text-base font-medium hover:text-primary transition-colors text-foreground"
                >
                  <span
                    className={`pb-1 ${isActive ? activeClass : "border-b-2 border-transparent"}`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right side area */}
          <div className="flex items-center gap-4">
            {/* Desktop right side buttons */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-3">
              {!ifUser && (
                <Link
                  href="/login"
                  className="text-base font-medium text-foreground bg-transparent cursor-pointer border border-input px-5 py-2.5 rounded-lg hover:bg-card transition-colors shadow-sm"
                >
                  Log in
                </Link>
              )}
              {ifUser && (
                <button
                  onClick={logout}
                  className="text-base font-medium text-foreground bg-transparent cursor-pointer border border-input px-5 py-2.5 rounded-lg hover:bg-card transition-colors shadow-sm"
                >
                  Logout
                </button>
              )}
              <button
                onClick={openModal}
                className="text-base font-medium text-primary-foreground bg-primary px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
              >
                Get started
              </button>
            </div>

            {/* Mobile Menu & Action Button */}
            <div className="lg:hidden flex items-center gap-2">
              {!isMobileMenuOpen && (
                <ActionButton
                  onClick={openModal}
                  className="px-4 py-2 text-sm font-medium"
                >
                  Get Started
                </ActionButton>
              )}
              <button
                className="p-2 text-foreground hover:bg-muted rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown Backdrop */}
      <div
        className={`lg:hidden fixed inset-0 top-20 bg-background/50 backdrop-blur-sm transition-opacity duration-300 z-[-1] ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Navigation Dropdown */}
      <div
        className={`lg:hidden absolute top-full inset-x-0 bg-white border-b border-border shadow-xl transition-all duration-300 ease-in-out overflow-hidden flex flex-col ${
          isMobileMenuOpen
            ? "max-h-[calc(100dvh-5rem)] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="overflow-y-auto flex flex-col">
          <div className="px-6 py-6 flex flex-col gap-6">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <div key={item.label} className="flex flex-col gap-2">
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-lg font-medium transition-colors ${
                      pathname === item.href
                        ? "text-primary"
                        : "text-foreground hover:text-primary"
                    }`}
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          <div className="px-6 pb-6 pt-0 flex flex-col gap-4">
            <div className="border-t border-border pt-6 flex flex-col gap-4">
              {!ifUser ? (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center text-base font-medium text-foreground bg-white border border-input px-5 py-3 rounded-lg hover:bg-muted transition-colors shadow-sm"
                >
                  Log in
                </Link>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-center text-base font-medium text-foreground bg-white border border-input px-5 py-3 rounded-lg hover:bg-muted transition-colors shadow-sm"
                >
                  Logout
                </button>
              )}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openModal();
                }}
                className="w-full text-center text-base font-medium text-primary-foreground bg-primary px-5 py-3 rounded-lg hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
              >
                Get started
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
