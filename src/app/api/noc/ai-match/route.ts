/**
 * POST /api/noc/ai-match  { query: string, duties?: string }
 *
 * Paid-tier fallback for job titles the dataset cannot resolve. The OpenAI key
 * stays on the server; the model is only ever used to *choose* among real NOC
 * 2021 unit groups — every code it returns is validated against the compiled
 * index and dropped if it does not exist, so it cannot invent a code or a TEER.
 *
 * Always answers 200. When the caller is not entitled (or the feature is off)
 * the response is `{ results: [], aiUsed: false, reason }` so the form can carry
 * on with free text instead of surfacing an error.
 */

import { NextResponse, type NextRequest } from "next/server";

import { checkAiEntitlement, isAiConfigured } from "@/lib/noc/server/entitlement";
import { getOccupationIndex } from "@/lib/noc/server/registry";
import type { OccupationSearchResponse, OccupationSearchResult } from "@/lib/noc/types";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const DEFAULT_MODEL = "gpt-4o-mini";
const OPENAI_TIMEOUT_MS = 12_000;

interface AiMatchResponse extends OccupationSearchResponse {
  reason?: string;
}

function respond(body: AiMatchResponse, status = 200) {
  return NextResponse.json(body, { status });
}

export async function POST(request: NextRequest) {
  let query = "";
  let duties = "";

  try {
    const payload = (await request.json()) as { query?: unknown; duties?: unknown };
    if (typeof payload.query === "string") query = payload.query.trim().slice(0, 160);
    if (typeof payload.duties === "string") duties = payload.duties.trim().slice(0, 600);
  } catch {
    // fall through — empty query is handled below
  }

  const base: AiMatchResponse = {
    query,
    results: [],
    aiUsed: false,
    aiAvailable: isAiConfigured(),
    allowFreeText: true,
  };

  if (query.length < 2) return respond({ ...base, reason: "query_too_short" });

  const gate = checkAiEntitlement(request);
  if (!gate.allowed) return respond({ ...base, reason: gate.reason });

  const index = await getOccupationIndex();

  // Ground the model in real candidates from the keyword search.
  const shortlist = index.search(query, { limit: 12 });
  const candidateBlock = shortlist
    .map((item) => `- ${item.nocCode} | TEER ${item.teer} | ${item.title}`)
    .join("\n");

  const prompt = [
    `A person described their job as: "${query}".`,
    duties ? `They described their duties as: "${duties}".` : "",
    candidateBlock
      ? `Keyword search suggested these NOC 2021 unit groups:\n${candidateBlock}`
      : "Keyword search found no candidates.",
    "",
    "Identify the 1-3 most likely National Occupational Classification (NOC) 2021 Version 1.0",
    "unit groups for this job. Prefer a candidate above when one fits. Only use real 5-digit",
    "NOC 2021 unit group codes. Reply with JSON only, in this exact shape:",
    '{"matches":[{"nocCode":"60020","reason":"short reason","confidence":0.8}]}',
  ]
    .filter(Boolean)
    .join("\n");

  let raw = "";
  try {
    const response = await fetch(OPENAI_URL, {
      method: "POST",
      cache: "no-store",
      signal: AbortSignal.timeout(OPENAI_TIMEOUT_MS),
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || DEFAULT_MODEL,
        temperature: 0,
        max_tokens: 400,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You map job titles to Canadian NOC 2021 unit group codes. Answer with JSON only.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      console.error("[noc/ai-match] OpenAI returned", response.status);
      return respond({ ...base, reason: "ai_unavailable" });
    }

    const completion = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    raw = completion.choices?.[0]?.message?.content ?? "";
  } catch (error) {
    console.error("[noc/ai-match] request failed", error);
    return respond({ ...base, reason: "ai_unavailable" });
  }

  let matches: Array<{ nocCode?: unknown; reason?: unknown; confidence?: unknown }> = [];
  try {
    const parsed = JSON.parse(raw) as { matches?: unknown };
    if (Array.isArray(parsed.matches)) matches = parsed.matches;
  } catch {
    return respond({ ...base, reason: "ai_unparsable" });
  }

  const seen = new Set<string>();
  const results: OccupationSearchResult[] = [];

  for (const match of matches) {
    const code = String(match?.nocCode ?? "").trim();
    if (!/^\d{5}$/.test(code) || seen.has(code)) continue;

    // The model can only pick from codes that actually exist in the dataset.
    const record = index.getRecord(code);
    if (!record) continue;

    seen.add(code);
    const confidence = Number(match?.confidence);
    const reason = typeof match?.reason === "string" ? match.reason.slice(0, 140) : "";

    results.push(
      index.toResult(
        record,
        "ai",
        reason || record.title,
        Number.isFinite(confidence) ? confidence : 0.7
      )
    );

    if (results.length === 3) break;
  }

  return respond({ ...base, results, aiUsed: true });
}
