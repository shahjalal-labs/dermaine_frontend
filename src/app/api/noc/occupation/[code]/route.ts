/**
 * GET /api/noc/occupation/60020
 *
 * Full detail for one unit group: lead statement, main duties, employment
 * requirements and illustrative example titles. Backs the "why this match"
 * expander and lets the review step re-verify a saved code.
 */

import { NextResponse, type NextRequest } from "next/server";

import { teerLabel } from "@/lib/noc/matcher";
import { getOccupationIndex } from "@/lib/noc/server/registry";
import type { OccupationDetail } from "@/lib/noc/types";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params;

  const index = await getOccupationIndex();
  const record = index.getRecord(code);

  if (!record) {
    return NextResponse.json({ error: "Unknown NOC code", code }, { status: 404 });
  }

  const detail: OccupationDetail = {
    nocCode: record.code,
    title: record.title,
    teer: record.teer,
    teerLabel: teerLabel(record.teer),
    matchedOn: record.title,
    matchType: "noc_code",
    confidence: 1,
    lead: record.lead,
    duties: record.duties,
    requirements: record.requirements,
    illustrative: record.illustrative,
    hierarchy: {
      broad: record.broad,
      major: record.major,
      subMajor: record.subMajor,
      minor: record.minor,
    },
  };

  return NextResponse.json(detail, {
    headers: { "cache-control": "public, max-age=3600" },
  });
}
