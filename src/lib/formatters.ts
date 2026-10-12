const STEP_TITLE_MAP: Record<string, string> = {
  personal: "Personal Profile",
  family_information: "Family Information",
  previous_immigration_history: "Previous Immigration History",
  education_background: "Education Background",
  language_skills: "Language Skills",
  study_plans_in_canada: "Study Plans in Canada",
  financial_ability: "Financial Ability",
  study_permit_risk_assessment: "Study Permit Risk Assessment",
  future_immigration_goals: "Future Immigration Goals",
  spouse_personal: "Spouse Personal Profile",
  spouse_education: "Spouse Education Background",
  spouse_language_skills: "Your Spouse's Language Skills",
  spouse_language: "Your Spouse's Language Skills",
  spousal_language_skills: "Your Spouse's Language Skills",
  spouse_work_experience: "Spouse Work Experience",
  spousal_open_work_permit: "Spousal Open Work Permit",
  lmia_exempt_work_permit_assessment: "LMIA-Exempt Work Permit Assessment",
};

export const formatStepTitle = (type: string): string => {
  const key = type.toLowerCase().trim().replace(/[\s-]+/g, "_");
  if (STEP_TITLE_MAP[key]) return STEP_TITLE_MAP[key];
  return type
    .replace(/[_]+/g, " ")
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
    .replace(/lmia/ig, "LMIA");
};

