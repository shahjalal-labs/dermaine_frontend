/**
 * Server-side NOC index registry.
 *
 * The compiled index (516 unit groups, ~29,500 searchable titles) is ~2 MB, so
 * it never goes to the browser. It is parsed once per server instance and the
 * built search index is memoised until the synonym table changes.
 *
 * Synonyms come from two places:
 *   1. src/lib/noc/synonyms.seed.json — committed, reviewed defaults.
 *   2. GET {NEXT_PUBLIC_BASE_URL_LOCAL}/occupation-synonyms — the admin-editable
 *      `occupation_synonyms` table. Overrides the seed by search term, so an
 *      admin can correct a seeded mapping without a deploy. A missing or failing
 *      endpoint is ignored: search keeps working on the seed alone.
 */

import { createOccupationIndex, normalizeText, type OccupationIndex } from "../matcher";
import type { NocIndexFile, NocRecord, OccupationSynonym } from "../types";
import nocIndexJson from "../data/noc-index.json";
import seedSynonymsJson from "../synonyms.seed.json";

const indexFile = nocIndexJson as unknown as NocIndexFile;

const SEED_SYNONYMS: OccupationSynonym[] = (seedSynonymsJson as OccupationSynonym[]).map(
  (row) => ({ ...row, source: "seed" })
);

export const NOC_SOURCE = indexFile.source;
export const NOC_UNIT_GROUPS = indexFile.unitGroups;
export const NOC_SEARCHABLE_TITLES = indexFile.searchableTitles;

export function getNocRecords(): NocRecord[] {
  return indexFile.records;
}

// ── remote synonyms ───────────────────────────────────────────────────────────

const REMOTE_TTL_MS = 5 * 60 * 1000;
const REMOTE_TIMEOUT_MS = 4000;

let remoteCache: { at: number; rows: OccupationSynonym[] } | null = null;

/** Accepts either camelCase or the snake_case column names of the DB table. */
function coerceSynonym(raw: unknown): OccupationSynonym | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;

  const searchTerm = row.searchTerm ?? row.search_term ?? row.term;
  const nocCode = row.nocCode ?? row.noc_code ?? row.code;
  if (typeof searchTerm !== "string" || !searchTerm.trim()) return null;
  if (typeof nocCode !== "string" && typeof nocCode !== "number") return null;

  const code = String(nocCode).trim();
  if (!/^\d{5}$/.test(code)) return null;

  const isActive = row.isActive ?? row.is_active;
  const priority = Number(row.priority ?? 0);
  const occupationTitle = row.occupationTitle ?? row.occupation_title;

  return {
    searchTerm: searchTerm.trim(),
    nocCode: code,
    occupationTitle: typeof occupationTitle === "string" ? occupationTitle : undefined,
    priority: Number.isFinite(priority) ? priority : 0,
    isActive: isActive === undefined || isActive === null ? true : Boolean(isActive),
    source: "admin",
  };
}

function unwrapList(body: unknown): unknown[] {
  if (Array.isArray(body)) return body;
  if (body && typeof body === "object") {
    const shell = body as Record<string, unknown>;
    for (const key of ["result", "data", "results", "synonyms"]) {
      const value = shell[key];
      if (Array.isArray(value)) return value;
      if (value && typeof value === "object" && Array.isArray((value as Record<string, unknown>).data)) {
        return (value as { data: unknown[] }).data;
      }
    }
  }
  return [];
}

async function fetchRemoteSynonyms(): Promise<OccupationSynonym[]> {
  const base = process.env.NEXT_PUBLIC_BASE_URL_LOCAL;
  const now = Date.now();

  if (!base) return [];
  if (remoteCache && now - remoteCache.at < REMOTE_TTL_MS) return remoteCache.rows;

  const previous = remoteCache?.rows ?? [];

  try {
    const response = await fetch(`${base.replace(/\/+$/, "")}/occupation-synonyms`, {
      cache: "no-store",
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(REMOTE_TIMEOUT_MS),
    });

    if (!response.ok) {
      // 404 until the backend ships the endpoint — expected, not an error.
      remoteCache = { at: now, rows: previous };
      return previous;
    }

    const rows = unwrapList(await response.json())
      .map(coerceSynonym)
      .filter((row): row is OccupationSynonym => row !== null);

    remoteCache = { at: now, rows };
    return rows;
  } catch {
    remoteCache = { at: now, rows: previous };
    return previous;
  }
}

/** Remote rows replace every seed row for the same search term. */
function mergeSynonyms(
  seed: OccupationSynonym[],
  remote: OccupationSynonym[]
): OccupationSynonym[] {
  if (remote.length === 0) return seed;
  const overridden = new Set(remote.map((row) => normalizeText(row.searchTerm)));
  return [...seed.filter((row) => !overridden.has(normalizeText(row.searchTerm))), ...remote];
}

// ── index memoisation ─────────────────────────────────────────────────────────

function fingerprint(rows: OccupationSynonym[]): string {
  let hash = 5381;
  for (const row of rows) {
    const text = `${row.searchTerm}>${row.nocCode}:${row.priority ?? 0}:${row.isActive === false ? 0 : 1}`;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) + hash + text.charCodeAt(i)) | 0;
    }
  }
  return `${rows.length}:${hash}`;
}

let built: { key: string; index: OccupationIndex } | null = null;

export async function getOccupationIndex(): Promise<OccupationIndex> {
  const synonyms = mergeSynonyms(SEED_SYNONYMS, await fetchRemoteSynonyms());
  const key = fingerprint(synonyms);

  if (built?.key === key) return built.index;

  built = { key, index: createOccupationIndex(indexFile.records, synonyms) };
  return built.index;
}
