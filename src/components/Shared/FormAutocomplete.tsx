/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Country } from "country-state-city";
import React from "react";
import { useController, useFormContext } from "react-hook-form";
import Select, { components, InputProps } from "react-select";

export interface FormAutocompleteProps {
  name: string;
  label: React.ReactNode;
  apiEndpoint?: string | null;
  placeholder?: string;
  className?: string;
  isMulti?: boolean;
}

const CustomInput = (props: InputProps) => {
  return (
    <components.Input 
      {...props} 
      autoComplete="new-password" 
      autoCorrect="off" 
      spellCheck="false" 
    />
  );
};

export default function FormAutocomplete({
  name,
  label,
  placeholder,
  className,
  isMulti = true,
}: FormAutocompleteProps) {
  const { control } = useFormContext();
  const {
    field: { onChange, value, ref: rhfRef },
    fieldState: { error: rhfError },
  } = useController({ name, control });

  // Occupation questions are handled by OccupationSearchField (full NOC 2021
  // dataset, server-side); this component is the country picker.
  const options = React.useMemo(() => {
    return Country.getAllCountries().map((country) => ({
      label: country.name,
      value: country.name,
    }));
  }, []);

  const selectedOption = React.useMemo(() => {
    if (Array.isArray(value)) {
      return options.filter((o) => value.includes(o.value));
    }
    return options.find((o) => o.value === value) || null;
  }, [value, options]);

  const labelClass =
    "block mb-2 text-base md:text-xl font-medium text-gray-900";

  // Customize react-select styles to match the existing input look
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      padding: "0.25rem 0",
      borderRadius: "0.5rem",
      borderColor: rhfError
        ? "#ef4444"
        : state.isFocused
          ? "#22c55e"
          : "#e5e7eb",
      boxShadow: state.isFocused
        ? rhfError
          ? "0 0 0 1px #ef4444"
          : "0 0 0 1px #22c55e"
        : "none",
      "&:hover": {
        borderColor: rhfError
          ? "#ef4444"
          : state.isFocused
            ? "#22c55e"
            : "#e5e7eb",
      },
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: "0 1rem",
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "#9ca3af",
    }),
    input: (provided: any) => ({
      ...provided,
      margin: 0,
      padding: 0,
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: "#86efac", // match the green from Figma
      borderRadius: "0.5rem", // more rounded
      padding: "2px",
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: "white", // white text
      fontWeight: 500,
      paddingLeft: "6px",
      paddingRight: "4px",
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: "white", // white icon
      cursor: "pointer",
      ":hover": {
        backgroundColor: "transparent",
        color: "#f3f4f6", // slightly dim on hover
      },
    }),
  };

  return (
    <div className={className}>
      <label className={labelClass}>{label}</label>
      <Select
        isMulti={isMulti}
        menuPlacement="bottom"
        options={options}
        value={selectedOption}
        onChange={(selected: any) => {
          if (!selected) {
            onChange(isMulti ? [] : "");
          } else if (Array.isArray(selected)) {
            onChange(selected.map((s) => s.value));
          } else {
            onChange(selected.value);
          }
        }}
        placeholder={placeholder || "Type and press enter"}
        isClearable
        isSearchable
        styles={customStyles}
        components={{
          Input: CustomInput,
          IndicatorSeparator: () => null,
          DropdownIndicator: (props) => (
            <div className="text-gray-400 px-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          ),
          ClearIndicator: (props) => (
            <div
              className="text-gray-400 hover:text-gray-600 px-2 cursor-pointer"
              onClick={props.innerProps.onClick}
              onMouseDown={props.innerProps.onMouseDown}
              onTouchEnd={props.innerProps.onTouchEnd}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </div>
          ),
        }}
        inputId={`autocomplete-${name}`}
        ref={rhfRef}
        classNamePrefix="react-select"
      />
      {rhfError && (
        <p className="mt-1 text-sm text-red-500">{rhfError.message}</p>
      )}
    </div>
  );
}
