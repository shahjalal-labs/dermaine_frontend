/* eslint-disable @typescript-eslint/no-explicit-any */
import { Question } from "@/types/assessment";

export const ADDITIONAL_VISA_COUNTRIES = [
  "Japan",
  "South Korea",
  "Singapore",
  "Malaysia",
  "Vietnam",
  "Brunei",
  "Ireland",
  "Romania",
  "Bulgaria",
  "Cyprus",
  "Panama",
  "Costa Rica",
  "Honduras",
  "Ukraine",
  "Bénin",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cameroon",
  "Central African Republic",
  "Chad",
  "Comoros",
  "Côte d'Ivoire",
  "Democratic Republic of the Congo",
  "Dominica",
  "Republic of the Congo",
  "Djibouti",
  "Egypt",
  "Equatorial Guinea",
  "Gabon",
  "Guinea",
  "Guinea-Bissau",
  "Haïti",
  "Lebanon",
  "Madagascar",
  "Mali",
  "Mauritania",
  "Mauritius",
  "Morocco",
  "Niger",
  "Rwanda",
  "Saint Lucia",
  "São Tomé and Principe",
  "Senegal",
  "Seychelles",
  "Togo",
  "Tunisia",
];

export function cleanTextEncoding(text: string | null | undefined): string {
  if (!text) return text || "";
  return text
    .replace(/â€™|ΓÇÖ/g, "’")
    .replace(/â€“|ΓÇô/g, "–")
    .replace(/â€”|ΓÇö/g, "—")
    .replace(/â€˜|ΓÇÿ/g, "‘");
}

/**
 * Normalizes and enriches assessment questions based on client business rules:
 * 1. Study Permit Risk Assessment: "Employer Name" is optional.
 * 2. Previous Immigration History: Adds the client-requested countries to the visa countries list.
 * 3. Family Sponsorship Assessment:
 *    - Standardizes relationship question text and the 11 client options.
 *    - Standardizes immigration status options with the 8 target statuses.
 *    - Ensures all child repeater fields are correctly bound to repeatable groupId.
 *    - Marks redundant fields as optional.
 */

export const CHILDREN_GROUP_ID = "6a9fcba504ea094707c6da7a";

export const FAMILY_RELATIONSHIP_OPTIONS = [
  { label: "My spouse", value: "my_spouse" },
  { label: "My common-law partner", value: "my_common_law_partner" },
  { label: "My conjugal partner", value: "my_conjugal_partner" },
  { label: "My parent", value: "my_parent" },
  { label: "My grandparent", value: "my_grandparent" },
  { label: "My biological child", value: "my_biological_child" },
  { label: "My adopted child", value: "my_adopted_child" },
  { label: "My brother or sister", value: "my_brother_or_sister" },
  { label: "My aunt or uncle", value: "my_aunt_or_uncle" },
  { label: "My niece or nephew", value: "my_niece_or_nephew" },
  { label: "Another relative", value: "another_relative" },
];

export const FAMILY_STATUS_OPTIONS = [
  { label: "Canadian Citizen", value: "canadian_citizen" },
  { label: "Permanent Resident", value: "permanent_resident" },
  { label: "Registered Indian", value: "registered_indian" },
  { label: "Temporary Resident – Worker", value: "temporary_resident_worker" },
  { label: "Temporary Resident – Student", value: "temporary_resident_student" },
  { label: "Temporary Resident – Visitor", value: "temporary_resident_visitor" },
  { label: "Other", value: "other" },
  { label: "Unsure", value: "unsure" },
];




