import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";
import { useController, useFormContext } from "react-hook-form";

export interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: React.ReactNode;
  icon?: React.ReactNode;
  containerClassName?: string;
  error?: string;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  (
    { label, icon, className, containerClassName, error, name, ...props },
    ref
  ) => {
    const textareaClass =
      "w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-description placeholder-description bg-white text-base md:text-lg font-normal leading-relaxed resize-vertical min-h-32 transition-all duration-200";
    const labelClass =
      "block mb-2 text-base md:text-lg font-medium text-gray-900";

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
          <textarea
            name={resolvedName}
            value={value || ""}
            onChange={onChange}
            onBlur={onBlur}
            className={cn(
              textareaClass,
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
          />
          {icon && (
            <div className="absolute right-4 top-4 pointer-events-none text-gray-400">
              {icon}
            </div>
          )}
        </div>
        {fieldError && (
          <p className="mt-1 text-sm text-red-500">{fieldError}</p>
        )}
      </div>
    );
  }
);

FormTextarea.displayName = "FormTextarea";
export default FormTextarea;
