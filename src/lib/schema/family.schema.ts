import { z } from "zod";

export const familyAssessmentSchema = z
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

    // Family Connection
    hasFamilyInCanada: z.boolean({ message: "Please select Yes or No" }),
    relationshipToFamily: z
      .string({
        message: "Please select your relationship to family",
      })
      .optional(),
    familyImmigrationStatus: z
      .string({
        message: "Please select family immigration status",
      })
      .optional(),
    familyProvince: z
      .string({ message: "Please select family province" })
      .optional(),

    // Spousal Sponsorship
    legallyMarried: z
      .boolean({ message: "You are legally married?" })
      .optional(),
    dateOfMarriage: z
      .string({ message: "Date of marriage is required" })
      .optional(),
    livedTogether12Months: z
      .boolean({
        message: "You have lived together for at least 12 months?",
      })
      .optional(),
    timeTogether: z
      .string({ message: "You have been together for?" })
      .optional(),
    haveChildrenTogether: z
      .boolean({ message: "You have children together?" })
      .optional(),
    metInPerson: z.boolean({ message: "You have met in person?" }).optional(),
    communicateFrequency: z
      .string()
      .min(1, "Communication frequency is required")
      .optional(),
    previouslyMarried: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    currentlyLivingTogether: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    separationLength: z
      .string({ message: "Separation length is required" })
      .optional(),

    // Sponsor Eligibility
    sponsorType: z.string().optional(),
    sponsorAge: z.string().optional(),
    sponsorResidesInCanada: z
      .boolean({
        message: "Sponsor Resides In Canada is required",
      })
      .optional(),
    sponsorPreviouslySponsored: z
      .boolean({ message: "Sponsor Previously Sponsored is required" })
      .optional(),
    sponsorOnSocialAssistance: z
      .boolean({ message: "Sponsor On Social Assistance is required" })
      .optional(),
    sponsorEmployed: z
      .boolean({ message: "Sponsor Employed is required" })
      .optional(),
    sponsorIncome: z.string().optional(),
    sponsorDefaultedUndertaking: z
      .boolean({ message: "Sponsor Defaulted Undertaking is required" })
      .optional(),

    // Parent / Grandparent
    pgSituation: z.string().optional(),
    pgAreYou: z.string().optional(),
    receivedPgpInvitation: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    pgInterestedIn: z.string().optional(),
    pgLengthOfStay: z.string().optional(),

    pgSponsorCitizen: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    pgSponsorAge18: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    pgSponsorLiveInCanada: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    pgSponsorReceivedInvitation: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    pgSponsorMeetIncome: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    pgSponsorFamilySize: z.string().optional(),

    // Dependent Child
    dependentChildSituation: z.string().optional(),
    dependentChildDOB: z.string().optional(),
    childIsMarried: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    childIsFinanciallyDependent: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    childConditionAffectingDependency: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    childBiologicalOrAdopted: z.string().optional(),

    // Adopted Child
    adoptedChildSituation: z.string().optional(),
    adoptedLegallyCompleted: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    adoptedOutsideCanada: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    adoptedBestInterests: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    adoptedGenuine: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    adoptedDOB: z.string().optional(),
    adoptedIsMarried: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    adoptedIsFinanciallyDependent: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    adoptedConditionAffectingDependency: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),

    // Brother / Sister
    siblingIsCitizenOrPR: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    siblingLivesInCanada: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    siblingProvince: z.string().optional(),
    siblingWillingToSupport: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    siblingInterestedIn: z.string().optional(),
    siblingHasOtherRelatives: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),

    // Orphaned Relative
    orphanedRelationshipToSponsor: z.string().optional(),
    orphanedUnder18: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    orphanedIsMarried: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    orphanedParentsDeceased: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    orphanedHasLegalGuardians: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),

    // Other Family Sponsorship
    otherRelativeIsCitizenOrPR: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    otherRelativeLivesInCanada: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    otherRelativeProvince: z.string().optional(),
    otherRelativeParentsDeceased: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    otherRelativeUnder18: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    otherRelativeIsMarried: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    otherRelativeFamilyInCanada: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    otherRelativeFamilyOutsideCanada: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    otherRelativeHardship: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),

    // Accompanying Spouse of Student
    spouseStudyingFullTime: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    spouseStudyProgram: z.string().optional(),
    spousePgwpEligible: z.string().optional(),
    spouseStudyPermitValidity: z.string().optional(),
    spouseStudentDesiredOutcome: z.string().optional(),

    // Accompanying Spouse of Worker
    workerSpousePermitType: z.string().optional(),
    workerSpouseOccupation: z.string().optional(),
    workerSpouseTeer: z.string().optional(),
    workerSpouseEmployedFullTime: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    workerSpousePermitValidity: z.string().optional(),
    workerSpouseDesiredOutcome: z.string().optional(),

    // Visitor Record
    vrVisitFamily: z.boolean({ message: "Please select Yes or No" }).optional(),
    vrIntendedLength: z.string().optional(),
    vrEmploymentHome: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    vrAssetsHome: z.boolean({ message: "Please select Yes or No" }).optional(),
    vrPreviouslyRefused: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),

    // Humanitarian
    hcSeparationLength: z.string().optional(),
    hcEmotionalHardship: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    hcFinancialHardship: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    hcChildrenNegativelyAffected: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    hcChildBestInterest: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    hcRelyOnCanadianFamily: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    hcLackSupportHome: z
      .boolean({ message: "Please select Yes or No" })
      .optional(),
    hcHardshipExplanation: z.string().optional(),

    professionalAssistance: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Step 2: Family Connection
    if (data.hasFamilyInCanada === true) {
      if (!data.relationshipToFamily) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select your relationship to family",
          path: ["relationshipToFamily"],
        });
      }
      if (!data.familyImmigrationStatus) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select family immigration status",
          path: ["familyImmigrationStatus"],
        });
      }
      if (!data.familyProvince) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select family province",
          path: ["familyProvince"],
        });
      }
    }

    // Step 3: Spousal Sponsorship
    const isSpouse = [
      "Spouse",
      "Common-law Partner",
      "Conjugal Partner",
    ].includes(data.relationshipToFamily as string);
    const isSponsorableStatus = [
      "Canadian Citizen",
      "Permanent Resident",
      "Registered Indian",
    ].includes(data.familyImmigrationStatus as string);

    if (isSpouse && isSponsorableStatus) {
      if (data.legallyMarried === undefined)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select Yes or No",
          path: ["legallyMarried"],
        });
      if (!data.dateOfMarriage)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Date of marriage is required",
          path: ["dateOfMarriage"],
        });
      if (data.livedTogether12Months === undefined)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select Yes or No",
          path: ["livedTogether12Months"],
        });
      if (!data.timeTogether)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select an option",
          path: ["timeTogether"],
        });
      if (data.haveChildrenTogether === undefined)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select Yes or No",
          path: ["haveChildrenTogether"],
        });
      if (data.metInPerson === undefined)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select Yes or No",
          path: ["metInPerson"],
        });
      if (!data.communicateFrequency)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Communication frequency is required",
          path: ["communicateFrequency"],
        });
      if (data.previouslyMarried === undefined)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select Yes or No",
          path: ["previouslyMarried"],
        });
      if (data.currentlyLivingTogether === undefined)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select Yes or No",
          path: ["currentlyLivingTogether"],
        });
      if (data.currentlyLivingTogether === false && !data.separationLength) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Separation length is required",
          path: ["separationLength"],
        });
      }
    }

    // Step 4: Sponsor Eligibility (assuming it shows for sponsorable status)
    if (isSponsorableStatus) {
      if (!data.sponsorType)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Sponsor Type is required",
          path: ["sponsorType"],
        });
      if (!data.sponsorAge)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Sponsor's age is required",
          path: ["sponsorAge"],
        });
      if (data.sponsorResidesInCanada === undefined)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Sponsor Resides In Canada is required",
          path: ["sponsorResidesInCanada"],
        });
      if (data.sponsorPreviouslySponsored === undefined)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Sponsor Previously Sponsored is required",
          path: ["sponsorPreviouslySponsored"],
        });
      if (data.sponsorOnSocialAssistance === undefined)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Sponsor On Social Assistance is required",
          path: ["sponsorOnSocialAssistance"],
        });
      if (data.sponsorEmployed === undefined)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Sponsor Employed is required",
          path: ["sponsorEmployed"],
        });
      if (!data.sponsorIncome)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Sponsor Income is required",
          path: ["sponsorIncome"],
        });
      if (data.sponsorDefaultedUndertaking === undefined)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Sponsor Defaulted Undertaking is required",
          path: ["sponsorDefaultedUndertaking"],
        });
    }

    // Step 5: Parent & Grandparent Pathways
    const isParentOrGrandparent = ["Parent", "Grandparent"].includes(
      data.relationshipToFamily as string
    );
    if (isParentOrGrandparent) {
      if (!data.pgSituation)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select a situation",
          path: ["pgSituation"],
        });

      if (
        data.pgSituation ===
        "I am the parent/grandparent and my child or grandchild is in Canada"
      ) {
        if (!data.pgAreYou)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select an option",
            path: ["pgAreYou"],
          });
        if (data.receivedPgpInvitation === undefined)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select Yes or No",
            path: ["receivedPgpInvitation"],
          });
        if (!data.pgInterestedIn)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select an option",
            path: ["pgInterestedIn"],
          });
        if (!data.pgLengthOfStay)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select an option",
            path: ["pgLengthOfStay"],
          });
      }

      if (
        data.pgSituation ===
        "I am in Canada and want to sponsor my parent or grandparent"
      ) {
        if (data.pgSponsorCitizen === undefined)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select Yes or No",
            path: ["pgSponsorCitizen"],
          });
        if (data.pgSponsorAge18 === undefined)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select Yes or No",
            path: ["pgSponsorAge18"],
          });
        if (data.pgSponsorLiveInCanada === undefined)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select Yes or No",
            path: ["pgSponsorLiveInCanada"],
          });
        if (data.pgSponsorReceivedInvitation === undefined)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select Yes or No",
            path: ["pgSponsorReceivedInvitation"],
          });
        if (data.pgSponsorMeetIncome === undefined)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select Yes or No",
            path: ["pgSponsorMeetIncome"],
          });
        if (!data.pgSponsorFamilySize)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please enter family size",
            path: ["pgSponsorFamilySize"],
          });
      }
    }

    // Step 6: Dependent Child
    const isChild =
      ["Biological Child", "Adopted Child", "Child"].includes(
        data.relationshipToFamily as string
      ) || data.relationshipToFamily?.includes("Child");
    if (isChild) {
      if (!data.dependentChildSituation)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select a situation",
          path: ["dependentChildSituation"],
        });

      if (
        data.dependentChildSituation ===
          "I am a parent in Canada and want to sponsor my child" ||
        data.dependentChildSituation ===
          "My parent is in Canada and may sponsor me as their dependent child"
      ) {
        if (!data.dependentChildDOB)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Date of birth is required",
            path: ["dependentChildDOB"],
          });
        if (data.childIsMarried === undefined)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select Yes or No",
            path: ["childIsMarried"],
          });
        if (data.childIsFinanciallyDependent === undefined)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select Yes or No",
            path: ["childIsFinanciallyDependent"],
          });
        if (data.childConditionAffectingDependency === undefined)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select Yes or No",
            path: ["childConditionAffectingDependency"],
          });
        if (!data.childBiologicalOrAdopted)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select an option",
            path: ["childBiologicalOrAdopted"],
          });
      }
    }

    // Step 7: Adopted Child
    const isAdoptedChild = data.relationshipToFamily === "Adopted Child";
    if (isAdoptedChild) {
      if (!data.adoptedChildSituation)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select a situation",
          path: ["adoptedChildSituation"],
        });

      if (
        data.adoptedChildSituation ===
          "I am a parent in Canada and want to sponsor my adopted child" ||
        data.adoptedChildSituation ===
          "I am an adopted child and my parent is in Canada"
      ) {
        if (data.adoptedLegallyCompleted === undefined)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select Yes or No",
            path: ["adoptedLegallyCompleted"],
          });
        if (data.adoptedOutsideCanada === undefined)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select Yes or No",
            path: ["adoptedOutsideCanada"],
          });
        if (data.adoptedBestInterests === undefined)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select Yes or No",
            path: ["adoptedBestInterests"],
          });
        if (data.adoptedGenuine === undefined)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select Yes or No",
            path: ["adoptedGenuine"],
          });
        if (!data.adoptedDOB)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Date of birth is required",
            path: ["adoptedDOB"],
          });
        if (data.adoptedIsMarried === undefined)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select Yes or No",
            path: ["adoptedIsMarried"],
          });
        if (data.adoptedIsFinanciallyDependent === undefined)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select Yes or No",
            path: ["adoptedIsFinanciallyDependent"],
          });
        if (data.adoptedConditionAffectingDependency === undefined)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select Yes or No",
            path: ["adoptedConditionAffectingDependency"],
          });
      }
    }

    // Step 9: Orphaned Relative
    const isOrphanedRelative = [
      "Brother or Sister",
      "Nephew or Niece",
      "Grandchild",
    ].includes(data.relationshipToFamily as string);
    if (isOrphanedRelative) {
      if (!data.orphanedRelationshipToSponsor)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select your relationship",
          path: ["orphanedRelationshipToSponsor"],
        });
      if (data.orphanedUnder18 === undefined)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select Yes or No",
          path: ["orphanedUnder18"],
        });
      if (data.orphanedIsMarried === undefined)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select Yes or No",
          path: ["orphanedIsMarried"],
        });
      if (data.orphanedParentsDeceased === undefined)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select Yes or No",
          path: ["orphanedParentsDeceased"],
        });
      if (data.orphanedHasLegalGuardians === undefined)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select Yes or No",
          path: ["orphanedHasLegalGuardians"],
        });
    }

    // Step 8: Brother / Sister
    const isSibling = data.relationshipToFamily === "Brother or Sister";
    if (isSibling) {
      if (data.siblingIsCitizenOrPR === undefined)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select Yes or No",
          path: ["siblingIsCitizenOrPR"],
        });
      if (data.siblingLivesInCanada === undefined)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select Yes or No",
          path: ["siblingLivesInCanada"],
        });
      if (data.siblingLivesInCanada && !data.siblingProvince)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Province is required",
          path: ["siblingProvince"],
        });
      if (data.siblingWillingToSupport === undefined)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select Yes or No",
          path: ["siblingWillingToSupport"],
        });
      if (!data.siblingInterestedIn)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select an option",
          path: ["siblingInterestedIn"],
        });
      if (data.siblingHasOtherRelatives === undefined)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select Yes or No",
          path: ["siblingHasOtherRelatives"],
        });
    }

    // Step 10: Other Relative
    const isOtherRelative = [
      "Aunt or Uncle",
      "Niece or Nephew",
      "Other Relative",
    ].includes(data.relationshipToFamily as string);
    if (isOtherRelative) {
      if (data.otherRelativeIsCitizenOrPR === undefined)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select Yes or No",
          path: ["otherRelativeIsCitizenOrPR"],
        });
      if (data.otherRelativeLivesInCanada === undefined)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select Yes or No",
          path: ["otherRelativeLivesInCanada"],
        });
      if (data.otherRelativeLivesInCanada && !data.otherRelativeProvince)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Province is required",
          path: ["otherRelativeProvince"],
        });
      if (data.otherRelativeParentsDeceased === undefined)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select Yes or No",
          path: ["otherRelativeParentsDeceased"],
        });
      if (data.otherRelativeUnder18 === undefined)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select Yes or No",
          path: ["otherRelativeUnder18"],
        });
      if (data.otherRelativeIsMarried === undefined)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select Yes or No",
          path: ["otherRelativeIsMarried"],
        });
      if (data.otherRelativeFamilyInCanada === undefined)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select Yes or No",
          path: ["otherRelativeFamilyInCanada"],
        });
      if (data.otherRelativeFamilyOutsideCanada === undefined)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select Yes or No",
          path: ["otherRelativeFamilyOutsideCanada"],
        });
      if (data.otherRelativeHardship === undefined)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select Yes or No",
          path: ["otherRelativeHardship"],
        });
    }

    // Step 11: Spouse of Worker
    const isSpouseOfWorker =
      ["Spouse", "Common-law Partner"].includes(
        data.relationshipToFamily as string
      ) && data.familyImmigrationStatus === "Temporary Resident / Worker";
    if (isSpouseOfWorker) {
      if (!data.workerSpousePermitType)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select a permit type",
          path: ["workerSpousePermitType"],
        });
      if (!data.workerSpouseOccupation)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Occupation is required",
          path: ["workerSpouseOccupation"],
        });
      if (!data.workerSpouseTeer)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select TEER category",
          path: ["workerSpouseTeer"],
        });
      if (data.workerSpouseEmployedFullTime === undefined)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select Yes or No",
          path: ["workerSpouseEmployedFullTime"],
        });
      if (!data.workerSpousePermitValidity)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select validity",
          path: ["workerSpousePermitValidity"],
        });
      if (!data.workerSpouseDesiredOutcome)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select an outcome",
          path: ["workerSpouseDesiredOutcome"],
        });
    }

    // Step 14: Humanitarian
    const isExtendedRelative = [
      "Brother or Sister",
      "Aunt or Uncle",
      "Niece or Nephew",
      "Other Relative",
    ].includes(data.relationshipToFamily as string);
    const indicatesHardship = data.otherRelativeHardship === true;
    const showHc = isExtendedRelative || indicatesHardship;

    if (showHc) {
      if (!data.hcSeparationLength)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select an option",
          path: ["hcSeparationLength"],
        });
      if (data.hcEmotionalHardship === undefined)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select Yes or No",
          path: ["hcEmotionalHardship"],
        });
      if (data.hcFinancialHardship === undefined)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select Yes or No",
          path: ["hcFinancialHardship"],
        });
      if (data.hcChildrenNegativelyAffected === undefined)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select Yes or No",
          path: ["hcChildrenNegativelyAffected"],
        });
      if (data.hcChildBestInterest === undefined)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select Yes or No",
          path: ["hcChildBestInterest"],
        });
      if (data.hcRelyOnCanadianFamily === undefined)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select Yes or No",
          path: ["hcRelyOnCanadianFamily"],
        });
      if (data.hcLackSupportHome === undefined)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select Yes or No",
          path: ["hcLackSupportHome"],
        });
      if (!data.hcHardshipExplanation)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please provide an explanation",
          path: ["hcHardshipExplanation"],
        });
    }
  });
