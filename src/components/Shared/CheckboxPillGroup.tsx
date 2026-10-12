"use client";

import { cn } from "@/lib/utils";
import { Check, Info } from "lucide-react";
import { forwardRef, ReactNode, SetStateAction, useEffect, useState } from "react";

export interface CheckboxPillGroupProps {
  label: ReactNode;
  options: { label: string; value: string; helpText?: string | null }[];
  defaultValue?: string[];
  value?: string[];
  onChange?: (value: string[]) => void;
  className?: string;
  error?: string;
  iconType?: "checkbox" | "radio";
}

const CheckboxPillGroup = forwardRef<HTMLDivElement, CheckboxPillGroupProps>(
  (
    {
      label,
      options,
      defaultValue = [],
      value: externalValue,
      onChange,
      className,
      error,
      iconType = "checkbox",
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState<string[]>(
      externalValue !== undefined ? externalValue : defaultValue
    );
    const [openTooltip, setOpenTooltip] = useState<string | null>(null);

    useEffect(() => {
      if (externalValue !== undefined) {
        setInternalValue(externalValue || []);
      }
    }, [externalValue]);

    const labelClass =
      "block mb-3 text-base md:text-xl font-medium text-gray-900";

    const handleSelect = (newValue: string) => {
      let updatedValue: string[];
      
      const isExclusive = (val: string) => {
        const lowerVal = val.toLowerCase();
        if (lowerVal === "none" || lowerVal === "none_of_the_above" || lowerVal === "not_sure" || lowerVal === "unsure" || lowerVal === "i_am_not_sure") {
          return true;
        }
        
        const option = options.find((o) => o.value === val);
        if (option) {
          const lowerLabel = option.label.toLowerCase();
          if (lowerLabel.includes("none of the above") || lowerLabel.includes("not sure") || lowerLabel.includes("unsure")) {
            return true;
          }
        }
        return false;
      };

      if (isExclusive(newValue)) {
        // If an exclusive option is selected, clear everything else
        if (internalValue.includes(newValue)) {
          updatedValue = [];
        } else {
          updatedValue = [newValue];
        }
      } else {
        // If a normal option is selected, remove any exclusive options
        if (internalValue.includes(newValue)) {
          updatedValue = internalValue.filter((v) => v !== newValue);
        } else {
          updatedValue = [
            ...internalValue.filter((v) => !isExclusive(v)),
            newValue,
          ];
        }
      }

      setInternalValue(updatedValue);
      onChange?.(updatedValue);
    };

    return (
      <div className={cn("w-full", className)} ref={ref}>
        <label className={labelClass}>{label}</label>
        <div className="flex flex-wrap items-center gap-4">
          {options.map((opt) => {
            const isSelected = internalValue.includes(opt.value);
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
                  error && "border-red-500"
                )}
              >
                {/* Icon */}
                {iconType === "radio" ? (
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
                ) : (
                  <div
                    className={cn(
                      "w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors",
                      isSelected ? "border-white bg-[#04a742]" : "border-gray-400"
                    )}
                  >
                    {isSelected && (
                      <Check className="w-3 h-3 text-white stroke-3" />
                    )}
                  </div>
                )}
                {opt.label}
                {opt.helpText && (
                  <span
                    className="relative group/tooltip inline-flex items-center ml-1 outline-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenTooltip(openTooltip === opt.value ? null : opt.value);
                    }}
                    onBlur={() => setOpenTooltip(null)}
                    tabIndex={0}
                  >
                    <Info
                      className={cn(
                        "w-[14px] h-[14px] shrink-0 transition-colors",
                        isSelected
                          ? "text-white/70 hover:text-white"
                          : "text-gray-300 hover:text-gray-500"
                      )}
                    />
                    {/* Option-level tooltip */}
                    <span className={cn(
                      "md:absolute md:bottom-full md:left-1/2 md:-translate-x-1/2 md:mb-3 md:w-max max-w-[260px] px-3 py-2.5 bg-gray-900 text-white text-xs font-normal leading-relaxed rounded-xl shadow-2xl transition-all duration-300 z-[999] pointer-events-none break-words whitespace-normal",
                      "max-md:fixed max-md:bottom-24 max-md:left-4 max-md:right-4 max-md:max-w-none max-md:text-center",
                      openTooltip === opt.value
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible translate-y-2 group-hover/tooltip:opacity-100 group-hover/tooltip:visible group-hover/tooltip:translate-y-0"
                    )}>
                      {opt.helpText}
                      <span className="hidden md:block absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-gray-900" />
                    </span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

CheckboxPillGroup.displayName = "CheckboxPillGroup";
export default CheckboxPillGroup;
