import { z } from "zod";

export const prAssessmentSchema = z.object({
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

  // Language Skills
  takenEnglishTest: z
    .boolean()
    .optional()
    .refine((val) => typeof val === "boolean", {
      message: "Please select Yes or No",
    }),
  englishTestType: z.string().optional(),
  englishWriting: z.string().optional(),
  englishReading: z.string().optional(),
  englishSpeaking: z.string().optional(),
  englishListening: z.string().optional(),
  takenFrenchTest: z
    .boolean()
    .optional()
    .refine((val) => typeof val === "boolean", {
      message: "Please select Yes or No",
    }),
  frenchTestType: z.string().optional(),
  frenchWriting: z.string().optional(),
  frenchReading: z.string().optional(),
  frenchSpeaking: z.string().optional(),
  frenchListening: z.string().optional(),

  // Education and Training
  completedPostSecondary: z
    .boolean()
    .optional()
    .refine((val) => typeof val === "boolean", {
      message: "Please select Yes or No",
    }),
  educationHistory: z
    .array(
      z.object({
        eduQualificationType: z
          .string()
          .min(1, "Qualification type is required"),
        eduCountry: z.string().min(1, "Country is required"),
        eduIsFullTime: z.boolean({ message: "Please select Yes or No" }),
        eduStartDate: z.string().min(1, "Start date is required"),
        eduInProgress: z.boolean({ message: "Please select Yes or No" }),
        eduExpectedFinish: z.string().optional(),
      })
    )
    .optional(),

  // Work History
  hasWorkExperience: z
    .boolean()
    .optional()
    .refine((val) => typeof val === "boolean", {
      message: "Please select Yes or No",
    }),
  workHistory: z
    .array(
      z.object({
        workJobType: z.string().min(1, "Job type/NOC is required"),
        workPaymentStructure: z
          .string()
          .min(1, "Payment structure is required"),
        workHoursPerWeek: z.string().min(1, "Hours per week is required"),
        workCountry: z.string().min(1, "Country is required"),
        workStartDate: z.string().min(1, "Start date is required"),
        workStillEmployed: z.boolean({ message: "Please select Yes or No" }),
      })
    )
    .max(5)
    .optional(),

  // Your Dependents
  hasDependents: z
    .boolean()
    .optional()
    .refine((val) => typeof val === "boolean", {
      message: "Please select Yes or No",
    }),
  dependents: z
    .array(
      z.object({
        dependentCitizenship: z.string().min(1, "Citizenship is required"),
        dependentResidencyStatus: z
          .string()
          .min(1, "Residency status is required"),
        dependentDOB: z.string().optional(),
        dependentCountryResidence: z.string().optional(),
      })
    )
    .max(7, "You can add up to 7 dependents")
    .optional(),

  // Canadian Relatives Input
  hasCanadianRelatives: z
    .boolean()
    .optional()
    .refine((val) => typeof val === "boolean", {
      message: "Please select Yes or No",
    }),
  canadianRelatives: z
    .array(
      z.object({
        relConnectionType: z.string().min(1, "Connection type is required"),
        relResidencyStatus: z.string().min(1, "Residency status is required"),
        relProvince: z.string().min(1, "Province is required"),
        relDOB: z.string().optional(),
        relStartDate: z.string().optional(),
      })
    )
    .max(7, "You can add up to 7 connections")
    .optional(),

  // Canadian Job Offer
  hasCanadianJobOffer: z
    .boolean()
    .optional()
    .refine((val) => typeof val === "boolean", {
      message: "Please select Yes or No",
    }),
  jobOfferNOC: z.string().optional(),
  jobOfferPaid: z.string().optional(),
  jobOfferHours: z.string().optional(),
  jobOfferProvince: z.string().optional(),
  jobOfferLMIAExempt: z
    .boolean({ message: "Please select Yes or No" })
    .optional(),
  jobOfferHasEndDate: z
    .boolean({ message: "Please select Yes or No" })
    .optional(),
  jobOfferEndDate: z.string().optional(),

  // Personal Net Worth
  netWorthCurrency: z.string().min(1, "Currency is required"),
  netWorthAmount: z.string().min(1, "Net worth amount is required"),
  householdIncomeAmount: z.string().min(1, "Household income is required"),
  fundsForCanada: z.string().min(1, "Please select funds for Canada"),
  addSpouseToApplication: z
    .boolean()
    .optional()
    .refine((val) => typeof val === "boolean", {
      message: "Please select Yes or No",
    }),

  // Spouse Information
  spouseDOB: z.string().optional(),
  spouseCitizenship: z.string().optional(),
  spouseHasMultipleCitizenship: z
    .boolean({ message: "Please select Yes or No" })
    .optional(),
  spouseCitizenships: z.array(z.string()).optional(),
  spouseCountryOfResidence: z.string().optional(),

  // Spouse Language Skills
  spouseTakenEnglishTest: z
    .boolean({ message: "Please select Yes or No" })
    .optional(),
  spouseEnglishTestType: z.string().optional(),
  spouseEnglishWriting: z.string().optional(),
  spouseEnglishReading: z.string().optional(),
  spouseEnglishSpeaking: z.string().optional(),
  spouseEnglishListening: z.string().optional(),
  spouseTakenFrenchTest: z
    .boolean({ message: "Please select Yes or No" })
    .optional(),
  spouseFrenchTestType: z.string().optional(),
  spouseFrenchWriting: z.string().optional(),
  spouseFrenchReading: z.string().optional(),
  spouseFrenchSpeaking: z.string().optional(),
  spouseFrenchListening: z.string().optional(),

  // Spouse Education and Training
  spouseCompletedHighSchool: z
    .boolean({ message: "Please select Yes or No" })
    .optional(),
  spousePostSecondary: z
    .boolean({ message: "Please select Yes or No" })
    .optional(),
  spouseEducationHistory: z
    .array(
      z.object({
        eduQualificationType: z
          .string()
          .min(1, "Qualification type is required"),
        eduCountry: z.string().min(1, "Country is required"),
        eduIsFullTime: z.boolean({ message: "Please select Yes or No" }),
        eduStartDate: z.string().min(1, "Start date is required"),
        eduInProgress: z.boolean({ message: "Please select Yes or No" }),
        eduExpectedFinish: z.string().optional(),
      })
    )
    .optional(),

  // Spouse Work History
  spouseHasWorkExperience: z
    .boolean({ message: "Please select Yes or No" })
    .optional(),
  spouseWorkHistory: z
    .array(
      z.object({
        workJobType: z.string().min(1, "Job type/NOC is required"),
        workPaymentStructure: z.string().min(1, "Payment structure is required"),
        workHoursPerWeek: z.string().min(1, "Hours per week is required"),
        workCountry: z.string().min(1, "Country is required"),
        workStartDate: z.string().min(1, "Start date is required"),
        isCurrentJob: z.boolean({ message: "Please select Yes or No" }),
        workEndDate: z.string().optional(),
      })
    )
    .optional(),
  spouseFamilyInCanada: z
    .boolean({ message: "Please select Yes or No" })
    .optional(),

  // Additional Information
  submissionTimeline: z.string().optional().refine(val => val && val.length > 0, "Please select an option"),
  canadianAncestor: z.string().optional().refine(val => val && val.length > 0, "Please select an option"),

  agreeUpdates: z.boolean().optional(),
  agreeContact: z.boolean().optional(),
  agreeTerms: z.boolean().optional(),

  professionalAssistance: z.string().min(1, "Please select an option"),
})
  .superRefine((data, ctx) => {
    if (data.hasCanadianJobOffer === true) {
      if (!data.jobOfferNOC) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["jobOfferNOC"],
          message: "Please select a job type",
        });
      }
      if (!data.jobOfferPaid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["jobOfferPaid"],
          message: "Please select whether this job is paid or non-paid.",
        });
      }
      if (!data.jobOfferHours) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["jobOfferHours"],
          message: "Please select hours per week",
        });
      }
      if (!data.jobOfferProvince) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["jobOfferProvince"],
          message: "Please select a province",
        });
      }
      if (typeof data.jobOfferLMIAExempt !== "boolean") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["jobOfferLMIAExempt"],
          message: "Please select Yes or No",
        });
      }
      if (typeof data.jobOfferHasEndDate !== "boolean") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["jobOfferHasEndDate"],
          message: "Please select Yes or No",
        });
      }
      if (data.jobOfferHasEndDate === true && !data.jobOfferEndDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["jobOfferEndDate"],
          message: "Please provide the end date",
        });
      }
    }

    if (data.takenEnglishTest === true) {
      if (!data.englishTestType) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["englishTestType"], message: "Please select test type" });
      if (!data.englishReading) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["englishReading"], message: "Score required" });
      if (!data.englishWriting) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["englishWriting"], message: "Score required" });
      if (!data.englishSpeaking) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["englishSpeaking"], message: "Score required" });
      if (!data.englishListening) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["englishListening"], message: "Score required" });
    }

    if (data.takenFrenchTest === true) {
      if (!data.frenchTestType) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["frenchTestType"], message: "Please select test type" });
      if (!data.frenchReading) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["frenchReading"], message: "Score required" });
      if (!data.frenchWriting) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["frenchWriting"], message: "Score required" });
      if (!data.frenchSpeaking) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["frenchSpeaking"], message: "Score required" });
      if (!data.frenchListening) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["frenchListening"], message: "Score required" });
    }

    if (data.completedPostSecondary === true) {
      if (!data.educationHistory || data.educationHistory.length === 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["educationHistory"], message: "Please add at least one education record" });
      }
    }

    if (data.hasWorkExperience === true) {
      if (!data.workHistory || data.workHistory.length === 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["workHistory"], message: "Please add at least one work record" });
      }
    }

    if (data.hasDependents === true) {
      if (!data.dependents || data.dependents.length === 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["dependents"], message: "Please add at least one dependent" });
      }
    }

    if (data.hasCanadianRelatives === true) {
      if (!data.canadianRelatives || data.canadianRelatives.length === 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["canadianRelatives"], message: "Please add at least one relative" });
      }
    }

    if (data.addSpouseToApplication === true) {
      if (!data.spouseDOB) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["spouseDOB"],
          message: "Date of Birth is required",
        });
      }
      if (typeof data.spouseHasMultipleCitizenship !== "boolean") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["spouseHasMultipleCitizenship"],
          message: "Please select Yes or No",
        });
      } else {
        if (data.spouseHasMultipleCitizenship === true) {
          if (!data.spouseCitizenships || data.spouseCitizenships.length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["spouseCitizenships"],
              message: "Please add at least one citizenship",
            });
          }
        } else {
          if (!data.spouseCitizenship) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["spouseCitizenship"],
              message: "Country of Citizenship is required",
            });
          }
        }
      }
      if (!data.spouseCountryOfResidence) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["spouseCountryOfResidence"],
          message: "Country of Residence is required",
        });
      }

      // Spouse toggles
      if (typeof data.spouseTakenEnglishTest !== "boolean") {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["spouseTakenEnglishTest"], message: "Please select Yes or No" });
      } else if (data.spouseTakenEnglishTest === true) {
        if (!data.spouseEnglishTestType) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["spouseEnglishTestType"], message: "Please select test type" });
        if (!data.spouseEnglishReading) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["spouseEnglishReading"], message: "Score required" });
        if (!data.spouseEnglishWriting) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["spouseEnglishWriting"], message: "Score required" });
        if (!data.spouseEnglishSpeaking) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["spouseEnglishSpeaking"], message: "Score required" });
        if (!data.spouseEnglishListening) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["spouseEnglishListening"], message: "Score required" });
      }

      if (typeof data.spouseTakenFrenchTest !== "boolean") {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["spouseTakenFrenchTest"], message: "Please select Yes or No" });
      } else if (data.spouseTakenFrenchTest === true) {
        if (!data.spouseFrenchTestType) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["spouseFrenchTestType"], message: "Please select test type" });
        if (!data.spouseFrenchReading) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["spouseFrenchReading"], message: "Score required" });
        if (!data.spouseFrenchWriting) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["spouseFrenchWriting"], message: "Score required" });
        if (!data.spouseFrenchSpeaking) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["spouseFrenchSpeaking"], message: "Score required" });
        if (!data.spouseFrenchListening) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["spouseFrenchListening"], message: "Score required" });
      }

      if (typeof data.spouseCompletedHighSchool !== "boolean") {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["spouseCompletedHighSchool"], message: "Please select Yes or No" });
      }

      if (typeof data.spousePostSecondary !== "boolean") {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["spousePostSecondary"], message: "Please select Yes or No" });
      } else if (data.spousePostSecondary === true) {
        if (!data.spouseEducationHistory || data.spouseEducationHistory.length === 0) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["spouseEducationHistory"], message: "Please add at least one education record" });
        }
      }

      if (typeof data.spouseHasWorkExperience !== "boolean") {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["spouseHasWorkExperience"], message: "Please select Yes or No" });
      } else if (data.spouseHasWorkExperience === true) {
        if (!data.spouseWorkHistory || data.spouseWorkHistory.length === 0) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["spouseWorkHistory"], message: "Please add at least one work record" });
        }
      }

      if (typeof data.spouseFamilyInCanada !== "boolean") {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["spouseFamilyInCanada"], message: "Please select Yes or No" });
      }
    }
  });

