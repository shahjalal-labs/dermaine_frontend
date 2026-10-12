import { z } from "zod";

export const studyAssessmentSchema = z.object({
  // Step 1: Personal Profile
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  email: z.string().email("Invalid email address"),
  telephone: z.string().min(1, "Telephone is required"),
  dateOfBirth: z.string().min(1, "Date of Birth is required"),
  gender: z.string().min(1, "Gender is required"),
  maritalStatus: z.string().min(1, "Marital Status is required"),
  currentCountry: z.string().min(1, "Current Country is required"),
  hasMultipleCitizenship: z.boolean({
    message: "Please select Yes or No",
  }),
  citizenships: z.array(z.string()).optional(),

  // Step 2: Family Information
  dependentChildren: z.string({ message: "Please select the number of children" }).min(1, "Please select the number of children"),
  spouseAccompany: z
    .boolean({ message: "Please select Yes or No" })
    .optional()
    .nullable(),
  childrenAccompany: z
    .boolean({ message: "Please select Yes or No" })
    .optional()
    .nullable(),

  // Step 3: Previous Immigration History
  visitedCanada: z
    .boolean({ message: "Please select Yes or No" }),
  studiedInCanada: z
    .boolean({ message: "Please select Yes or No" }),
  workedInCanada: z
    .boolean({ message: "Please select Yes or No" }),
  appliedForCanadianVisa: z
    .boolean({ message: "Please select Yes or No" }),
  refusedVisaOrEntry: z
    .boolean({ message: "Please select Yes or No" })
    .optional()
    .nullable(),
  refusalExplanation: z.string().optional(),
  overstayedInCountry: z
    .boolean({ message: "Please select Yes or No" })
    .optional()
    .nullable(),
  overstayedExplanation: z.string().optional(),
  removalOrderOrDeportation: z
    .boolean({ message: "Please select Yes or No" })
    .optional()
    .nullable(),
  removalExplanation: z.string().optional(),
  validVisaForCountries: z.array(z.string()).optional().nullable(),

  // Step 4: Education Background
  highestEducation: z.string().min(1, "Highest Education is required"),
  fieldOfStudy: z.string().min(1, "Field of Study is required"),
  institutionName: z.string().min(1, "Institution Name is required"),
  countryOfEducation: z.string().min(1, "Country of Education is required"),
  yearCompleted: z.string().min(1, "Year Completed is required"),

  // Step 5: Language Skills
  takenEnglishTest: z.boolean({ message: "Please select Yes or No" }),
  englishTestType: z.string().optional(),
  englishWriting: z.string().min(1, "Please select a level"),
  englishReading: z.string().min(1, "Please select a level"),
  englishSpeaking: z.string().min(1, "Please select a level"),
  englishListening: z.string().min(1, "Please select a level"),
  takenFrenchTest: z.boolean({ message: "Please select Yes or No" }),
  frenchTestType: z.string().optional(),
  frenchWriting: z.string().min(1, "Please select a level"),
  frenchReading: z.string().min(1, "Please select a level"),
  frenchSpeaking: z.string().min(1, "Please select a level"),
  frenchListening: z.string().min(1, "Please select a level"),

  // Step 6: Study Plans In Canada
  studyLevel: z.string().min(1, "Study Level is required"),
  haveSchoolInMind: z
    .boolean({ message: "Please select Yes or No" })
    .optional()
    .nullable(),
  schoolName: z.string().optional(),
  intendedProvince: z.string().min(1, "Province is required"),
  programName: z.string().min(1, "Program Name is required"),
  programLength: z.string().min(1, "Program Length is required"),
  tuitionCost: z.string().min(1, "Tuition Cost is required"),
  programStartDate: z.string().min(1, "Start Date is required"),
  qualifiesForPGWP: z
    .boolean({ message: "Please select Yes or No" })
    .optional()
    .nullable(),

  // Step 7: Financial Ability
  whoWillPay: z.string().min(1, "Who will pay is required"),
  savingsAmount: z.string().min(1, "Savings Amount is required"),
  annualIncome: z.string().min(1, "Annual Income is required"),
  ownProperty: z
    .boolean({ message: "Please select Yes or No" })
    .optional()
    .nullable(),
  proofOfFunds: z
    .boolean({ message: "Please select Yes or No" })
    .optional()
    .nullable(),
  paidTuitionDeposit: z
    .boolean({ message: "Please select Yes or No" })
    .optional()
    .nullable(),
  purchasedGIC: z
    .boolean({ message: "Please select Yes or No" })
    .optional()
    .nullable(),

  // Step 8: Study Permit Risk Assessment
  currentlyEmployed: z
    .boolean({ message: "Please select Yes or No" }),
  occupation: z.string().optional(),
  employer: z.string().optional(),
  employmentCountry: z.string().optional(),
  employmentStartDate: z.string().optional(),
  annualSalary: z.string().optional(),

  ownBusiness: z
    .boolean({ message: "Please select Yes or No" }),
  businessName: z.string().optional(),
  yearsOperating: z.string().optional(),
  businessCountry: z.string().optional(),

  familyTiesInHomeCountry: z
    .boolean({ message: "Please select Yes or No" }),
  familyMembersTies: z.array(z.string()).optional(),
  studyReason: z.string().min(1, "Reason is required"),
  returnReason: z.string().min(1, "Reason is required"),
  criminalCharges: z
    .boolean({ message: "Please select Yes or No" }),
  medicalConditions: z
    .boolean({ message: "Please select Yes or No" }),

  // Step 9: Future Immigration Goals
  interestedInPR: z
    .boolean({ message: "Please select Yes or No" }),
  provincesOfInterest: z.string({ message: "Please select at least one province" }).min(1, "Please select at least one province"),
  ruralImmigration: z
    .boolean({ message: "Please select Yes or No" }),
  francophonePathways: z
    .boolean({ message: "Please select Yes or No" }),
  relativesInCanada: z.array(z.string(), { message: "Please select at least one option" }).min(1, "Please select at least one option"),

  // Step 10: Final Review Continues
  professionalAssistance: z.string().optional().nullable(),
}).superRefine((data, ctx) => {
  // Family Information Validation
  if (
    (data.maritalStatus === "Married" ||
      data.maritalStatus === "Common-Law") &&
    data.spouseAccompany === undefined
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please select Yes or No",
      path: ["spouseAccompany"],
    });
  }

  if (
    data.dependentChildren &&
    data.dependentChildren !== "0" &&
    data.childrenAccompany === undefined
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please select Yes or No",
      path: ["childrenAccompany"],
    });
  }

  if (data.refusedVisaOrEntry === true && (!data.refusalExplanation || data.refusalExplanation.trim().length < 10)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please provide a description of at least 10 characters",
      path: ["refusalExplanation"],
    });
  }
  if (data.overstayedInCountry === true && (!data.overstayedExplanation || data.overstayedExplanation.trim().length < 10)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please provide a description of at least 10 characters",
      path: ["overstayedExplanation"],
    });
  }
  if (data.removalOrderOrDeportation === true && (!data.removalExplanation || data.removalExplanation.trim().length < 10)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please provide a description of at least 10 characters",
      path: ["removalExplanation"],
    });
  }

  // Language Skills Validation
  if (data.takenEnglishTest === true && !data.englishTestType) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please select which English test you have taken",
      path: ["englishTestType"],
    });
  }
  if (data.takenFrenchTest === true && !data.frenchTestType) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please select which French test you have taken",
      path: ["frenchTestType"],
    });
  }

  // Risk Assessment Validation
  if (data.currentlyEmployed === true) {
    if (!data.occupation) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Occupation is required", path: ["occupation"] });
    }
    if (!data.employer) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Employer is required", path: ["employer"] });
    }
    if (!data.employmentCountry) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Country is required", path: ["employmentCountry"] });
    }
    if (!data.employmentStartDate) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Start Date is required", path: ["employmentStartDate"] });
    }
    if (!data.annualSalary) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Annual Salary is required", path: ["annualSalary"] });
    }
  }

  if (data.ownBusiness === true) {
    if (!data.businessName) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Business Name is required", path: ["businessName"] });
    }
    if (!data.yearsOperating) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Years Operating is required", path: ["yearsOperating"] });
    }
    if (!data.businessCountry) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Country is required", path: ["businessCountry"] });
    }
  }

  if (data.familyTiesInHomeCountry === true) {
    if (!data.familyMembersTies || data.familyMembersTies.length === 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select at least one family member", path: ["familyMembersTies"] });
    }
  }
});

