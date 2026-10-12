import { z } from "zod";

export const workAssessmentSchema = z
  .object({
    // Personal Profile
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    telephone: z.string().min(1, "Telephone is required"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    gender: z.string().min(1, "Gender is required"),
    maritalStatus: z.string().min(1, "Marital status is required"),
    currentCountry: z.string().min(1, "Current country is required"),
    hasMultipleCitizenship: z.boolean({
      message: "Please select Yes or No",
    }),
    citizenships: z.array(z.string()).optional(),

    // Family Information
    dependentChildren: z
      .string({ message: "Please select the number of children" })
      .min(1, "Please select the number of children"),
    spouseAccompany: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    childrenAccompany: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),

    // Previous Immigration History
    visitedCanada: z.boolean({ message: "Please select Yes or No" }),
    studiedInCanada: z.boolean({ message: "Please select Yes or No" }),
    workedInCanada: z.boolean({ message: "Please select Yes or No" }),
    appliedForCanadianVisa: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
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

    // Employment Background
    currentlyEmployed: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    currentJobTitle: z.string().optional(),
    employerName: z.string().optional(),
    countryOfEmployment: z.string().optional(),
    employmentStartDate: z.string().optional(),
    currentSalary: z.string().optional(),

    // Work Experience
    workExperiences: z
      .array(
        z.object({
          totalYearsWorkExperience: z.string({ message: "Total years of work experience is required" }).min(1, "Total years of work experience is required"),
          occupationNoc: z.string({ message: "Occupation / NOC is required" }).min(1, "Occupation / NOC is required"),
          mainJobDuties: z.string({ message: "Please provide a description of at least 10 characters" }).min(10, "Please provide a description of at least 10 characters"),
          managerialRole: z.boolean({ message: "Please select Yes or No" }),
          supervisedEmployees: z.boolean({ message: "Please select Yes or No" }),
          moreExperienceToAdd: z.boolean({ message: "Please select Yes or No" }).optional(),
        })
      )
      .optional(),

    // Canadian Job Offer
    hasCanadianJobOffer: z
      .boolean({ message: "Please select Yes or No" }),
    canadianEmployerName: z.string().optional(),
    provinceOfEmployment: z.string().optional(),
    canadianOccupation: z.string().optional(),
    wageOffered: z.string().optional(),
    lmiaWilling: z.string().optional(),
    lmiaApproved: z.boolean({ message: "Please select Yes or No" }).optional(),
    lmiaNumber: z.string().optional(),
    nocCode: z.string().optional(),
    teerCategory: z.string().optional(),

    // LMIA-Exempt Work Permit
    lmiaExemptPermits: z.preprocess(
      (val) => val ?? [],
      z.array(z.string()).min(1, "Please select at least one option")
    ),
    worksForIntlCompany: z
      .boolean({ message: "Please select Yes or No" }),
    workedContinuously1Year: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    transferringToCanadaBranch: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),

    // Spousal Open Work Permit
    spouseInCanada: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    spouseStatus: z.string().optional(),
    spouseOccupation: z.string().optional(),
    spouseProvince: z.string().optional(),
    spouseNocTeer: z.string().optional(),
    spouseWorking30Hours: z.boolean({ message: "Please select Yes or No" }).optional(),
    spouseWorkPermitValidity: z.string().optional(),
    spouseStudentEducationLevel: z.string().optional(),
    spouseProgramLength: z.string().optional(),
    spouseFinalAcademicTerm: z.boolean({ message: "Please select Yes or No" }).optional(),

    // Admissibility Review
    workedWithoutAuth: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    workedWithoutAuthExplanation: z.string().optional(),
    overstayedStatus: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    overstayedStatusExplanation: z.string().optional(),
    violatedConditions: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    violatedConditionsExplanation: z.string().optional(),
    criminalOffence: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    criminalOffenceExplanation: z.string().optional(),
    refusedVisaOtherCountry: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    refusedVisaOtherCountryExplanation: z.string().optional(),

    // Future Immigration Goals
    interestedInPR: z.boolean({ message: "Please select Yes or No" }),
    provincesOfInterest: z.preprocess(
      (val) => val ?? [],
      z.array(z.string()).min(1, "Please select at least one option")
    ),
    ruralImmigration: z.boolean({ message: "Please select Yes or No" }),
    francophonePathways: z.boolean({ message: "Please select Yes or No" }),
    relativesInCanada: z.preprocess(
      (val) => val ?? [],
      z.array(z.string()).min(1, "Please select at least one option")
    ),

    professionalAssistance: z.string().optional(),
  })
  .superRefine((data, ctx) => {
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

    if (
      data.refusedVisaOrEntry === true &&
      (!data.refusalExplanation || data.refusalExplanation.trim().length < 10)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please provide a description of at least 10 characters",
        path: ["refusalExplanation"],
      });
    }
    if (
      data.overstayedInCountry === true &&
      (!data.overstayedExplanation ||
        data.overstayedExplanation.trim().length < 10)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please provide a description of at least 10 characters",
        path: ["overstayedExplanation"],
      });
    }
    if (
      data.removalOrderOrDeportation === true &&
      (!data.removalExplanation || data.removalExplanation.trim().length < 10)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please provide a description of at least 10 characters",
        path: ["removalExplanation"],
      });
    }

    // Canadian Job Offer Validation
    if (data.hasCanadianJobOffer === true) {
      if (!data.canadianEmployerName) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Employer Name is required", path: ["canadianEmployerName"] });
      }
      if (!data.provinceOfEmployment) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Province of Employment is required", path: ["provinceOfEmployment"] });
      }
      if (!data.canadianOccupation) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Occupation / Job Title is required", path: ["canadianOccupation"] });
      }
      if (!data.wageOffered) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Wage Offered is required", path: ["wageOffered"] });
      }
      if (!data.lmiaWilling) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select an option", path: ["lmiaWilling"] });
      }
      if (data.lmiaApproved === undefined) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select Yes or No", path: ["lmiaApproved"] });
      } else if (data.lmiaApproved === true) {
        if (!data.nocCode) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: "NOC Code is required", path: ["nocCode"] });
        }
        if (!data.teerCategory) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: "TEER Category is required", path: ["teerCategory"] });
        }
      }
    }

    // LMIA-Exempt Work Permit Validation
    if (data.worksForIntlCompany === true) {
      if (data.workedContinuously1Year === undefined) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select Yes or No", path: ["workedContinuously1Year"] });
      }
      if (data.transferringToCanadaBranch === undefined) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select Yes or No", path: ["transferringToCanadaBranch"] });
      }
    }

    // Spousal Open Work Permit Validation
    if (data.maritalStatus === "Married" || data.maritalStatus === "Common-Law") {
      if (data.spouseInCanada === undefined) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select Yes or No", path: ["spouseInCanada"] });
      } else if (data.spouseInCanada === true) {
        if (!data.spouseStatus) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Spouse Status is required", path: ["spouseStatus"] });
        } else if (data.spouseStatus === "worker") {
          if (!data.spouseOccupation) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Spouse Occupation is required", path: ["spouseOccupation"] });
          }
          if (!data.spouseProvince) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Province is required", path: ["spouseProvince"] });
          }
          if (!data.spouseNocTeer) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Spouse NOC / TEER is required", path: ["spouseNocTeer"] });
          }
          if (data.spouseWorking30Hours === undefined) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select Yes or No", path: ["spouseWorking30Hours"] });
          }
          if (!data.spouseWorkPermitValidity) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select validity", path: ["spouseWorkPermitValidity"] });
          }
        } else if (data.spouseStatus === "student") {
          if (!data.spouseStudentEducationLevel) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select education level", path: ["spouseStudentEducationLevel"] });
          }
          if (!data.spouseProgramLength) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select program length", path: ["spouseProgramLength"] });
          }
          if (data.spouseFinalAcademicTerm === undefined) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select Yes or No", path: ["spouseFinalAcademicTerm"] });
          }
        }
      }
    }

    // Admissibility Review Validation
    if (data.workedWithoutAuth === true && (!data.workedWithoutAuthExplanation || data.workedWithoutAuthExplanation.trim().length < 10)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please provide a description of at least 10 characters", path: ["workedWithoutAuthExplanation"] });
    }
    if (data.overstayedStatus === true && (!data.overstayedStatusExplanation || data.overstayedStatusExplanation.trim().length < 10)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please provide a description of at least 10 characters", path: ["overstayedStatusExplanation"] });
    }
    if (data.violatedConditions === true && (!data.violatedConditionsExplanation || data.violatedConditionsExplanation.trim().length < 10)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please provide a description of at least 10 characters", path: ["violatedConditionsExplanation"] });
    }
    if (data.criminalOffence === true && (!data.criminalOffenceExplanation || data.criminalOffenceExplanation.trim().length < 10)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please provide a description of at least 10 characters", path: ["criminalOffenceExplanation"] });
    }
    if (data.refusedVisaOtherCountry === true && (!data.refusedVisaOtherCountryExplanation || data.refusedVisaOtherCountryExplanation.trim().length < 10)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please provide a description of at least 10 characters", path: ["refusedVisaOtherCountryExplanation"] });
    }
  });

