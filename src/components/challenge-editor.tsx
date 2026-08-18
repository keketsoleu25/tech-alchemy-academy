"use client";

import { useState } from "react";

interface ChallengeEditorProps {
  challengeSlug: string;
  starterCode: string;
}

type SubmissionResult = {
  passed?: boolean;
  passedTests?: number;
  totalTests?: number;
  runtimeMs?: number | null;
  xpAwarded?: number;
  totalXp?: number | null;
  error?: string | null;
  message?: string;
};

export function ChallengeEditor({ challengeSlug, starterCode }: ChallengeEditorProps) {
  const [code, setCode] = useState(starterCode);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);

  async function submitSolution() {
    setSubmitting(true);
    setResult(null);

    try {
      const response = await fetch(`/api/challenges/${challengeSlug}/submit`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code, language: "javascript" }),
      });

      const payload = (await response.json()) as SubmissionResult;

      if (!response.ok) {
        setResult({
          error: payload.message ?? "Unable to run the challenge.",
        });
        return;
      }

      setResult(payload);
    } catch {
      setResult({ error: "Unable to reach the challenge runner." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#080b09]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
              JavaScript
            </p>
            <p className="mt-1 text-xs text-gray-600">solution.js</p>
          </div>

          <button
            type="button"
            onClick={() => {
              setCode(starterCode);
              setResult(null);
            }}
            className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-gray-400 transition hover:border-white/20 hover:text-white"
          >
            Reset
          </button>
        </div>

        <textarea
          value={code}
          onChange={(event) => setCode(event.target.value)}
          spellCheck={false}
          aria-label="Challenge solution"
          className="min-h-[360px] w-full resize-y bg-transparent p-5 font-mono text-sm leading-7 text-gray-200 outline-none"
        />
      </div>

      <button
        type="button"
        onClick={submitSolution}
        disabled={submitting || code.trim().length === 0}
        className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-300 px-5 py-4 text-sm font-black text-black transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Running hidden tests…" : "Submit solution"}
      </button>

      {result && (
        <div
          className={`rounded-2xl border p-5 ${
            result.passed
              ? "border-emerald-400/25 bg-emerald-400/[0.06]"
              : "border-rose-400/20 bg-rose-400/[0.05]"
          }`}
        >
          {result.passed ? (
            <>
              <p className="font-black text-emerald-300">Challenge passed.</p>
              <p className="mt-2 text-sm text-gray-400">
                {result.passedTests}/{result.totalTests} tests passed
                {typeof result.runtimeMs === "number" ? ` · ${result.runtimeMs} ms` : ""}.
              </p>
              <p className="mt-3 text-sm font-bold text-amber-300">
                {result.xpAwarded
                  ? `+${result.xpAwarded} XP awarded`
                  : "Already mastered — no duplicate XP awarded"}
              </p>
            </>
          ) : (
            <>
              <p className="font-black text-rose-300">Not quite yet.</p>
              {typeof result.passedTests === "number" && typeof result.totalTests === "number" && (
                <p className="mt-2 text-sm text-gray-400">
                  {result.passedTests}/{result.totalTests} tests passed.
                </p>
              )}
              <p className="mt-2 text-sm leading-6 text-gray-500">
                {result.error ?? "Review the problem and try another approach."}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