export type FamilyAssessmentFormData = z.infer<typeof familyAssessmentSchema>;

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
      "citizenships",
    ],
  },
  {
    id: 2,
    title: "Family Connection",
    path: "family-connection",
    fields: [
      "hasFamilyInCanada",
      "relationshipToFamily",
      "familyImmigrationStatus",
      "familyProvince",
    ],
  },
  {
    id: 3,
    title: "Spousal / Partner Sponsorship",
    path: "spousal-sponsorship",
    fields: [
      "legallyMarried",
      "dateOfMarriage",
      "livedTogether12Months",
      "timeTogether",
      "haveChildrenTogether",
      "metInPerson",
      "communicateFrequency",
      "previouslyMarried",
      "currentlyLivingTogether",
      "separationLength",
    ],
  },
  {
    id: 4,
    title: "Sponsor Eligibility",
    path: "sponsor-eligibility",
    fields: [
      "sponsorType",
      "sponsorAge",
      "sponsorResidesInCanada",
      "sponsorPreviouslySponsored",
      "sponsorOnSocialAssistance",
      "sponsorEmployed",
      "sponsorIncome",
      "sponsorDefaultedUndertaking",
    ],
  },
  {
    id: 5,
    title: "Parent & Grandparent Pathways",
    path: "parent-grandparent",
    fields: [
      "pgSituation",
      "pgAreYou",
      "receivedPgpInvitation",
      "pgInterestedIn",
      "pgLengthOfStay",
      "pgSponsorCitizen",
      "pgSponsorAge18",
      "pgSponsorLiveInCanada",
      "pgSponsorReceivedInvitation",
      "pgSponsorMeetIncome",
      "pgSponsorFamilySize",
    ],
  },
  {
    id: 6,
    title: "Dependent Child Sponsorship",
    path: "dependent-child",
    fields: [
      "dependentChildSituation",
      "dependentChildDOB",
      "childIsMarried",
      "childIsFinanciallyDependent",
      "childConditionAffectingDependency",
      "childBiologicalOrAdopted",
    ],
  },
  {
    id: 7,
    title: "Adopted Child Sponsorship",
    path: "adopted-child",
    fields: [
      "adoptedChildSituation",
      "adoptedLegallyCompleted",
      "adoptedOutsideCanada",
      "adoptedBestInterests",
      "adoptedGenuine",
      "adoptedDOB",
      "adoptedIsMarried",
      "adoptedIsFinanciallyDependent",
      "adoptedConditionAffectingDependency",
    ],
  },
  {
    id: 8,
    title: "Brother / Sister Sponsorship",
    path: "brother-sister",
    fields: [
      "siblingIsCitizenOrPR",
      "siblingLivesInCanada",
      "siblingProvince",
      "siblingWillingToSupport",
      "siblingInterestedIn",
      "siblingHasOtherRelatives",
    ],
  },
  {
    id: 9,
    title: "Orphaned Relative Sponsorship",
    path: "orphaned-relative",
    fields: [
      "orphanedRelationshipToSponsor",
      "orphanedUnder18",
      "orphanedIsMarried",
      "orphanedParentsDeceased",
      "orphanedHasLegalGuardians",
    ],
  },
  {
    id: 10,
    title: "Other Sponsorship Exceptions",
    path: "other-exceptions",
    fields: [
      "otherRelativeIsCitizenOrPR",
      "otherRelativeLivesInCanada",
      "otherRelativeProvince",
      "otherRelativeParentsDeceased",
      "otherRelativeUnder18",
      "otherRelativeIsMarried",
      "otherRelativeFamilyInCanada",
      "otherRelativeFamilyOutsideCanada",
      "otherRelativeHardship",
    ],
  },
  {
    id: 11,
    title: "Spouse Of International Student",
    path: "spouse-of-student",
    fields: [
      "spouseStudyingFullTime",
      "spouseStudyProgram",
      "spousePgwpEligible",
      "spouseStudyPermitValidity",
      "spouseStudentDesiredOutcome",
    ],
  },
  {
    id: 12,
    title: "Spouse Of Foreign Worker",
    path: "spouse-of-worker",
    fields: [
      "workerSpousePermitType",
      "workerSpouseOccupation",
      "workerSpouseTeer",
      "workerSpouseEmployedFullTime",
      "workerSpousePermitValidity",
      "workerSpouseDesiredOutcome",
    ],
  },
  {
    id: 13,
    title: "Visitor Record Options",
    path: "visitor-record",
    fields: [
      "vrVisitFamily",
      "vrIntendedLength",
      "vrEmploymentHome",
      "vrAssetsHome",
      "vrPreviouslyRefused",
    ],
  },
  {
    id: 14,
    title: "Humanitarian & Compassionate",
    path: "humanitarian",
    fields: [
      "hcSeparationLength",
      "hcEmotionalHardship",
      "hcFinancialHardship",
      "hcChildrenNegativelyAffected",
      "hcChildBestInterest",
      "hcRelyOnCanadianFamily",
      "hcLackSupportHome",
      "hcHardshipExplanation",
    ],
  },
  {
    id: 15,
    title: "Review & Submission",
    path: "review",
    fields: ["professionalAssistance"],
  },
];

