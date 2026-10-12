/* eslint-disable @typescript-eslint/no-explicit-any */
import { Question } from "@/types/assessment";
import { useFormContext } from "react-hook-form";
import DynamicField from "./DynamicField";

export interface LanguageSkillsRendererProps {
  questions: Question[];
}

const languageScoreOptions = [
  { label: "None", value: "none" },
  { label: "Limited", value: "limited" },
  { label: "Modest", value: "modest" },
  { label: "Competent", value: "competent" },
  { label: "Good", value: "good" },
  { label: "Very Good", value: "very_good" },
  { label: "Excellent", value: "excellent" },
  { label: "Expert", value: "expert" },
];

const celpipOptions = [
  { label: "M, 3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
  { label: "6", value: "6" },
  { label: "7", value: "7" },
  { label: "8", value: "8" },
  { label: "9", value: "9" },
  { label: "10", value: "10" },
  { label: "11, 12", value: "11_12" },
];

const ieltsOptions = [
  { label: "4.0", value: "4.0" },
  { label: "4.5", value: "4.5" },
  { label: "5.0", value: "5.0" },
  { label: "5.5", value: "5.5" },
  { label: "6.0", value: "6.0" },
  { label: "6.5", value: "6.5" },
  { label: "7.0", value: "7.0" },
  { label: "7.5", value: "7.5" },
  { label: "8.0", value: "8.0" },
  { label: "8.5", value: "8.5" },
  { label: "9.0", value: "9.0" },
];

const pteOptions = [
  { label: "30-40", value: "30_40" },
  { label: "41-50", value: "41_50" },
  { label: "51-60", value: "51_60" },
  { label: "61-70", value: "61_70" },
  { label: "71-80", value: "71_80" },
  { label: "81-90", value: "81_90" },
];

const tefTcfOptions = [
  { label: "None", value: "none" },
  { label: "Limited", value: "limited" },
  { label: "Modest", value: "modest" },
  { label: "Competent", value: "competent" },
  { label: "Good", value: "good" },
  { label: "Very Good", value: "very_good" },
  { label: "Excellent", value: "excellent" },
  { label: "Expert", value: "expert" },
];

const toeflOptions = [
  { label: "0-10", value: "0_10" },
  { label: "11-20", value: "11_20" },
  { label: "21-30", value: "21_30" },
];

const englishTestOptions = [
  { label: "IELTS General Training", value: "IELTS" },
  { label: "IELTS Academic", value: "IELTS_ACADEMIC" },
  { label: "CELPIP-General", value: "CELPIP" },
  { label: "PTE Core", value: "PTE" },
  { label: "TOEFL iBT", value: "TOEFL" },
];

const frenchTestOptions = [
  { label: "TEF Canada", value: "TEF" },
  { label: "TCF Canada", value: "TCF" },
];

export default function LanguageSkillsRenderer({
  questions,
}: LanguageSkillsRendererProps) {
  const { watch } = useFormContext();
  const formValues = watch();

  const findQ = (text: string, isFrench = false) => {
    const matches = questions.filter((q) =>
      q.questionText.toLowerCase().includes(text.toLowerCase())
    );
    if (matches.length === 1) return matches[0];
    if (matches.length > 1) {
      const sorted = [...matches].sort(
        (a, b) => (a.order || 0) - (b.order || 0)
      );
      return isFrench ? sorted[1] : sorted[0];
    }
    return undefined;
  };

  const createMockQ = (text: string, id: string, inputType: string) =>
    ({
      id: `mock_${id}`,
      questionId: `question_${id}`,
      questionText: text,
      inputType: inputType as any,
      questionType: "LANGUAGE_SKILLS",
      options: [],
    }) as any;

  const englishTestQ =
    findQ("English Language test") ||
    createMockQ(
      "Have you taken an English Language test?",
      "eng_test",
      "BOOLEAN"
    );
  const englishTestTypeQ =
    findQ("Which English") ||
    createMockQ(
      "Which English language test have you taken?",
      "eng_test_type",
      "SELECT"
    );
  const englishTestWritingQ = createMockQ(
    "Writing",
    "eng_test_writing",
    "SELECT"
  );
  const englishTestReadingQ = createMockQ(
    "Reading",
    "eng_test_reading",
    "SELECT"
  );
  const englishTestSpeakingQ = createMockQ(
    "Speaking",
    "eng_test_speaking",
    "SELECT"
  );
  const englishTestListeningQ = createMockQ(
    "Listening",
    "eng_test_listening",
    "SELECT"
  );

  const englishCommWritingQ = createMockQ(
    "Writing",
    "eng_comm_writing",
    "SELECT"
  );
  const englishCommReadingQ = createMockQ(
    "Reading",
    "eng_comm_reading",
    "SELECT"
  );
  const englishCommSpeakingQ = createMockQ(
    "Speaking",
    "eng_comm_speaking",
    "SELECT"
  );
  const englishCommListeningQ = createMockQ(
    "Listening",
    "eng_comm_listening",
    "SELECT"
  );

  const frenchTestQ =
    findQ("French Language test") ||
    createMockQ(
      "Have you taken a French Language test?",
      "fre_test",
      "BOOLEAN"
    );
  const frenchTestTypeQ =
    findQ("Which French") ||
    createMockQ(
      "Which French language test have you taken?",
      "fre_test_type",
      "SELECT"
    );
  const frenchTestWritingQ = createMockQ(
    "Writing",
    "fre_test_writing",
    "SELECT"
  );
  const frenchTestReadingQ = createMockQ(
    "Reading",
    "fre_test_reading",
    "SELECT"
  );
  const frenchTestSpeakingQ = createMockQ(
    "Speaking",
    "fre_test_speaking",
    "SELECT"
  );
  const frenchTestListeningQ = createMockQ(
    "Listening",
    "fre_test_listening",
    "SELECT"
  );

  const frenchCommWritingQ = createMockQ(
    "Writing",
    "fre_comm_writing",
    "SELECT"
  );
  const frenchCommReadingQ = createMockQ(
    "Reading",
    "fre_comm_reading",
    "SELECT"
  );
  const frenchCommSpeakingQ = createMockQ(
    "Speaking",
    "fre_comm_speaking",
    "SELECT"
  );
  const frenchCommListeningQ = createMockQ(
    "Listening",
    "fre_comm_listening",
    "SELECT"
  );

  const withOptions = (
    q: Question | undefined,
    opts: any[],
    placeholder?: string
  ) => {
    if (!q) return q;
    const finalQ = { ...q, options: opts };
    if (placeholder) {
      finalQ.placeholder = placeholder;
    }
    return finalQ;
  };

  const takenEnglishTest = formValues[englishTestQ.questionId];
  const takenFrenchTest = formValues[frenchTestQ.questionId];

  const isEnglishTestSelected =
    takenEnglishTest === "Yes" ||
    takenEnglishTest === true ||
    String(takenEnglishTest).toLowerCase() === "true";
  const isFrenchTestSelected =
    takenFrenchTest === "Yes" ||
    takenFrenchTest === true ||
    String(takenFrenchTest).toLowerCase() === "true";

  const selectedEnglishTestType = formValues[englishTestTypeQ.questionId];
  let englishDynamicOptions = languageScoreOptions;
  if (isEnglishTestSelected) {
    if (selectedEnglishTestType?.includes("IELTS"))
      englishDynamicOptions = ieltsOptions;
    else if (selectedEnglishTestType?.includes("CELPIP"))
      englishDynamicOptions = celpipOptions;
    else if (selectedEnglishTestType?.includes("PTE"))
      englishDynamicOptions = pteOptions;
    else if (selectedEnglishTestType?.includes("TOEFL"))
      englishDynamicOptions = toeflOptions;
    else englishDynamicOptions = [];
  }

  const selectedFrenchTestType = formValues[frenchTestTypeQ.questionId];
  let frenchDynamicOptions = languageScoreOptions;
  if (isFrenchTestSelected) {
    if (selectedFrenchTestType) {
      frenchDynamicOptions = tefTcfOptions;
    } else {
      frenchDynamicOptions = [];
    }
  }

  const renderEnglishBlock = () => (
    <div className="space-y-6">
      {englishTestQ && (
        <div className="flex flex-col justify-start">
          <DynamicField question={englishTestQ} />
        </div>
      )}

      {takenEnglishTest !== undefined &&
        takenEnglishTest !== null &&
        takenEnglishTest !== "" && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            {isEnglishTestSelected ? (
              <div className="space-y-6">
                {englishTestTypeQ && (
                  <div className="max-w-md">
                    <DynamicField
                      question={
                        withOptions(
                          englishTestTypeQ,
                          englishTestOptions,
                          "Select test"
                        )!
                      }
                    />
                  </div>
                )}

                {selectedEnglishTestType && (
                  <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <label className="block mb-4 text-base md:text-xl font-medium text-gray-900">
                      Enter your test score
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                      {englishTestWritingQ && (
                        <DynamicField
                          question={
                            withOptions(
                              englishTestWritingQ,
                              englishDynamicOptions,
                              "Select level"
                            )!
                          }
                        />
                      )}
                      {englishTestReadingQ && (
                        <DynamicField
                          question={
                            withOptions(
                              englishTestReadingQ,
                              englishDynamicOptions,
                              "Select level"
                            )!
                          }
                        />
                      )}
                      {englishTestSpeakingQ && (
                        <DynamicField
                          question={
                            withOptions(
                              englishTestSpeakingQ,
                              englishDynamicOptions,
                              "Select level"
                            )!
                          }
                        />
                      )}
                      {englishTestListeningQ && (
                        <DynamicField
                          question={
                            withOptions(
                              englishTestListeningQ,
                              englishDynamicOptions,
                              "Select level"
                            )!
                          }
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-gray-600 text-sm md:text-base">
                  Please provide your best level of language competency for both
                  English and French.
                </p>
                <div>
                  <label className="block mb-4 text-base md:text-xl font-medium text-gray-900">
                    Enter your level of communication
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {englishCommWritingQ && (
                      <DynamicField
                        question={
                          withOptions(
                            englishCommWritingQ,
                            languageScoreOptions,
                            "Select level"
                          )!
                        }
                      />
                    )}
                    {englishCommReadingQ && (
                      <DynamicField
                        question={
                          withOptions(
                            englishCommReadingQ,
                            languageScoreOptions,
                            "Select level"
                          )!
                        }
                      />
                    )}
                    {englishCommSpeakingQ && (
                      <DynamicField
                        question={
                          withOptions(
                            englishCommSpeakingQ,
                            languageScoreOptions,
                            "Select level"
                          )!
                        }
                      />
                    )}
                    {englishCommListeningQ && (
                      <DynamicField
                        question={
                          withOptions(
                            englishCommListeningQ,
                            languageScoreOptions,
                            "Select level"
                          )!
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
    </div>
  );

  const renderFrenchBlock = () => (
    <div className="space-y-6 pt-4">
      {frenchTestQ && (
        <div className="flex flex-col justify-start">
          <DynamicField question={frenchTestQ} />
        </div>
      )}

      {takenFrenchTest !== undefined &&
        takenFrenchTest !== null &&
        takenFrenchTest !== "" && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            {isFrenchTestSelected ? (
              <div className="space-y-6">
                {frenchTestTypeQ && (
                  <div className="max-w-md">
                    <DynamicField
                      question={
                        withOptions(
                          frenchTestTypeQ,
                          frenchTestOptions,
                          "Select test"
                        )!
                      }
                    />
                  </div>
                )}

                {selectedFrenchTestType && (
                  <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <label className="block mb-4 text-base md:text-xl font-medium text-gray-900">
                      Enter your test score
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                      {frenchTestWritingQ && (
                        <DynamicField
                          question={
                            withOptions(
                              frenchTestWritingQ,
                              frenchDynamicOptions,
                              "Select level"
                            )!
                          }
                        />
                      )}
                      {frenchTestReadingQ && (
                        <DynamicField
                          question={
                            withOptions(
                              frenchTestReadingQ,
                              frenchDynamicOptions,
                              "Select level"
                            )!
                          }
                        />
                      )}
                      {frenchTestSpeakingQ && (
                        <DynamicField
                          question={
                            withOptions(
                              frenchTestSpeakingQ,
                              frenchDynamicOptions,
                              "Select level"
                            )!
                          }
                        />
                      )}
                      {frenchTestListeningQ && (
                        <DynamicField
                          question={
                            withOptions(
                              frenchTestListeningQ,
                              frenchDynamicOptions,
                              "Select level"
                            )!
                          }
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-gray-600 text-sm md:text-base">
                  Please provide your best level of language competency for
                  French.
                </p>
                <div>
                  <label className="block mb-4 text-base md:text-xl font-medium text-gray-900">
                    Enter your level of communication
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {frenchCommWritingQ && (
                      <DynamicField
                        question={
                          withOptions(
                            frenchCommWritingQ,
                            languageScoreOptions,
                            "Select level"
                          )!
                        }
                      />
                    )}
                    {frenchCommReadingQ && (
                      <DynamicField
                        question={
                          withOptions(
                            frenchCommReadingQ,
                            languageScoreOptions,
                            "Select level"
                          )!
                        }
                      />
                    )}
                    {frenchCommSpeakingQ && (
                      <DynamicField
                        question={
                          withOptions(
                            frenchCommSpeakingQ,
                            languageScoreOptions,
                            "Select level"
                          )!
                        }
                      />
                    )}
                    {frenchCommListeningQ && (
                      <DynamicField
                        question={
                          withOptions(
                            frenchCommListeningQ,
                            languageScoreOptions,
                            "Select level"
                          )!
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
    </div>
  );

  return (
    <div className="w-full">
      {renderEnglishBlock()}
      <div className="my-8 border-t border-gray-200"></div>
      {renderFrenchBlock()}
    </div>
  );
}
