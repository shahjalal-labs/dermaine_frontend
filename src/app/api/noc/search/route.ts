/**
 * GET /api/noc/search?q=department+store+manager&limit=8
 *
 * Keyword + synonym + fuzzy search over the official NOC 2021 datasets. Always
 * 200 with a (possibly empty) result list — the caller must never be blocked by
 * a missing match, hence `allowFreeText: true`.
 */

import { NextResponse, type NextRequest } from "next/server";

import { isAiConfigured } from "@/lib/noc/server/entitlement";
import { getOccupationIndex } from "@/lib/noc/server/registry";
import type { OccupationSearchResponse } from "@/lib/noc/types";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const query = (params.get("q") ?? "").slice(0, 120);

  const requestedLimit = Number(params.get("limit"));
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(25, Math.max(1, Math.trunc(requestedLimit)))
    : 8;

  let results: OccupationSearchResponse["results"] = [];
  try {
    const index = await getOccupationIndex();
    results = index.search(query, { limit });
  } catch (error) {
    // A broken index must not break the form; the field falls back to free text.
    console.error("[noc/search] failed", error);
  }

  const body: OccupationSearchResponse = {
    query,
    results,
    aiUsed: false,
    aiAvailable: isAiConfigured(),
    allowFreeText: true,
  };

  return NextResponse.json(body, {
    headers: { "cache-control": "private, max-age=30" },
  });
}
