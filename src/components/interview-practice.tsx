"use client";

import { useEffect, useState } from "react";

type Question = { prompt: string; probes: string[]; evidence: string[] };
type Track = { title: string; subtitle: string; questions: Question[] };
type RecordEntry = { date: string; track: string; score: number; total: number; focus: string };

const tracks: Record<string, Track> = {
  frontend: {
    title: "Frontend Developer",
    subtitle: "React, accessibility, browser behavior and delivery",
    questions: [
      { prompt: "A React search page feels slow when the user types. How would you diagnose and improve it?", probes: ["What would you measure first?", "When would you debounce, memoize or change the API?"], evidence: ["Measure before optimizing", "Explain rendering and network costs", "Describe a test that confirms improvement"] },
      { prompt: "A form works with a mouse but a keyboard user cannot submit it. Walk me through your fix.", probes: ["How would you verify focus order?", "What feedback should a screen reader announce?"], evidence: ["Use semantic controls and labels", "Handle errors and focus", "Verify keyboard and assistive technology behavior"] },
      { prompt: "A production page hydrates differently from the server render. How do you find the cause?", probes: ["Which code commonly differs between server and browser?", "How would you prevent regression?"], evidence: ["Identify nondeterministic rendering", "Isolate browser-only data", "Show a concrete verification plan"] },
      { prompt: "Design a paginated jobs list that remains usable on a slow mobile connection.", probes: ["How will loading, empty and error states behave?", "How will you keep filters in the URL?"], evidence: ["Describe data and UI state", "Address accessibility and responsive layout", "Consider request cost and test cases"] },
      { prompt: "Tell me about a frontend feature you shipped and a tradeoff you made.", probes: ["What was your personal contribution?", "What would you improve after release?"], evidence: ["Give a specific situation and action", "Explain an outcome with evidence", "Reflect honestly on a tradeoff"] },
    ],
  },
  fullstack: {
    title: "Full Stack Developer",
    subtitle: "APIs, databases, auth and production decisions",
    questions: [
      { prompt: "Design an endpoint that lets a user create and view their own tasks. How do you protect ownership?", probes: ["Where is identity checked?", "How do you stop one user reading another user's task?"], evidence: ["Validate input server-side", "Scope queries by authenticated owner", "Describe status codes and tests"] },
      { prompt: "An endpoint becomes slow as its table grows. How would you investigate?", probes: ["What does an execution plan tell you?", "What pagination strategy would you choose?"], evidence: ["Measure query and request timing", "Discuss indexes and query shape", "Explain pagination and verification"] },
      { prompt: "A deployment succeeds but users receive 500 errors. What is your first 20-minute response?", probes: ["How do you narrow down the failing layer?", "When would you roll back?"], evidence: ["Use logs and recent changes", "Check configuration and database state", "Prioritize user impact and recovery"] },
      { prompt: "How would you prevent duplicate payment or submission actions when a user retries?", probes: ["What happens on a network timeout?", "What belongs in the database?"], evidence: ["Explain idempotency keys", "Use database constraints or transactions", "Discuss safe retries and failure cases"] },
      { prompt: "Explain a full-stack project you built from user need to deployed result.", probes: ["Which part did you own?", "What would you change if usage grew tenfold?"], evidence: ["Frame the user's problem", "Explain architecture and decisions", "Give a measured outcome and tradeoff"] },
    ],
  },
  support: {
    title: "IT Support & Graduate Tech",
    subtitle: "Troubleshooting, communication and practical judgment",
    questions: [
      { prompt: "A user cannot sign in after a password reset. How do you troubleshoot without exposing their credentials?", probes: ["What would you ask first?", "When would you escalate?"], evidence: ["Confirm scope and exact error", "Check account state and logs safely", "Communicate next steps clearly"] },
      { prompt: "Several people report that the office internet is down. What do you check and in what order?", probes: ["How do you distinguish Wi-Fi from upstream failure?", "How do you keep people updated?"], evidence: ["Establish impact and scope", "Test layers systematically", "Escalate with useful evidence"] },
      { prompt: "A laptop is overheating and shutting down during work. Walk through diagnosis and safety.", probes: ["What can the user do immediately?", "What evidence would you record?"], evidence: ["Prioritize safe shutdown and backups", "Check hardware and software symptoms", "Document and explain repair options"] },
      { prompt: "A colleague asks you to bypass access controls to meet a deadline. How do you respond?", probes: ["What approved alternative can you offer?", "Who should authorize access?"], evidence: ["Protect accounts and data", "Offer an approved route", "Stay calm and document escalation"] },
      { prompt: "Tell me about a time you solved a technical problem for a nontechnical person.", probes: ["How did you explain the fix?", "How did you confirm it stayed fixed?"], evidence: ["Describe the situation and your role", "Show clear communication", "Explain outcome and follow-up"] },
    ],
  },
};

