/**
 * Shared types for the NOC 2021 occupation search.
 *
 * `NocRecord` mirrors one unit group as compiled by scripts/build-noc-index.mjs
 * from the two official Government of Canada datasets.
 */

export interface NocRecord {
  /** 5-digit NOC 2021 unit group code, e.g. "60020". */
  code: string;
  /** Official occupation title, e.g. "Retail and wholesale trade managers". */
  title: string;
  /** TEER level 0-5 — the second digit of the code. */
  teer: number;
  broad: string;
  major: string;
  subMajor: string;
  minor: string;
  /** Lead statement (the class definition). */
  lead: string;
  /** Illustrative example titles. */
  illustrative: string[];
  /** The remaining "All examples" titles (illustrative ones removed). */
  examples: string[];
  /** Alternative titles recovered from "(See NNNNN …)" exclusion cross-references. */
  altTitles: string[];
  duties: string[];
  requirements: string[];
  inclusions: string[];
}

export interface NocIndexFile {
  source: string;
  generatedFrom: string[];
  unitGroups: number;
  searchableTitles: number;
  records: NocRecord[];
}

/**
 * One row of the editable `occupation_synonyms` table: a job title people
 * actually type, mapped to the official NOC unit group it should resolve to.
 */
export interface OccupationSynonym {
  /** What the user types, e.g. "walmart department manager". */
  searchTerm: string;
  /** 5-digit NOC code to resolve to. */
  nocCode: string;
  /** Optional label for reference only — the official title always wins. */
  occupationTitle?: string;
  /** Higher wins when two synonyms share a search term. Defaults to 0. */
  priority?: number;
  isActive?: boolean;
  /** Where the row came from, for debugging. */
  source?: "seed" | "admin";
}

export type MatchType =
  | "synonym"
  | "noc_code"
  | "official_title"
  | "example_title"
  | "alt_title"
  | "keywords"
  | "fuzzy"
  | "ai";

export interface OccupationSearchResult {
  /** Official NOC code — save this. */
  nocCode: string;
  /** Official occupation title — save this. */
  title: string;
  /** TEER level 0-5 — save this. */
  teer: number;
  /** Display label, e.g. "TEER 1". */
  teerLabel: string;
  /** The string that produced the match, for the "matched: …" hint. */
  matchedOn: string;
  matchType: MatchType;
  /** 0-1. Below ~0.6 the AI fallback is worth consulting. */
  confidence: number;
}

export interface OccupationSearchResponse {
  query: string;
  results: OccupationSearchResult[];
  aiUsed: boolean;
  /** True when the AI fallback is configured, so the client may offer to try it. */
  aiAvailable: boolean;
  /** Always true — a user is never blocked by a missing dataset match. */
  allowFreeText: true;
}

export interface OccupationDetail extends OccupationSearchResult {
  lead: string;
  duties: string[];
  requirements: string[];
  illustrative: string[];
  hierarchy: {
    broad: string;
    major: string;
    subMajor: string;
    minor: string;
  };
}
