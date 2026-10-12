/**
 * NOC 2021 occupation matcher.
 *
 * Pure and dependency-free: no I/O, no framework imports, no `@/` aliases — the
 * server registry feeds it the compiled index and the merged synonym table, and
 * scripts/test-noc-search.mjs exercises the same code path over HTTP.
 *
 * Why this beats a plain `includes()` search: NOC example titles are written as
 * `head - qualifier` ("department manager - retail", "store manager - retail").
 * Matching the *head* exactly ranks the right unit group above an incidental
 * substring hit such as "accounting department manager".
 */

import type {
  MatchType,
  NocRecord,
  OccupationSearchResult,
  OccupationSynonym,
} from "./types";

// ── Text handling ─────────────────────────────────────────────────────────────

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "as",
  "at",
  "by",
  "for",
  "from",
  "in",
  "into",
  "my",
  "of",
  "on",
  "or",
  "the",
  "to",
  "with",
]);

/**
 * Employer and platform names users attach to their job title. NOC never lists
 * brands, so a query is also scored with these removed: "Walmart Department
 * Manager" then behaves exactly like "Department Manager".
 */
const EMPLOYER_BRANDS = [
  "7 eleven",
  "amazon",
  "best buy",
  "bell canada",
  "canada post",
  "canadian tire",
  "cineplex",
  "costco",
  "dollarama",
  "doordash",
  "fedex",
  "food basics",
  "freshco",
  "giant tiger",
  "home depot",
  "home hardware",
  "ikea",
  "instacart",
  "lidl",
  "loblaw",
  "loblaws",
  "london drugs",
  "longos",
  "lowes",
  "lyft",
  "mcdonald s",
  "mcdonalds",
  "metro",
  "no frills",
  "omni",
  "presidents choice",
  "purolator",
  "real canadian superstore",
  "rona",
  "shoppers drug mart",
  "skip the dishes",
  "skipthedishes",
  "sobeys",
  "staples",
  "starbucks",
  "subway",
  "superstore",
  "tim hortons",
  "uber eats",
  "ubereats",
  "uber",
  "ups",
  "walmart",
  "wal mart",
  "wendys",
  "winners",
  "zehrs",
];

/**
 * American spellings users type, mapped to the Canadian spelling the dataset
 * uses. Applied to both sides of the comparison so it can only ever help.
 */
const SPELLING_VARIANTS: Array<[RegExp, string]> = [
  [/\bcenter\b/g, "centre"],
  [/\bcenters\b/g, "centres"],
  [/\blabor\b/g, "labour"],
  [/\blaborer\b/g, "labourer"],
  [/\blaborers\b/g, "labourers"],
  [/\blicense\b/g, "licence"],
  [/\bfulfilment\b/g, "fulfillment"],
  [/\bprogramme\b/g, "program"],
  [/\bcounselor\b/g, "counsellor"],
  [/\bjeweler\b/g, "jeweller"],
];

/** Lowercase, strip accents and punctuation, collapse whitespace. Keeps hyphens
 *  so the ` - ` qualifier separator used by NOC titles survives. */
export function normalizeText(input: string): string {
  let text = input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 -]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  for (const [pattern, replacement] of SPELLING_VARIANTS) {
    text = text.replace(pattern, replacement);
  }

  return text;
}

function tokenize(normalized: string): string[] {
  return normalized
    .split(/[\s-]+/)
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

/** "department manager - retail" → "department manager" */
function headOf(normalized: string): string {
  const index = normalized.indexOf(" - ");
  return index === -1 ? normalized : normalized.slice(0, index).trim();
}

function stripEmployerBrands(normalized: string): string {
  let result = ` ${normalized} `;
  for (const brand of EMPLOYER_BRANDS) {
    result = result.split(` ${brand} `).join(" ");
  }
  return result.replace(/\s+/g, " ").trim();
}

/** Damerau-Levenshtein distance, abandoned as soon as it exceeds `max`. */
function boundedDistance(a: string, b: string, max: number): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;

  let previous = new Array<number>(b.length + 1);
  let current = new Array<number>(b.length + 1);
  let beforePrevious = new Array<number>(b.length + 1);

  for (let j = 0; j <= b.length; j++) previous[j] = j;

  for (let i = 1; i <= a.length; i++) {
    current[0] = i;
    let rowMin = current[0];

    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let value = Math.min(current[j - 1] + 1, previous[j] + 1, previous[j - 1] + cost);

      // transposition
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        value = Math.min(value, beforePrevious[j - 2] + 1);
      }

      current[j] = value;
      if (value < rowMin) rowMin = value;
    }

    if (rowMin > max) return max + 1;

    const spare = beforePrevious;
    beforePrevious = previous;
    previous = current;
    current = spare;
  }

  return previous[b.length];
}