export function patchAssessmentQuestions(questions: Question[]): Question[] {
  if (!Array.isArray(questions)) return questions;

  return questions.map((rawQuestion) => {
    let question = {
      ...rawQuestion,
      questionText: cleanTextEncoding(rawQuestion.questionText),
      helpText: rawQuestion.helpText ? cleanTextEncoding(rawQuestion.helpText) : rawQuestion.helpText,
      options: rawQuestion.options?.map((opt) => ({
        ...opt,
        label: cleanTextEncoding(opt.label),
      })),
    };
    const qText = (question.questionText || "").toLowerCase().trim();
    const qType = (question.questionType || "").toUpperCase();
    const qId = (question.questionId || "").toLowerCase();

    // 1. Study Permit Risk Assessment: Employer Name must be optional
    const isEmployerQuestion =
      question.questionId === "question_1785857630433" ||
      (qType.includes("RISK_ASSESSMENT") && qText.includes("employer name"));

    if (isEmployerQuestion) {
      question = {
        ...question,
        isOptional: true,
      };
    }

    // 2. Previous Immigration History: Add additional visa countries
    const isVisaCountriesQuestion =
      question.questionId === "question_1785853351727" ||
      (qType.includes("PREVIOUS_IMMIGRATION_HISTORY") &&
        qText.includes("valid visa for any of the following countries"));

    if (isVisaCountriesQuestion && question.options) {
      const existingOptions = [...question.options];
      const existingValues = new Set(
        existingOptions.map((opt) => opt.value?.toLowerCase())
      );
      const existingLabels = new Set(
        existingOptions.map((opt) => opt.label?.toLowerCase())
      );

      const newOptions = ADDITIONAL_VISA_COUNTRIES.filter((country) => {
        const val = country.toLowerCase().replace(/[^a-z0-9]/g, "_");
        const lbl = country.toLowerCase();
        return !existingValues.has(val) && !existingLabels.has(lbl);
      }).map((country) => {
        const value = country.toLowerCase().replace(/[^a-z0-9]/g, "_");
        return {
          id: `opt_country_${value}`,
          label: country,
          value: value,
          helpText: null,
          questionId: question.id || question.questionId,
        };
      });

      question = {
        ...question,
        options: [...existingOptions, ...newOptions],
      };
    }

    // 3. Family Sponsorship Assessment: Standardize Relationship Question & Options
    const isFamilyRelQuestion =
      question.questionId === "question_1786528419964" ||
      question.questionId === "who_is_family_member" ||
      question.questionId === "relationshipToFamily" ||
      question.id === "6a7c431cc36c04dc85a46282" ||
      ((qText.includes("relationship") || qText.includes("who is this family member")) &&
        (qType === "FAMILY_MEMBER_LIVING_IN_CANADA" || qText.includes("family member")));

    if (isFamilyRelQuestion) {
      question = {
        ...question,
        questionText: "Who is this family member living in Canada?",
        options: FAMILY_RELATIONSHIP_OPTIONS.map((opt) => ({
          id: `opt_rel_${opt.value}`,
          label: opt.label,
          value: opt.value,
          helpText: null,
          questionId: question.id || question.questionId,
        })),
      };
    }

    // 4. Family Sponsorship Assessment: Standardize Immigration Status Question & Options
    const isFamilyStatusQuestion =
      question.questionId === "question_1786528562364" ||
      question.questionId === "familyImmigrationStatus" ||
      question.id === "6a7c4381c36c04dc85a4628e" ||
      (qText.includes("current immigration status") &&
        (qType === "FAMILY_MEMBER_LIVING_IN_CANADA" || qText.includes("their current immigration status")));

    if (isFamilyStatusQuestion) {
      question = {
        ...question,
        options: FAMILY_STATUS_OPTIONS.map((opt) => ({
          id: `opt_status_${opt.value}`,
          label: opt.label,
          value: opt.value,
          helpText: null,
          questionId: question.id || question.questionId,
        })),
      };
    }

    // 4.5. Family Assessment: Fix marriage legally recognized question
    const isMarriageLegallyRecognized = qText.includes("is your marriage legally recognized");
    if (isMarriageLegallyRecognized) {
      question = {
        ...question,
        inputType: "SELECT",
        isCountry: false,
        options: [
          { id: "opt_yes", label: "Yes", value: "yes", helpText: null, questionId: question.id || question.questionId },
          { id: "opt_no", label: "No", value: "no", helpText: null, questionId: question.id || question.questionId },
          { id: "opt_not_sure", label: "I am not sure", value: "not_sure", helpText: null, questionId: question.id || question.questionId },
        ],
      };
    }

    // 4.6. Family Assessment: Update helper text for previously sponsored
    if (qText.includes("previously sponsored to canada")) {
      question = {
        ...question,
        helpText: "Sponsorship is when an eligible person in Canada helps their spouse (legally married), common-law partner (lived together as a couple for at least 12 continuous months), or conjugal partner (in a committed relationship but unable to marry or live together) apply for permanent residence.",
      };
    }

    // 4.7. Family Assessment: Make specific dates optional
    if (qText.includes("become a permanent resident") || qText.includes("current status expire")) {
      question = {
        ...question,
        isOptional: true,
      };
    }

    // 4.8. Add client-requested helper texts for conjugal/family flow
    if (qText.includes("genuine conjugal relationship with your partner for at least 12 months")) {
      question = {
        ...question,
        helpText: "A conjugal relationship is a committed, marriage-like relationship where you and your partner have been together for at least 12 months, but serious barriers have prevented you from marrying or living together continuously.",
      };
    }
    
    if (qText.includes("have either you or your partner previously been married or in a common-law relationship") || 
        qText === "what type of relationship was it?" || 
        qText.includes("is this child married or in a common-law relationship")) {
      question = {
        ...question,
        helpText: "A married relationship means two people are legally joined in a marriage that is officially recognized by the law of the province or country where it took place. A common-law relationship means two people are not legally married but have lived together continuously in a marriage-like relationship for at least one full year.",
      };
    }
    
    if (qText.includes("receiving social assistance for reasons other than disability")) {
      question = {
        ...question,
        helpText: "Social assistance is financial or other support provided by a provincial government to help with basic living needs such as food, housing, clothing and essential expenses. It generally does not include assistance received because of a disability.",
      };
    }
    
    if (qText.includes("undischarged bankrupt")) {
      question = {
        ...question,
        helpText: "An undischarged bankrupt is someone who has declared bankruptcy but has not been legally released (discharged) from the bankruptcy.",
      };
    }
    
    if (qText === "has your partner previously sponsored another spouse, common-law partner or conjugal partner?") {
      question = {
        ...question,
        helpText: "A sponsor is a Canadian Citizen, permanent resident, or person registered as an Indian under the Canadian Indian Act who applies to bring a family member to live in Canada. By becoming a sponsor, they sign a legally binding contract promising to financially support the relative and cover their basic needs like food, housing, and clothing so the newcomer does not have to rely on government social assistance.",
      };
    }
    
    if (qText.includes("subject to a removal order from canada")) {
      question = {
        ...question,
        helpText: "A removal order is an official order from Canadian immigration authorities requiring a person to leave Canada. It may include a departure order, exclusion order, or deportation order.",
      };
    }

    // 5. Family Assessment: Ensure dynamic child repeater questions belong to CHILDREN_GROUP_ID
    const isChildGateQuestion =
      qId.endsWith("_has_children") ||
      qId === "q_spouse_has_children" ||
      qId === "q_has_children" ||
      qText === "do you have any children?" ||
      qText === "do you have any children" ||
      qText === "do you have children that are directly affected by the immigration decision?";

    if (isChildGateQuestion) {
      question = {
        ...question,
        order: 9999, // Force to bottom as requested
      };
    }

    const isChildRepeaterQuestion =
      !isChildGateQuestion &&
      (qId.includes("child_relationship") ||
        qId.includes("child_age") ||
        qId.includes("child_married") ||
        qId.includes("child_is_married") ||
        qId.includes("child_dependent_22") ||
        qId.includes("child_financially_dependent_condition") ||
        qId.includes("child_country") ||
        qId.includes("child_accompany") ||
        qText.includes("what is this child’s relationship to you") ||
        qText.includes("what is this child's relationship to you") ||
        qText.includes("how old is this child") ||
        qText.includes("is this child married or in a common-law") ||
        qText.includes("has this child depended substantially on a parent for financial support since before age 22") ||
        qText.includes("what country does this child currently live in") ||
        qText.includes("will this child come to canada with you"));

    if (isChildRepeaterQuestion) {
      question = {
        ...question,
        groupId: CHILDREN_GROUP_ID,
      };
    }

    // 6. Family Assessment: Mark redundant fields as optional
    const isRedundant =
      (qType !== "PERSONAL" &&
        (qText === "what is your date of birth?" ||
          qText === "what is your date of birth" ||
          qText === "date of birth" ||
          qText === "what is your date of birth?*" ||
          qText === "what is your age?" ||
          qText === "what is your age" ||
          qText === "age")) ||
      qText.includes("parent’s date of birth") ||
      qText.includes("parent's date of birth") ||
      qText.includes("grandparent’s date of birth") ||
      qText.includes("grandparent's date of birth") ||
      qText.startsWith("do you plan to") ||
      qText.includes("what type of authorization would you like assessed") ||
      qText.includes("what options would you like assessed");

    if (isRedundant) {
      question = {
        ...question,
        isOptional: true,
      };
    }

    // 7. PR & Repeatable Work History Parity: Work End Date depends on "Is this your current job?" == false
    // Note: Exclude prospective job offers in Work in Canada assessment
    const isJobEndMatch =
      (qId.includes("workenddate") ||
        qId.includes("work_end_date") ||
        qId.includes("job_end_date") ||
        qText.includes("when did the job end") ||
        qText.includes("when did this job end") ||
        qText.includes("when did employment end")) &&
      !qType.includes("JOB_OFFER") &&
      !qType.includes("CANADIAN_JOB_OFFER") &&
      !qType.includes("WORK_PERMIT") &&
      !qText.includes("prospective") &&
      !qText.includes("job offer") &&
      !qText.includes("contract");

    if (isJobEndMatch) {
      const currentJobParent =
        (question.groupId
          ? questions.find(
              (pq) =>
                pq.groupId === question.groupId &&
                ((pq.questionText || "").toLowerCase().includes("current job") ||
                  (pq.questionText || "").toLowerCase().includes("still employed") ||
                  (pq.questionText || "").toLowerCase().includes("currently working") ||
                  (pq.questionText || "").toLowerCase().includes("currently employed") ||
                  (pq.questionId || "").toLowerCase().includes("currentjob") ||
                  (pq.questionId || "").toLowerCase().includes("stillemployed") ||
                  pq.questionId === "workStillEmployed")
            )
          : null) ||
        questions.find(
          (pq) =>
            (pq.questionText || "").toLowerCase().includes("current job") ||
            (pq.questionText || "").toLowerCase().includes("still employed") ||
            (pq.questionText || "").toLowerCase().includes("currently working") ||
            (pq.questionText || "").toLowerCase().includes("currently employed") ||
            (pq.questionId || "").toLowerCase().includes("currentjob") ||
            (pq.questionId || "").toLowerCase().includes("stillemployed") ||
            pq.questionId === "workStillEmployed"
        );

      if (currentJobParent) {
        question = {
          ...question,
          dependsOnQuestionId: currentJobParent.id || currentJobParent.questionId,
          dependsOnOperator: "IS_FALSE",
          dependsOnValue: "false",
        };
      }
    }

    // 8. PR & Repeatable Education Parity:
    // A. Expected Finish Date depends on "Is this program still in progress?" == true
    const isEduExpectedFinishMatch =
      (qId.includes("eduexpectedfinish") ||
        qId.includes("edu_expected_finish") ||
        qId.includes("expectedfinish") ||
        qId.includes("expected_finish") ||
        qText.includes("expected to finish") ||
        qText.includes("expected finish")) &&
      !qType.includes("STUDY_PLANS") &&
      !qType.includes("STUDY_PERMIT") &&
      !qType.includes("PROGRAM_OF_STUDY") &&
      !qText.includes("plan to study") &&
      !qText.includes("prospective");

    if (isEduExpectedFinishMatch) {
      const inProgressParent =
        (question.groupId
          ? questions.find(
              (pq) =>
                pq.groupId === question.groupId &&
                ((pq.questionText || "").toLowerCase().includes("in progress") ||
                  (pq.questionText || "").toLowerCase().includes("still in progress") ||
                  (pq.questionText || "").toLowerCase().includes("still studying") ||
                  (pq.questionText || "").toLowerCase().includes("currently studying") ||
                  (pq.questionId || "").toLowerCase().includes("inprogress") ||
                  pq.questionId === "eduInProgress")
            )
          : null) ||
        questions.find(
          (pq) =>
            (pq.questionText || "").toLowerCase().includes("in progress") ||
            (pq.questionText || "").toLowerCase().includes("still in progress") ||
            (pq.questionText || "").toLowerCase().includes("still studying") ||
            (pq.questionText || "").toLowerCase().includes("currently studying") ||
            (pq.questionId || "").toLowerCase().includes("inprogress") ||
            pq.questionId === "eduInProgress"
        );

      if (inProgressParent) {
        question = {
          ...question,
          dependsOnQuestionId: inProgressParent.id || inProgressParent.questionId,
          dependsOnOperator: "IS_TRUE",
          dependsOnValue: "true",
        };
      }
    }

    // B. Education End Date depends on "Is this program still in progress?" == false
    const isEduEndMatch =
      !isEduExpectedFinishMatch &&
      (qId.includes("eduenddate") ||
        qId.includes("edu_end_date") ||
        qText.includes("when did the program end") ||
        qText.includes("when did this program end")) &&
      !qType.includes("STUDY_PLANS") &&
      !qType.includes("STUDY_PERMIT") &&
      !qType.includes("PROGRAM_OF_STUDY") &&
      !qText.includes("plan to study") &&
      !qText.includes("will your program end") &&
      !qText.includes("prospective");

    if (isEduEndMatch) {
      const inProgressParent =
        (question.groupId
          ? questions.find(
              (pq) =>
                pq.groupId === question.groupId &&
                ((pq.questionText || "").toLowerCase().includes("in progress") ||
                  (pq.questionText || "").toLowerCase().includes("still in progress") ||
                  (pq.questionText || "").toLowerCase().includes("still studying") ||
                  (pq.questionText || "").toLowerCase().includes("currently studying") ||
                  (pq.questionId || "").toLowerCase().includes("inprogress") ||
                  pq.questionId === "eduInProgress")
            )
          : null) ||
        questions.find(
          (pq) =>
            (pq.questionText || "").toLowerCase().includes("in progress") ||
            (pq.questionText || "").toLowerCase().includes("still in progress") ||
            (pq.questionText || "").toLowerCase().includes("still studying") ||
            (pq.questionText || "").toLowerCase().includes("currently studying") ||
            (pq.questionId || "").toLowerCase().includes("inprogress") ||
            pq.questionId === "eduInProgress"
        );

      if (inProgressParent) {
        question = {
          ...question,
          dependsOnQuestionId: inProgressParent.id || inProgressParent.questionId,
          dependsOnOperator: "IS_FALSE",
          dependsOnValue: "false",
        };
      }
    }

    // 9. Conjugal Partner Parity & Children order
    if (qType === "MY_CONJUGAL_PARTNER" || qType.includes("CONJUGAL")) {
      if (qId === "q_conj_rel_begin" || qId === "q_conj_meet_in_person") {
        question = { ...question, isOptional: true };
      }

      if (qId === "conj_prev_rel_who" || qId === "conj_prev_rel_type" || qId === "conj_prev_rel_end") {
        // conj_previous_relationship is BOOLEAN
        question = { ...question, dependsOnQuestionId: "conj_previous_relationship", dependsOnValue: "true", dependsOnOperator: "EQUALS" };
      }

      if (qId === "conj_prev_sponsored_date") {
        // conj_sponsor_prev_sponsored is SELECT
        question = { ...question, dependsOnQuestionId: "conj_sponsor_prev_sponsored", dependsOnValue: "yes", dependsOnOperator: "EQUALS" };
      }

      if (qId === "conj_was_sponsored_date") {
        // conj_sponsor_was_sponsored is SELECT
        question = { ...question, dependsOnQuestionId: "conj_sponsor_was_sponsored", dependsOnValue: "yes", dependsOnOperator: "EQUALS" };
      }

      if (qId === "conj_sponsor_return_intent") {
        // conj_sponsor_lives_canada is BOOLEAN
        question = { ...question, dependsOnQuestionId: "conj_sponsor_lives_canada", dependsOnValue: "false", dependsOnOperator: "EQUALS" };
      }

      if (qId === "conj_conviction_details") {
        // conj_sponsor_conviction is SELECT
        question = { ...question, dependsOnQuestionId: "conj_sponsor_conviction", dependsOnValue: "yes", dependsOnOperator: "EQUALS" };
      }

      if (qId === "conj_outside_country" || qId === "conj_outside_status") {
        // conj_in_canada is BOOLEAN
        question = { ...question, dependsOnQuestionId: "conj_in_canada", dependsOnValue: "false", dependsOnOperator: "EQUALS" };
      }
    }

    // 10. Conjugal Partner: Prevented question depends on able to legally marry == 'no'
    if (qText === "what has prevented you from marrying or living together?") {
      const legallyMarryQ = questions.find((pq) => (pq.questionText || "").toLowerCase().trim() === "have you been able to legally marry?");
      if (legallyMarryQ) {
        question = {
          ...question,
          dependsOnQuestionId: legallyMarryQ.id || legallyMarryQ.questionId,
          dependsOnOperator: "IN_LIST",
          dependsOnValue: '["false", "no"]',
        };
      }
    }

    // 11. Child age dependency: Has this child depended substantially... depends on child_age >= 22
    if (qText.includes("has this child depended substantially on a parent") || qText.includes("financial support since before age 22")) {
      const childAgeQ = questions.find((pq) => (pq.questionText || "").toLowerCase().includes("how old is this child") && pq.groupId === question.groupId);
      if (childAgeQ) {
        question = {
          ...question,
          dependsOnQuestionId: childAgeQ.id || childAgeQ.questionId,
          dependsOnOperator: "GREATER_THAN_OR_EQUAL",
          dependsOnValue: "22",
        };
      }
    }

    // 12. Worker in Canada: Spouse or Common-law partner
    if (qText === "is this person in canada:" || qText === "is this person in canada") {
      question = {
        ...question,
        questionText: "Is this person in Canada your spouse or common-law partner?",
        options: [
          { id: "opt_spouse", label: "Spouse", value: "spouse", helpText: null, questionId: question.id || question.questionId },
          { id: "opt_common_law", label: "Common-law partner", value: "common_law", helpText: null, questionId: question.id || question.questionId }
        ],
        helpText: "A married relationship means two people are legally joined in a marriage that is officially recognized by the law of the province or country where it took place. A common-law relationship means two people are not legally married but have lived together continuously in a marriage-like relationship for at least one full year."
      };
    }

    // 13. Worker in Canada: Immigration status in that country
    if (qText === "what is your current immigration status in that country?" || qText === "what is your current immigration status in that country") {
      question = {
        ...question,
        options: [
          { id: "opt_status_citizen", label: "Citizen", value: "citizen", helpText: null, questionId: question.id || question.questionId },
          { id: "opt_status_pr", label: "Permanent resident", value: "permanent_resident", helpText: null, questionId: question.id || question.questionId },
          { id: "opt_status_worker", label: "Worker", value: "worker", helpText: null, questionId: question.id || question.questionId },
          { id: "opt_status_student", label: "Student", value: "student", helpText: null, questionId: question.id || question.questionId },
          { id: "opt_status_visitor", label: "Visitor", value: "visitor", helpText: null, questionId: question.id || question.questionId },
          { id: "opt_status_other_temp", label: "Other temporary resident", value: "other_temporary_resident", helpText: null, questionId: question.id || question.questionId },
          { id: "opt_status_no_legal", label: "No current legal status", value: "no_legal_status", helpText: null, questionId: question.id || question.questionId },
          { id: "opt_status_other", label: "Other", value: "other", helpText: null, questionId: question.id || question.questionId },
          { id: "opt_status_not_sure", label: "I am not sure", value: "not_sure", helpText: null, questionId: question.id || question.questionId }
        ]
      };
    }

    // We apply order 9999 to child gate questions above
    return question;
  }).filter((q: Question) => {
    const qType = (q.questionType || "").toUpperCase();
    const qText = (q.questionText || "").toLowerCase().trim();

    // Remove redundant parent location questions from Child flows
    // These are already asked in the family member living in Canada section
    if (qType.includes("CHILD") || qType.includes("CANADIAN_CITIZEN_OR_PERMANENT_RESIDENT") || qType.includes("PR")) {
      if (qText === "does your parent currently live in canada?") return false;
      if (qText === "which province or territory does your parent live in?") return false;
    }

    // Remove redundant parent status questions from Parent flows
    if (qType.includes("PARENT") || qType.includes("SPONSOR")) {
      if (qText === "what is your parent's status in canada?" || qText === "what is your parent’s status in canada?") return false;
    }

    // Parent of a Canadian Child flow: remove redundant questions
    if (qType.includes("PARENT_OF_")) {
      if (qText === "does your child currently live in canada?") return false;
      if (qText === "which province or territory does your child live in?") return false;
      if (qText === "what is your primary goal?" || qText === "what is your primary goal") return false;
      if (qText === "what type of option would you like the system to assess?" || qText === "what type of option would you like the system to assess?") return false;
      if (qText === "what is the main purpose of your proposed stay?" || qText === "what is the main purpose of your proposed stay") return false;
      if (qText === "in which country was the adoption completed?") return false;
      if (qText === "please describe your ties outside canada" || qText === "please describe your ties outside canada.") return false;
    }
    
    // Conjugal Partner flow: remove specific questions
    if (qType === "MY_CONJUGAL_PARTNER" || qType.includes("CONJUGAL")) {
      if (qText === "do you have any children?") return false;
      if (qText === "are you currently living in canada?" || qText === "are you currently in canada?") return false;
      if (qText === "are you legally married to your partner?") return false;
    }

    return true;
  }).map((q: Question) => {
    const qType = (q.questionType || "").toUpperCase();
    let qText = (q.questionText || "").toLowerCase().trim();

    // H&C Family Reunification Factors (Fix Country selectors to Selects)
    if (qText.includes("can the canadian relative travel to your country")) {
      q = {
        ...q,
        inputType: "SELECT",
        isCountry: false,
        options: [
          { id: "opt_yes", label: "Yes", value: "yes", helpText: null, questionId: q.id || q.questionId },
          { id: "opt_no", label: "No", value: "no", helpText: null, questionId: q.id || q.questionId },
          { id: "opt_serious_difficulty", label: "Only with serious difficulty", value: "serious_difficulty", helpText: null, questionId: q.id || q.questionId }
        ]
      };
    }

    if (qText.includes("if no, why")) {
      q = {
        ...q,
        inputType: "SELECT",
        isCountry: false,
        options: [
          { id: "opt_med", label: "Medical limitation", value: "medical_limitation", helpText: null, questionId: q.id || q.questionId },
          { id: "opt_fin", label: "Financial limitation", value: "financial_limitation", helpText: null, questionId: q.id || q.questionId },
          { id: "opt_emp", label: "Employment responsibilities", value: "employment_responsibilities", helpText: null, questionId: q.id || q.questionId },
          { id: "opt_child", label: "Childcare responsibilities", value: "childcare_responsibilities", helpText: null, questionId: q.id || q.questionId },
          { id: "opt_imm", label: "Immigration restriction", value: "immigration_restriction", helpText: null, questionId: q.id || q.questionId },
          { id: "opt_saf", label: "Safety concern", value: "safety_concern", helpText: null, questionId: q.id || q.questionId },
          { id: "opt_dis", label: "Disability", value: "disability", helpText: null, questionId: q.id || q.questionId },
          { id: "opt_oth", label: "Other", value: "other", helpText: null, questionId: q.id || q.questionId }
        ]
      };
    }

    if (qText.includes("do you have meaningful family or community support")) {
      q = {
        ...q,
        questionText: "Do you have meaningful family or community support outside of Canada?",
        inputType: "SELECT",
        isCountry: false,
        options: [
          { id: "opt_yes", label: "Yes", value: "yes", helpText: null, questionId: q.id || q.questionId },
          { id: "opt_no", label: "No", value: "no", helpText: null, questionId: q.id || q.questionId },
          { id: "opt_limited", label: "Limited", value: "limited", helpText: null, questionId: q.id || q.questionId }
        ]
      };
    }

    if (qText.includes("would you have safe and suitable housing there")) {
      q = { 
        ...q, 
        questionText: "Would you have safe and suitable housing outside of Canada?",
        inputType: "SELECT",
        options: [
          { id: "opt_yes", label: "Yes", value: "yes", helpText: null, questionId: q.id || q.questionId },
          { id: "opt_no", label: "No", value: "no", helpText: null, questionId: q.id || q.questionId },
          { id: "opt_unsure", label: "Unsure", value: "unsure", helpText: null, questionId: q.id || q.questionId }
        ]
      };
      qText = "would you have safe and suitable housing outside of canada?";
    }

    if (qText.includes("would you have access to employment or financial support") && !qText.includes("outside of canada")) {
      q = { 
        ...q, 
        questionText: "Would you have access to employment or financial support outside of Canada?",
        inputType: "SELECT",
        options: [
          { id: "opt_yes", label: "Yes", value: "yes", helpText: null, questionId: q.id || q.questionId },
          { id: "opt_no", label: "No", value: "no", helpText: null, questionId: q.id || q.questionId },
          { id: "opt_unsure", label: "Unsure", value: "unsure", helpText: null, questionId: q.id || q.questionId }
        ]
      };
      qText = "would you have access to employment or financial support outside of canada?";
    }

    if (qText.includes("medical treatment") || qText.includes("caregiving")) {
      q = { 
        ...q, 
        questionText: "Would you have access to necessary medical treatment or caregiving outside of Canada?",
        inputType: "SELECT",
        options: [
          { id: "opt_yes", label: "Yes", value: "yes", helpText: null, questionId: q.id || q.questionId },
          { id: "opt_no", label: "No", value: "no", helpText: null, questionId: q.id || q.questionId },
          { id: "opt_unsure", label: "Unsure", value: "unsure", helpText: null, questionId: q.id || q.questionId }
        ]
      };
      qText = "would you have access to necessary medical treatment or caregiving outside of canada?";
    }

    if (qText.includes("treatment or necessary support available in your country")) {
      q = {
        ...q,
        inputType: "SELECT",
        isCountry: false,
        options: [
          { id: "opt_yes", label: "Yes", value: "yes", helpText: null, questionId: q.id || q.questionId },
          { id: "opt_no", label: "No", value: "no", helpText: null, questionId: q.id || q.questionId }
        ]
      };
    }

    if (qText.includes("employment or financial support outside") || 
        qText.includes("medical treatment or caregiving outside") ||
        qText.includes("safe and suitable housing outside")) {
      q = {
        ...q,
        inputType: "SELECT",
        isCountry: false,
        options: [
          { id: "opt_yes", label: "Yes", value: "yes", helpText: null, questionId: q.id || q.questionId },
          { id: "opt_no", label: "No", value: "no", helpText: null, questionId: q.id || q.questionId },
          { id: "opt_unsure", label: "Unsure", value: "unsure", helpText: null, questionId: q.id || q.questionId }
        ]
      };
    }

    if (qText.includes("please explain why the available support would or would not be adequate")) {
      const medicalQ = questions.find((pq) => {
        const text = (pq.questionText || "").toLowerCase();
        return text.includes("medical treatment") || text.includes("caregiving");
      });
      if (medicalQ) {
        q = {
          ...q,
          dependsOnQuestionId: medicalQ.id || medicalQ.questionId,
          dependsOnOperator: "EQUALS",
          dependsOnValue: "no"
        };
      }
    }

    if (qText.includes("does your relative have any living relatives whom they could otherwise sponsor, including")) {
      q = {
        ...q,
        helpText: undefined
      };
    }

    // Simplify adoption question text
    if (qType.includes("PARENT_OF_") && qText === "is the adoption legally recognized in the country where it occurred?") {
      q = { ...q, questionText: "Is the adoption legally recognized?" };
      qText = "is the adoption legally recognized?";
    }

    // Parent of a Canadian Child / Temporary: replace "Which situation best describes you?" options
    if (
      qType.includes("PARENT_OF_") &&
      (qText.includes("which situation best describes you") || qText.includes("situation best describes"))
    ) {
      const baseOptions = [
        { id: "opt_bio_visit", label: "I want to visit my child in Canada", value: "visit_child", helpText: null, questionId: q.id || q.questionId },
        { id: "opt_bio_stay", label: "I am already in Canada and want to stay with my child for an extended period", value: "stay_with_child", helpText: null, questionId: q.id || q.questionId }
      ];

      if (!qType.includes("TEMPORARY")) {
        baseOptions.push({ id: "opt_bio_sponsor", label: "I want to determine whether my child can sponsor me to become a permanent resident", value: "child_sponsor_me", helpText: null, questionId: q.id || q.questionId });
      }

      baseOptions.push(
        { id: "opt_bio_work_study", label: "Work or study options", value: "work_or_study", helpText: null, questionId: q.id || q.questionId },
        { id: "opt_bio_all_options", label: "I want to explore all immigration options available to me", value: "explore_all_options", helpText: null, questionId: q.id || q.questionId },
        { id: "opt_bio_not_sure", label: "I am not sure", value: "not_sure", helpText: null, questionId: q.id || q.questionId }
      );

      return {
        ...q,
        questionText: "Which situation best describes you?",
        options: baseOptions,
      } as any;
    }

    return q;
  });
}

