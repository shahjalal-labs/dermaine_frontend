// Compiles the official Government of Canada NOC 2021 Version 1.0 datasets into a
// single search index consumed by src/lib/noc/server/registry.ts.
//
//   node scripts/build-noc-index.mjs            # uses data/noc/*.csv, downloads if missing
//   node scripts/build-noc-index.mjs --refresh  # always re-download
//
// Sources (see https://open.canada.ca/data/en/dataset/1feee3b5-8068-4dbb-b361-180875837593):
//   - Elements .................. every illustrative / example job title, main duties,
//                                 employment requirements, inclusions, exclusions
//   - Classification structure .. hierarchy + class definition (lead statement)

import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CACHE_DIR = join(ROOT, "data", "noc");
const OUT_FILE = join(ROOT, "src", "lib", "noc", "data", "noc-index.json");

const SOURCES = {
  elements: {
    file: "noc-2021-v1.0-elements.csv",
    url: "https://www.statcan.gc.ca/en/subjects/standard/noc/2021/indexV1/noc-2021-v1.0-elements.csv",
  },
  structure: {
    file: "noc-2021-v1.0-classification-structure.csv",
    url: "https://www.statcan.gc.ca/en/subjects/standard/noc/2021/indexV1/noc-2021-v1.0-classification-structure.csv",
  },
};

const EXPECTED_UNIT_GROUPS = 516;
const MIN_EXPECTED_TITLES = 28000;