function maxTypos(length: number): number {
  if (length <= 3) return 0;
  if (length <= 5) return 1;
  return 2;
}

// ── Index ─────────────────────────────────────────────────────────────────────

type EntryKind = "official" | "illustrative" | "example" | "alt";

const KIND_BONUS: Record<EntryKind, number> = {
  official: 25,
  illustrative: 10,
  example: 0,
  alt: -10,
};

const KIND_RANK: Record<EntryKind, number> = {
  official: 0,
  illustrative: 1,
  example: 2,
  alt: 3,
};

const KIND_MATCH_TYPE: Record<EntryKind, MatchType> = {
  official: "official_title",
  illustrative: "example_title",
  example: "example_title",
  alt: "alt_title",
};

interface TitleEntry {
  raw: string;
  norm: string;
  head: string;
  tokens: string[];
  kind: EntryKind;
}

interface IndexedRecord {
  record: NocRecord;
  entries: TitleEntry[];
  /** Lead statement + duties + requirements + inclusions, normalized. The
   *  "keywords" tier searches this. */
  corpus: string;
}

interface QueryShape {
  norm: string;
  tokens: string[];
}

const SCORE_SYNONYM = 1200;
const SCORE_CODE_EXACT = 1150;
const SCORE_CODE_PREFIX = 1050;
const SCORE_TITLE_EXACT = 1000;
const SCORE_HEAD_EXACT = 950;
const SCORE_HEAD_PREFIX = 800;
const SCORE_TITLE_PREFIX = 760;
const SCORE_ALL_TOKENS = 600;
const SCORE_KEYWORDS = 420;
const SCORE_PARTIAL = 260;
const FUZZY_FACTOR = 0.55;

/**
 * Results below this are noise ("zzz not a job" otherwise surfaces Lawyers via
 * the word "not"). Returning nothing is the honest answer — the field then
 * offers the free-text row and, for entitled users, the AI fallback.
 */
const MIN_RESULT_SCORE = 250;

/** Scores above this are treated as a confident match (no AI needed). */
export const CONFIDENT_SCORE = 600;

export interface SearchOptions {
  limit?: number;
}

export interface OccupationIndex {
  search(query: string, options?: SearchOptions): OccupationSearchResult[];
  getRecord(code: string): NocRecord | undefined;
  hasCode(code: string): boolean;
  toResult(record: NocRecord, matchType: MatchType, matchedOn?: string, confidence?: number): OccupationSearchResult;
  readonly size: number;
}

export function teerLabel(teer: number): string {
  return `TEER ${teer}`;
}

