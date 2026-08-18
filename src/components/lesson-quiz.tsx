"use client";

import { useMemo, useState } from "react";

type PublicQuiz = {
  lessonSlug: string;
  title: string;
  passPercent: number;
  xpReward: number;
  questions: {
    id: string;
    prompt: string;
    options: string[];
  }[];
};

type QuizResult = {
  score: number;
  passed: boolean;
  passPercent: number;
  quizXpAwarded: number;
  totalXp: number;
  unlockedAchievements: {
    slug: string;
    name: string;
    description: string;
    xpAwarded: number;
  }[];
  review: {
    questionId: string;
    selectedIndex: number;
    correctIndex: number;
    correct: boolean;
    explanation: string;
  }[];
};

export function LessonQuiz({
  quiz,
  bestScore,
  alreadyPassed,
}: {
  quiz: PublicQuiz;
  bestScore: number | null;
  alreadyPassed: boolean;
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const answeredCount = Object.keys(answers).length;
  const canSubmit = answeredCount === quiz.questions.length && !isSubmitting;

  const reviewByQuestion = useMemo(
    () => new Map(result?.review.map((item) => [item.questionId, item]) ?? []),
    [result],
  );

  async function submitQuiz() {
    if (!canSubmit) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/lessons/${quiz.lessonSlug}/quiz`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          answers: quiz.questions.map((question) => ({
            questionId: question.id,
            selectedIndex: answers[question.id],
          })),
        }),
      });

      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.message ?? "Unable to submit quiz.");
      }

      setResult(body as QuizResult);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to submit quiz.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function retryQuiz() {
    setAnswers({});
    setResult(null);
    setError(null);
  }

  return (
    <section className="rounded-3xl border border-purple-400/20 bg-purple-400/[0.04] p-6 sm:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-300">
            Knowledge check
          </p>
          <h2 className="mt-3 text-2xl font-black">{quiz.title}</h2>
          <p className="mt-2 text-sm text-gray-500">
            Pass at {quiz.passPercent}% or higher. First pass earns +{quiz.xpReward} XP.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-right text-xs">
          <p className="text-gray-600">Best score</p>
          <p className="mt-1 font-bold text-white">
            {bestScore === null ? "Not attempted" : `${bestScore}%`}
          </p>
        </div>
      </div>

      {alreadyPassed && !result && (
        <div className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.05] px-4 py-3 text-sm text-emerald-300">
          Quiz already passed. You can retake it to improve your score, but quiz XP is awarded only once.
        </div>
      )}

      <div className="mt-7 space-y-6">
        {quiz.questions.map((question, questionIndex) => {
          const review = reviewByQuestion.get(question.id);

          return (
            <article
              key={question.id}
              className="rounded-2xl border border-white/10 bg-black/20 p-5"
            >
              <p className="text-xs font-bold text-purple-300">
                QUESTION {questionIndex + 1}
              </p>
              <h3 className="mt-3 font-bold leading-7">{question.prompt}</h3>

              <div className="mt-4 space-y-2">
                {question.options.map((option, optionIndex) => {
                  const selected = answers[question.id] === optionIndex;
                  const isCorrectAnswer = review?.correctIndex === optionIndex;
                  const isIncorrectSelection =
                    Boolean(review) && selected && !review?.correct;

                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={Boolean(result)}
                      onClick={() =>
                        setAnswers((current) => ({
                          ...current,
                          [question.id]: optionIndex,
                        }))
                      }
                      className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left text-sm transition ${
                        isCorrectAnswer
                          ? "border-emerald-400/40 bg-emerald-400/[0.08] text-emerald-200"
                          : isIncorrectSelection
                            ? "border-red-400/40 bg-red-400/[0.06] text-red-200"
                            : selected
                              ? "border-purple-400/50 bg-purple-400/[0.08] text-white"
                              : "border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current/30 text-[11px] font-black">
                        {String.fromCharCode(65 + optionIndex)}
                      </span>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>

              {review && (
                <p
                  className={`mt-4 text-sm leading-6 ${
                    review.correct ? "text-emerald-300" : "text-amber-300"
                  }`}
                >
                  {review.correct ? "Correct. " : "Review: "}
                  {review.explanation}
                </p>
              )}
            </article>
          );
        })}
      </div>

      {error && (
        <p className="mt-5 rounded-xl border border-red-400/20 bg-red-400/[0.05] p-4 text-sm text-red-300">
          {error}
        </p>
      )}

      {result ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-gray-500">Quiz result</p>
              <p
                className={`mt-1 text-3xl font-black ${
                  result.passed ? "text-emerald-300" : "text-amber-300"
                }`}
              >
                {result.score}% · {result.passed ? "Passed" : "Try again"}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                {result.quizXpAwarded > 0
                  ? `+${result.quizXpAwarded} quiz XP · ${result.totalXp.toLocaleString()} total XP`
                  : `${result.totalXp.toLocaleString()} total XP`}
              </p>
            </div>

            <button
              type="button"
              onClick={retryQuiz}
              className="rounded-xl border border-white/15 px-5 py-3 text-sm font-bold transition hover:bg-white/5"
            >
              Retake quiz
            </button>
          </div>

          {result.unlockedAchievements.length > 0 && (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {result.unlockedAchievements.map((achievement) => (
                <div
                  key={achievement.slug}
                  className="rounded-xl border border-amber-300/20 bg-amber-300/[0.05] p-4"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-300">
                    Achievement unlocked
                  </p>
                  <p className="mt-2 font-black">{achievement.name}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {achievement.description}
                  </p>
                  {achievement.xpAwarded > 0 && (
                    <p className="mt-2 text-xs font-bold text-amber-300">
                      +{achievement.xpAwarded} XP
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          disabled={!canSubmit}
          onClick={submitQuiz}
          className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-purple-300 px-5 py-3.5 text-sm font-black text-black transition hover:bg-purple-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSubmitting
            ? "Checking answers..."
            : `Submit quiz · ${answeredCount}/${quiz.questions.length} answered`}
        </button>
      )}
    </section>
  );
}
