"use client";

import { FormEvent, useState } from "react";

export function AdminChallengeForm({ lessons }: { lessons: Array<{ id: string; label: string }> }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);

    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());

    let testCases: unknown;
    try {
      testCases = JSON.parse(String(values.testCases));
    } catch {
      setBusy(false);
      setMessage("Test cases must be valid JSON.");
      return;
    }

    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity: "challenge",
          lessonId: values.lessonId || null,
          title: values.title,
          slug: values.slug,
          description: values.description,
          instructions: values.instructions,
          starterCode: values.starterCode,
          solutionCode: values.solutionCode,
          functionName: values.functionName,
          testCases,
          difficulty: values.difficulty,
          xpReward: Number(values.xpReward),
          estimatedMinutes: Number(values.estimatedMinutes),
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not create challenge.");
      form.reset();
      setMessage("Challenge created as a draft. Review it in Publishing before going live.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not create challenge.");
    } finally {
      setBusy(false);
    }
  }

  const input = "mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none transition focus:border-emerald-400/50";
  const textarea = `${input} min-h-32 font-mono`;

  return (
    <form onSubmit={submit} className="space-y-6">
      {message && <p className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-gray-300">{message}</p>}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-xs font-bold text-gray-400">Title<input name="title" required className={input} /></label>
        <label className="text-xs font-bold text-gray-400">Slug<input name="slug" required pattern="[a-z0-9-]+" className={input} /></label>
        <label className="text-xs font-bold text-gray-400">Related lesson<select name="lessonId" className={input}><option value="">Standalone challenge</option>{lessons.map((lesson) => <option key={lesson.id} value={lesson.id}>{lesson.label}</option>)}</select></label>
        <label className="text-xs font-bold text-gray-400">Function name<input name="functionName" required placeholder="solve" className={input} /></label>
        <label className="text-xs font-bold text-gray-400">Difficulty<select name="difficulty" defaultValue="EASY" className={input}>{["BEGINNER","EASY","MEDIUM","HARD","EXPERT"].map((value) => <option key={value}>{value}</option>)}</select></label>
        <div className="grid grid-cols-2 gap-3"><label className="text-xs font-bold text-gray-400">XP reward<input name="xpReward" type="number" min="0" max="10000" defaultValue="100" className={input} /></label><label className="text-xs font-bold text-gray-400">Minutes<input name="estimatedMinutes" type="number" min="1" max="600" defaultValue="15" className={input} /></label></div>
      </div>

      <label className="block text-xs font-bold text-gray-400">Short description<textarea name="description" required className={`${input} min-h-24`} /></label>
      <label className="block text-xs font-bold text-gray-400">Learner instructions<textarea name="instructions" required className={`${input} min-h-36`} /></label>

      <div className="grid gap-5 xl:grid-cols-2">
        <label className="block text-xs font-bold text-gray-400">Starter code<textarea name="starterCode" required defaultValue={'function solve(input) {\n  // Your code here\n}'} className={textarea} /></label>
        <label className="block text-xs font-bold text-gray-400">Reference solution<textarea name="solutionCode" required className={textarea} /></label>
      </div>

      <label className="block text-xs font-bold text-gray-400">Hidden test cases (JSON)<textarea name="testCases" required defaultValue={'[\n  { "input": [[1, 2, 3]], "expected": [3, 2, 1] },\n  { "input": [[]], "expected": [] }\n]'} className={`${textarea} min-h-44`} /><span className="mt-2 block font-normal text-gray-600">These tests stay server-side. Use an array of objects with input[] and expected.</span></label>

      <button disabled={busy} className="rounded-xl bg-emerald-300 px-6 py-3.5 text-sm font-black text-black transition hover:bg-emerald-200 disabled:opacity-50">{busy ? "Creating…" : "Create draft challenge"}</button>
    </form>
  );
}