export function createOccupationIndex(
  records: NocRecord[],
  synonyms: OccupationSynonym[] = []
): OccupationIndex {
  const indexed: IndexedRecord[] = records.map((record) => {
    const entries: TitleEntry[] = [];

    const add = (raw: string, kind: EntryKind) => {
      const norm = normalizeText(raw);
      if (!norm) return;
      entries.push({ raw, norm, head: headOf(norm), tokens: tokenize(norm), kind });
    };

    add(record.title, "official");
    record.illustrative.forEach((title) => add(title, "illustrative"));
    record.examples.forEach((title) => add(title, "example"));
    record.altTitles.forEach((title) => add(title, "alt"));

    const corpus = normalizeText(
      [record.lead, ...record.duties, ...record.requirements, ...record.inclusions].join(" ")
    );

    return { record, entries, corpus };
  });

  const byCode = new Map<string, IndexedRecord>();
  indexed.forEach((entry) => byCode.set(entry.record.code, entry));

  // token → record positions, for candidate shortlisting
  const vocabulary = new Map<string, Set<number>>();
  indexed.forEach((item, position) => {
    for (const entry of item.entries) {
      for (const token of entry.tokens) {
        let bucket = vocabulary.get(token);
        if (!bucket) {
          bucket = new Set();
          vocabulary.set(token, bucket);
        }
        bucket.add(position);
      }
    }
  });
  const sortedVocabulary = [...vocabulary.keys()].sort();

  // normalized search term → synonym rows (highest priority first)
  const synonymMap = new Map<string, OccupationSynonym[]>();
  for (const synonym of synonyms) {
    if (synonym.isActive === false) continue;
    if (!byCode.has(synonym.nocCode)) continue; // never surface a code we can't resolve
    const key = normalizeText(synonym.searchTerm);
    if (!key) continue;
    const bucket = synonymMap.get(key) ?? [];
    bucket.push(synonym);
    synonymMap.set(key, bucket);
  }
  for (const bucket of synonymMap.values()) {
    bucket.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  }

  // ── candidate shortlisting ──────────────────────────────────────────────────

  const PREFIX_EXPANSION_CAP = 400;

  function vocabularyPrefixMatches(prefix: string): string[] {
    let low = 0;
    let high = sortedVocabulary.length;
    while (low < high) {
      const mid = (low + high) >>> 1;
      if (sortedVocabulary[mid] < prefix) low = mid + 1;
      else high = mid;
    }
    const matches: string[] = [];
    for (let i = low; i < sortedVocabulary.length && matches.length < PREFIX_EXPANSION_CAP; i++) {
      if (!sortedVocabulary[i].startsWith(prefix)) break;
      matches.push(sortedVocabulary[i]);
    }
    return matches;
  }

  function candidatePositions(tokens: string[]): Set<number> {
    const positions = new Set<number>();
    for (const token of tokens) {
      for (const vocabToken of vocabularyPrefixMatches(token)) {
        const bucket = vocabulary.get(vocabToken);
        if (bucket) for (const position of bucket) positions.add(position);
      }
    }
    return positions;
  }

  /** Replace tokens absent from the vocabulary with their closest known token. */
  function correctTypos(tokens: string[]): { tokens: string[]; changed: boolean } {
    let changed = false;
    const corrected = tokens.map((token) => {
      if (vocabulary.has(token) || vocabularyPrefixMatches(token).length > 0) return token;

      const limit = maxTypos(token.length);
      if (limit === 0) return token;

      let best = token;
      let bestDistance = limit + 1;
      for (const candidate of sortedVocabulary) {
        if (Math.abs(candidate.length - token.length) > limit) continue;
        const distance = boundedDistance(token, candidate, limit);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = candidate;
          if (distance === 1) break;
        }
      }

      if (bestDistance <= limit) {
        changed = true;
        return best;
      }
      return token;
    });

    return { tokens: corrected, changed };
  }

  // ── scoring ─────────────────────────────────────────────────────────────────

  function scoreEntry(entry: TitleEntry, query: QueryShape): number {
    if (!query.norm) return 0;

    // How many words the entry carries beyond what was typed. Without this a
    // one-word query like "driver" ranks "driver's licence examiner" (a prefix
    // hit) above "Transport truck drivers".
    const padding = Math.max(0, entry.tokens.length - query.tokens.length);
    const padPenalty = Math.min(210, padding * 70);

    let score = 0;
    if (entry.norm === query.norm) score = SCORE_TITLE_EXACT;
    else if (entry.head === query.norm) score = SCORE_HEAD_EXACT;
    else if (entry.head.startsWith(`${query.norm} `)) score = SCORE_HEAD_PREFIX - padPenalty;
    else if (entry.norm.startsWith(query.norm)) score = SCORE_TITLE_PREFIX - padPenalty;
    else if (query.tokens.length > 0) {
      let covered = 0;
      for (const token of query.tokens) {
        if (entry.tokens.some((entryToken) => entryToken === token || entryToken.startsWith(token))) {
          covered++;
        }
      }
      if (covered === query.tokens.length) {
        // Prefer titles that are not padded with extra words.
        score = SCORE_ALL_TOKENS + Math.max(0, 60 - padding * 10);
      } else if (covered * 2 >= query.tokens.length) {
        // At least half the typed words appear in this title. Below half it is
        // noise ("zzz not a job" hitting "notary public" on "not").
        score = SCORE_PARTIAL + Math.round(400 * (covered / query.tokens.length - 0.5));
      }
    }

    return score <= 0 ? 0 : score + KIND_BONUS[entry.kind];
  }

  interface Hit {
    position: number;
    score: number;
    matchedOn: string;
    matchType: MatchType;
    kindRank: number;
  }

  function collectHits(queries: QueryShape[], fuzzy: boolean): Map<number, Hit> {
    const hits = new Map<number, Hit>();
    const allTokens = queries.flatMap((query) => query.tokens);
    if (allTokens.length === 0) return hits;

    for (const position of candidatePositions(allTokens)) {
      const item = indexed[position];
      let best: Hit | null = null;

      for (const entry of item.entries) {
        for (const query of queries) {
          const score = scoreEntry(entry, query);
          if (score <= 0) continue;
          if (
            !best ||
            score > best.score ||
            (score === best.score && KIND_RANK[entry.kind] < best.kindRank)
          ) {
            best = {
              position,
              score,
              matchedOn: entry.raw,
              matchType: fuzzy ? "fuzzy" : KIND_MATCH_TYPE[entry.kind],
              kindRank: KIND_RANK[entry.kind],
            };
          }
        }
      }

      // "keywords" tier: every query token appears somewhere in the lead
      // statement, main duties, employment requirements or inclusions.
      if (!best || best.score < SCORE_ALL_TOKENS) {
        for (const query of queries) {
          if (query.tokens.length === 0) continue;
          const allPresent = query.tokens.every((token) => item.corpus.includes(token));
          if (allPresent && (!best || best.score < SCORE_KEYWORDS)) {
            best = {
              position,
              score: SCORE_KEYWORDS,
              matchedOn: item.record.title,
              matchType: fuzzy ? "fuzzy" : "keywords",
              kindRank: KIND_RANK.official,
            };
          }
        }
      }

      if (best) hits.set(position, best);
    }

    if (fuzzy) {
      for (const hit of hits.values()) hit.score = Math.round(hit.score * FUZZY_FACTOR);
    }

    return hits;
  }

  function toResult(
    record: NocRecord,
    matchType: MatchType,
    matchedOn = record.title,
    confidence = 1
  ): OccupationSearchResult {
    return {
      nocCode: record.code,
      title: record.title,
      teer: record.teer,
      teerLabel: teerLabel(record.teer),
      matchedOn,
      matchType,
      confidence: Math.max(0, Math.min(1, confidence)),
    };
  }

  function search(rawQuery: string, options: SearchOptions = {}): OccupationSearchResult[] {
    const limit = options.limit ?? 10;
    const normalized = normalizeText(rawQuery ?? "");
    if (normalized.length < 2) return [];

    const ranked: Array<{ score: number; result: OccupationSearchResult; kindRank: number; code: string }> = [];
    const claimed = new Set<string>();

    const push = (score: number, result: OccupationSearchResult, kindRank: number) => {
      if (claimed.has(result.nocCode)) return;
      claimed.add(result.nocCode);
      ranked.push({ score, result, kindRank, code: result.nocCode });
    };

    // 1 — synonyms (the admin-editable table wins over everything)
    const brandStripped = stripEmployerBrands(normalized);
    for (const key of brandStripped && brandStripped !== normalized ? [normalized, brandStripped] : [normalized]) {
      for (const synonym of synonymMap.get(key) ?? []) {
        const item = byCode.get(synonym.nocCode);
        if (item) {
          push(
            SCORE_SYNONYM,
            toResult(item.record, "synonym", synonym.searchTerm, 1),
            KIND_RANK.official
          );
        }
      }
    }

    // 2 — NOC code lookup
    const codeQuery = normalized.replace(/\s+/g, "");
    if (/^\d{2,5}$/.test(codeQuery)) {
      const exact = byCode.get(codeQuery);
      if (exact) {
        push(SCORE_CODE_EXACT, toResult(exact.record, "noc_code", exact.record.code, 1), KIND_RANK.official);
      }
      for (const item of indexed) {
        if (item.record.code.startsWith(codeQuery)) {
          push(
            SCORE_CODE_PREFIX,
            toResult(item.record, "noc_code", item.record.code, 0.9),
            KIND_RANK.official
          );
        }
      }
    }

    // 3-8 — title / head / prefix / token / keyword tiers, scored against both
    // the raw query and its brand-stripped variant.
    const queries: QueryShape[] = [{ norm: normalized, tokens: tokenize(normalized) }];
    if (brandStripped && brandStripped !== normalized) {
      queries.push({ norm: brandStripped, tokens: tokenize(brandStripped) });
    }

    const hits = collectHits(queries, false);

    // 9 — fuzzy: correct typos against the vocabulary, then re-score.
    if (hits.size === 0 || Math.max(...[...hits.values()].map((hit) => hit.score)) < CONFIDENT_SCORE) {
      const fuzzyQueries: QueryShape[] = [];
      for (const query of queries) {
        const { tokens, changed } = correctTypos(query.tokens);
        if (changed) fuzzyQueries.push({ norm: tokens.join(" "), tokens });
      }
      if (fuzzyQueries.length > 0) {
        const fuzzyHits = collectHits(fuzzyQueries, true);
        for (const [position, hit] of fuzzyHits) {
          const existing = hits.get(position);
          if (!existing || hit.score > existing.score) hits.set(position, hit);
        }
      }
    }

    for (const hit of hits.values()) {
      const item = indexed[hit.position];
      const matchedOn =
        hit.matchedOn.toLowerCase() === item.record.title.toLowerCase() ? item.record.title : hit.matchedOn;
      push(
        hit.score,
        toResult(item.record, hit.matchType, matchedOn, hit.score / SCORE_TITLE_EXACT),
        hit.kindRank
      );
    }

    ranked.sort(
      (a, b) => b.score - a.score || a.kindRank - b.kindRank || a.code.localeCompare(b.code)
    );

    return ranked
      .filter((entry) => entry.score >= MIN_RESULT_SCORE)
      .slice(0, limit)
      .map((entry) => entry.result);
  }

  return {
    search,
    getRecord: (code) => byCode.get(code)?.record,
    hasCode: (code) => byCode.has(code),
    toResult,
    size: indexed.length,
  };
}
