/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

interface AssetButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "green";
  children: React.ReactNode;
  link?: string;
}

export default function AssetButton({
  variant = "primary",
  className,
  children,
  link,
  ...props
}: AssetButtonProps) {
  const baseStyles =
    "font-medium px-6 py-3 rounded-md poppins transition-all duration-200 cursor-pointer text-base md:text-lg hover:scale-[1.2] active:scale-[0.4] ";

  const variants = {
    primary: "bg-primary hover:opacity-90 text-primary-foreground",
    outline:
      "bg-transparent hover:bg-primary/10 text-black border border-primary/40",
    green: "bg-[#54B75B1A] text-primary shadow-md",
  };

  const combinedClassName = cn(baseStyles, variants[variant], className);

  if (link) {
    const { onClick } = props;
    return (
      <Link href={link} className={combinedClassName} onClick={onClick as any}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
}
