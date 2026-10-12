"use client";

import ActionButton from "@/components/Shared/ActionButton";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/hooks";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const options = [
  {
    label: "Apply for Permanent Residence",
    href: "/assessment/permanent-residence",
  },
  { label: "Study in Canada", href: "/assessment/study" },
  { label: "Work in Canada", href: "/assessment/work" },
  { label: "Apply to Join Family in Canada", href: "/assessment/family" },
];

export default function AssessmentModal({
  isOpen,
  onClose,
}: AssessmentModalProps) {
  const router = useRouter();
  // Use Redux persisted token — avoids cookie path/race-condition issues
  const token = useAppSelector((state) => state.auth.token);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  if (!isOpen) return null;

  const toggleOption = (optionLabel: string) => {
    setSelectedOptions((prev) =>
      prev.includes(optionLabel) ? [] : [optionLabel]
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[32px] w-full max-w-180 p-8 md:p-12 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[28px] md:text-[36px] font-bold caros text-title mb-8 text-center md:text-left leading-[1.2]">
          What would you like to do in Canada?
        </h2>

        <div className="flex flex-col gap-4 mb-10">
          {options.map((option) => {
            const isSelected = selectedOptions.includes(option.label);
            return (
              <button
                key={option.label}
                onClick={() => toggleOption(option.label)}
                className="flex items-center gap-4 w-full text-left cursor-pointer group"
              >
                <div
                  className={cn(
                    "w-5 h-5 md:w-6 md:h-6 rounded flex items-center justify-center transition-colors shrink-0 border-[1.5px]",
                    isSelected
                      ? "bg-primary border-primary"
                      : "border-gray-400 group-hover:border-gray-500 bg-white"
                  )}
                >
                  {isSelected && (
                    <Check
                      className="w-3.5 h-3.5 md:w-4 md:h-4 text-white"
                      strokeWidth={3}
                    />
                  )}
                </div>
                <span className="text-base md:text-lg text-description">
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end mt-4">
          <ActionButton
            variant="green"
            onClick={() => {
              onClose();
              if (selectedOptions.length > 0) {
                const selectedOption = options.find(
                  (o) => o.label === selectedOptions[0]
                );

                if (!token) {
                  router.push("/login");
                } else if (selectedOption?.href) {
                  router.push(selectedOption.href);
                }
              }
            }}
            className="px-8 py-3 text-base md:text-lg hover:bg-green-50 font-semibold rounded-lg"
          >
            Continue
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
