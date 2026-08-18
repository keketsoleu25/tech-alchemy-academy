"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  lessonSlug: string;
  xpReward: number;
  completed: boolean;
};

export function LessonCompleteButton({ lessonSlug, xpReward, completed }: Props) {
  const router = useRouter();
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(completed);
  const [message, setMessage] = useState<string | null>(null);

  async function completeLesson() {
    setIsCompleting(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/lessons/${lessonSlug}/complete`, {
        method: "POST",
      });

      const result = (await response.json()) as {
        alreadyCompleted?: boolean;
        xpAwarded?: number;
        totalXp?: number;
        message?: string;
      };

      if (!response.ok || typeof result.totalXp !== "number") {
        throw new Error(result.message ?? "Unable to save lesson progress.");
      }

      setIsCompleted(true);
      setMessage(
        result.alreadyCompleted
          ? "Lesson already completed. Your XP is safe."
          : `Lesson complete. +${result.xpAwarded ?? xpReward} XP awarded.`,
      );
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to save lesson progress.",
      );
    } finally {
      setIsCompleting(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={completeLesson}
        disabled={isCompleting || isCompleted}
        className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-300 px-5 py-3.5 text-sm font-black text-black transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:bg-emerald-300/40 disabled:text-black/60"
      >
        {isCompleted
          ? "Lesson completed"
          : isCompleting
            ? "Saving progress..."
            : `Complete lesson · +${xpReward} XP`}
      </button>

      {message && (
        <p className="mt-3 text-center text-xs leading-5 text-gray-400" role="status">
          {message}
        </p>
      )}
    </div>
  );
}
