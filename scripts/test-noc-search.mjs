#!/usr/bin/env node
/**
 * Regression test for the NOC occupation search API.
 *
 *   npm run dev            # in one terminal
 *   node scripts/test-noc-search.mjs
 *   node scripts/test-noc-search.mjs http://localhost:3101
 *
 * Exits non-zero on the first failed assertion, so it is CI-usable.
 */

const BASE = (process.argv[2] || process.env.NOC_TEST_BASE || "http://localhost:3000").replace(
  /\/+$/,
  ""
);

let passed = 0;
const failures = [];

function fail(label, detail) {
  failures.push(`${label}\n    ${detail}`);
  console.log(`  FAIL  ${label}\n        ${detail}`);
}

function pass(label) {
  passed += 1;
  console.log(`  ok    ${label}`);
}

async function search(query, limit = 8) {
  const url = `${BASE}/api/noc/search?q=${encodeURIComponent(query)}&limit=${limit}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} → HTTP ${response.status}`);
  return response.json();
}

function describe(body) {
  if (!body.results.length) return "no results";
  return body.results
    .slice(0, 3)
    .map((r) => `${r.nocCode}/T${r.teer} ${r.title} (${r.confidence.toFixed(2)}, ${r.matchType})`)
    .join(" | ");
}

/** The top result must be this NOC code (and TEER, when given). */
async function expectTop(query, code, teer) {
  const body = await search(query);
  const top = body.results[0];
  const label = `"${query}" → top ${code}`;

  if (!top) return fail(label, `got no results`);
  if (top.nocCode !== code) return fail(label, `got ${describe(body)}`);
  if (teer !== undefined && top.teer !== teer)
    return fail(label, `TEER ${top.teer}, expected ${teer} — ${describe(body)}`);

  pass(`${label} • TEER ${top.teer} • ${top.title}`);
}

/** The code must appear somewhere in the result list. */
async function expectContains(query, code) {
  const body = await search(query, 12);
  const label = `"${query}" → contains ${code}`;
  const hit = body.results.find((r) => r.nocCode === code);
  if (!hit) return fail(label, `got ${describe(body)}`);
  pass(`${label} (rank ${body.results.indexOf(hit) + 1}, ${hit.matchType})`);
}

/** Unknown input must still answer 200 with an empty list and free text allowed. */
async function expectNoMatch(query) {
  const body = await search(query);
  const label = `"${query}" → no match, never blocked`;
  if (body.results.length !== 0) return fail(label, `got ${describe(body)}`);
  if (body.allowFreeText !== true) return fail(label, `allowFreeText was ${body.allowFreeText}`);
  pass(label);
}

async function expectDetail(code) {
  const response = await fetch(`${BASE}/api/noc/occupation/${code}`);
  const label = `GET /api/noc/occupation/${code}`;
  if (!response.ok) return fail(label, `HTTP ${response.status}`);
  const detail = await response.json();
  if (detail.nocCode !== code) return fail(label, `returned ${detail.nocCode}`);
  if (!detail.lead) return fail(label, "lead statement is empty");
  pass(`${label} → ${detail.title} (TEER ${detail.teer})`);
}

async function main() {
  console.log(`NOC search regression suite → ${BASE}\n`);

  try {
    await fetch(`${BASE}/api/noc/search?q=test`);
  } catch (error) {
    console.error(`Cannot reach ${BASE}. Start the dev server first (npm run dev).`);
    console.error(String(error));
    process.exit(2);
  }

  console.log("The required mapping table:");
  await expectTop("Department Manager", "60020", 0);
  await expectTop("Walmart Department Manager", "60020", 0);
  await expectTop("OMNI Department Manager", "60020", 0);
  await expectTop("department store manager", "60020", 0);
  await expectTop("Store Manager", "60020", 0);
  await expectTop("Restaurant Supervisor", "62020", 2);
  await expectTop("Software Developer", "21232", 1);

  console.log("\nSynonyms (admin-editable table, seeded):");
  await expectTop("Amazon Picker", "75101");
  await expectTop("Fulfillment Associate", "75101");
  await expectContains("Fulfillment Associate", "65102"); // the NOC-listed alternative
  await expectTop("Uber Driver", "75200");
  await expectContains("psw", "44101");
  await expectContains("psw", "33102"); // both TEERs offered — the difference matters for CRS

  console.log("\nTypos, codes and partial input:");
  await expectContains("sofware develper", "21232");
  await expectContains("resturant manager", "60030");
  await expectTop("21232", "21232", 1);
  await expectContains("2123", "21232");
  await expectContains("truck driver", "73300");
  await expectContains("call center representative", "64409");

  console.log("\nNever block the user:");
  await expectNoMatch("zzz not a job");
  await expectNoMatch("asdfghjkl");

  console.log("\nDetail endpoint:");
  await expectDetail("60020");
  await expectDetail("21232");

  console.log(`\n${passed} passed, ${failures.length} failed`);
  if (failures.length) {
    console.error("\nFailures:\n" + failures.map((f) => `  - ${f}`).join("\n"));
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(2);
});