// ── CSV ───────────────────────────────────────────────────────────────────────
// Minimal RFC 4180 reader. Required: many class titles contain commas and are
// therefore quoted, e.g. "Advertising, marketing and public relations managers".
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          quoted = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') quoted = true;
    else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }

  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function loadSource({ file, url }, refresh) {
  const path = join(CACHE_DIR, file);

  if (!refresh && (await exists(path))) {
    console.log(`  using cached ${file}`);
  } else {
    console.log(`  downloading ${url}`);
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to download ${url} — HTTP ${res.status}`);
    }
    await mkdir(CACHE_DIR, { recursive: true });
    await writeFile(path, Buffer.from(await res.arrayBuffer()));
  }

  // Strip the UTF-8 BOM StatCan ships on both files.
  return parseCsv((await readFile(path, "utf8")).replace(/^﻿/, ""));
}

const clean = (value) => (value ?? "").replace(/\s+/g, " ").trim();

// "Drugstore manager  (See 60020 Retail and wholesale trade managers)"
//   → { title: "Drugstore manager", code: "60020" }
// Exclusions are a rich source of alternative titles: the excluded title is a real
// job title, and the reference tells us which unit group it actually belongs to.
function parseExclusionRedirect(text) {
  const match = text.match(/^(.*?)\s*\(\s*See\s+(\d{5})\b/i);
  if (!match) return null;
  const title = clean(match[1]);
  if (!title) return null;
  return { title, code: match[2] };
}

function pushUnique(list, value) {
  const trimmed = clean(value);
  if (!trimmed) return;
  const key = trimmed.toLowerCase();
  if (!list.some((entry) => entry.toLowerCase() === key)) list.push(trimmed);
}

async function main() {
  const refresh = process.argv.includes("--refresh");

  console.log("NOC 2021 index build");
  const [elementRows, structureRows] = await Promise.all([
    loadSource(SOURCES.elements, refresh),
    loadSource(SOURCES.structure, refresh),
  ]);

  // ── Structure: hierarchy labels + lead statement ────────────────────────────
  // Codes are prefix-based: broad = 1 digit, major = 2, sub-major = 3, minor = 4,
  // unit group = 5.
  const titleByCode = new Map();
  const definitionByCode = new Map();

  for (const row of structureRows.slice(1)) {
    const [level, , code, title, definition] = row;
    if (!code) continue;
    titleByCode.set(code, clean(title));
    definitionByCode.set(code, clean(definition));
    if (level === "5" && !clean(title)) {
      throw new Error(`Unit group ${code} has no class title in the structure CSV`);
    }
  }

  // ── Elements: titles, duties, requirements ──────────────────────────────────
  const groups = new Map();

  const getGroup = (code) => {
    let group = groups.get(code);
    if (!group) {
      group = {
        code,
        title: titleByCode.get(code) || "",
        teer: Number(code[1]),
        broad: "",
        major: "",
        subMajor: "",
        minor: "",
        lead: "",
        illustrative: [],
        examples: [],
        altTitles: [],
        duties: [],
        requirements: [],
        inclusions: [],
      };
      groups.set(code, group);
    }
    return group;
  };

  const header = elementRows[0]?.map(clean) ?? [];
  const expectedHeader = [
    "Level",
    "Code - NOC 2021 V1.0",
    "Class title",
    "Element Type Label English",
    "Element Description English",
  ];
  if (expectedHeader.some((column, i) => header[i] !== column)) {
    throw new Error(
      `Unexpected Elements CSV header — the dataset schema changed.\n  got:      ${header.join(" | ")}\n  expected: ${expectedHeader.join(" | ")}`
    );
  }

  for (const row of elementRows.slice(1)) {
    const [, code, classTitle, elementType, description] = row;
    if (!code) continue;

    const group = getGroup(code);
    if (!group.title) group.title = clean(classTitle);

    const value = clean(description);
    if (!value) continue;

    switch (elementType) {
      case "Illustrative example(s)":
        pushUnique(group.illustrative, value);
        break;
      case "All examples":
        pushUnique(group.examples, value);
        break;
      case "Main duties":
        group.duties.push(value);
        break;
      case "Employment requirements":
        group.requirements.push(value);
        break;
      case "Inclusion(s)":
        group.inclusions.push(value);
        break;
      case "Exclusion(s)": {
        const redirect = parseExclusionRedirect(value);
        if (redirect) pushUnique(getGroup(redirect.code).altTitles, redirect.title);
        break;
      }
      case "Additional information":
        break;
      default:
        throw new Error(`Unknown element type "${elementType}" for NOC ${code}`);
    }
  }

  // ── Finalise ────────────────────────────────────────────────────────────────
  const records = [...groups.values()]
    .filter((group) => /^\d{5}$/.test(group.code))
    .sort((a, b) => a.code.localeCompare(b.code));

  for (const record of records) {
    record.broad = titleByCode.get(record.code.slice(0, 1)) || "";
    record.major = titleByCode.get(record.code.slice(0, 2)) || "";
    record.subMajor = titleByCode.get(record.code.slice(0, 3)) || "";
    record.minor = titleByCode.get(record.code.slice(0, 4)) || "";
    record.lead = definitionByCode.get(record.code) || "";

    // "All examples" is a superset of the illustrative list; keep illustrative
    // separately (it drives the nicer "matched: …" hint) and de-duplicate.
    const illustrative = new Set(record.illustrative.map((t) => t.toLowerCase()));
    record.examples = record.examples.filter((t) => !illustrative.has(t.toLowerCase()));

    if (!record.title) throw new Error(`NOC ${record.code} ended up with no title`);
    if (Number.isNaN(record.teer) || record.teer < 0 || record.teer > 5) {
      throw new Error(`NOC ${record.code} produced an invalid TEER (${record.teer})`);
    }
  }

  const titleCount = records.reduce(
    (total, r) => total + 1 + r.illustrative.length + r.examples.length + r.altTitles.length,
    0
  );

  if (records.length !== EXPECTED_UNIT_GROUPS) {
    throw new Error(
      `Expected ${EXPECTED_UNIT_GROUPS} unit groups, got ${records.length} — verify the source datasets`
    );
  }
  if (titleCount < MIN_EXPECTED_TITLES) {
    throw new Error(
      `Only ${titleCount} searchable titles indexed (expected at least ${MIN_EXPECTED_TITLES}) — the Elements CSV may not have loaded`
    );
  }

  const payload = {
    source: "NOC 2021 Version 1.0 (Statistics Canada / ESDC)",
    generatedFrom: [SOURCES.elements.url, SOURCES.structure.url],
    unitGroups: records.length,
    searchableTitles: titleCount,
    records,
  };

  await mkdir(dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(payload));

  console.log(`  unit groups ......... ${records.length}`);
  console.log(`  searchable titles ... ${titleCount}`);
  console.log(`  duty lines .......... ${records.reduce((n, r) => n + r.duties.length, 0)}`);
  console.log(`  alt titles (from exclusion cross-references) ... ${records.reduce((n, r) => n + r.altTitles.length, 0)}`);
  console.log(`  wrote ${OUT_FILE}`);
}

main().catch((error) => {
  console.error(`\nNOC index build failed: ${error.message}`);
  process.exit(1);
});
