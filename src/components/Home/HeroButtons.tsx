"use client";

import ActionButton from "@/components/Shared/ActionButton";
import { useAssessmentModal } from "@/context/AssessmentModalContext";
import { useRouter } from "next/navigation";

export default function HeroButtons() {
  const { openModal } = useAssessmentModal();
  const router = useRouter();

  return (
    <>
      <div className="flex flex-wrap items-center gap-4 hover:gap-8 mt-2 ">
        <ActionButton
          variant="primary"
          className="font-medium"
          onClick={openModal}
        >
          Get started
        </ActionButton>
        <ActionButton 
          variant="outline" 
          className="font-medium"
          onClick={() => router.push('/book-consultation')}
        >
          Talk to an Expert
        </ActionButton>
      </div>
    </>
  );
}
