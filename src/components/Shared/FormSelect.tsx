import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import React, { forwardRef } from "react";
import { useController, useFormContext } from "react-hook-form";

export interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: React.ReactNode;
  options: { label: string; value: string }[];
  placeholder?: string;
  containerClassName?: string;
  error?: string;
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    {
      label,
      options,
      placeholder,
      className,
      containerClassName,
      error,
      name,
      ...props
    },
    ref
  ) => {
    const inputClass =
      "w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 text-description placeholder-description bg-white appearance-none text-base md:text-xl";
    const labelClass =
      "block mb-2 text-base md:text-xl font-medium text-gray-900";

    const fallbackName = React.useId();
    const resolvedName = name || fallbackName;

    const { control } = useFormContext();
    const {
      field: { onChange, onBlur, value, ref: rhfRef },
      fieldState: { error: rhfError },
    } = useController({ name: resolvedName, control });

    const fieldError = error || rhfError?.message;

    return (
      <div className={containerClassName}>
        <label className={labelClass}>{label}</label>
        <div className="relative">
          <select
            name={resolvedName}
            value={value || ""}
            onChange={onChange}
            onBlur={onBlur}
            className={cn(
              inputClass,
              fieldError
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-gray-200",
              className
            )}
            {...props}
            ref={(e) => {
              rhfRef(e);
              if (typeof ref === "function") {
                ref(e);
              } else if (ref) {
                ref.current = e;
              }
            }}
          >
            {placeholder && (
              <option value="" disabled hidden={options.length > 0}>
                {options.length > 0 ? placeholder : "Please select a test first"}
              </option>
            )}
            {options.map((opt, i) => (
              <option key={i} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none stroke-[1.5]" />
        </div>
        {fieldError && (
          <p className="mt-1 text-sm text-red-500">{fieldError}</p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";
export default FormSelect;