export function getApplicableSteps(data: Partial<FamilyAssessmentFormData>) {
  const rel = data.relationshipToFamily;
  const status = data.familyImmigrationStatus;

  const showSponsorEligibility = [
    "Canadian Citizen",
    "Permanent Resident",
    "Registered Indian",
  ].includes(status || "");
  const showSpousal =
    ["Spouse", "Common-law Partner", "Conjugal Partner"].includes(rel || "") &&
    showSponsorEligibility;
  const showPGP = ["Parent", "Grandparent"].includes(rel || "");
  const showDependentChild = [
    "Biological Child",
    "Adopted Child",
    "Child",
  ].includes(rel || "");
  const showAdoptedChild = rel === "Adopted Child";
  const showBrotherSister = rel === "Brother or Sister";
  const showOrphanedRelative = [
    "Brother or Sister",
    "Nephew or Niece",
    "Grandchild",
  ].includes(rel || "");
  const showOtherExceptions = [
    "Aunt or Uncle",
    "Niece or Nephew",
    "Other Relative",
  ].includes(rel || "");
  const showSpouseOfStudent =
    ["Spouse", "Common-law Partner"].includes(rel || "") &&
    status === "Temporary Resident / Student";
  const showSpouseOfWorker =
    ["Spouse", "Common-law Partner"].includes(rel || "") &&
    status === "Temporary Resident / Worker";
  const showVisitorRecord = status === "Visitor";
  const showHc =
    showOtherExceptions ||
    showBrotherSister ||
    data.otherRelativeHardship === true;

  return routeSteps.filter((step) => {
    switch (step.id) {
      case 1:
        return true; // Personal Profile
      case 2:
        return true; // Family Connection
      case 3:
        return showSponsorEligibility;
      case 4:
        return showSpousal;
      case 5:
        return showPGP;
      case 6:
        return showDependentChild;
      case 7:
        return showAdoptedChild;
      case 8:
        return showBrotherSister;
      case 9:
        return showOrphanedRelative;
      case 10:
        return showOtherExceptions;
      case 11:
        return showSpouseOfStudent;
      case 12:
        return showSpouseOfWorker;
      case 13:
        return showVisitorRecord;
      case 14:
        return showHc;
      case 15:
        return true; // Review & Submission
      default:
        return true;
    }
  });
}
