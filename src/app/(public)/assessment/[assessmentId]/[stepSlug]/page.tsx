"use client";

import QuestionRenderer from "@/components/Assessment/QuestionRenderer";
import { useGetAssessmentByIdQuery } from "@/redux/api/assessmentApi";
import { Group, Question } from "@/types/assessment";
import { AlertTriangle, CheckCircle2, Loader2, Pencil } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";

import { getAssessmentApiId } from "@/lib/assessmentMap";
import {
  getMaritalStatusValue,
  isMaritalStatusSpouseEligible,
  isQuestionVisible,
  isSpousalOpenWorkPermit,
  isSpouseStepOrQuestion,
  shouldIncludeSpouse,
  isFamilyAssessment,
} from "@/lib/assessmentUtils";
import { formatStepTitle } from "@/lib/formatters";
import { formatNocBadge, readOccupationMeta } from "@/lib/noc/occupationFields";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatAnswerValue(
  question: Question,
  rawValue: unknown
): string | string[] | null {
  if (rawValue === undefined || rawValue === null || rawValue === "")
    return null;

  switch (question.inputType) {
    case "BOOLEAN":
      return rawValue === true || rawValue === "true" ? "Yes" : "No";

    case "SELECT": {
      const opt = question.options?.find((o) => o.value === rawValue);
      return opt ? opt.label : String(rawValue);
    }

    case "MULTI_SELECT": {
      const arr = Array.isArray(rawValue) ? rawValue : [rawValue];
      return arr.map((v) => {
        const opt = question.options?.find((o) => o.value === v);
        return opt ? opt.label : String(v);
      });
    }

    case "DATE":
      try {
        return new Date(rawValue as string).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      } catch {
        return String(rawValue);
      }

    default:
      return String(rawValue);
  }
}

// ── ReviewSection ─────────────────────────────────────────────────────────────

interface ReviewSectionProps {
  title: string;
  questions: Question[];
  formValues: Record<string, unknown>;
  allQuestions: Question[];
  groups: Group[];
  editPath: string;
}

function AnswerNode({
  question,
  formatted,
  badge,
}: {
  question: Question;
  formatted: string | string[];
  /** e.g. "NOC 60020 • TEER 0" for occupation answers. */
  badge?: string | null;
}) {
  const isMulti = Array.isArray(formatted);
  return (
    <div className={isMulti ? "sm:col-span-2" : ""}>
      <p className="text-xs md:text-sm font-medium text-gray-400 uppercase tracking-wide mb-1.5 poppins">
        {question.questionText}
      </p>
      {isMulti ? (
        <div className="flex flex-wrap gap-2">
          {(formatted as string[]).map((v) => (
            <span
              key={v}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
              style={{ background: "rgba(0,166,62,0.1)", color: "#00a63e" }}
            >
              {v}
            </span>
          ))}
        </div>
      ) : (
        <p
          className="text-base md:text-lg font-medium poppins"
          style={{
            color:
              formatted === "Yes"
                ? "#00a63e"
                : formatted === "No"
                  ? "#9ca3af"
                  : "#1f2937",
          }}
        >
          {formatted as string}
        </p>
      )}
      {badge && (
        <p className="mt-1 text-xs md:text-sm font-medium text-gray-500 poppins">
          {badge}
        </p>
      )}
    </div>
  );
}

