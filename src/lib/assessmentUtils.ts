import { Question, RuleOperator } from "@/types/assessment";

export function normalizeAssessmentValue(value: unknown): string {
  if (value === undefined || value === null) return "";

  return String(value)
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function isMaritalStatusSpouseEligible(value: unknown): boolean {
  const normalized = normalizeAssessmentValue(value);
  if (!normalized) return false;

  // Explicit non-spouse statuses should always block spouse questions.
  const excludedStatuses = [
    "single",
    "never married",
    "not married",
    "divorced",
    "widowed",
    "separated",
    "annulled",
    "unmarried",
  ];

  if (
    excludedStatuses.some(
      (status) => normalized === status || normalized.includes(status)
    )
  ) {
    return false;
  }

  return (
    normalized.includes("married") ||
    normalized.includes("common law") ||
    normalized.includes("commonlaw") ||
    normalized.includes("partner") ||
    normalized.includes("spouse")
  );
}

export function isSpouseStepOrQuestion(textOrType: string): boolean {
  const lower = (textOrType || "").toLowerCase();
  return (
    lower.includes("spouse") ||
    lower.includes("spousal") ||
    lower.includes("partner")
  );
}

export function isSpousalOpenWorkPermit(textOrType: string): boolean {
  const normalized = normalizeAssessmentValue(textOrType);
  return (
    normalized.includes("spousal open work permit") ||
    normalized.includes("spousal_open_work_permit")
  );
}

export function getMaritalStatusValue(
  formValues: Record<string, any>,
  questions: Question[] = []
): string | undefined {
  if (formValues?.maritalStatus !== undefined && formValues.maritalStatus !== "") {
    return formValues.maritalStatus;
  }
  if (formValues?.marital_status !== undefined && formValues.marital_status !== "") {
    return formValues.marital_status;
  }

  // First try to find a question that is specifically the applicant's marital status
  let maritalQ = questions.find((q) => {
    const text = (q.questionText || "").toLowerCase().trim();
    const qId = (q.questionId || "").toLowerCase();
    
    // Avoid parents/family marital status questions
    if (text.includes("parent") || text.includes("mother") || text.includes("father")) {
      return false;
    }

    return (
      text === "marital status" ||
      text === "what is your marital status?" ||
      text === "current marital status" ||
      text.includes("your marital status") ||
      qId === "maritalstatus" ||
      qId === "marital_status"
    );
  });

  // Fallback to broader search if not found
  if (!maritalQ) {
    maritalQ = questions.find((q) => {
      const text = (q.questionText || "").toLowerCase();
      const qId = (q.questionId || "").toLowerCase();
      return (
        text.includes("marital status") ||
        qId === "maritalstatus" ||
        qId === "marital_status"
      );
    });
  }

  if (maritalQ && formValues?.[maritalQ.questionId] !== undefined) {
    return formValues[maritalQ.questionId];
  }

  return undefined;
}

export function isSpouseAccompanyQuestion(q: Question): boolean {
  const text = (q.questionText || "").toLowerCase();
  const qId = (q.questionId || "").toLowerCase();

  const mentionsSpouse =
    text.includes("spouse") ||
    text.includes("partner") ||
    qId.includes("spouse");

  const mentionsAccompanyOrInclusion =
    text.includes("accompany") ||
    text.includes("accompanying") ||
    text.includes("add") ||
    text.includes("include") ||
    text.includes("have a spouse") ||
    text.includes("do you have") ||
    qId.includes("accompany");

  return mentionsSpouse && mentionsAccompanyOrInclusion;
}

export function shouldIncludeSpouse(
  formValues: Record<string, any>,
  allQuestions: Question[] = []
): boolean {
  // 1. Check marital status
  const maritalVal = getMaritalStatusValue(formValues, allQuestions);
  if (!maritalVal || !isMaritalStatusSpouseEligible(maritalVal)) {
    return false; // User is Single, Divorced, Widowed, Separated, etc.
  }

  // 2. Check "add spouse to application" / "spouse accompanying" / "do you have a spouse" questions
  const spouseInclusionQ = allQuestions.find(isSpouseAccompanyQuestion);

  if (spouseInclusionQ) {
    const val = formValues[spouseInclusionQ.questionId];
    if (val !== undefined && val !== null && val !== "") {
      const normalizedVal = normalizeAssessmentValue(val);
      const isYes =
        val === true ||
        normalizedVal === "yes" ||
        normalizedVal === "true" ||
        normalizedVal === "y" ||
        normalizedVal === "1";
      if (!isYes) {
        return false; // User explicitly selected No to adding spouse
      }
    }
  }

  return true;
}

export function isFamilyAssessment(
  questions: Question[] = []
): boolean {
  if (typeof window !== "undefined") {
    const p = (window.location.pathname || "").toLowerCase();
    if (p.includes("/family") || p.includes("6a3512fa79dce42f4e5f440a")) {
      return true;
    }
  }

  return questions.some((q) => {
    const text = (q.questionText || "").toLowerCase();
    const qType = (q.questionType || "").toLowerCase();
    const qId = (q.questionId || "").toLowerCase();
    return (
      text.includes("family member currently living in canada") ||
      qId === "who_is_family_member" ||
      qId === "question_1786528385298" ||
      qId === "6a7c431cc36c04dc85a46282" ||
      qType === "canadian_relative_information" ||
      qType === "family_member_living_in_canada" ||
      qType.includes("common_law_partner") ||
      qType.includes("conjugal_partner") ||
      qType === "one_other_relative_exception"
    );
  });
}

export function getSectionChildrenGate(
  question: Question,
  questions: Question[],
  formValues: Record<string, any>
): { hasGate: boolean; isOpen: boolean } {
  if (!question.groupId) return { hasGate: false, isOpen: true };

  const gateQ = questions.find((cand) => {
    if (cand.groupId) return false;
    const text = (cand.questionText || "").toLowerCase().trim();
    const id = (cand.questionId || "").toLowerCase();
    const sameSection = cand.questionType === question.questionType;
    const isChildGateText =
      text.includes("do you have any children") ||
      text.includes("have any children") ||
      id.endsWith("_has_children") ||
      id === "q_has_children" ||
      id === "6a9fcbc2e481ca7fb0489582";
    return sameSection && isChildGateText;
  });

  if (!gateQ) return { hasGate: false, isOpen: true };

  const val = formValues[gateQ.questionId];
  const isYes =
    val === true ||
    String(val).toLowerCase() === "true" ||
    String(val).toLowerCase() === "yes";

  return { hasGate: true, isOpen: isYes };
}

export function isQuestionVisible(
  q: Question,
  formValues: Record<string, any>,
  questions: Question[] = [],
  visited: Set<string> = new Set()
): boolean {
  if (visited.has(q.id || q.questionId)) return false;
  visited.add(q.id || q.questionId);

  const isFamily = isFamilyAssessment(questions);

  if (isFamily) {
    const whoIsFamilyQ = questions.find(
      (cand) => cand.questionId === "who_is_family_member" || cand.id === "6a7c431cc36c04dc85a46282" || cand.questionId === "question_1786528419964"
    );
    if (whoIsFamilyQ) {
      const familyMemberVal = formValues[whoIsFamilyQ.questionId];
      if (familyMemberVal) {
        const qType = (q.questionType || "").toUpperCase();
        
        // If family member is parent/grandparent, the applicant is the child/grandchild
        if (qType.includes("CHILD_OF_") || qType.includes("GRANDCHILD_OF_")) {
          if (familyMemberVal !== "my_parent" && familyMemberVal !== "my_grandparent") {
            return false;
          }
        }
        
        // If family member is child, the applicant is the parent
        if (qType.includes("PARENT_OF_")) {
          if (familyMemberVal !== "my_biological_child" && familyMemberVal !== "my_adopted_child") {
            return false;
          }
        }

        // If family member is niece or nephew, the applicant is the aunt/uncle.
        // Do not ask if the applicant is an orphaned niece or nephew.
        if (qType.includes("ORPHANED_NIECE_OR_NEPHEW_SCREENING")) {
          if (familyMemberVal === "my_niece_or_nephew") {
            return false;
          }
        }
      }
    }
  }

  // Check section children gate for repeatable groups
  const childGate = getSectionChildrenGate(q, questions, formValues);
  if (childGate.hasGate && !childGate.isOpen) {
    return false;
  }

  if (!isFamily) {
    const maritalVal = getMaritalStatusValue(formValues, questions);
    const isMaritalEligible = isMaritalStatusSpouseEligible(maritalVal);

    const qText = (q.questionText || "").toLowerCase();
    const qId = (q.questionId || "").toLowerCase();

    const isMaritalStatusQ =
      qText.includes("marital status") ||
      qId.includes("marital");

    if (isMaritalStatusQ) {
      return true;
    }

    // 1. Spouse accompany/inclusion question: only visible if marital status is Married / Common-law
    if (isSpouseAccompanyQuestion(q)) {
      if (!isMaritalEligible) {
        return false;
      }
    }

    // 2. Spousal Open Work Permit stream: only visible if marital status is Married / Common-law
    else if (isSpousalOpenWorkPermit(q.questionType)) {
      if (!isMaritalEligible) {
        return false;
      }
    }

    // 3. Other accompanying spouse profile questions: only visible if spouse is included in application
    else if (
      isSpouseStepOrQuestion(q.questionType) ||
      isSpouseStepOrQuestion(q.questionText) ||
      isSpouseStepOrQuestion(q.questionId)
    ) {
      if (!shouldIncludeSpouse(formValues, questions)) {
        return false;
      }
    }
  }

  // 4. Evaluate conditional rule dependencies (dependsOnQuestionId)
  if (!q.dependsOnQuestionId) return true;

  // dependsOnQuestionId is the MongoDB id or questionId.
  const parentQuestion = questions.find(
    (pq) =>
      pq.id === q.dependsOnQuestionId || pq.questionId === q.dependsOnQuestionId
  );
  if (!parentQuestion) return true;

  // If parent question itself is hidden, dependent question must be hidden too
  if (!isQuestionVisible(parentQuestion, formValues, questions, visited)) {
    return false;
  }

  const parentValue = formValues[parentQuestion.questionId];

  // If there's no operator specified, we assume it's visible if the dependency has any value
  if (!q.dependsOnOperator) {
    return (
      parentValue !== undefined && parentValue !== null && parentValue !== ""
    );
  }

  switch (q.dependsOnOperator) {
    case RuleOperator.EQUALS:
    case "EQUALS": {
      const normVal = normalizeAssessmentValue(parentValue);
      const targetVal = normalizeAssessmentValue(q.dependsOnValue);
      return (
        String(parentValue) === String(q.dependsOnValue) || normVal === targetVal
      );
    }
    case RuleOperator.NOT_EQUALS:
    case "NOT_EQUALS": {
      const normVal = normalizeAssessmentValue(parentValue);
      const targetVal = normalizeAssessmentValue(q.dependsOnValue);
      return (
        String(parentValue) !== String(q.dependsOnValue) && normVal !== targetVal
      );
    }
    case RuleOperator.IS_TRUE:
    case "IS_TRUE":
      return (
        parentValue === true ||
        String(parentValue).toLowerCase() === "true" ||
        String(parentValue).toLowerCase() === "yes"
      );
    case RuleOperator.IS_FALSE:
    case "IS_FALSE":
      return (
        parentValue === false ||
        String(parentValue).toLowerCase() === "false" ||
        String(parentValue).toLowerCase() === "no"
      );
    case RuleOperator.IS_EMPTY:
    case "IS_EMPTY":
      return (
        parentValue === undefined || parentValue === null || parentValue === ""
      );
    case RuleOperator.IS_NOT_EMPTY:
    case "IS_NOT_EMPTY":
      return (
        parentValue !== undefined && parentValue !== null && parentValue !== ""
      );
    case RuleOperator.CONTAINS:
    case "CONTAINS":
      return String(parentValue || "")
        .toLowerCase()
        .includes(String(q.dependsOnValue || "").toLowerCase());
    case RuleOperator.NOT_CONTAINS:
    case "NOT_CONTAINS":
      return !String(parentValue || "")
        .toLowerCase()
        .includes(String(q.dependsOnValue || "").toLowerCase());
    case RuleOperator.GREATER_THAN:
    case "GREATER_THAN":
      return Number(parentValue) > Number(q.dependsOnValue);
    case RuleOperator.GREATER_THAN_OR_EQUAL:
    case "GREATER_THAN_OR_EQUAL":
      return Number(parentValue) >= Number(q.dependsOnValue);
    case RuleOperator.LESS_THAN:
    case "LESS_THAN":
      return Number(parentValue) < Number(q.dependsOnValue);
    case RuleOperator.LESS_THAN_OR_EQUAL:
    case "LESS_THAN_OR_EQUAL":
      return Number(parentValue) <= Number(q.dependsOnValue);
    case RuleOperator.IN_LIST:
    case "IN_LIST": {
      try {
        const list: string[] = JSON.parse(q.dependsOnValue || "[]");
        const normalizedList = list.map((v) => normalizeAssessmentValue(v));
        if (Array.isArray(parentValue)) {
          return parentValue.some((item) =>
            normalizedList.includes(normalizeAssessmentValue(item))
          );
        }
        const normPv = normalizeAssessmentValue(parentValue);
        return (
          normalizedList.includes(normPv) ||
          list
            .map((v) => String(v).toLowerCase())
            .includes(String(parentValue ?? "").toLowerCase())
        );
      } catch {
        return false;
      }
    }
    case RuleOperator.NOT_IN_LIST:
    case "NOT_IN_LIST": {
      try {
        const list: string[] = JSON.parse(q.dependsOnValue || "[]");
        const normalizedList = list.map((v) => normalizeAssessmentValue(v));
        if (Array.isArray(parentValue)) {
          return !parentValue.some((item) =>
            normalizedList.includes(normalizeAssessmentValue(item))
          );
        }
        const normPv = normalizeAssessmentValue(parentValue);
        return (
          !normalizedList.includes(normPv) &&
          !list
            .map((v) => String(v).toLowerCase())
            .includes(String(parentValue ?? "").toLowerCase())
        );
      } catch {
        return true;
      }
    }
    default:
      return true;
  }
}


