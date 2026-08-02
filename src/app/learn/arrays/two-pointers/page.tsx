"use client";

import Link from "next/link";
import { useState } from "react";

const numbers = [1, 2, 4, 7, 11, 15];
const target = 15;

const answers = [
  "It makes the interface load faster",
  "Pointer movement can safely eliminate impossible values",
  "JavaScript only searches sorted arrays",
];

const codeExample = `function findPair(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];

    if (sum === target) {
      return [numbers[left], numbers[right]];
    }

    if (sum < target) {
      left++;
    } else {
      right--;
    }
  }

  return null;
}`;

export default function TwoPointersLessonPage() {
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(numbers.length - 1);
  const [found, setFound] = useState(false);
  const [explanation, setExplanation] = useState(
    "Start with one pointer at each end of the sorted array.",
  );
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizChecked, setQuizChecked] = useState(false);
  const [lessonComplete, setLessonComplete] = useState(false);

  const currentSum = numbers[left] + numbers[right];
  const correctAnswer = selectedAnswer === 1;
  const canComplete = found && correctAnswer && quizChecked;

  function takeStep() {
    const sum = numbers[left] + numbers[right];

    if (sum === target) {
      setFound(true);
      setExplanation(
        `${numbers[left]} + ${numbers[right]} equals ${target}. The target pair has been found.`,
      );
      return;
    }

    if (sum < target) {
      setExplanation(
        `${sum} is smaller than ${target}, so move the left pointer one position to the right.`,
      );
      setLeft((position) => position + 1);
      return;
    }

    setExplanation(
      `${sum} is greater than ${target}, so move the right pointer one position to the left.`,
    );
    setRight((position) => position - 1);
  }

  function resetVisualizer() {
    setLeft(0);
    setRight(numbers.length - 1);
    setFound(false);
    setExplanation(
      "Start with one pointer at each end of the sorted array.",
    );
  }

  function checkAnswer() {
    if (selectedAnswer !== null) {
      setQuizChecked(true);
    }
  }

  return (
    <main className="min-h-screen bg-[#050806] text-white">
      <header className="border-b border-white/10 bg-[#070b08]">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-5 px-5 py-5 sm:px-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 text-sm font-bold text-gray-400 transition hover:text-white"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5">
              ←
            </span>
            Dashboard
          </Link>

          <div className="hidden text-center sm:block">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
              Arrays & Strings
            </p>
            <p className="mt-1 text-sm text-gray-400">Lesson 6 of 8</p>
          </div>

          <div className="min-w-28">
            <div className="flex justify-between text-[11px] text-gray-500">
              <span>Progress</span>
              <span>75%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-emerald-400 to-amber-300" />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-10">
        <div className="space-y-8">
          <section>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 text-xs font-bold text-emerald-300">
                Two Pointers
              </span>
              <span className="rounded-full border border-amber-300/20 bg-amber-300/5 px-3 py-1.5 text-xs font-bold text-amber-300">
                +150 XP
              </span>
              <span className="text-xs text-gray-600">12 minute lesson</span>
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
              Search smarter with two pointers.
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-400">
              Instead of checking every possible pair, place one pointer at each
              end of a sorted array. Move the pointers based on whether their
              sum is too small or too large.
            </p>
          </section>

          <section className="grid gap-4 sm:grid-cols-3">
            {[
              {
                number: "01",
                title: "Start at both ends",
                text: "The left pointer begins at the smallest value and the right pointer at the largest.",
              },
              {
                number: "02",
                title: "Compare the sum",
                text: "Add the two selected values and compare the result with the target.",
              },
              {
                number: "03",
                title: "Eliminate a value",
                text: "Move only the pointer that cannot be part of the correct answer.",
              },
            ].map((step) => (
              <article
                key={step.number}
                className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"
              >
                <span className="font-mono text-xs font-bold text-emerald-300">
                  STEP {step.number}
                </span>
                <h2 className="mt-4 font-bold">{step.title}</h2>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {step.text}
                </p>
              </article>
            ))}
          </section>

          <section className="rounded-3xl border border-emerald-400/20 bg-[#08100b] p-5 sm:p-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
                  Interactive visualizer
                </p>
                <h2 className="mt-3 text-2xl font-black">
                  Find two numbers that equal {target}
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Use the next-step button and observe how each decision removes
                  unnecessary comparisons.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-center">
                <p className="text-[11px] uppercase tracking-wider text-gray-600">
                  Current sum
                </p>
                <p
                  className={`mt-1 text-2xl font-black ${
                    found ? "text-emerald-300" : "text-white"
                  }`}
                >
                  {numbers[left]} + {numbers[right]} = {currentSum}
                </p>
              </div>
            </div>

            <div className="mt-9 grid grid-cols-3 gap-3 sm:grid-cols-6">
              {numbers.map((number, index) => {
                const isLeft = index === left;
                const isRight = index === right;
                const isActive = isLeft || isRight;

                return (
                  <div key={`${number}-${index}`} className="text-center">
                    <div className="mb-2 flex h-6 justify-center gap-1">
                      {isLeft && (
                        <span className="rounded bg-emerald-300 px-2 py-1 text-[10px] font-black text-black">
                          LEFT
                        </span>
                      )}
                      {isRight && (
                        <span className="rounded bg-amber-300 px-2 py-1 text-[10px] font-black text-black">
                          RIGHT
                        </span>
                      )}
                    </div>

                    <div
                      className={`flex aspect-square items-center justify-center rounded-xl border text-xl font-black transition ${
                        isActive
                          ? found
                            ? "border-emerald-300 bg-emerald-300 text-black"
                            : "border-emerald-400/50 bg-emerald-400/10 text-white"
                          : "border-white/10 bg-black/30 text-gray-600"
                      }`}
                    >
                      {number}
                    </div>

                    <p className="mt-2 font-mono text-[10px] text-gray-700">
                      INDEX {index}
                    </p>
                  </div>
                );
              })}
            </div>

            <div
              aria-live="polite"
              className={`mt-7 rounded-xl border p-4 text-sm leading-6 ${
                found
                  ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                  : "border-white/10 bg-black/20 text-gray-400"
              }`}
            >
              {explanation}
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={takeStep}
                disabled={found || left >= right}
                className="rounded-xl bg-emerald-300 px-6 py-3.5 font-black text-black transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-gray-600"
              >
                {found ? "Target pair found" : "Next step"}
              </button>

              <button
                type="button"
                onClick={resetVisualizer}
                className="rounded-xl border border-white/10 px-6 py-3.5 font-bold text-gray-400 transition hover:border-white/25 hover:text-white"
              >
                Reset visualizer
              </button>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 sm:p-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-300">
                  Implementation
                </p>
                <h2 className="mt-3 text-2xl font-black">
                  JavaScript solution
                </h2>
              </div>

              <div className="flex gap-2 text-xs">
                <span className="rounded-lg bg-emerald-400/10 px-3 py-2 text-emerald-300">
                  Time: O(n)
                </span>
                <span className="rounded-lg bg-blue-400/10 px-3 py-2 text-blue-300">
                  Space: O(1)
                </span>
              </div>
            </div>

            <pre className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-black/60 p-5 text-sm leading-7 text-gray-300">
              <code>{codeExample}</code>
            </pre>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
              Knowledge check
            </p>
            <h2 className="mt-3 text-2xl font-black">
              Why must the array be sorted?
            </h2>

            <div className="mt-6 space-y-3">
              {answers.map((answer, index) => (
                <button
                  key={answer}
                  type="button"
                  onClick={() => {
                    setSelectedAnswer(index);
                    setQuizChecked(false);
                  }}
                  className={`w-full rounded-xl border p-4 text-left text-sm transition ${
                    selectedAnswer === index
                      ? "border-emerald-400/50 bg-emerald-400/10 text-white"
                      : "border-white/10 bg-black/20 text-gray-400 hover:border-white/25"
                  }`}
                >
                  <span className="mr-3 font-mono text-emerald-300">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {answer}
                </button>
              ))}
            </div>

            {quizChecked && (
              <div
                aria-live="polite"
                className={`mt-5 rounded-xl border p-4 text-sm ${
                  correctAnswer
                    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                    : "border-red-400/30 bg-red-400/10 text-red-200"
                }`}
              >
                {correctAnswer
                  ? "Correct. Sorting tells us which pointer movement will increase or decrease the sum."
                  : "Not quite. Think about how moving left or right changes the selected values."}
              </div>
            )}

            <button
              type="button"
              onClick={checkAnswer}
              disabled={selectedAnswer === null}
              className="mt-5 rounded-xl border border-emerald-400/30 px-6 py-3 font-bold text-emerald-300 transition hover:bg-emerald-400/10 disabled:cursor-not-allowed disabled:border-white/10 disabled:text-gray-700"
            >
              Check answer
            </button>
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-6 lg:h-fit">
          <article className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
              Lesson objective
            </p>

            <ul className="mt-5 space-y-4 text-sm text-gray-400">
              {[
                "Explain how two pointers reduce comparisons",
                "Trace pointer movement through a sorted array",
                "Implement an O(n) pair-search algorithm",
              ].map((objective) => (
                <li key={objective} className="flex gap-3">
                  <span className="mt-0.5 text-emerald-300">◆</span>
                  <span className="leading-6">{objective}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-amber-300/20 bg-amber-300/[0.04] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
              Completion requirements
            </p>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Find the target pair</span>
                <span className={found ? "text-emerald-300" : "text-gray-700"}>
                  {found ? "Complete" : "Pending"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400">Pass knowledge check</span>
                <span
                  className={
                    quizChecked && correctAnswer
                      ? "text-emerald-300"
                      : "text-gray-700"
                  }
                >
                  {quizChecked && correctAnswer ? "Complete" : "Pending"}
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={!canComplete || lessonComplete}
              onClick={() => setLessonComplete(true)}
              className="mt-6 w-full rounded-xl bg-amber-300 py-3.5 font-black text-black transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-gray-600"
            >
              {lessonComplete ? "Lesson completed: +150 XP" : "Complete lesson"}
            </button>
          </article>

          {lessonComplete && (
            <article className="rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-300 text-2xl font-black text-black">
                ✓
              </div>
              <h2 className="mt-4 text-xl font-black">Alchemy complete</h2>
              <p className="mt-2 text-sm leading-6 text-emerald-100/70">
                You earned 150 XP and unlocked the next lesson.
              </p>
            </article>
          )}
        </aside>
      </div>
    </main>
  );
}