export const assessmentSlugToId: Record<string, string> = {
  "permanent-residence": "6a3512fa79dce42f4e5f4407",
  // Fallbacks or placeholders for others if needed
  "study": "6a3512fa79dce42f4e5f4408", 
  "work": "6a3512fa79dce42f4e5f4409",
  "family": "6a3512fa79dce42f4e5f440a",
};

export const getAssessmentApiId = (rawId: string) => {
  return assessmentSlugToId[rawId] || rawId;
};
