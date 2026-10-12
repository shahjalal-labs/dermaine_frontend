"use client";

import { useGetAssessmentByIdQuery } from "@/redux/api/assessmentApi";
import { Question } from "@/types/assessment";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import { getAssessmentApiId } from "@/lib/assessmentMap";

export default function AssessmentRootRedirect() {
  const params = useParams();
  const router = useRouter();
  const rawId = params.assessmentId as string;
  const assessmentId = getAssessmentApiId(rawId);

  const { data: assessmentResponse, isLoading } = useGetAssessmentByIdQuery(assessmentId, {
    skip: !assessmentId,
  });

  useEffect(() => {
    if (!isLoading && assessmentResponse?.result?.questions) {
      const questions: Question[] = assessmentResponse.result.questions;
      if (questions.length > 0) {
        const savedStep = localStorage.getItem(`assessmentStep_${assessmentId}`);
        if (savedStep && savedStep !== "completed") {
          router.replace(`/assessment/${rawId}/${savedStep}`);
        } else {
          // Redirect to the first questionType
          const firstType = questions[0].questionType.toLowerCase().replace(/\s+/g, "-");
          router.replace(`/assessment/${rawId}/${firstType}`);
        }
      }
    }
  }, [assessmentResponse, isLoading, assessmentId, router, rawId]);

  return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}
