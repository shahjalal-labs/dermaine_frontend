"use client";

/**
 * Occupation ("what type of job is this?") search field.
 *
 * Searches the full NOC 2021 dataset server-side — official titles, the ~29,000
 * example/illustrative titles, lead statements, duties and the admin-managed
 * `occupation_synonyms` table — with fuzzy matching for typos.
 *
 * It NEVER blocks the user. What they type is written to the form on every
 * keystroke, the dropdown always offers `Use "<what I typed>"`, and if the API
 * fails the component silently behaves like a plain text input.
 *
 * On select it writes the official title to `name` (still a plain string, so the
 * existing zod TEXT validator is untouched) plus four sibling keys in the same
 * scope, which travel with their repeatable-group instance:
 *
 *   name              "Retail and wholesale trade managers"
 *   name__nocCode     "60020"
 *   name__teer        "0"
 *   name__matchSource "dataset" | "synonym" | "ai" | "custom"
 *   name__userInput   "walmart department manager"
 */

import {
    NOC_CODE_SUFFIX,
    NOC_INPUT_SUFFIX,
    NOC_SOURCE_SUFFIX,
    NOC_TEER_SUFFIX,
    type OccupationMatchSource,
} from "@/lib/noc/occupationFields";
import type { OccupationSearchResponse, OccupationSearchResult } from "@/lib/noc/types";
import { cn } from "@/lib/utils";
import React from "react";
import { useController, useFormContext, useWatch } from "react-hook-form";

export interface OccupationSearchFieldProps {
  name: string;
  label: React.ReactNode;
  placeholder?: string;
  className?: string;
}

const DEBOUNCE_MS = 250;
const MIN_QUERY = 2;
/** Below this the AI fallback (paid tier, when configured) is worth consulting. */
const LOW_CONFIDENCE = 0.6;
/** Don't spend an AI call on half-typed words. */
const MIN_AI_QUERY = 5;

function matchSourceOf(result: OccupationSearchResult): OccupationMatchSource {
  if (result.matchType === "synonym") return "synonym";
  if (result.matchType === "ai") return "ai";
  return "dataset";
}

