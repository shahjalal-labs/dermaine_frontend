# NOC occupation search

How "What type of job is this?" resolves a typed job title to an official
**NOC 2021 Version 1.0** unit group, TEER level and code — and what the backend
needs to provide so the mapping stays editable without a code change.

---

## 1. Why this exists

The field used to search only the **516 official unit-group titles**. Real users
type their actual job title, so `department store manager` returned nothing even
though the correct answer is **60020 Retail and wholesale trade managers,
TEER 0**.

The fix indexes the full official dataset — every example/illustrative title,
lead statement, duty and requirement — and adds an admin-editable synonym table
for the brand- and slang-heavy titles the government data will never contain
(`Walmart Department Manager`, `Uber Driver`, `PSW`).

**The user is never blocked.** Whatever they type is kept as the answer; a NOC
match is enrichment, not a validation requirement.

---

## 2. Data sources

Both files come from the Statistics Canada NOC 2021 V1.0 open-data package
(<https://open.canada.ca/data/en/dataset/1feee3b5-8068-4dbb-b361-180875837593>):

| File | Rows | What it contributes |
| --- | --- | --- |
| `noc-2021-v1.0-elements.csv` — *Elements, English* | 44,037 | example + illustrative titles, main duties, employment requirements, inclusions, exclusions |
| `noc-2021-v1.0-classification-structure.csv` | 823 | hierarchy (broad / major / sub-major / minor) and the lead statement |

Compiled output: **516 unit groups, 29,493 searchable titles**, 6,144 duty lines,
1,042 alternative titles recovered from `(See NNNNN …)` exclusion cross-references.

```bash
npm run noc:build
```

Downloads both CSVs into `data/noc/` (gitignored cache), verifies the header
schema, asserts 516 unit groups and ≥28,000 titles, and writes
`src/lib/noc/data/noc-index.json` (~2.1 MB, **committed** — no build-time network
access needed). The script fails loudly if StatCan changes the CSV schema.

`teer` is the **second digit** of the 5-digit code: `60020` → 0, `21232` → 1,
`65102` → 5.

---

## 3. How matching works

`src/lib/noc/matcher.ts` is pure and dependency-free. It precomputes normalised
titles, a token index and a trigram index once per process, then scores in tiers:

| Tier | Signal | Score |
| --- | --- | --- |
| 1 | Synonym hit (admin table or seed) | 1200 |
| 2 | NOC code exact `21232` / prefix `2123` | 1150 / 1050 |
| 3 | Exact full-title match (official, illustrative, example, alt) | 1000 |
| 4 | Exact **head** match before the ` - ` qualifier | 950 |
| 5 | Head / title prefix (drives autocomplete), length-penalised | ≤ 800 |
| 6 | All query tokens present in one title | ≤ 660 |
| 7 | All query tokens present in the group corpus (lead + duties + requirements) | 420 |
| 8 | ≥ 50 % token coverage | 260–460 |
| 9 | Fuzzy — trigram shortlist + Damerau-Levenshtein | × 0.55 |

Plus: accent/case/punctuation-insensitive normalisation, stop-word stripping,
CA/US spelling variants (`center` → `centre`, `labor` → `labour`), and
**employer-brand stripping** — every query is also scored with `walmart`,
`amazon`, `uber`, `tim hortons`, `costco`, … removed, so
`Walmart Department Manager` behaves like `Department Manager`.

Results below a score of 250 are dropped, so nonsense (`zzz not a job`) returns
an empty list rather than noise.

**Why the head match matters:** NOC example titles are `head - qualifier`
(`department manager - retail`). An exact head match outranks a mere substring
hit such as `accounting department manager`, which is what the old
`includes()` search picked.

---

## 4. `occupation_synonyms` — the admin-editable table

Two cases the official data genuinely cannot resolve prove why this is needed:
`Restaurant Supervisor` (not a listed title anywhere; ties between 62020 and
60030) and `Uber Driver` (NOC contains no brand names).

### Table

```sql
CREATE TABLE occupation_synonyms (
  id               SERIAL PRIMARY KEY,
  search_term      VARCHAR(160) NOT NULL,   -- what the user types, e.g. 'walmart department manager'
  noc_code         CHAR(5)      NOT NULL,   -- must be a real NOC 2021 unit group
  occupation_title VARCHAR(255),            -- reference only; the official title always wins
  is_active        BOOLEAN      NOT NULL DEFAULT TRUE,
  priority         INTEGER      NOT NULL DEFAULT 0,   -- higher wins when terms collide
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX occupation_synonyms_term_idx ON occupation_synonyms (lower(search_term));
```

`search_term` is matched after normalisation (lowercased, accents and
punctuation stripped), so `PSW`, `psw` and `P.S.W.` all hit the same row.

### Endpoints the frontend expects

| Method | Path | Used by |
| --- | --- | --- |
| `GET` | `/occupation-synonyms` | this app, every 5 minutes |
| `POST` | `/occupation-synonyms` | admin panel |
| `PATCH` | `/occupation-synonyms/:id` | admin panel |
| `DELETE` | `/occupation-synonyms/:id` | admin panel |

`GET` needs no auth-specific shape; the loader accepts a bare array or
`{ result | data | results | synonyms: [...] }`, and both `camelCase` and
`snake_case` keys:

```json
{ "result": [
  { "id": 1, "search_term": "walmart department manager", "noc_code": "60020",
    "occupation_title": "Retail and wholesale trade managers",
    "is_active": true, "priority": 10 }
] }
```

Rows with `is_active: false` are ignored. A row whose `noc_code` is not a real
unit group is dropped (the code can never be invented downstream).

### Behaviour before the endpoint exists

`src/lib/noc/server/registry.ts` fetches it with a 4-second timeout and a
5-minute in-process TTL. **Any non-200 (including the 404 you get today) is
ignored silently** and the previous/seed rows stay in use — so nothing breaks
now, and no code change is needed when the endpoint ships.

> Deliberate deviation from the original plan: the TTL lives in-process rather
> than in Next's data cache (`next: { revalidate }`). The 2 MB index has to be
> memoised in module scope anyway, and layering two caches would make
> invalidation ambiguous.

### Seed

`src/lib/noc/synonyms.seed.json` holds 115 curated rows (shape identical to the
table, so it is copy-pasteable as a seed migration). Remote rows **replace** any
seed row with the same normalised `search_term`, so the admin panel always wins.

**Note on two rows:** `Amazon Picker` and `Fulfillment Associate` are seeded to
**75101 Material handlers** as specified, but the official dataset lists
`order picker` and `fulfillment associate` under **65102 Store shelf stockers,
clerks and order fillers**. Both are TEER 5, so CRS impact is nil, and both codes
appear in the dropdown. Flip the seed row (or the admin table) to follow NOC.

`psw` is intentionally mapped to **both** 44101 (TEER 4) and 33102 (TEER 3) —
the TEER difference is CRS-relevant, so the user picks.

---

## 5. API

| Route | Purpose |
| --- | --- |
| `GET /api/noc/search?q=&limit=` | keyword + synonym + fuzzy search. Always 200. |
| `GET /api/noc/occupation/[code]` | lead statement, duties, requirements, illustrative titles, hierarchy. |
| `POST /api/noc/ai-match` | paid-tier OpenAI fallback (see below). Always 200. |

```jsonc
// GET /api/noc/search?q=department%20store%20manager
{
  "query": "department store manager",
  "results": [
    { "nocCode": "60020", "title": "Retail and wholesale trade managers",
      "teer": 0, "teerLabel": "TEER 0",
      "matchedOn": "department store manager", "matchType": "synonym",
      "confidence": 1 }
  ],
  "aiUsed": false,
  "aiAvailable": false,
  "allowFreeText": true     // always true — the user is never blocked
}
```

Search runs server-side: the index is 2.1 MB (435 KB gzipped), too heavy to ship
to a phone, and server-side is what lets admin synonyms and the AI fallback work
without a redeploy.

---

## 6. What is saved for the Rules Engine

`answers` keeps its exact current shape (`answers[question.id] = <official
title>`). The submit payload gains one **additive** array:

```jsonc
{
  "assesmentId": "…",
  "country": "Canada",
  "answers": { "…": "Retail and wholesale trade managers" },
  "occupations": [
    {
      "questionId": "jobTitle",
      "questionDbId": "…",            // same id used as the key in `answers`
      "groupKey": "workExperience",   // present only inside a repeatable group
      "instanceIndex": 0,
      "occupationTitle": "Retail and wholesale trade managers",
      "nocCode": "60020",             // "" when the user kept their own wording
      "teerCategory": 0,              // null when there is no code
      "matchSource": "synonym",       // dataset | synonym | ai | custom
      "userInput": "walmart department manager"
    }
  ]
}
```

`occupations` is omitted entirely when no occupation field was answered.

Client-side the metadata rides in sibling form keys in the same scope, so it
travels with its repeatable-group instance and the answer itself stays a plain
string (the existing zod `TEXT` validator is untouched):

```
jobTitle              "Retail and wholesale trade managers"
jobTitle__nocCode     "60020"
jobTitle__teer        "0"
jobTitle__matchSource "synonym"
jobTitle__userInput   "walmart department manager"
```

`onSubmit` reads these with `methods.getValues()`, not the resolver output —
zod strips unknown keys. Helpers: `src/lib/noc/occupationFields.ts`.

---

## 7. AI fallback (paid tier)

Off by default. When configured, the client calls `POST /api/noc/ai-match` only
when keyword search returns nothing or nothing above 0.6 confidence — and only
for queries of 5+ characters, once per distinct query per field, so half-typed
words never spend a call.

```env
NOC_AI_ENABLED=false
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
NOC_AI_ALLOWED_PLANS=paid,premium,pro
```

- The key never reaches the browser.
- The prompt is grounded in the keyword shortlist, and **every code the model
  returns is validated against the loaded index and dropped if it does not
  exist** — the model cannot invent a code or a TEER.
- Denied, unconfigured, rate-limited or failing → **200 with an empty result
  list** and a `reason`, never an error that could block the form.
- Free users keep the full keyword/synonym/fuzzy search, which resolves every
  case in the dataset.

### Entitlement caveat — please read

`src/lib/noc/server/entitlement.ts` decides eligibility by base64-decoding the
`token` cookie payload and looking for a plan claim (`plan`, `subscription`,
`tier`, `isPaid`, …). **The signature is not verified, so this is a cost control,
not a security boundary** — a determined user could forge the claim and spend
tokens. It also applies a per-IP limit of 20 calls / 10 minutes, which is
per-instance only.

Two things the backend should do to close this properly:

1. Include a real plan/entitlement claim in the JWT (none exists today), and
2. ideally own the check — expose `GET /me/entitlements`, or proxy the AI call
   server-to-server so this app never needs the key.

---

## 8. Where the field appears

`src/components/Assessment/DynamicField.tsx` renders `OccupationSearchField`
for `TEXT` (and non-country `AUTOCOMPLETE`) questions whose `questionId` or
`questionText` mentions *job*, *noc* or *occupation* — the same heuristic the old
NOC autocomplete used, so nothing that matched before stops matching.

Against the live Permanent Residence assessment (172 questions) that resolves to
exactly the four "What type of job is this?" fields:

| Question id | Scope |
| --- | --- |
| `question_1785158587940` | `work_experience` group (repeatable) |
| `question_1785160012970` | Canadian job offer |
| `question_1785311699247` | `spouse_work_experience` group (repeatable) |
| `question_1785312986512` | spouse's Canadian job offer |

Every other job-related question is `SELECT` / `DATE` / `BOOLEAN` / `NUMBER` and
is untouched.

---

## 9. Verification

```bash
npm run noc:build                  # 516 groups, ≥28,000 titles, else non-zero exit
npm run dev
node scripts/test-noc-search.mjs   # asserts the required mapping table
```

`scripts/test-noc-search.mjs` asserts `Department Manager` → 60020 TEER 0,
`Walmart`/`OMNI Department Manager` → 60020, `Store Manager` → 60020,
`Restaurant Supervisor` → 62020, `Software Developer` → 21232, the synonym rows,
fuzzy (`sofware develper` → 21232), code lookup (`21232`, `2123`), and that
`zzz not a job` returns 200 with `allowFreeText: true`. Non-zero exit on any
regression.