export type WorkAssessmentFormData = z.infer<typeof workAssessmentSchema>;

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
    title: "Family Information",
    path: "family-information",
    fields: ["dependentChildren", "spouseAccompany", "childrenAccompany"],
  },
  {
    id: 3,
    title: "Previous Immigration History",
    path: "immigration-history",
    fields: [
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
  },
  {
    id: 4,
    title: "Employment Background",
    path: "employment-background",
    fields: [
      "currentlyEmployed",
      "currentJobTitle",
      "employerName",
      "countryOfEmployment",
      "employmentStartDate",
      "currentSalary",
    ],
  },
  {
    id: 5,
    title: "Work Experience",
    path: "work-experience",
    fields: [
      "workExperiences"
    ],
  },
  {
    id: 6,
    title: "Canadian Job Offer",
    path: "canadian-job-offer",
    fields: [
      "hasCanadianJobOffer",
      "canadianEmployerName",
      "provinceOfEmployment",
      "canadianOccupation",
      "wageOffered",
      "lmiaWilling",
      "lmiaApproved",
      "lmiaNumber",
      "nocCode",
      "teerCategory",
    ],
  },
  {
    id: 7,
    title: "LMIA-Exempt Work Permit",
    path: "lmia-exempt",
    fields: [
      "lmiaExemptPermits",
      "worksForIntlCompany",
      "workedContinuously1Year",
      "transferringToCanadaBranch",
    ],
  },
  {
    id: 8,
    title: "Spousal Open Work Permit",
    path: "spousal-open-work-permit",
    fields: [
      "spouseInCanada",
      "spouseStatus",
      "spouseOccupation",
      "spouseProvince",
      "spouseNocTeer",
      "spouseWorking30Hours",
      "spouseWorkPermitValidity",
      "spouseStudentEducationLevel",
      "spouseProgramLength",
      "spouseFinalAcademicTerm"
    ],
  },
  {
    id: 9,
    title: "Admissibility Review",
    path: "admissibility-review",
    fields: [
      "workedWithoutAuth",
      "workedWithoutAuthExplanation",
      "overstayedStatus",
      "overstayedStatusExplanation",
      "violatedConditions",
      "violatedConditionsExplanation",
      "criminalOffence",
      "criminalOffenceExplanation",
      "refusedVisaOtherCountry",
      "refusedVisaOtherCountryExplanation"
    ],
  },
  {
    id: 10,
    title: "Future Immigration Goals",
    path: "future-goals",
    fields: [
      "interestedInPR", 
      "provincesOfInterest", 
      "ruralImmigration",
      "francophonePathways",
      "relativesInCanada"
    ],
  },
  {
    id: 11,
    title: "Review & Submission",
    path: "review",
    fields: ["professionalAssistance"],
  },
];
