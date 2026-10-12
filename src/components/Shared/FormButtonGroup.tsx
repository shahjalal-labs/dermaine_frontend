"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface FormButtonGroupProps {
  label: string;
  name?: string;
  options: { label: string; value: string }[];
  defaultValue?: string | null;
  value?: string | null;
  onChange?: (value: string) => void;
  className?: string;
  error?: string;
}

export default function FormButtonGroup({
  label,
  name,
  options,
  defaultValue = null,
  value: externalValue,
  onChange,
  className,
  error,
}: FormButtonGroupProps) {
  const formContext = useFormContext();

  const renderGroup = (
    val: string | null | undefined,
    onChg: (v: string) => void,
    err: string | undefined
  ) => {
    const labelClass =
      "block mb-3 text-base md:text-xl font-medium text-gray-900";

    return (
      <div className={cn("w-full", className)}>
        <label className={labelClass}>{label}</label>
        <div className="flex flex-wrap items-center gap-4">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChg(opt.value)}
              className={cn(
                "flex-1 min-w-30 py-3 rounded-lg font-medium transition-colors border text-base md:text-lg text-center",
                val === opt.value
                  ? "bg-[#16a34a] border-[#16a34a] text-white"
                  : "bg-white border-gray-200 text-gray-400 hover:bg-gray-50",
                err && "border-red-500"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {err && <p className="mt-1 text-sm text-red-500">{err}</p>}
      </div>
    );
  };

  // Uncontrolled fallback
  const isControlled = externalValue !== undefined;
  const [internalValue, setInternalValue] = useState<string | null | undefined>(
    defaultValue
  );
  const currentValue = isControlled ? externalValue : internalValue;

  if (formContext && name) {
    return (
      <Controller
        control={formContext.control}
        name={name}
        defaultValue={formContext.getValues(name) ?? defaultValue}
        render={({ field, fieldState }) =>
          renderGroup(
            field.value,
            (val) => {
              field.onChange(val);
              onChange?.(val);
            },
            fieldState.error?.message || error
          )
        }
      />
    );
  }

  return renderGroup(
    currentValue,
    (val) => {
      if (!isControlled) setInternalValue(val);
      onChange?.(val);
    },
    error
  );
}