function sameTitle(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export default function OccupationSearchField({
  name,
  label,
  placeholder,
  className,
}: OccupationSearchFieldProps) {
  const { control, setValue } = useFormContext();
  const {
    field: { onChange, onBlur, value, ref: rhfRef },
    fieldState: { error },
  } = useController({ name, control });

  const text = typeof value === "string" ? value : "";

  const [results, setResults] = React.useState<OccupationSearchResult[]>([]);
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [searched, setSearched] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const listboxId = React.useId();
  /** Queries already sent to the AI fallback, so backspacing doesn't re-spend. */
  const aiTried = React.useRef<Set<string>>(new Set());

  // useWatch (not getValues) so the badge re-renders when the metadata changes.
  const nocCode = useWatch({ control, name: `${name}${NOC_CODE_SUFFIX}` });
  const teer = useWatch({ control, name: `${name}${NOC_TEER_SUFFIX}` });
  const selectedCode = typeof nocCode === "string" ? nocCode : "";
  const selectedTeer = typeof teer === "string" ? teer : "";

  const writeMeta = React.useCallback(
    (meta: { nocCode: string; teer: string; matchSource: string; userInput: string }) => {
      const options = { shouldDirty: true };
      setValue(`${name}${NOC_CODE_SUFFIX}`, meta.nocCode, options);
      setValue(`${name}${NOC_TEER_SUFFIX}`, meta.teer, options);
      setValue(`${name}${NOC_SOURCE_SUFFIX}`, meta.matchSource, options);
      setValue(`${name}${NOC_INPUT_SUFFIX}`, meta.userInput, options);
    },
    [name, setValue]
  );

  const clearMeta = React.useCallback(
    (userInput: string) => {
      writeMeta({
        nocCode: "",
        teer: "",
        matchSource: userInput ? "custom" : "",
        userInput,
      });
    },
    [writeMeta]
  );

  const select = React.useCallback(
    (result: OccupationSearchResult) => {
      const typed = text;
      onChange(result.title);
      writeMeta({
        nocCode: result.nocCode,
        teer: String(result.teer),
        matchSource: matchSourceOf(result),
        userInput: typed,
      });
      setOpen(false);
      setResults([]);
      setSearched(false);
    },
    [onChange, text, writeMeta]
  );

  const keepFreeText = React.useCallback(() => {
    clearMeta(text);
    setOpen(false);
    setSearched(false);
  }, [clearMeta, text]);

  // ── search ────────────────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!open) return;

    const query = text.trim();
    if (query.length < MIN_QUERY) return;

    const controller = new AbortController();
    const timer = setTimeout(() => {
      const run = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `/api/noc/search?q=${encodeURIComponent(query)}&limit=200`,
            { signal: controller.signal }
          );
          if (!response.ok) throw new Error(`search ${response.status}`);

          const data = (await response.json()) as OccupationSearchResponse;
          if (controller.signal.aborted) return;

          let found = Array.isArray(data.results) ? data.results : [];
          setResults(found);
          setActiveIndex(0);

          const needsAi =
            data.aiAvailable &&
            query.length >= MIN_AI_QUERY &&
            !aiTried.current.has(query) &&
            (found.length === 0 || (found[0]?.confidence ?? 0) < LOW_CONFIDENCE);

          if (needsAi) {
            aiTried.current.add(query);
            // Paid-tier fallback. Denied or unavailable → a 200 with no results,
            // so there is nothing to handle and nothing to show the user.
            const aiResponse = await fetch("/api/noc/ai-match", {
              method: "POST",
              signal: controller.signal,
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ query }),
            });
            if (controller.signal.aborted) return;

            if (aiResponse.ok) {
              const aiData = (await aiResponse.json()) as OccupationSearchResponse;
              const seen = new Set(found.map((item) => item.nocCode));
              const extra = (aiData.results ?? []).filter(
                (item) => !seen.has(item.nocCode)
              );
              if (extra.length > 0) {
                found = [...found, ...extra];
                setResults(found);
              }
            }
          }
        } catch {
          // Silent: the field degrades to a plain text input.
          if (!controller.signal.aborted) setResults([]);
        } finally {
          if (!controller.signal.aborted) {
            setLoading(false);
            setSearched(true);
          }
        }
      };
      void run();
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [text, open]);

  // ── close on outside click ────────────────────────────────────────────────
  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const node = containerRef.current;
      if (node && !node.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open]);

  // Derived, not state: a query that shrank below the minimum hides the previous
  // results without an extra render pass.
  const visible = text.trim().length >= MIN_QUERY ? results : [];
  const optionCount = visible.length + 1; // + the "Use what I typed" row

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      setActiveIndex((current) => {
        const next = event.key === "ArrowDown" ? current + 1 : current - 1;
        return (next + optionCount) % optionCount;
      });
      return;
    }

    if (event.key === "Enter") {
      if (!open) return; // let the form handle Enter as usual
      event.preventDefault();
      const picked = visible[activeIndex];
      if (picked) select(picked);
      else keepFreeText();
      return;
    }

    if (event.key === "Escape") {
      if (open) {
        event.preventDefault();
        setOpen(false);
      }
      return;
    }

    if (event.key === "Tab") setOpen(false);
  };

  const handleBlur = () => {
    // Typing the official title exactly, without opening the dropdown, still
    // attaches the code.
    if (!selectedCode) {
      const exact = visible.find((item) => sameTitle(item.title, text));
      if (exact) {
        writeMeta({
          nocCode: exact.nocCode,
          teer: String(exact.teer),
          matchSource: matchSourceOf(exact),
          userInput: text,
        });
      }
    }
    onBlur();
  };

  const inputClass =
    "w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 text-description placeholder-description bg-white appearance-none text-base md:text-xl";
  const labelClass = "block mb-2 text-base md:text-xl font-medium text-gray-900";

  const showNoMatch = open && searched && !loading && text.trim().length >= MIN_QUERY;

  return (
    <div className={className} ref={containerRef}>
      <label className={labelClass}>{label}</label>

      <div className="relative">
        <input
          name={name}
          type="text"
          autoComplete="new-password"
          autoCorrect="off"
          spellCheck="false"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          value={text}
          placeholder={placeholder || "Start typing your job title"}
          className={cn(
            inputClass,
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-200"
          )}
          onChange={(event) => {
            const next = event.target.value;
            onChange(next);
            clearMeta(next);
            setOpen(true);
            setSearched(false);
            setActiveIndex(0);
          }}
          onFocus={() => {
            if (text.trim().length >= MIN_QUERY) setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          ref={rhfRef}
        />

        {loading && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
            Searching…
          </span>
        )}

        {open && (
          <ul
            id={listboxId}
            role="listbox"
            className="absolute z-40 mt-1 w-full max-h-80 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg"
          >
            {visible.map((result, index) => {
              const isActive = index === activeIndex;
              return (
                <li
                  key={`${result.nocCode}-${index}`}
                  role="option"
                  aria-selected={isActive}
                  className={cn(
                    "cursor-pointer px-4 py-3 border-b border-gray-100 last:border-b-0",
                    isActive ? "bg-green-50" : "bg-white hover:bg-gray-50"
                  )}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    select(result);
                  }}
                >
                  <span className="block text-base font-medium text-gray-900">
                    {result.title}
                  </span>
                  <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm text-gray-500">
                    <span className="font-medium text-gray-700">
                      NOC {result.nocCode} • TEER {result.teer}
                    </span>
                    {!sameTitle(result.matchedOn, result.title) && (
                      <span className="text-gray-400">
                        matched: “{result.matchedOn}”
                      </span>
                    )}
                  </span>
                </li>
              );
            })}

            {showNoMatch && visible.length === 0 && (
              <li className="px-4 py-3 text-sm text-gray-500">
                No official occupation matched — you can keep your own wording.
              </li>
            )}

            <li
              role="option"
              aria-selected={activeIndex === visible.length}
              className={cn(
                "cursor-pointer px-4 py-3 border-t border-gray-100",
                activeIndex === visible.length
                  ? "bg-green-50"
                  : "bg-white hover:bg-gray-50"
              )}
              onMouseEnter={() => setActiveIndex(visible.length)}
              onMouseDown={(event) => {
                event.preventDefault();
                keepFreeText();
              }}
            >
              <span className="block text-base text-gray-900">
                Use “{text.trim() || "what I typed"}”
              </span>
              <span className="text-sm text-gray-400">
                Save my own wording — no NOC code
              </span>
            </li>
          </ul>
        )}
      </div>

      {selectedCode && (
        <p className="mt-2 text-sm font-medium text-gray-600">
          NOC {selectedCode}
          {selectedTeer !== "" && ` • TEER ${selectedTeer}`}
        </p>
      )}

      {error?.message && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
