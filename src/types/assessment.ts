export interface QuestionOption {
  id: string;
  label: string;
  value: string;
  helpText?: string | null;
  questionId: string;
}

export enum RuleOperator {
  EQUALS = "EQUALS",
  NOT_EQUALS = "NOT_EQUALS",
  CONTAINS = "CONTAINS",
  NOT_CONTAINS = "NOT_CONTAINS",
  GREATER_THAN = "GREATER_THAN",
  GREATER_THAN_OR_EQUAL = "GREATER_THAN_OR_EQUAL",
  LESS_THAN = "LESS_THAN",
  LESS_THAN_OR_EQUAL = "LESS_THAN_OR_EQUAL",
  IN_LIST = "IN_LIST",
  NOT_IN_LIST = "NOT_IN_LIST",
  IS_TRUE = "IS_TRUE",
  IS_FALSE = "IS_FALSE",
  IS_EMPTY = "IS_EMPTY",
  IS_NOT_EMPTY = "IS_NOT_EMPTY",
}

export interface Group {
  id: string;
  assesmentId: string;
  groupKey: string;
  title: string;
  isRepeatable: boolean;
  minInstances?: number;
  maxInstances?: number | null;
  order: number;
}

export interface Question {
  id: string;
  questionId: string;
  questionText: string;
  inputType: "TEXT" | "NUMBER" | "SELECT" | "MULTI_SELECT" | "DATE" | "EMAIL" | "PHONE" | "BOOLEAN" | "AUTOCOMPLETE" | "TEXTAREA";
  order: number;
  assesmentId: string;
  questionType: string;
  createdAt?: string;
  updatedAt?: string;
  options?: QuestionOption[];
  
  groupId?: string | null;
  
  // Conditional visibility
  dependsOnQuestionId?: string | null;
  dependsOnOperator?: RuleOperator | string | null;
  dependsOnValue?: string | null;

  // Generic endpoint for fetching options (e.g., for AUTOCOMPLETE)
  apiEndpoint?: string | null;

  isCountry?: boolean;
  placeholder?: string;
  isOptional?: boolean;
  helpText?: string;
  
  // For TEXTAREA input type
  rows?: number;
  maxLength?: number;
}

export interface Assessment {
  id: string;
  title: string;
  questions: Question[];
  groups?: Group[];
}
