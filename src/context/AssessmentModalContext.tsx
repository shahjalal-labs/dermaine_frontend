"use client";

import AssessmentModal from "@/components/Assessment/AssessmentModal";
import React, { createContext, useContext, useState } from "react";

interface AssessmentModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const AssessmentModalContext = createContext<AssessmentModalContextType>({
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
});

export const useAssessmentModal = () => useContext(AssessmentModalContext);

export function AssessmentModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AssessmentModalContext.Provider
      value={{
        isOpen,
        openModal: () => setIsOpen(true),
        closeModal: () => setIsOpen(false),
      }}
    >
      {children}
      <AssessmentModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </AssessmentModalContext.Provider>
  );
}