const criteria = ["Accuracy", "Clear explanation", "Concrete example", "Tradeoffs and verification"];
const storageKey = "alchemy-academy-interview-history-v1";

export default function InterviewPractice() {
  const [trackId, setTrackId] = useState("fullstack");
  const [stage, setStage] = useState<"setup" | "interview" | "review" | "done">("setup");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [ratings, setRatings] = useState<number[][]>([]);
  const [history, setHistory] = useState<RecordEntry[]>([]);
  const [saved, setSaved] = useState(false);
  const track = tracks[trackId];
  const questions = track.questions;
  const total = questions.length * criteria.length * 2;
  const score = ratings.flat().reduce((sum, rating) => sum + rating, 0);

  useEffect(() => {
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
      if (Array.isArray(parsed)) setHistory(parsed.filter((item) => item && typeof item.track === "string" && typeof item.score === "number").slice(0, 10));
    } catch { /* Storage may be disabled. Practice still works. */ }
  }, []);

  useEffect(() => {
    if (stage !== "interview") return;
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [stage]);

  function start() {
    setAnswers([]);
    setRatings(questions.map(() => criteria.map(() => 0)));
    setIndex(0);
    setDraft("");
    setSeconds(0);
    setSaved(false);
    setStage("interview");
  }

  function next() {
    if (draft.trim().length < 30) return;
    const updated = [...answers];
    updated[index] = draft.trim();
    setAnswers(updated);
    setDraft("");
    if (index === questions.length - 1) {
      setIndex(0);
      setStage("review");
    } else setIndex(index + 1);
  }

  function rate(questionIndex: number, criterionIndex: number, value: number) {
    setRatings((previous) => previous.map((row, i) => i === questionIndex ? row.map((rating, j) => j === criterionIndex ? value : rating) : row));
  }

  function finish() {
    if (saved) return;
    const weakest = criteria.map((name, i) => ({ name, points: ratings.reduce((sum, row) => sum + row[i], 0) })).sort((a, b) => a.points - b.points)[0];
    const entry = { date: new Date().toISOString(), track: track.title, score, total, focus: weakest.name };
    const updated = [entry, ...history].slice(0, 10);
    setHistory(updated);
    try { localStorage.setItem(storageKey, JSON.stringify(updated)); } catch { /* Local storage is optional. */ }
    setSaved(true);
    setStage("done");
  }

  return (
    <div>
      <div className="py-12 sm:py-16">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-300">Interview Lab · Practice with evidence</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">Prepare for the room, not just the quiz.</h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-gray-400">Work through realistic junior-role questions under a timer. Write your own answers, face follow-up probes, then assess your evidence against a transparent rubric.</p>
      </div>

      {stage === "setup" && (
        <div className="grid gap-8 lg:grid-cols-[1.5fr_0.8fr]">
          <section aria-labelledby="choose-track" className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <h2 id="choose-track" className="text-2xl font-bold">Choose your interview</h2>
            <div className="mt-6 grid gap-3">{Object.entries(tracks).map(([id, item]) => <button key={id} type="button" onClick={() => setTrackId(id)} aria-pressed={trackId === id} className={`rounded-2xl border p-5 text-left transition ${trackId === id ? "border-emerald-400/70 bg-emerald-400/10" : "border-white/10 hover:border-white/30"}`}><span className="block font-bold">{item.title}</span><span className="mt-1 block text-sm text-gray-400">{item.subtitle}</span></button>)}</div>
            <p className="mt-6 text-sm leading-6 text-gray-400">Five questions. About 15–25 minutes. The timer measures elapsed time but does not cut you off. Your answers stay on this device for the current session; only your self-assessed result is saved in this browser.</p>
            <button type="button" onClick={start} className="mt-6 rounded-xl bg-emerald-300 px-6 py-3 font-bold text-black hover:bg-emerald-200">Start mock interview →</button>
          </section>
          <aside className="rounded-3xl border border-white/10 bg-[#0b110d] p-6 sm:p-8">
            <h2 className="text-xl font-bold">How the review works</h2>
            <ol className="mt-5 list-inside list-decimal space-y-4 text-sm leading-6 text-gray-400"><li>Answer without seeing the model evidence.</li><li>Review follow-up probes and specific points a strong answer covers.</li><li>Rate four criteria from 0 to 2 for each answer.</li><li>Leave with a focus area for your next attempt.</li></ol>
            <p className="mt-6 border-t border-white/10 pt-5 text-xs leading-5 text-gray-500">Scores are self-assessments, not recruiter judgments. No AI evaluation or recording is performed.</p>
          </aside>
        </div>
      )}

      {stage === "interview" && (
        <section className="rounded-3xl border border-emerald-400/20 bg-[#0b110d] p-6 sm:p-9">
          <div className="flex flex-wrap justify-between gap-3 text-xs font-bold uppercase tracking-widest text-emerald-300"><span>{track.title} · Question {index + 1} of {questions.length}</span><span aria-live="off">Elapsed {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}</span></div>
          <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-emerald-300" style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div>
          <h2 className="mt-9 max-w-3xl text-2xl font-bold leading-snug sm:text-3xl">{questions[index].prompt}</h2>
          <p className="mt-5 text-sm text-gray-400">Speak your answer aloud first, then write the main points. Include what you would do, why, and how you would verify it.</p>
          <label htmlFor="interview-answer" className="mt-8 block text-sm font-semibold">Your answer</label>
          <textarea id="interview-answer" value={draft} onChange={(event) => setDraft(event.target.value)} rows={9} maxLength={6000} placeholder="Start with your approach, then give a concrete example and a way to check the outcome…" className="mt-3 w-full rounded-2xl border border-white/15 bg-black/30 p-5 leading-7 text-white outline-none placeholder:text-gray-600 focus:border-emerald-400" />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4"><p className="text-xs text-gray-500">{draft.trim().length < 30 ? "Write at least 30 characters to continue." : `${draft.length} / 6000 characters`}</p><button type="button" disabled={draft.trim().length < 30} onClick={next} className="rounded-xl bg-emerald-300 px-6 py-3 font-bold text-black disabled:cursor-not-allowed disabled:opacity-40">{index === questions.length - 1 ? "Review answers →" : "Next question →"}</button></div>
        </section>
      )}

      {stage === "review" && (
        <section>
          <div className="rounded-3xl border border-amber-300/20 bg-amber-300/[0.04] p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-widest text-amber-300">Structured review</p><h2 className="mt-3 text-2xl font-bold">Be honest and specific.</h2><p className="mt-3 text-sm leading-6 text-gray-400">For every criterion choose 0 = missing, 1 = partial, or 2 = clear evidence. Compare your answer with the prompts below. The score is a practice aid.</p></div>
          <div className="mt-6 space-y-5">{questions.map((question, questionIndex) => <article key={question.prompt} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-widest text-emerald-300">Question {questionIndex + 1}</p><h3 className="mt-3 text-xl font-bold">{question.prompt}</h3><div className="mt-5 whitespace-pre-wrap rounded-xl border border-white/10 bg-black/25 p-4 text-sm leading-6 text-gray-300">{answers[questionIndex]}</div><div className="mt-6 grid gap-6 md:grid-cols-2"><div><h4 className="font-bold">Interviewer follow-ups</h4><ul className="mt-2 list-inside list-disc space-y-2 text-sm text-gray-400">{question.probes.map((item) => <li key={item}>{item}</li>)}</ul></div><div><h4 className="font-bold">Evidence to look for</h4><ul className="mt-2 list-inside list-disc space-y-2 text-sm text-gray-400">{question.evidence.map((item) => <li key={item}>{item}</li>)}</ul></div></div><div className="mt-7 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-2">{criteria.map((criterion, criterionIndex) => <div key={criterion} className="flex items-center justify-between gap-2 rounded-xl bg-white/5 px-4 py-3"><span className="text-sm">{criterion}</span><select aria-label={`Question ${questionIndex + 1}: ${criterion}`} value={ratings[questionIndex]?.[criterionIndex] ?? 0} onChange={(event) => rate(questionIndex, criterionIndex, Number(event.target.value))} className="rounded-lg border border-white/20 bg-[#121b15] p-2 text-sm text-white"><option value={0}>0 · Missing</option><option value={1}>1 · Partial</option><option value={2}>2 · Clear</option></select></div>)}</div></article>)}</div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 p-6"><p className="font-bold">Self-assessed score: {score} / {total}</p><button type="button" onClick={finish} className="rounded-xl bg-emerald-300 px-6 py-3 font-bold text-black hover:bg-emerald-200">Finish and save result →</button></div>
        </section>
      )}

      {stage === "done" && <section className="rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.05] p-8"><p className="text-xs font-bold uppercase tracking-widest text-emerald-300">Session complete</p><h2 className="mt-4 text-3xl font-black">{score} / {total} self-assessed points</h2><p className="mt-4 text-gray-400">Next focus: <strong className="text-white">{history[0]?.focus}</strong>. Try the same track again and add a clearer example or verification step in each answer.</p><button type="button" onClick={() => setStage("setup")} className="mt-7 rounded-xl bg-emerald-300 px-6 py-3 font-bold text-black">Practice again</button></section>}

      {history.length > 0 && stage !== "interview" && stage !== "review" && <section className="mt-12 border-t border-white/10 pt-9"><h2 className="text-xl font-bold">Practice history on this device</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{history.map((entry, i) => <div key={`${entry.date}-${i}`} className="rounded-2xl border border-white/10 p-4"><p className="font-semibold">{entry.track} · {entry.score}/{entry.total}</p><p className="mt-2 text-xs text-gray-500">{new Date(entry.date).toLocaleDateString()} · Focus: {entry.focus}</p></div>)}</div></section>}
    </div>
  );
}