function ReviewSection({
  title,
  questions,
  formValues,
  allQuestions,
  groups,
  editPath,
}: ReviewSectionProps) {
  const router = useRouter();
  const params = useParams();
  const rawId = params.assessmentId as string;

  const isFamily = isFamilyAssessment(allQuestions);
  const maritalVal = getMaritalStatusValue(formValues, allQuestions);
  const isMaritalEligible = isMaritalStatusSpouseEligible(maritalVal);
  const includeSpouse = isFamily ? true : shouldIncludeSpouse(formValues, allQuestions);

  if (!isFamily) {
    const isSpousalWorkPermit = isSpousalOpenWorkPermit(title);
    if (isSpousalWorkPermit) {
      if (!isMaritalEligible) return null;
    } else if (!includeSpouse && isSpouseStepOrQuestion(title)) {
      return null;
    }
  }

  const regularQuestions: Question[] = [];
  const groupQuestionsMap = new Map<string, Question[]>();

  questions.forEach((q) => {
    if (q.groupId) {
      const group = groups.find((g) => g.id === q.groupId);
      if (group && group.isRepeatable) {
        if (!groupQuestionsMap.has(q.groupId)) {
          groupQuestionsMap.set(q.groupId, []);
        }
        groupQuestionsMap.get(q.groupId)!.push(q);
        return;
      }
    }
    regularQuestions.push(q);
  });

  const visibleRegularAnswers = regularQuestions
    .filter((q) => {
      if (!isFamily) {
        const isSpousal = isSpousalOpenWorkPermit(q.questionType);
        if (isSpousal) {
          if (!isMaritalEligible) return false;
        } else if (!includeSpouse && isSpouseStepOrQuestion(q.questionText)) {
          return false;
        }
      }
      return isQuestionVisible(q, formValues, allQuestions);
    })
    .map((q) => ({
      question: q,
      formatted: formatAnswerValue(q, formValues[q.questionId]),
      badge: formatNocBadge(readOccupationMeta(formValues, q.questionId)),
    }))
    .filter(({ formatted }) => formatted !== null);

  const renderedGroups = Array.from(groupQuestionsMap.entries())
    .map(([groupId]) => {
      const group = groups.find((g) => g.id === groupId)!;
      if (!group) return null;

      if (!isFamily && !includeSpouse && isSpouseStepOrQuestion(group.title || group.groupKey)) {
        return null;
      }

      // Use ALL questions that belong to this group, regardless of their questionType
      const allGroupQs = allQuestions.filter((q) => q.groupId === groupId);

      // Gate check: is the group gate open?
      const isGroupGateOpen = allGroupQs.some((q) =>
        isQuestionVisible(q, formValues, allQuestions)
      );
      if (!isGroupGateOpen) return null;

      const groupInstances = formValues[group.groupKey] as
        | Record<string, unknown>[]
        | undefined;

      if (!Array.isArray(groupInstances) || groupInstances.length === 0)
        return null;

      const instancesWithAnswers = groupInstances
        .map((instance, idx) => {
          const mergedContext = { ...formValues, ...instance };
          const visibleAnswers = allGroupQs
            .map((q) => {
              const isVisible = isQuestionVisible(
                q,
                mergedContext,
                allQuestions
              );
              if (!isVisible) return null;

              const rawValue = instance[q.questionId];
              return {
                question: q,
                formatted: formatAnswerValue(q, rawValue),
                badge: formatNocBadge(readOccupationMeta(instance, q.questionId)),
              };
            })
            .filter((ans) => ans !== null && ans.formatted !== null);

          return { index: idx, visibleAnswers };
        })
        .filter((inst) => inst.visibleAnswers.length > 0);

      if (instancesWithAnswers.length === 0) return null;

      return { group, instances: instancesWithAnswers };
    })
    .filter(Boolean) as { group: Group; instances: { index: number, visibleAnswers: { question: Question, formatted: string | string[], badge: string | null | undefined }[] }[] }[];

  if (visibleRegularAnswers.length === 0 && renderedGroups.length === 0)
    return null;

  return (
    <div className="mb-6 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <div
        className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3"
        style={{
          background:
            "linear-gradient(to right, rgba(0,166,62,0.07), rgba(0,166,62,0.02))",
        }}
      >
        <div className="flex items-center gap-3">
          <CheckCircle2
            className="w-5 h-5 shrink-0"
            style={{ color: "#00a63e" }}
          />
          <h2 className="text-base md:text-lg font-semibold text-gray-800 caros">
            {title}
          </h2>
        </div>

        {/* Edit button */}
        <button
          type="button"
          onClick={() => router.push(`/assessment/${rawId}/${editPath}?isEditing=true`)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 bg-green-50 border border-green-100 hover:border-green-300 transition-all duration-200 poppins"
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit
        </button>
      </div>

      <div className="p-6">
        {visibleRegularAnswers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            {visibleRegularAnswers.map(({ question, formatted, badge }) => (
              <AnswerNode
                key={question.id}
                question={question}
                formatted={formatted!}
                badge={badge}
              />
            ))}
          </div>
        )}

        {renderedGroups.map(({ group, instances }) => (
          <div
            key={group.id}
            className={`mt-2 ${visibleRegularAnswers.length > 0 ? "border-t border-gray-100 pt-6" : ""}`}
          >
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
              {group.title || group.groupKey}
            </h3>
            <div className="space-y-4">
              {instances.map(({ index, visibleAnswers }) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-5 border border-gray-100"
                >
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Entry #{index + 1}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                    {visibleAnswers.map(({ question, formatted, badge }) => (
                      <AnswerNode
                        key={question.id}
                        question={question}
                        formatted={formatted}
                        badge={badge}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function DynamicAssessmentPage() {
  const params = useParams();
  const rawId = params.assessmentId as string;
  const assessmentId = getAssessmentApiId(rawId);
  const stepSlug = params.stepSlug as string;

  const { data: assessmentResponse, isLoading } = useGetAssessmentByIdQuery(
    assessmentId,
    {
      skip: !assessmentId,
    }
  );

  // Access the shared form values from the layout's FormProvider
  const formContext = useFormContext();
  const formValues = formContext?.watch() ?? {};

  const stepData = useMemo(() => {
    if (!assessmentResponse?.result?.questions) return null;

    if (stepSlug === "review") {
      return { title: "Review & Submission", questions: [] };
    }

    const questions: Question[] = assessmentResponse.result.questions;
    const types = Array.from(new Set(questions.map((q) => q.questionType)));

    const currentType = types.find(
      (type) => type.toLowerCase().replace(/\s+/g, "-") === stepSlug
    );

    if (!currentType) return null;

    return {
      title: formatStepTitle(currentType),
      questions: questions.filter((q) => q.questionType === currentType),
    };
  }, [assessmentResponse, stepSlug]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!stepData) {
    return (
      <div className="text-center py-20 text-gray-500">Step not found</div>
    );
  }

  // ── Review page ──────────────────────────────────────────────────────────────
  if (stepSlug === "review") {
    const allQuestions: Question[] =
      assessmentResponse?.result?.questions ?? [];

    // Group questions by questionType, preserving original order
    const sectionMap = new Map<string, Question[]>();
    for (const q of allQuestions) {
      if (!sectionMap.has(q.questionType)) sectionMap.set(q.questionType, []);
      sectionMap.get(q.questionType)!.push(q);
    }

    const maritalVal = getMaritalStatusValue(formValues, allQuestions);
    const isMaritalEligible = isMaritalStatusSpouseEligible(maritalVal);
    const includeSpouse = shouldIncludeSpouse(formValues, allQuestions);

    const sections = Array.from(sectionMap.entries())
      .filter(([type]) => {
        const isSpousal = isSpousalOpenWorkPermit(type);
        if (isSpousal) {
          return isMaritalEligible;
        }
        if (!includeSpouse && isSpouseStepOrQuestion(type)) {
          return false;
        }
        return true;
      })
      .map(([type, qs]) => ({
        title: formatStepTitle(type),
        questions: qs.sort((a, b) => a.order - b.order),
      }));

    return (
      <div className="bg-background flex justify-center pt-4 md:pt-5 pb-16 md:pb-24">
        <div className="w-full max-w-4xl px-6">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-3 caros text-title">
              Review &amp; Submission
            </h1>
            <p className="poppins text-base text-description">
              Please review your answers carefully before submitting.
            </p>
          </div>

          {/* Sections */}
          {sections.map((section) => {
            const editPath = section.questions[0]?.questionType
              .toLowerCase()
              .replace(/\s+/g, "-") ?? "";
            return (
              <ReviewSection
                key={section.title}
                title={section.title}
                questions={section.questions}
                formValues={formValues}
                allQuestions={allQuestions}
                groups={assessmentResponse?.result?.groups ?? []}
                editPath={editPath}
              />
            );
          })}

          {/* Warning note before submission */}
          <div
            className="mt-6 rounded-2xl px-6 py-5 flex items-start gap-4 bg-amber-50/80 border border-amber-200/80 shadow-sm"
          >
            <AlertTriangle
              className="w-6 h-6 mt-0.5 shrink-0 text-amber-600"
            />
            <div>
              <p className="text-base font-semibold text-amber-900 poppins">
                Important: Review your information
              </p>
              <p className="text-sm text-amber-800 poppins mt-1 leading-relaxed">
                Please make sure all the information provided above is accurate and complete. Once your assessment is submitted, you will not be able to edit or make further changes.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <QuestionRenderer
      title={stepData.title}
      questions={stepData.questions}
      groups={assessmentResponse?.result?.groups}
      allQuestions={assessmentResponse?.result?.questions ?? []}
    />
  );
}
