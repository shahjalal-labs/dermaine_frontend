/**
 * Cost gate for the OpenAI-backed NOC fallback.
 *
 * IMPORTANT: this is a cost control, not a security boundary. The `token` cookie
 * payload is read without signature verification (exactly as
 * src/components/Shared/Navbar.tsx:51 already does client-side), so a determined
 * user could forge a plan claim. The durable fix is for the backend to expose an
 * entitlement endpoint or to proxy the AI call itself; see
 * docs/noc-occupation-search.md.
 *
 * Defaults are deliberately closed: with no env configuration the AI path is off
 * for everyone and keyword search — which handles every case in the dataset —
 * remains fully available to free users.
 */

import type { NextRequest } from "next/server";

export type AiDenyReason =
  | "disabled"
  | "missing_key"
  | "not_signed_in"
  | "plan_not_eligible"
  | "rate_limited";

export interface AiEntitlement {
  allowed: boolean;
  reason?: AiDenyReason;
  /** Plan claim we found, for logging. */
  plan?: string;
}

const DEFAULT_ALLOWED_PLANS = ["paid", "premium", "pro", "plus", "gold", "platinum"];

/** Claims we look at, in order. Different backends name this differently. */
const PLAN_CLAIMS = [
  "plan",
  "planName",
  "subscription",
  "subscriptionPlan",
  "subscriptionType",
  "tier",
  "membership",
  "package",
];
const BOOLEAN_CLAIMS = ["isPaid", "isPremium", "isSubscribed", "hasSubscription"];

function allowedPlans(): string[] {
  const raw = process.env.NOC_AI_ALLOWED_PLANS;
  if (!raw) return DEFAULT_ALLOWED_PLANS;
  return raw
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const segment = token.split(".")[1];
  if (!segment) return null;
  try {
    const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const json = Buffer.from(padded, "base64").toString("utf8");
    const payload = JSON.parse(json);
    return payload && typeof payload === "object" ? payload : null;
  } catch {
    return null;
  }
}

// ── rate limit ────────────────────────────────────────────────────────────────
// Per-instance, in-memory. Enough to stop a single client looping the endpoint;
// a multi-instance deployment needs the backend to own this.

const WINDOW_MS = 10 * 60 * 1000;
const MAX_CALLS = 20;
const buckets = new Map<string, { count: number; resetAt: number }>();

function clientKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function withinRateLimit(request: NextRequest): boolean {
  const key = clientKey(request);
  const now = Date.now();

  if (buckets.size > 5000) buckets.clear(); // crude ceiling; buckets are cheap to rebuild

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (bucket.count >= MAX_CALLS) return false;
  bucket.count += 1;
  return true;
}

// ── gate ──────────────────────────────────────────────────────────────────────

/** True when the AI fallback is configured at all — no user context needed. */
export function isAiConfigured(): boolean {
  return process.env.NOC_AI_ENABLED === "true" && Boolean(process.env.OPENAI_API_KEY);
}

export function checkAiEntitlement(request: NextRequest): AiEntitlement {
  if (process.env.NOC_AI_ENABLED !== "true") return { allowed: false, reason: "disabled" };
  if (!process.env.OPENAI_API_KEY) return { allowed: false, reason: "missing_key" };

  const token = request.cookies.get("token")?.value;
  if (!token) return { allowed: false, reason: "not_signed_in" };

  const payload = decodeJwtPayload(token);
  if (!payload) return { allowed: false, reason: "not_signed_in" };

  const permitted = allowedPlans();
  let plan: string | undefined;

  for (const claim of PLAN_CLAIMS) {
    const value = payload[claim];
    if (typeof value === "string" && value.trim()) {
      plan = value.trim().toLowerCase();
      if (permitted.includes(plan)) break;
    }
  }

  const flagged = BOOLEAN_CLAIMS.some((claim) => payload[claim] === true);
  const eligible = flagged || (plan !== undefined && permitted.includes(plan));

  if (!eligible) return { allowed: false, reason: "plan_not_eligible", plan };
  if (!withinRateLimit(request)) return { allowed: false, reason: "rate_limited", plan };

  return { allowed: true, plan: plan ?? "flagged" };
}