export type PRAssessmentFormData = z.infer<typeof prAssessmentSchema>;

export const routeSteps = [
  {
    id: 1,
    title: "Personal Profile",
    path: "personal-profile",
    fields: [
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
  },
  {
    id: 2,
    title: "Language Skills",
    path: "language-skills",
    fields: [
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
  },
  {
    id: 3,
    title: "Education and Training",
    path: "education-training",
    fields: ["completedPostSecondary", "educationHistory"],
  },
  {
    id: 4,
    title: "Work History",
    path: "work-history",
    fields: ["hasWorkExperience", "workHistory"],
  },
  {
    id: 5,
    title: "Your Dependents",
    path: "your-dependents",
    fields: ["hasDependents", "dependents"],
  },
  {
    id: 6,
    title: "Canadian Relatives",
    path: "canadian-relatives",
    fields: ["hasCanadianRelatives", "canadianRelatives"],
  },
  {
    id: 7,
    title: "Canadian Job Offer",
    path: "canadian-job-offer",
    fields: [
      "hasCanadianJobOffer",
      "jobOfferNOC",
      "jobOfferPaid",
      "jobOfferHours",
      "jobOfferProvince",
      "jobOfferLMIAExempt",
      "jobOfferHasEndDate",
      "jobOfferEndDate",
    ],
  },
  {
    id: 8,
    title: "Personal Net Worth",
    path: "personal-net-worth",
    fields: [
      "netWorthCurrency",
      "netWorthAmount",
      "householdIncomeAmount",
      "fundsForCanada",
      "addSpouseToApplication",
      "spouseDOB",
      "spouseCitizenship",
      "spouseHasMultipleCitizenship",
      "spouseCitizenships",
      "spouseCountryOfResidence",
    ],
  },
  {
    id: 9,
    title: "Spouse Language Skills",
    path: "spouse-language-skills",
    fields: [
      "spouseTakenEnglishTest",
      "spouseEnglishTestType",
      "spouseEnglishWriting",
      "spouseEnglishReading",
      "spouseEnglishSpeaking",
      "spouseEnglishListening",
      "spouseTakenFrenchTest",
      "spouseFrenchTestType",
      "spouseFrenchWriting",
      "spouseFrenchReading",
      "spouseFrenchSpeaking",
      "spouseFrenchListening",
    ],
  },
  {
    id: 10,
    title: "Spouse Education",
    path: "spouse-education",
    fields: [
      "spouseCompletedHighSchool",
      "spousePostSecondary",
      "spouseEducationHistory",
    ],
  },
  {
    id: 11,
    title: "Spouse Work History",
    path: "spouse-work-history",
    fields: [
      "spouseHasWorkExperience",
      "spouseWorkHistory",
      "spouseFamilyInCanada",
    ],
  },
  {
    id: 12,
    title: "Additional Information",
    path: "additional-information",
    fields: [
      "submissionTimeline",
      "canadianAncestor",
      "agreeUpdates",
      "agreeContact",
      "agreeTerms",
    ],
  },
  {
    id: 13,
    title: "Review & Submission",
    path: "review",
    fields: ["professionalAssistance"],
  },
];
