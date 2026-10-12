/* eslint-disable @typescript-eslint/no-explicit-any */
import { isQuestionVisible } from "@/lib/assessmentUtils";
import { Group, Question } from "@/types/assessment";
import { z } from "zod";

export function generateDynamicSchema(
  questions: Question[],
  groups: Group[] = []
) {
  const schemaShape: Record<string, z.ZodTypeAny> = {};

  const repeatableGroups = groups.filter((g) => g.isRepeatable);
  const repeatableGroupIds = repeatableGroups.map((g) => g.id);

  const mainQuestions = questions.filter(
    (q) => !q.groupId || !repeatableGroupIds.includes(q.groupId)
  );

  // Helper to get base validator that accepts any primitive or empty value
  // so that superRefine handles all visibility-aware and required validations with custom messages
  const getBaseValidator = () => {
    return z
      .union([
        z.string(),
        z.number(),
        z.boolean(),
        z.array(z.any()),
        z.record(z.string(), z.any()),
        z.null(),
        z.undefined(),
      ])
      .optional();
  };

  // Helper functions for professional error messages
  const getFieldType = (inputType: string): string => {
    const typeMap: Record<string, string> = {
      TEXT: "text",
      PHONE: "phone number",
      NUMBER: "number",
      DATE: "date",
      SELECT: "selection",
      EMAIL: "email address",
      BOOLEAN: "selection",
      MULTI_SELECT: "selection",
      AUTOCOMPLETE: "selection",
      TEXTAREA: "text",
    };
    return typeMap[inputType] || "field";
  };

  const getRequiredMessage = (fieldType: string): string => {
    const messages: Record<string, string> = {
      text: "Please fill in this required field",
      "phone number": "Please enter your phone number",
      number: "Please enter a valid number",
      date: "Please select a date",
      "email address": "Please enter your email address",
      selection: "Please make a selection",
    };
    return messages[fieldType] || "This field is required";
  };

  const getSelectMessage = (): string => {
    return "Please select an option";
  };

  const getMultiSelectMessage = (): string => {
    return "Please select at least one option";
  };

  const getBooleanMessage = (): string => {
    return "Please select Yes or No";
  };

  const getGroupRequiredMessage = (title: string): string => {
    return `Please add at least one ${title.toLowerCase()}`;
  };

  // Add main questions to schema
  mainQuestions.forEach((q) => {
    schemaShape[q.questionId] = getBaseValidator();
  });

  // Handle repeatable groups
  repeatableGroups.forEach((g) => {
    const groupQuestions = questions.filter((q) => q.groupId === g.id);
    if (groupQuestions.length > 0) {
      const groupShape: Record<string, z.ZodTypeAny> = {};
      groupQuestions.forEach((q) => {
        groupShape[q.questionId] = getBaseValidator();
      });
      schemaShape[g.groupKey] = z.array(z.object(groupShape)).optional();
    }
  });

  return z.object(schemaShape).superRefine((data, ctx) => {
    // 1. Validate main questions
    mainQuestions.forEach((q) => {
      const isVisible = isQuestionVisible(q, data, questions);

      if (isVisible && q.isOptional !== true) {
        const actualInputType = q.inputType;
        const val = data[q.questionId];
        let isValid = true;
        let errorMessage = "This field is required";

        if (actualInputType === "BOOLEAN") {
          if (val !== true && val !== false) {
            isValid = false;
            errorMessage = getBooleanMessage();
          }
        } else if (actualInputType === "MULTI_SELECT") {
          if (!Array.isArray(val) || val.length === 0) {
            isValid = false;
            errorMessage = getMultiSelectMessage();
          }
        } else if (actualInputType === "SELECT") {
          if (val === undefined || val === null || String(val).trim() === "") {
            isValid = false;
            errorMessage = getSelectMessage();
          }
        } else if (actualInputType === "EMAIL") {
          if (val === undefined || val === null || String(val).trim() === "") {
            isValid = false;
            errorMessage = getRequiredMessage("email address");
          } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val).trim())
          ) {
            isValid = false;
            errorMessage = "Please enter a valid email address";
          }
        } else if (actualInputType === "AUTOCOMPLETE") {
          if (val === undefined || val === null || String(val).trim() === "") {
            isValid = false;
            errorMessage = getRequiredMessage("selection");
          }
          if (Array.isArray(val) && val.length === 0) {
            isValid = false;
            errorMessage = getMultiSelectMessage();
          }
        } else {
          if (val === undefined || val === null || String(val).trim() === "") {
            isValid = false;
            const fieldType = getFieldType(actualInputType);
            errorMessage = getRequiredMessage(fieldType);
          }
        }

        if (!isValid) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: errorMessage,
            path: [q.questionId],
          });
        }
      }
    });

    // 2. Validate repeatable groups
    repeatableGroups.forEach((g) => {
      const groupQuestions = questions.filter((q) => q.groupId === g.id);
      const groupData = data[g.groupKey];

      // The group is only active when at least one of its questions is visible
      // AND the gate question (do you have children?) for this section is answered "yes"
      const gateQuestion = questions.find((cand) => {
        if (cand.groupId) return false;
        const text = (cand.questionText || "").toLowerCase().trim();
        const id = (cand.questionId || "").toLowerCase();
        return (
          text.includes("do you have any children") ||
          text.includes("have any children") ||
          id.endsWith("_has_children") ||
          id === "q_has_children" ||
          id === "6a9fcbc2e481ca7fb0489582"
        );
      });

      // If there's a gate question and it's not explicitly "yes", skip group validation
      if (gateQuestion) {
        const gateVal = data[gateQuestion.questionId];
        const isGateYes =
          gateVal === true ||
          String(gateVal).toLowerCase() === "true" ||
          String(gateVal).toLowerCase() === "yes";
        if (!isGateYes) return; // Gate closed — skip group entirely
      }

      const groupShouldBeVisible = groupQuestions.some((q) =>
        isQuestionVisible(q, data, questions)
      );

      if (groupShouldBeVisible) {
        if (!Array.isArray(groupData) || groupData.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: getGroupRequiredMessage(g.title || 'entry'),
            path: [g.groupKey],
          });
        } else {
          groupData.forEach((instanceData: any, index: number) => {
            const mergedData = { ...data, ...instanceData };

            groupQuestions.forEach((q) => {
              const isVisible = isQuestionVisible(q, mergedData, questions);

              if (isVisible && q.isOptional !== true) {
                const actualInputType = q.inputType;
                const val = instanceData[q.questionId];
                let isValid = true;
                let errorMessage = "This field is required";

                if (actualInputType === "BOOLEAN") {
                  if (val !== true && val !== false) {
                    isValid = false;
                    errorMessage = getBooleanMessage();
                  }
                } else if (actualInputType === "MULTI_SELECT") {
                  if (!Array.isArray(val) || val.length === 0) {
                    isValid = false;
                    errorMessage = getMultiSelectMessage();
                  }
                } else if (actualInputType === "SELECT") {
                  if (val === undefined || val === null || String(val).trim() === "") {
                    isValid = false;
                    errorMessage = getSelectMessage();
                  }
                } else if (actualInputType === "EMAIL") {
                  if (val === undefined || val === null || String(val).trim() === "") {
                    isValid = false;
                    errorMessage = getRequiredMessage("email address");
                  } else if (
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val).trim())
                  ) {
                    isValid = false;
                    errorMessage = "Please enter a valid email address";
                  }
                } else if (actualInputType === "AUTOCOMPLETE") {
                  if (val === undefined || val === null || String(val).trim() === "") {
                    isValid = false;
                    errorMessage = getRequiredMessage("selection");
                  }
                  if (Array.isArray(val) && val.length === 0) {
                    isValid = false;
                    errorMessage = getMultiSelectMessage();
                  }
                } else {
                  if (val === undefined || val === null || String(val).trim() === "") {
                    isValid = false;
                    const fieldType = getFieldType(actualInputType);
                    errorMessage = getRequiredMessage(fieldType);
                  }
                }

                if (!isValid) {
                  ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: errorMessage,
                    path: [g.groupKey, index, q.questionId],
                  });
                }
              }
            });
          });
        }
      }
    });
  });
}