"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

export interface YesNoToggleProps {
  label: React.ReactNode;
  name?: string;
  defaultValue?: boolean | undefined;
  value?: boolean | undefined;
  onChange?: (value: boolean) => void;
  className?: string;
  error?: string;
}

export default function YesNoToggle({
  label,
  name,
  defaultValue = undefined,
  value: externalValue,
  onChange,
  className,
  error,
}: YesNoToggleProps) {
  const formContext = useFormContext();

  const renderToggle = (
    val: boolean | undefined,
    onChg: (v: boolean) => void,
    err: string | undefined
  ) => {
    const labelClass =
      "block mb-2 text-base md:text-xl font-medium text-gray-900";

    return (
      <div className={cn("w-full", className)}>
        <label className={labelClass}>{label}</label>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => onChg(true)}
            className={cn(
              "flex items-center justify-center gap-2 min-w-30 py-2.5 rounded-lg font-medium transition-colors border text-[15px]",
              val === true
                ? "bg-primary border-primary text-white"
                : "bg-white border-gray-200 text-gray-400 hover:bg-gray-50",
              err && "border-red-500"
            )}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => onChg(false)}
            className={cn(
              "flex items-center justify-center gap-2 min-w-30 py-2.5 rounded-lg font-medium transition-colors border text-[15px]",
              val === false
                ? "bg-primary border-primary text-white"
                : "bg-white border-gray-200 text-gray-400 hover:bg-gray-50",
              err && "border-red-500"
            )}
          >
            No
          </button>
        </div>
        {err && <p className="mt-1 text-sm text-red-500">{err}</p>}
      </div>
    );
  };

  // Uncontrolled fallback if not inside a form provider
  const isControlled = externalValue !== undefined;
  const [internalValue, setInternalValue] = useState<boolean | undefined>(
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
          renderToggle(
            field.value,
            (val) => {
              field.onChange(val);
              field.onBlur();
              onChange?.(val);
            },
            fieldState.error?.message || error
          )
        }
      />
    );
  }

  return renderToggle(
    currentValue,
    (val) => {
      if (!isControlled) setInternalValue(val);
      onChange?.(val);
    },
    error
  );
}
