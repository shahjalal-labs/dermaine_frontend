/**
 * Shared helpers for the occupation metadata that OccupationSearchField writes
 * alongside the answer it validates.
 *
 * The answer itself stays a plain string (the official occupation title) so the
 * existing zod validators are untouched; the NOC code, TEER level, match source
 * and the user's original wording live in sibling keys in the same scope:
 *
 *   jobTitle              "Retail and wholesale trade managers"
 *   jobTitle__nocCode     "60020"
 *   jobTitle__teer        "0"
 *   jobTitle__matchSource "dataset" | "synonym" | "ai" | "custom"
 *   jobTitle__userInput   "walmart department manager"
 *
 * Client-safe: no server imports, no dataset import.
 */

export const NOC_CODE_SUFFIX = "__nocCode";
export const NOC_TEER_SUFFIX = "__teer";
export const NOC_SOURCE_SUFFIX = "__matchSource";
export const NOC_INPUT_SUFFIX = "__userInput";

export type OccupationMatchSource = "dataset" | "synonym" | "ai" | "custom";

export interface OccupationMeta {
  /** "" when the user kept their own wording. */
  nocCode: string;
  /** null when there is no NOC code. */
  teerCategory: number | null;
  matchSource: OccupationMatchSource;
  /** What the user typed before selecting, when it differed. */
  userInput: string;
}

/** One entry of the additive `occupations[]` array sent to the Rules Engine. */
export interface OccupationAnswer extends OccupationMeta {
  /** Stable question key, e.g. "jobTitle". */
  questionId: string;
  /** Database id of the question, matching the keys used in `answers`. */
  questionDbId: string;
  occupationTitle: string;
  /** Set for answers inside a repeatable group. */
  groupKey?: string;
  instanceIndex?: number;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Reads the metadata a scope (top-level form values, or one repeatable-group
 * instance) holds for `questionId`. Returns null when the question carries no
 * occupation metadata at all — i.e. it was never an occupation field.
 */
export function readOccupationMeta(
  scope: Record<string, unknown> | undefined | null,
  questionId: string
): OccupationMeta | null {
  if (!scope || typeof scope !== "object") return null;

  const hasAny = [
    NOC_CODE_SUFFIX,
    NOC_TEER_SUFFIX,
    NOC_SOURCE_SUFFIX,
    NOC_INPUT_SUFFIX,
  ].some((suffix) => `${questionId}${suffix}` in scope);
  if (!hasAny) return null;

  const nocCode = asString(scope[`${questionId}${NOC_CODE_SUFFIX}`]);
  const rawTeer = asString(scope[`${questionId}${NOC_TEER_SUFFIX}`]);
  const teer = rawTeer === "" ? Number.NaN : Number(rawTeer);
  const source = asString(scope[`${questionId}${NOC_SOURCE_SUFFIX}`]);

  const matchSource: OccupationMatchSource =
    source === "dataset" || source === "synonym" || source === "ai" || source === "custom"
      ? source
      : nocCode
        ? "dataset"
        : "custom";

  return {
    nocCode,
    teerCategory: Number.isFinite(teer) ? teer : null,
    matchSource,
    userInput: asString(scope[`${questionId}${NOC_INPUT_SUFFIX}`]),
  };
}

/** "NOC 60020 • TEER 0", or null when there is no code to show. */
export function formatNocBadge(meta: OccupationMeta | null): string | null {
  if (!meta?.nocCode) return null;
  return meta.teerCategory === null
    ? `NOC ${meta.nocCode}`
    : `NOC ${meta.nocCode} • TEER ${meta.teerCategory}`;
}
