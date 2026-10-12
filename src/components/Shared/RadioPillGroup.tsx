"use client";

import { cn } from "@/lib/utils";
import React, { forwardRef, useEffect, useState } from "react";

export interface RadioPillGroupProps {
  label: string;
  options: { label: string; value: string }[];
  defaultValue?: string | null;
  value?: string | null;
  onChange?: (value: string) => void;
  className?: string;
  error?: string;
  hideIcon?: boolean;
}

const RadioPillGroup = forwardRef<HTMLDivElement, RadioPillGroupProps>(
  ({ label, options, defaultValue = null, value: externalValue, onChange, className, error, hideIcon }, ref) => {
    const [internalValue, setInternalValue] = useState<string | null>(
      externalValue !== undefined ? externalValue : defaultValue
    );

    useEffect(() => {
      if (externalValue !== undefined) {
        setInternalValue(externalValue);
      }
    }, [externalValue]);

    const labelClass = "block mb-3 text-base md:text-xl font-medium text-gray-900";

    const handleSelect = (newValue: string) => {
      setInternalValue(newValue);
      onChange?.(newValue);
    };

    return (
      <div className={cn("w-full", className)} ref={ref}>
        <label className={labelClass}>{label}</label>
        <div className="flex flex-wrap items-center gap-4">
          {options.map((opt) => {
            const isSelected = internalValue === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={cn(
                  "flex items-center gap-3 px-5 py-3 rounded-lg font-medium transition-colors border text-[15px]",
                  isSelected
                    ? "bg-[#04a742] border-[#04a742] text-white"
                    : "bg-white border-gray-200 text-gray-400 hover:bg-gray-50",
                  error && "border-red-500",
                  hideIcon && "flex-1 justify-center w-full"
                )}
              >
                {/* Radio circle */}
                {!hideIcon && (
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border flex items-center justify-center shrink-0",
                      isSelected ? "border-white" : "border-gray-400"
                    )}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                )}
                {/* Label */}
                <span className={cn("text-center", hideIcon ? "w-full" : "")}>{opt.label}</span>
              </button>
            );
          })}
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

RadioPillGroup.displayName = "RadioPillGroup";
export default RadioPillGroup;
