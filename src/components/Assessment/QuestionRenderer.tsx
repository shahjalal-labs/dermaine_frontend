/* eslint-disable @typescript-eslint/no-explicit-any */
import YesNoToggle from "@/components/Shared/YesNoToggle";
import { isQuestionVisible } from "@/lib/assessmentUtils";
import { Group, Question } from "@/types/assessment";
import React, { useEffect, useRef } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import DynamicField from "./DynamicField";

export interface QuestionRendererProps {
  title: string;
  questions: Question[];
  groups?: Group[];
  allQuestions?: Question[];
}

export default function QuestionRenderer({
  title,
  questions,
  groups = [],
  allQuestions = [],
}: QuestionRendererProps) {
  const { watch, setValue, getValues } = useFormContext();
  const formValues = watch(); // Watch all fields to re-evaluate conditions on change
  const repeatableGroups = groups.filter((g) => g.isRepeatable);
  const repeatableGroupIds = repeatableGroups.map((g) => g.id);

  const allAssessmentQuestions =
    allQuestions && allQuestions.length > 0 ? allQuestions : questions;

  const mainQuestionsRaw = questions.filter(
    (q) => !q.groupId || !repeatableGroupIds.includes(q.groupId)
  );

  // Filter main questions based on conditional visibility
  const visibleQuestions = mainQuestionsRaw.filter((q) => {
    return isQuestionVisible(q, formValues, allAssessmentQuestions);
  });

  const hiddenQuestions = mainQuestionsRaw.filter(
    (q) => !visibleQuestions.includes(q)
  );

  // Clear values for questions that are conditionally hidden
  useEffect(() => {
    hiddenQuestions.forEach((q) => {
      const currentValue = getValues(q.questionId);
      if (
        currentValue !== undefined &&
        currentValue !== null &&
        currentValue !== ""
      ) {
        setValue(q.questionId, "", { shouldValidate: true });
      }
    });
  }, [hiddenQuestions, getValues, setValue]);

  // Sort visible questions by order
  const sortedQuestions = [...visibleQuestions].sort((a, b) => {
    return (a.order || 0) - (b.order || 0);
  });

  return (
    <div className="bg-background flex justify-center pt-8 pb-16 md:pb-24">
      <div className="w-full max-w-6xl px-6">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 caros text-title">
          {title}
        </h1>
        <div className="h-1 w-20 bg-primary rounded-full mb-8"></div>

        <div className="space-y-8 poppins">
          {(() => {
            const cleanTitle = title.trim().toLowerCase();
            const isLanguageSkills =
              cleanTitle.includes("language") ||
              questions.some((q) =>
                q.questionType?.toLowerCase().includes("language")
              );

            return (
              <div
                className={`grid grid-cols-1 ${
                  isLanguageSkills ? "md:grid-cols-4" : "md:grid-cols-2"
                } gap-8`}
              >
                {sortedQuestions.map((question) => {
                  const qText = question.questionText.toLowerCase().trim();
                  const isScore =
                    ["writing", "reading", "speaking", "listening"].includes(
                      qText
                    ) ||
                    ["writing", "reading", "speaking", "listening"].some(
                      (skill) => qText.endsWith(` ${skill}`) || qText === skill
                    );

                  let colSpanClass = "col-span-1 md:col-span-1";
                  if (isLanguageSkills) {
                    if (isScore) {
                      colSpanClass = "col-span-1 md:col-span-1";
                    } else if (
                      qText.startsWith("which") ||
                      qText.includes("which")
                    ) {
                      colSpanClass =
                        "col-span-1 md:col-span-4 md:w-1/2 md:pr-3";
                    } else {
                      colSpanClass = "col-span-1 md:col-span-4";
                    }
                  } else if (question.inputType === "MULTI_SELECT") {
                    colSpanClass = "col-span-1 md:col-span-2";
                  } else if (question.inputType === "TEXTAREA") {
                    // TEXTAREA fields should span full width for better UX
                    colSpanClass = "col-span-1 md:col-span-2";
                  } else {
                    colSpanClass = "col-span-1 md:col-span-1";
                  }

                  return (
                    <React.Fragment key={`wrapper-${question.id}`}>
                      <div
                        key={question.id}
                        className={`${colSpanClass} ${
                          question.inputType === "BOOLEAN"
                            ? "flex flex-col justify-start"
                            : ""
                        }`}
                      >
                        <DynamicField question={question} />
                      </div>

                      {/* Render any repeatable groups that depend on this question right underneath it */}
                      {repeatableGroups.map((group) => {
                        const groupQuestions = questions.filter((q) => q.groupId === group.id);
                        if (groupQuestions.length === 0) return null;
                        
                        const firstDep = groupQuestions.find((q) => q.dependsOnQuestionId);
                        if (!firstDep || (firstDep.dependsOnQuestionId !== question.id && firstDep.dependsOnQuestionId !== question.questionId)) {
                          return null;
                        }
                        
                        return (
                          <RepeatableGroupRenderer
                            key={`inline-group-${group.id}`}
                            group={group}
                            questions={groupQuestions}
                            allQuestions={allAssessmentQuestions}
                            formValues={formValues}
                          />
                        );
                      })}
                    </React.Fragment>
                  );
                })}
                {/* Render repeatable groups that don't explicitly depend on a specific main question */}
                {repeatableGroups.map((group) => {
                  const groupQuestions = questions.filter(
                    (q) => q.groupId === group.id
                  );
                  if (groupQuestions.length === 0) return null;

                  const firstDep = groupQuestions.find((q) => q.dependsOnQuestionId);
                  const isDependentOnMain = firstDep && sortedQuestions.some((q) => q.id === firstDep.dependsOnQuestionId || q.questionId === firstDep.dependsOnQuestionId);
                  
                  if (isDependentOnMain) return null; // Already rendered inline

                  return (
                    <RepeatableGroupRenderer
                      key={group.id}
                      group={group}
                      questions={groupQuestions}
                      allQuestions={allAssessmentQuestions}
                      formValues={formValues}
                    />
                  );
                })}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

function RepeatableGroupRenderer({
  group,
  questions,
  allQuestions,
  formValues,
}: {
  group: Group;
  questions: Question[];
  allQuestions: Question[];
  formValues: Record<string, any>;
}) {
  const { control, watch } = useFormContext();
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: group.groupKey,
  });

  const initialized = useRef(false);

  // Determine if the group itself is "gated open" — check if at least one
  // question in the group is visible when we ignore the group-internal context.
  // If NO question would be visible (e.g. the gate is "No"), hide everything.
  const isGroupGateOpen = questions.some((q) =>
    isQuestionVisible(q, formValues, allQuestions)
  );

  // When the gate closes, wipe all instances so the card disappears.
  // When the gate opens again, seed one empty instance.
  useEffect(() => {
    if (!isGroupGateOpen) {
      initialized.current = false;
      if (fields.length > 0) {
        replace([]);
      }
      return;
    }
    if (fields.length === 0 && !initialized.current) {
      initialized.current = true;
      append({});
    }
  }, [isGroupGateOpen, fields.length, append, replace]);

  // Watch the entire group array to pass to isQuestionVisible for internal dependencies
  const groupValues = watch(group.groupKey) || [];

  // Don't render anything when the gate question is answered "No"
  if (!isGroupGateOpen) return null;

  return (
    <div className="col-span-1 md:col-span-2 space-y-8 mt-4">
      {fields.map((field, index) => {
        const localValues = groupValues[index] || {};
        const mergedValues = { ...formValues, ...localValues };

        // Filter visible questions for this specific instance
        const visibleGroupQuestions = questions.filter((q) =>
          isQuestionVisible(q, mergedValues, allQuestions)
        );

        if (visibleGroupQuestions.length === 0) return null;

        return (
          <div
            key={field.id}
            className="p-6 md:p-8 border border-gray-100 rounded-2xl bg-white shadow-sm relative"
          >
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-6 right-6 text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
              >
                Remove
              </button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {visibleGroupQuestions.map((q) => {
                let colSpanClass = "col-span-1 md:col-span-1";
                if (q.inputType === "MULTI_SELECT") {
                  colSpanClass = "col-span-1 md:col-span-2";
                }

                return (
                  <div
                    key={q.id}
                    className={`${colSpanClass} ${q.inputType === "BOOLEAN" ? "flex flex-col justify-start" : ""}`}
                  >
                    <DynamicField
                      question={q}
                      namePrefix={`${group.groupKey}.${index}`}
                    />
                  </div>
                );
              })}
            </div>

            {/* The 'add more' toggle at the bottom of the *last* instance */}
            {index === fields.length - 1 && (
              <div className="mt-8 pt-8 border-t border-gray-100">
                <YesNoToggle
                  label={`Do you want to add another ${group.title
                      ? group.title.toLowerCase().replace(/canada/g, "Canada").replace(/^([a-z]+)s\b/, "$1")
                      : "entry"
                    }?`}
                  onChange={(val) => {
                    if (val) append({});
                  }}
                  value={undefined}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
