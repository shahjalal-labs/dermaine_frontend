/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { generateDynamicSchema } from "@/lib/schema/dynamicSchema";
import {
    useGetAssessmentByIdQuery,
    useSubmitAssesmentMutation,
} from "@/redux/api/assessmentApi";
import { Group, Question } from "@/types/assessment";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check, Eye, Loader2 } from "lucide-react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { getAssessmentApiId } from "@/lib/assessmentMap";
import {
    getMaritalStatusValue,
    isMaritalStatusSpouseEligible,
    isQuestionVisible,
    isSpousalOpenWorkPermit,
    isSpouseStepOrQuestion,
    shouldIncludeSpouse,
    isSpouseAccompanyQuestion,
    isFamilyAssessment,
} from "@/lib/assessmentUtils";
import { formatStepTitle } from "@/lib/formatters";
import {
    readOccupationMeta,
    type OccupationAnswer,
} from "@/lib/noc/occupationFields";

export default function DynamicAssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const rawId = params.assessmentId as string;
  const assessmentId = getAssessmentApiId(rawId);

  const { data: assessmentResponse, isLoading } = useGetAssessmentByIdQuery(
    assessmentId,
    {
      skip: !assessmentId,
    }
  );

  const [isMounted, setIsMounted] = useState(false);

  const searchParams = useSearchParams();
  const isEditing = searchParams.get("isEditing") === "true";
  console.log("isEditing", isEditing);

  // Group questions by questionType
  const routeSteps = useMemo(() => {
    if (!assessmentResponse?.result?.questions) return [];
    const questions: Question[] = assessmentResponse.result.questions;
    const groups: Group[] = assessmentResponse.result.groups || [];
    const types = Array.from(new Set(questions.map((q) => q.questionType)));

    const steps = types.map((type, index) => {
      const stepQuestions = questions.filter((q) => q.questionType === type);
      const fieldIds = stepQuestions.map((q) => q.questionId);

      const groupKeys = new Set<string>();
      stepQuestions.forEach(q => {
        if (q.groupId) {
          const group = groups.find(g => g.id === q.groupId);
          if (group && group.isRepeatable) {
            groupKeys.add(group.groupKey);
          }
        }
      });

      return {
        id: index + 1,
        title: formatStepTitle(type),
        path: type.toLowerCase().replace(/\s+/g, "-"),
        fields: [...fieldIds, ...Array.from(groupKeys)],
        groupKeys: Array.from(groupKeys),
        originalType: type,
      };
    });

    // Add review step
    steps.push({
      id: steps.length + 1,
      title: "Review & Submission",
      path: "review",
      fields: [],
      groupKeys: [],
      originalType: "review",
    });

    return steps;
  }, [assessmentResponse]);

  // Generate dynamic schema
  const dynamicSchema = useMemo(() => {
    if (!assessmentResponse?.result?.questions || !assessmentResponse?.result?.groups) return null;
    return generateDynamicSchema(
      assessmentResponse.result.questions,
      assessmentResponse.result.groups
    );
  }, [assessmentResponse]);

  const methods = useForm<Record<string, any>>({
    resolver: async (data, context, options) => {
      if (!dynamicSchema) return { values: data, errors: {} };
      return zodResolver(dynamicSchema)(data, context, options);
    },
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {},
  });

  // Initialize repeatable groups with at least one instance if they have dependencies
  useEffect(() => {
    if (!assessmentResponse?.result?.groups || !assessmentResponse?.result?.questions) return;

    const groups: Group[] = assessmentResponse.result.groups;
    const questions: Question[] = assessmentResponse.result.questions;

    const repeatableGroups = groups.filter(g => g.isRepeatable);
    const currentValues = methods.getValues() as Record<string, any>;

    repeatableGroups.forEach(group => {
      // Check if this group has a dependency question
      const groupQuestions = questions.filter(q => q.groupId === group.id);
      const dependencyQuestion = groupQuestions.find(q => q.dependsOnQuestionId);

      if (dependencyQuestion) {
        const dependsOnQuestion = questions.find(
          q => q.id === dependencyQuestion.dependsOnQuestionId
        );

        if (dependsOnQuestion) {
          const dependsOnValue = currentValues[dependsOnQuestion.questionId];
          // If the dependency is true and the group doesn't exist, initialize it
          if (dependsOnValue === true && !currentValues[group.groupKey]) {
            methods.setValue(group.groupKey, []);
          }
        }
      }
    });
  }, [assessmentResponse, methods]);

  useEffect(() => {
    setIsMounted(true);
    const savedData = localStorage.getItem(`assessmentData_${assessmentId}`);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        methods.reset(parsedData);
      } catch (e) {
        console.error("Failed to parse saved form data", e);
      }
    }
  }, [methods, assessmentId]);

  useEffect(() => {
    const subscription = methods.watch((value) => {
      localStorage.setItem(
        `assessmentData_${assessmentId}`,
        JSON.stringify(value)
      );
    });
    return () => subscription.unsubscribe();
  }, [methods, assessmentId]);

  const { trigger, handleSubmit } = methods;

  const [submitAssessment] = useSubmitAssesmentMutation();

  const currentSegment = pathname.split("/").pop();
  const currentIndex = routeSteps.findIndex(
    (step) => step.path === currentSegment
  );

  useEffect(() => {
    if (currentSegment && currentIndex !== -1 && currentSegment !== "completed") {
      localStorage.setItem(`assessmentStep_${assessmentId}`, currentSegment);
    }
  }, [currentSegment, currentIndex, assessmentId]);

  // Helper function to get all fields that need validation including nested group fields
  const getFieldsToValidate = (step: typeof routeSteps[0]) => {
    if (!assessmentResponse) return [];

    const allQuestions: Question[] = assessmentResponse.result.questions;
    const groups: Group[] = assessmentResponse.result.groups || [];
    const currentFormValues = methods.getValues();
    const isFamily = isFamilyAssessment(allQuestions);
    const maritalVal = getMaritalStatusValue(currentFormValues, allQuestions);
    const isMaritalEligible = isMaritalStatusSpouseEligible(maritalVal);
    const includeSpouse = isFamily ? true : shouldIncludeSpouse(currentFormValues, allQuestions);

    const repeatableGroups = groups.filter(g => g.isRepeatable);
    const repeatableGroupIds = repeatableGroups.map(g => g.id);

    // Get questions belonging to the current step's questionType
    const stepQuestions = allQuestions.filter(q => q.questionType === step.originalType);

    const fieldsToValidate: string[] = [];

    // 1. Only include NON-GROUP questions that are currently visible
    stepQuestions
      .filter(q => !q.groupId || !repeatableGroupIds.includes(q.groupId))
      .forEach(q => {
        if (!isFamily) {
          const isSpousalWorkPermit = isSpousalOpenWorkPermit(q.questionType);
          if (isSpousalWorkPermit) {
            if (!isMaritalEligible) return;
          } else if (!includeSpouse && isSpouseStepOrQuestion(q.questionText)) {
            return;
          }
        }
        if (isQuestionVisible(q, currentFormValues, allQuestions)) {
          fieldsToValidate.push(q.questionId);
        }
      });

    // 2. For repeatable groups: only validate when the gate is open
    step.groupKeys.forEach(groupKey => {
      const group = repeatableGroups.find(g => g.groupKey === groupKey);
      if (!group) return;

      if (!isFamily && !includeSpouse && isSpouseStepOrQuestion(group.title || group.groupKey)) {
        return;
      }

      const groupQuestions = allQuestions.filter(q => q.groupId === group.id);

      // Children gate check: if there's a "do you have any children?" question and it's not "yes", skip
      const childrenGateQ = allQuestions.find((cand) => {
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
      if (childrenGateQ) {
        const gateVal = currentFormValues[childrenGateQ.questionId];
        const isGateYes =
          gateVal === true ||
          String(gateVal).toLowerCase() === "true" ||
          String(gateVal).toLowerCase() === "yes";
        if (!isGateYes) return; // children gate closed — skip group
      }

      // Gate check: is at least one group question visible?
      const isGateOpen = groupQuestions.some(q =>
        isQuestionVisible(q, currentFormValues, allQuestions)
      );

      if (!isGateOpen) return; // Gate closed — skip entirely

      // Include the group key so the array-level validator runs
      fieldsToValidate.push(groupKey);

      // Expand each group instance, only for visible questions
      const groupData = methods.getValues(groupKey);
      if (Array.isArray(groupData)) {
        groupData.forEach((instanceData: Record<string, unknown>, index: number) => {
          const mergedValues = { ...currentFormValues, ...instanceData };
          groupQuestions.forEach(q => {
            if (isQuestionVisible(q, mergedValues, allQuestions)) {
              fieldsToValidate.push(`${groupKey}.${index}.${q.questionId}`);
            }
          });
        });
      }
    });

    return fieldsToValidate;
  };

  if (isLoading || !isMounted) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (currentIndex === -1 || !assessmentResponse) {
    return <>{children}</>;
  }

  const isReviewPage = currentSegment === "review";
  const currentStep = routeSteps[currentIndex];

  const totalStepsForProgress = routeSteps.filter(
    (s) => s.path !== "review"
  ).length;
  const progressPercentage = Math.round(
    (currentIndex / Math.max(1, totalStepsForProgress - 1)) * 100
  );

  /**
   * Returns the indices of ALL spouse/spousal steps that should be skipped
   * when spouse should not be included.
   */
  const getSpouseStepsToSkip = (
    formVals: Record<string, any>,
    allQuestions: Question[]
  ): number[] => {
    if (isFamilyAssessment(allQuestions)) {
      return [];
    }

    const maritalVal = getMaritalStatusValue(formVals, allQuestions);
    const isMaritalEligible = isMaritalStatusSpouseEligible(maritalVal);
    const includeSpouse = shouldIncludeSpouse(formVals, allQuestions);

    const gatekeeperQuestion = allQuestions.find(isSpouseAccompanyQuestion);
    const gatekeeperStepType = gatekeeperQuestion?.questionType;

    const indices: number[] = [];
    routeSteps.forEach((s, idx) => {
      // Do not unconditionally skip the gatekeeper step itself based on includeSpouse
      if (gatekeeperStepType && s.originalType === gatekeeperStepType) {
        return;
      }

      const isSpousalWorkPermit =
        isSpousalOpenWorkPermit(s.originalType ?? "") ||
        isSpousalOpenWorkPermit(s.path) ||
        isSpousalOpenWorkPermit(s.title);

      if (isSpousalWorkPermit) {
        if (!isMaritalEligible) {
          indices.push(idx);
        }
      } else if (
        isSpouseStepOrQuestion(s.title) ||
        isSpouseStepOrQuestion(s.path) ||
        isSpouseStepOrQuestion(s.originalType ?? "")
      ) {
        if (!includeSpouse) {
          indices.push(idx);
        }
      }
    });
    return indices;
  };

  const getFirstIncompleteStep = (
    formVals: Record<string, any>,
    allQuestions: Question[],
    groups: Group[]
  ) => {
    const isFamily = isFamilyAssessment(allQuestions);
    const maritalVal = getMaritalStatusValue(formVals, allQuestions);
    const isMaritalEligible = isMaritalStatusSpouseEligible(maritalVal);
    const includeSpouse = isFamily ? true : shouldIncludeSpouse(formVals, allQuestions);
    const repeatableGroups = groups.filter((g) => g.isRepeatable);
    const repeatableGroupIds = repeatableGroups.map((g) => g.id);

    for (const step of routeSteps) {
      if (step.path === "review" || step.path === "completed") continue;

      if (!isFamily) {
        const isSpousalWorkPermit =
          isSpousalOpenWorkPermit(step.originalType ?? "") ||
          isSpousalOpenWorkPermit(step.path) ||
          isSpousalOpenWorkPermit(step.title);

        if (isSpousalWorkPermit) {
          if (!isMaritalEligible) continue;
        } else if (
          !includeSpouse &&
          (isSpouseStepOrQuestion(step.title) ||
            isSpouseStepOrQuestion(step.path) ||
            isSpouseStepOrQuestion(step.originalType ?? ""))
        ) {
          continue;
        }
      }

      const stepQuestions = allQuestions.filter(
        (q) => q.questionType === step.originalType
      );

      // Check if step has any visible questions
      const hasVisibleQuestion = stepQuestions.some((q) =>
        isQuestionVisible(q, formVals, allQuestions)
      );
      if (stepQuestions.length > 0 && !hasVisibleQuestion) {
        continue; // Entire step is conditionally hidden
      }

      // 1. Check non-group questions
      const regularQuestions = stepQuestions.filter(
        (q) => !q.groupId || !repeatableGroupIds.includes(q.groupId)
      );

      for (const q of regularQuestions) {
        if (!isQuestionVisible(q, formVals, allQuestions)) continue;
        
        if (q.isOptional) {
          const isGatekeeper = isSpouseAccompanyQuestion(q);
          if (!(isGatekeeper && isMaritalEligible)) {
            continue;
          }
        }

        const val = formVals[q.questionId];
        if (q.inputType === "BOOLEAN") {
          if (val !== true && val !== false) {
            console.log("Validation blocked silently by boolean field:", q.questionId, q.questionText);
            return step;
          }
        } else if (q.inputType === "MULTI_SELECT") {
          if (!Array.isArray(val) || val.length === 0) {
            console.log("Validation blocked silently by multiselect field:", q.questionId, q.questionText);
            return step;
          }
        } else {
          if (val === undefined || val === null || String(val).trim() === "") {
            console.log("Validation blocked silently by empty field:", q.questionId, q.questionText);
            return step;
          }
        }
      }

      // 2. Check repeatable groups in step
      for (const groupKey of step.groupKeys) {
        const group = repeatableGroups.find((g) => g.groupKey === groupKey);
        if (!group) continue;
        if (
          !includeSpouse &&
          isSpouseStepOrQuestion(group.title || group.groupKey)
        ) {
          continue;
        }

        const groupQuestions = allQuestions.filter(
          (q) => q.groupId === group.id
        );

        // Children gate check: skip group if "do you have any children?" is not answered "yes"
        const childrenGateQ = allQuestions.find((cand) => {
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
        if (childrenGateQ) {
          const gateVal = formVals[childrenGateQ.questionId];
          const isGateYes =
            gateVal === true ||
            String(gateVal).toLowerCase() === "true" ||
            String(gateVal).toLowerCase() === "yes";
          if (!isGateYes) continue; // children gate closed — skip
        }

        const isGroupGateOpen = groupQuestions.some((q) =>
          isQuestionVisible(q, formVals, allQuestions)
        );
        if (!isGroupGateOpen) continue;

        const groupData = formVals[groupKey];
        if (!Array.isArray(groupData) || groupData.length === 0) {
          return step;
        }

        for (const instance of groupData) {
          const merged = { ...formVals, ...instance };
          for (const q of groupQuestions) {
            if (!isQuestionVisible(q, merged, allQuestions)) continue;
            if (q.isOptional) continue;
            const val = instance[q.questionId];
            if (q.inputType === "BOOLEAN") {
              if (val !== true && val !== false) {
                console.log("Validation blocked silently by boolean group field:", q.questionId, q.questionText);
                return step;
              }
            } else if (q.inputType === "MULTI_SELECT") {
              if (!Array.isArray(val) || val.length === 0) {
                console.log("Validation blocked silently by multiselect group field:", q.questionId, q.questionText);
                return step;
              }
            } else {
              if (
                val === undefined ||
                val === null ||
                String(val).trim() === ""
              ) {
                console.log("Validation blocked silently by empty group field:", q.questionId, q.questionText);
                return step;
              }
            }
          }
        }
      }
    }

    return null;
  };

  const handleNext = async () => {
    const fieldsToValidate = getFieldsToValidate(currentStep);

    // Clear any stale errors from fields that are no longer visible
    // so they don't interfere with the step-level trigger call
    methods.clearErrors();

    const isStepValid = await trigger(fieldsToValidate as any);

    if (isStepValid) {
      const formValues = methods.getValues();
      const questions: Question[] = assessmentResponse?.result?.questions || [];
      const groups: Group[] = assessmentResponse?.result?.groups || [];

      // Early Exit check for Family Sponsorship
      if (isFamilyAssessment(questions)) {
        const rootFamilyGate = questions.find(
          (q) =>
            q.questionText.toLowerCase().includes("family member currently living in canada") ||
            q.questionId === "question_1786528385298" ||
            q.questionId === "6a7c4294c36c04dc85a46281"
        );
        const isFamilyEarlyExit =
          rootFamilyGate &&
          (formValues[rootFamilyGate.questionId] === false ||
            formValues[rootFamilyGate.questionId] === "false" ||
            String(formValues[rootFamilyGate.questionId]).trim().toLowerCase() === "no");

        if (isFamilyEarlyExit) {
          router.push(`/assessment/${rawId}/review`);
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
      }

      // Indices of all spouse/spousal steps to skip based on marital status
      const spouseStepIndices = getSpouseStepsToSkip(formValues, questions);

      let nextIndex = currentIndex + 1;
      
      // Indices of all spouse/spousal steps to skip based on marital status
      // (already calculated above)


      // Keep advancing nextIndex as long as it lands on a spouse step to skip
      // or a step with no visible questions
      let safetyCount = 0;
      while (nextIndex < routeSteps.length - 1 && safetyCount++ < 20) {
        // Skip spouse/spousal steps when marital status doesn't qualify
        if (spouseStepIndices.includes(nextIndex)) {
          nextIndex++;
          continue;
        }

        const nextStep = routeSteps[nextIndex];
        const stepQuestions = questions.filter(
          (q) => q.questionType === nextStep.originalType
        );

        if (stepQuestions.length === 0) {
          break; // Keep step if it has no questions in DB (e.g. Review)
        }

        const hasVisibleQuestion = stepQuestions.some((q) =>
          isQuestionVisible(q, formValues, questions)
        );

        if (hasVisibleQuestion) {
          break; // Found a valid step
        }

        nextIndex++;
      }

      if (isEditing) {
        // Explicitly clear any stale values for questions that are conditionally hidden
        // This ensures if a user changes a controlling field (like Marital Status),
        // previously hidden fields (like the gatekeeper question) don't retain stale answers
        // that would incorrectly satisfy getFirstIncompleteStep.
        questions.forEach(q => {
          if (!isQuestionVisible(q, formValues, questions)) {
             formValues[q.questionId] = "";
             methods.setValue(q.questionId, "");
          }
        });

        const incompleteStep = getFirstIncompleteStep(
          formValues,
          questions,
          groups
        );

        if (incompleteStep) {
          router.push(`/assessment/${rawId}/${incompleteStep.path}`);
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }

        router.push(`/assessment/${rawId}/review`);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      if (nextIndex < routeSteps.length) {
        router.push(
          `/assessment/${rawId}/${routeSteps[nextIndex].path}`
        );
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      // Scroll to first error
      setTimeout(() => {
        const errorElement = document.querySelector(
          ".border-red-500, p.text-red-500"
        );
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  };

  const handleBack = () => {
    // If in editing mode, go back to review page
    if (isEditing) {
      router.push(`/assessment/${rawId}/review`);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    let prevIndex = currentIndex - 1;
    const formValues = methods.getValues();
    const questions: Question[] = assessmentResponse?.result?.questions || [];

    // Indices of all spouse/spousal steps to skip based on marital status
    const spouseStepIndicesBack = getSpouseStepsToSkip(formValues, questions);

    // Keep decreasing prevIndex as long as it lands on a spouse step to skip
    // or a step with no visible questions
    let safetyCountBack = 0;
    while (prevIndex > 0 && safetyCountBack++ < 20) {
      // Skip spouse/spousal steps when marital status doesn't qualify
      if (spouseStepIndicesBack.includes(prevIndex)) {
        prevIndex--;
        continue;
      }

      const prevStep = routeSteps[prevIndex];
      const stepQuestions = questions.filter(
        (q) => q.questionType === prevStep.originalType
      );

      if (stepQuestions.length === 0) {
        break; // Keep step if it has no questions in DB
      }

      const hasVisibleQuestion = stepQuestions.some((q) =>
        isQuestionVisible(q, formValues, questions)
      );

      if (hasVisibleQuestion) {
        break; // Found a valid step
      }

      prevIndex--;
    }

    if (prevIndex >= 0) {
      router.push(`/assessment/${rawId}/${routeSteps[prevIndex].path}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const formValues = methods.getValues();
      const questions: Question[] = assessmentResponse?.result?.questions || [];
      const groups: Group[] = assessmentResponse?.result?.groups || [];

      // Ensure all required steps are complete before submission
      const incompleteStep = getFirstIncompleteStep(
        formValues,
        questions,
        groups
      );
      if (incompleteStep) {
        router.push(`/assessment/${rawId}/${incompleteStep.path}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const answers: Record<string, any> = {};
      const isFamily = isFamilyAssessment(questions);
      const maritalVal = getMaritalStatusValue(formValues, questions);
      const isMaritalEligible = isMaritalStatusSpouseEligible(maritalVal);
      const includeSpouse = isFamily ? true : shouldIncludeSpouse(formValues, questions);

      const repeatableGroups = groups.filter(g => g.isRepeatable);
      const repeatableGroupIds = repeatableGroups.map(g => g.id);

      // Process regular (non-group) questions
      questions.forEach((q) => {
        if (q.groupId && repeatableGroupIds.includes(q.groupId)) {
          return; // Handled below
        }

        if (!isFamily) {
          const isSpousalWorkPermit = isSpousalOpenWorkPermit(q.questionType);
          if (isSpousalWorkPermit) {
            if (!isMaritalEligible) return;
          } else if (
            !includeSpouse &&
            isSpouseStepOrQuestion(q.questionType + " " + q.questionText)
          ) {
            return;
          }
        }

        // Exclude conditionally hidden questions
        if (!isQuestionVisible(q, formValues, questions)) {
          return;
        }

        const val = data[q.questionId];
        if (val !== undefined && val !== null && val !== "") {
          answers[q.id] = val;
        }
      });

      // Handle repeatable groups
      repeatableGroups.forEach(g => {
        // Exclude spouse groups if spouse is not included
        if (!isFamily && !includeSpouse && isSpouseStepOrQuestion(g.groupKey + " " + g.title)) {
          return;
        }

        const groupQuestions = questions.filter(q => q.groupId === g.id);
        const isGroupGateOpen = groupQuestions.some(q =>
          isQuestionVisible(q, formValues, questions)
        );

        if (!isGroupGateOpen) {
          return; // Gate closed — skip stale group data
        }

        const groupData = data[g.groupKey];
        if (Array.isArray(groupData) && groupData.length > 0) {
          const groupAnswers = groupData.map(instanceData => {
            const instanceAnswers: Record<string, any> = {};
            const mergedContext = { ...formValues, ...instanceData };
            groupQuestions.forEach(q => {
              if (isQuestionVisible(q, mergedContext, questions)) {
                const val = instanceData[q.questionId];
                if (val !== undefined && val !== null && val !== "") {
                  instanceAnswers[q.id] = val;
                }
              }
            });
            return instanceAnswers;
          }).filter(ans => Object.keys(ans).length > 0);

          if (groupAnswers.length > 0) {
            answers[g.groupKey] = groupAnswers;
          }
        }
      });

      // Occupation metadata for the Rules Engine. Read from getValues() rather
      // than `data`, because zod strips the sibling metadata keys from the
      // resolver output. Additive — `answers` keeps its exact current shape.
      const rawValues = methods.getValues() as Record<string, any>;
      const occupations: OccupationAnswer[] = [];

      questions.forEach((q) => {
        if (q.groupId && repeatableGroupIds.includes(q.groupId)) return;
        const meta = readOccupationMeta(rawValues, q.questionId);
        const title = rawValues[q.questionId];
        if (!meta || typeof title !== "string" || title.trim() === "") return;
        occupations.push({
          questionId: q.questionId,
          questionDbId: q.id,
          occupationTitle: title.trim(),
          ...meta,
        });
      });

      repeatableGroups.forEach((g) => {
        const instances = rawValues[g.groupKey];
        if (!Array.isArray(instances)) return;
        instances.forEach((instance: Record<string, any>, index: number) => {
          questions.forEach((q) => {
            if (q.groupId !== g.id) return;
            const meta = readOccupationMeta(instance, q.questionId);
            const title = instance?.[q.questionId];
            if (!meta || typeof title !== "string" || title.trim() === "") return;
            occupations.push({
              questionId: q.questionId,
              questionDbId: q.id,
              groupKey: g.groupKey,
              instanceIndex: index,
              occupationTitle: title.trim(),
              ...meta,
            });
          });
        });
      });

      const payload = {
        assesmentId: assessmentId,
        country: "Canada",
        answers,
        ...(occupations.length > 0 ? { occupations } : {}),
      };

      console.log("Submitted payload:", payload);

      await submitAssessment(payload).unwrap();
      localStorage.removeItem(`assessmentData_${assessmentId}`);
      localStorage.removeItem(`assessmentStep_${assessmentId}`);
      router.push(`/assessment/${rawId}/completed`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  // Determine if back button should be disabled
  const isBackDisabled = isEditing || currentIndex === 0;

  return (
    <FormProvider {...methods}>
      <div className="pt-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          {!isReviewPage && !isEditing && (
            <div className="w-full max-w-6xl mx-auto px-6 mb-4">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm md:text-base font-semibold text-gray-500 uppercase tracking-wider">
                  STEP {currentIndex + 1} OF {totalStepsForProgress}:{" "}
                  <span className="text-gray-900">{currentStep.title}</span>
                </span>
                <span className="text-sm md:text-base font-bold text-primary">
                  {progressPercentage}%
                </span>
              </div>
              <div className="h-2 md:h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500 ease-in-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          )}

          {children}

          <div className="pb-16 md:pb-24 flex justify-between w-full max-w-6xl mx-auto px-6 mt-8">
            <button
              type="button"
              onClick={handleBack}
              disabled={isBackDisabled}
              className={`px-6 md:px-8 py-3 rounded-lg text-base md:text-lg font-medium transition-colors flex items-center gap-2 ${isBackDisabled
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" /> Back
            </button>

            {isEditing ? (
              // Show Preview button when in editing mode - GREEN background
              <button
                type="button"
                onClick={handleNext}
                className="px-6 md:px-8 py-3 rounded-lg text-base md:text-lg font-medium transition-all duration-300 flex items-center gap-2 bg-primary hover:bg-green-600 text-white shadow-md hover:shadow-lg transform hover:scale-[1.02]"
              >
                <Eye className="w-5 h-5" />
                Preview Changes
              </button>
            ) : currentIndex < routeSteps.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 md:px-8 py-3 rounded-lg text-base md:text-lg font-medium transition-colors flex items-center gap-2 bg-primary text-white hover:bg-green-600 shadow-sm"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 md:px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg text-base md:text-lg font-medium transition-colors flex items-center gap-2 cursor-pointer"
              >
                Submit Assessment
                <Check className="w-5 h-5" />
              </button>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  );
}