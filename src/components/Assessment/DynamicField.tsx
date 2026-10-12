import CheckboxPillGroup from "@/components/Shared/CheckboxPillGroup";
import FormAutocomplete from "@/components/Shared/FormAutocomplete";
import FormInput from "@/components/Shared/FormInput";
import FormSelect from "@/components/Shared/FormSelect";
import FormTextarea from "@/components/Shared/FormTextarea";
import FormDatePicker from "@/components/Shared/FormDatePicker";
import OccupationSearchField from "@/components/Shared/OccupationSearchField";
import YesNoToggle from "@/components/Shared/YesNoToggle";
import { Question } from "@/types/assessment";
import { Info } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { useState } from "react";

export interface DynamicFieldProps {
  question: Question;
  namePrefix?: string;
}

/**
 * Occupation-shaped questions ("What type of job is this?") get the NOC 2021
 * search field. Same heuristic the previous NOC autocomplete used, so nothing
 * that matched before stops matching.
 */
function isOccupationQuestion(question: Question): boolean {
  const haystack = `${question.questionId} ${question.questionText}`.toLowerCase();
  return (
    haystack.includes("job") ||
    haystack.includes("noc") ||
    haystack.includes("occupation")
  );
}

export default function DynamicField({
  question,
  namePrefix,
}: DynamicFieldProps) {
  const { control } = useFormContext();
  const [showTooltip, setShowTooltip] = useState(false);

  const inputTypeToRender = question.inputType;

  const questionId = question.questionId;
  const finalName = namePrefix ? `${namePrefix}.${questionId}` : questionId;
  let questionText = question.questionText;

  // Question text overrides based on client feedback
  if (questionText.toLowerCase().includes("select any options that apply to you")) {
    questionText = "Which of the following LMIA-exempt work permit options may apply to you? Select all that apply. You may select more than one option if you are unsure or believe you may qualify under multiple categories. Tap the ⓘ beside any option for a brief explanation. You do not need to know whether you qualify at this stage.";
  } else {
    const admissibilityKeywords = [
      "worked without authorization in canada",
      "overstayed your immigration status",
      "violated immigration conditions",
      "charged or convicted of a criminal offence",
      "refused a visa by another country"
    ];
    if (admissibilityKeywords.some(kw => questionText.toLowerCase().includes(kw))) {
      if (!questionText.toLowerCase().startsWith("have you")) {
        questionText = `Have you ${questionText.charAt(0).toLowerCase()}${questionText.slice(1)}`;
      }
    }
  }

  const options = question.options;

  const isOptional = question.isOptional === true;

  const requiredIndicator = !isOptional ? (
    <span className="text-red-500">&nbsp;*</span>
  ) : (
    <span className="text-gray-400 text-[13px] font-normal">&nbsp;(Optional)</span>
  );

  const labelNode = (
    <span className="inline relative">
      <span className="inline">{questionText}</span>{requiredIndicator}
      {question.helpText && (
        <span 
          className="text-gray-400 hover:text-primary cursor-help relative group inline-flex items-center transition-colors ml-2 align-middle"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowTooltip(!showTooltip); }}
          onBlur={() => setShowTooltip(false)}
          tabIndex={0}
        >
          <Info className="w-[18px] h-[18px] pointer-events-none" />
          
          {/* Custom Tooltip */}
          <span className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-max max-w-[280px] px-4 py-3 bg-gray-900 text-white text-sm font-normal leading-relaxed rounded-xl shadow-2xl transition-all duration-300 z-[9999] break-words pointer-events-none ${showTooltip ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0'}`}>
            {question.helpText}
            {/* Tooltip Arrow */}
            <span className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-gray-900"></span>
          </span>
        </span>
      )}
    </span>
  );

  switch (inputTypeToRender) {
    case "TEXT":
    case "EMAIL":
    case "PHONE":
    case "DATE":
    case "NUMBER": {
      let inputTypeProp = "text";
      if (question.inputType === "EMAIL") inputTypeProp = "email";
      else if (question.inputType === "PHONE") inputTypeProp = "tel";
      else if (question.inputType === "DATE") inputTypeProp = "date";
      else if (question.inputType === "NUMBER") inputTypeProp = "number";

      if (question.inputType === "TEXT" && isOccupationQuestion(question)) {
        return (
          <OccupationSearchField
            name={finalName}
            label={labelNode}
            placeholder={question.placeholder || "Start typing your job title"}
          />
        );
      }

      if (question.inputType === "DATE") {
        return (
          <FormDatePicker
            name={finalName}
            label={labelNode}
            placeholder={questionText}
          />
        );
      }

      return (
        <FormInput
          name={finalName}
          label={labelNode}
          type={inputTypeProp}
          placeholder={questionText}
          min={question.inputType === "NUMBER" ? "0" : undefined}
          onKeyDown={(e) => {
            if (question.inputType === "NUMBER" && e.key === "-") {
              e.preventDefault();
            }
          }}
          onInput={(e) => {
            if (question.inputType === "PHONE") {
              e.currentTarget.value = e.currentTarget.value.replace(
                /[^0-9+]/g,
                ""
              );
            }
            if (question.inputType === "NUMBER") {
              const val = parseFloat(e.currentTarget.value);
              if (!isNaN(val) && val < 0) {
                e.currentTarget.value = "0";
              }
            }
          }}
        />
      );
    }

    case "SELECT": {
      if (question.isCountry) {
        return (
          <FormAutocomplete
            name={finalName}
            label={labelNode}
            placeholder={question.placeholder || questionText}
            isMulti={false}
          />
        );
      }

      const selectOptions =
        options?.map((opt) => ({
          label: opt.label,
          value: opt.value,
        })) || [];

      const customPlaceholder = question.placeholder || questionText;

      return (
        <FormSelect
          name={finalName}
          label={labelNode}
          options={selectOptions}
          placeholder={customPlaceholder}
        />
      );
    }

    case "MULTI_SELECT": {
      if (question.isCountry) {
        return (
          <FormAutocomplete
            name={finalName}
            label={labelNode}
            placeholder={question.placeholder || questionText}
            isMulti={true}
          />
        );
      }

      const multiOptions =
        options?.map((opt) => ({
          label: opt.label,
          value: opt.value,
          helpText: opt.helpText,
        })) || [];

      return (
        <Controller
          control={control}
          name={finalName}
          defaultValue={[]}
          render={({ field, fieldState }) => (
            <CheckboxPillGroup
              label={labelNode}
              options={multiOptions}
              value={Array.isArray(field.value) ? field.value : []}
              onChange={(vals) => {
                field.onChange(vals);
                field.onBlur();
              }}
              error={fieldState.error?.message}
            />
          )}
        />
      );
    }

    case "AUTOCOMPLETE":
      if (!question.isCountry && isOccupationQuestion(question)) {
        return (
          <OccupationSearchField
            name={finalName}
            label={labelNode}
            placeholder={question.placeholder || "Start typing your job title"}
          />
        );
      }

      return (
        <FormAutocomplete
          name={finalName}
          label={labelNode}
          apiEndpoint={question.apiEndpoint}
          placeholder={questionText}
        />
      );

    case "BOOLEAN":
      return <YesNoToggle name={finalName} label={labelNode} />;

    case "TEXTAREA":
      return (
        <FormTextarea
          name={finalName}
          label={labelNode}
          placeholder={question.placeholder || questionText}
          rows={question.rows || 5}
          maxLength={question.maxLength || 5000}
        />
      );

    default:
      return null;
  }
}