/**
 * Recursively applies patches to assessment payload data
 */
export function patchAssessmentPayload(payload: any): any {
  if (!payload) return payload;

  let patched = payload;

  if (payload.questions && Array.isArray(payload.questions)) {
    let questions = [...payload.questions];

    // Check if education groups in PR assessment need the completed "When did the program end?" question
    const eduGroups = new Set<string>();
    questions.forEach((q: any) => {
      const qType = (q.questionType || "").toUpperCase();
      if (
        (qType.includes("EDUCATION") || qType.includes("TRAINING")) &&
        q.groupId
      ) {
        eduGroups.add(q.groupId);
      }
    });

    eduGroups.forEach((gId) => {
      const groupQs = questions.filter((q: any) => q.groupId === gId);
      const inProgressQ = groupQs.find((q: any) =>
        (q.questionText || "").toLowerCase().includes("in progress") ||
        (q.questionId || "").toLowerCase().includes("inprogress")
      );
      const expectedFinishQ = groupQs.find((q: any) =>
        (q.questionText || "").toLowerCase().includes("expected to finish") ||
        (q.questionText || "").toLowerCase().includes("expected finish") ||
        (q.questionId || "").toLowerCase().includes("expectedfinish")
      );
      const hasEndQ = groupQs.some((q: any) =>
        (q.questionText || "").toLowerCase().includes("when did the program end") ||
        (q.questionText || "").toLowerCase().includes("when did this program end") ||
        (q.questionId || "").toLowerCase().includes("eduenddate") ||
        (q.questionId || "").toLowerCase().includes("edu_end_date")
      );

      if (inProgressQ && expectedFinishQ && !hasEndQ) {
        const newEndQ: any = {
          id: `${expectedFinishQ.id || expectedFinishQ.questionId}_end`,
          questionId: `${expectedFinishQ.questionId || expectedFinishQ.id}_end`,
          questionText: "When did the program end?",
          questionType: expectedFinishQ.questionType,
          inputType: "DATE",
          groupId: gId,
          order: (expectedFinishQ.order || 0) + 0.5,
          isOptional: false,
          dependsOnQuestionId: inProgressQ.id || inProgressQ.questionId,
          dependsOnOperator: "IS_FALSE",
          dependsOnValue: "false",
          options: [],
          helpText: null,
        };
        questions.push(newEndQ);
      }
    });

    // Check for missing questions in the Canadian Relative section (identified by "does your relative have any living relatives...")
    const relativeQs = questions.filter((q: any) => (q.questionText || "").toLowerCase().includes("does your relative have any living relatives whom they could otherwise sponsor"));
    
    relativeQs.forEach((relQ: any) => {
      const gId = relQ.groupId; // Can be null
      const qType = relQ.questionType;
      
      const targetQs = gId ? questions.filter((q: any) => q.groupId === gId) : questions.filter((q: any) => q.questionType === qType);
      const hasLocationQ = targetQs.some((q: any) => (q.questionText || "").toLowerCase().includes("where are you currently located"));
      
      if (!hasLocationQ) {
        // If it's a standalone question, give it a base order that puts it after the relQ.
        // relQ.order is 862. Let's start at relQ.order + 1
        const baseOrder = relQ.order ? relQ.order + 1 : 870;
        
        const locQ: any = {
          id: `missing_loc_${gId || qType}`, questionId: `missing_loc_${gId || qType}`,
          questionText: "Where are you currently located?",
          questionType: qType, inputType: "SELECT", groupId: gId, order: baseOrder, isOptional: false,
          options: [
            { id: "opt_in_can", label: "In Canada", value: "in_canada", helpText: null, questionId: `missing_loc_${gId || qType}` },
            { id: "opt_out_can", label: "Outside Canada", value: "outside_canada", helpText: null, questionId: `missing_loc_${gId || qType}` }
          ], helpText: null
        };
        
        const statusQ: any = {
          id: `missing_stat_${gId || qType}`, questionId: `missing_stat_${gId || qType}`,
          questionText: "What is your current immigration status?",
          questionType: qType, inputType: "SELECT", groupId: gId, order: baseOrder + 0.1, isOptional: false,
          dependsOnQuestionId: locQ.id, dependsOnOperator: "EQUALS", dependsOnValue: "in_canada",
          options: [
            { id: "opt_s1", label: "Citizen", value: "citizen", helpText: null, questionId: `missing_stat_${gId || qType}` },
            { id: "opt_s2", label: "Permanent resident", value: "permanent_resident", helpText: null, questionId: `missing_stat_${gId || qType}` },
            { id: "opt_s3", label: "Worker", value: "worker", helpText: null, questionId: `missing_stat_${gId || qType}` },
            { id: "opt_s4", label: "Student", value: "student", helpText: null, questionId: `missing_stat_${gId || qType}` },
            { id: "opt_s5", label: "Visitor", value: "visitor", helpText: null, questionId: `missing_stat_${gId || qType}` },
            { id: "opt_s6", label: "Refugee claimant", value: "refugee_claimant", helpText: null, questionId: `missing_stat_${gId || qType}` },
            { id: "opt_s7", label: "Temporary Resident Permit holder", value: "trp_holder", helpText: null, questionId: `missing_stat_${gId || qType}` },
            { id: "opt_s8", label: "No valid status", value: "no_valid_status", helpText: null, questionId: `missing_stat_${gId || qType}` },
            { id: "opt_s9", label: "Other", value: "other", helpText: null, questionId: `missing_stat_${gId || qType}` },
            { id: "opt_s10", label: "Unsure", value: "unsure", helpText: null, questionId: `missing_stat_${gId || qType}` }
          ], helpText: null
        };
        
        const timeQ: any = {
          id: `missing_time_${gId || qType}`, questionId: `missing_time_${gId || qType}`,
          questionText: "How long have you continuously lived in Canada?",
          questionType: qType, inputType: "SELECT", groupId: gId, order: baseOrder + 0.2, isOptional: false,
          dependsOnQuestionId: locQ.id, dependsOnOperator: "EQUALS", dependsOnValue: "in_canada",
          options: [
            { id: "opt_t1", label: "Less than 1 year", value: "less_than_1", helpText: null, questionId: `missing_time_${gId || qType}` },
            { id: "opt_t2", label: "1–3 years", value: "1_to_3", helpText: null, questionId: `missing_time_${gId || qType}` },
            { id: "opt_t3", label: "3–5 years", value: "3_to_5", helpText: null, questionId: `missing_time_${gId || qType}` },
            { id: "opt_t4", label: "More than 5 years", value: "more_than_5", helpText: null, questionId: `missing_time_${gId || qType}` }
          ], helpText: null
        };
        
        const studyQ: any = {
          id: `missing_study_${gId || qType}`, questionId: `missing_study_${gId || qType}`,
          questionText: "Are you studying in Canada?",
          questionType: qType, inputType: "SELECT", groupId: gId, order: baseOrder + 0.3, isOptional: false,
          dependsOnQuestionId: locQ.id, dependsOnOperator: "EQUALS", dependsOnValue: "in_canada",
          options: [
            { id: "opt_stu1", label: "Yes", value: "yes", helpText: null, questionId: `missing_study_${gId || qType}` },
            { id: "opt_stu2", label: "No", value: "no", helpText: null, questionId: `missing_study_${gId || qType}` }
          ], helpText: null
        };
        
        const volQ: any = {
          id: `missing_vol_${gId || qType}`, questionId: `missing_vol_${gId || qType}`,
          questionText: "Do you volunteer or participate in a religious, cultural or community organization?",
          questionType: qType, inputType: "SELECT", groupId: gId, order: baseOrder + 0.4, isOptional: false,
          dependsOnQuestionId: locQ.id, dependsOnOperator: "EQUALS", dependsOnValue: "in_canada",
          options: [
            { id: "opt_vol1", label: "Yes", value: "yes", helpText: null, questionId: `missing_vol_${gId || qType}` },
            { id: "opt_vol2", label: "No", value: "no", helpText: null, questionId: `missing_vol_${gId || qType}` }
          ], helpText: null
        };
        
        const homeQ: any = {
          id: `missing_home_${gId || qType}`, questionId: `missing_home_${gId || qType}`,
          questionText: "Do you own or rent a home in Canada?",
          questionType: qType, inputType: "SELECT", groupId: gId, order: baseOrder + 0.5, isOptional: false,
          dependsOnQuestionId: locQ.id, dependsOnOperator: "EQUALS", dependsOnValue: "in_canada",
          options: [
            { id: "opt_hom1", label: "Own", value: "own", helpText: null, questionId: `missing_home_${gId || qType}` },
            { id: "opt_hom2", label: "Rent", value: "rent", helpText: null, questionId: `missing_home_${gId || qType}` },
            { id: "opt_hom3", label: "Neither", value: "neither", helpText: null, questionId: `missing_home_${gId || qType}` }
          ], helpText: null
        };
        
        const taxQ: any = {
          id: `missing_tax_${gId || qType}`, questionId: `missing_tax_${gId || qType}`,
          questionText: "Do you pay taxes in Canada?",
          questionType: qType, inputType: "SELECT", groupId: gId, order: baseOrder + 0.6, isOptional: false,
          dependsOnQuestionId: locQ.id, dependsOnOperator: "EQUALS", dependsOnValue: "in_canada",
          options: [
            { id: "opt_tax1", label: "Yes", value: "yes", helpText: null, questionId: `missing_tax_${gId || qType}` },
            { id: "opt_tax2", label: "No", value: "no", helpText: null, questionId: `missing_tax_${gId || qType}` },
            { id: "opt_tax3", label: "Not applicable", value: "not_applicable", helpText: null, questionId: `missing_tax_${gId || qType}` }
          ], helpText: null
        };
        
        const friendsQ: any = {
          id: `missing_fri_${gId || qType}`, questionId: `missing_fri_${gId || qType}`,
          questionText: "Do you have close friends or extended family in Canada?",
          questionType: qType, inputType: "SELECT", groupId: gId, order: baseOrder + 0.7, isOptional: false,
          dependsOnQuestionId: locQ.id, dependsOnOperator: "EQUALS", dependsOnValue: "in_canada",
          options: [
            { id: "opt_fri1", label: "Yes", value: "yes", helpText: null, questionId: `missing_fri_${gId || qType}` },
            { id: "opt_fri2", label: "No", value: "no", helpText: null, questionId: `missing_fri_${gId || qType}` }
          ], helpText: null
        };
        
        questions.push(locQ, statusQ, timeQ, studyQ, volQ, homeQ, taxQ, friendsQ);
      }
    });

    // Check if work history groups in PR assessment need the "Was this position self-employed?" question
    const workGroups = new Set<string>();
    questions.forEach((q: any) => {
      const qType = (q.questionType || "").toUpperCase();
      if (
        (qType.includes("WORK") || qType.includes("EMPLOYMENT")) &&
        !qType.includes("JOB_OFFER") &&
        !qType.includes("CANADIAN_JOB_OFFER") &&
        q.groupId
      ) {
        workGroups.add(q.groupId);
      }
    });

    workGroups.forEach((gId) => {
      const groupQs = questions.filter((q: any) => q.groupId === gId);
      const currentJobQ = groupQs.find((q: any) =>
        (q.questionText || "").toLowerCase().includes("current job") ||
        (q.questionText || "").toLowerCase().includes("still employed") ||
        (q.questionId || "").toLowerCase().includes("currentjob") ||
        (q.questionId || "").toLowerCase().includes("stillemployed")
      );
      
      const hasSelfEmployedQ = groupQs.some((q: any) =>
        (q.questionText || "").toLowerCase().includes("self-employed") ||
        (q.questionText || "").toLowerCase().includes("self employed") ||
        (q.questionId || "").toLowerCase().includes("selfemployed") ||
        (q.questionId || "").toLowerCase().includes("self_employed")
      );

      if (currentJobQ && !hasSelfEmployedQ) {
        const newSelfEmpQ: any = {
          id: `${currentJobQ.id || currentJobQ.questionId}_self_employed`,
          questionId: `${currentJobQ.questionId || currentJobQ.id}_self_employed`,
          questionText: "Was this position self-employed?",
          questionType: currentJobQ.questionType,
          inputType: "BOOLEAN",
          groupId: gId,
          order: (currentJobQ.order || 0) + 0.8,
          isOptional: false,
          options: [],
          helpText: null,
        };
        questions.push(newSelfEmpQ);
      }
    });

    patched = {
      ...patched,
      questions: patchAssessmentQuestions(questions),
    };
  }

  // Ensure children repeatable group exists in groups array if it's a family assessment
  if (patched.groups && Array.isArray(patched.groups)) {
    const hasChildrenGroup = patched.groups.some(
      (g: any) => g.id === CHILDREN_GROUP_ID || g.groupKey === "children"
    );
    if (!hasChildrenGroup) {
      patched = {
        ...patched,
        groups: [
          ...patched.groups,
          {
            id: CHILDREN_GROUP_ID,
            assesmentId: patched.id || "6a3512fa79dce42f4e5f440a",
            groupKey: "children",
            title: "Children Information",
            isRepeatable: true,
            minInstances: 0,
            maxInstances: null,
            order: 1,
          },
        ],
      };
    }
  }

  return patched;
}