export type StudyAssessmentFormData = z.infer<typeof studyAssessmentSchema>;

export const stepFields = [
  // Step 1
  [
    "firstName",
    "lastName",
    "email",
    "telephone",
    "dateOfBirth",
    "gender",
    "maritalStatus",
    "currentCountry",
    "hasMultipleCitizenship",
    "citizenships",
  ],
  // Step 2
  ["dependentChildren", "spouseAccompany", "childrenAccompany"],
  // Step 3
  [
    "visitedCanada",
    "studiedInCanada",
    "workedInCanada",
    "appliedForCanadianVisa",
    "validVisaForCountries",
    "refusedVisaOrEntry",
    "refusalExplanation",
    "overstayedInCountry",
    "overstayedExplanation",
    "removalOrderOrDeportation",
    "removalExplanation",
  ],
  // Step 4
  [
    "highestEducation",
    "fieldOfStudy",
    "institutionName",
    "countryOfEducation",
    "yearCompleted",
  ],
  // Step 5
  [
    "takenEnglishTest",
    "englishTestType",
    "englishWriting",
    "englishReading",
    "englishSpeaking",
    "englishListening",
    "takenFrenchTest",
    "frenchTestType",
    "frenchWriting",
    "frenchReading",
    "frenchSpeaking",
    "frenchListening",
  ],
  // Step 6
  [
    "studyLevel",
    "haveSchoolInMind",
    "schoolName",
    "intendedProvince",
    "programName",
    "programLength",
    "tuitionCost",
    "programStartDate",
    "qualifiesForPGWP",
  ],
  // Step 7
  [
    "whoWillPay",
    "savingsAmount",
    "annualIncome",
    "ownProperty",
    "proofOfFunds",
    "paidTuitionDeposit",
    "purchasedGIC",
  ],
  // Step 8
  [
    "currentlyEmployed",
    "occupation",
    "employer",
    "employmentCountry",
    "employmentStartDate",
    "annualSalary",
    "ownBusiness",
    "businessName",
    "yearsOperating",
    "businessCountry",
    "familyTiesInHomeCountry",
    "familyMembersTies",
    "studyReason",
    "returnReason",
    "criminalCharges",
    "medicalConditions",
  ],
  // Step 9
  [
    "interestedInPR",
    "provincesOfInterest",
    "ruralImmigration",
    "francophonePathways",
    "relativesInCanada",
  ],
  // Step 10
  ["professionalAssistance"],
];

export const routeSteps = [
  {
    id: 1,
    title: "Personal Profile",
    path: "personal-profile",
    fields: stepFields[0],
  },
  {
    id: 2,
    title: "Family Information",
    path: "family-information",
    fields: stepFields[1],
  },
  {
    id: 3,
    title: "Immigration History",
    path: "immigration-history",
    fields: stepFields[2],
  },
  {
    id: 4,
    title: "Education Background",
    path: "education-background",
    fields: stepFields[3],
  },
  {
    id: 5,
    title: "Language Skills",
    path: "language-skills",
    fields: stepFields[4],
  },
  { id: 6, title: "Study Plans", path: "study-plans", fields: stepFields[5] },
  {
    id: 7,
    title: "Financial Ability",
    path: "financial-ability",
    fields: stepFields[6],
  },
  {
    id: 8,
    title: "Risk Assessment",
    path: "risk-assessment",
    fields: stepFields[7],
  },
  { id: 9, title: "Future Goals", path: "future-goals", fields: stepFields[8] },
  { id: 10, title: "Final Review", path: "review", fields: stepFields[9] },
];
