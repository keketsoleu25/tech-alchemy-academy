import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { awardXp } from "@/lib/gamification/award-xp";

export const runtime = "nodejs";

const MAX_TRANSACTION_ATTEMPTS = 3;

function getTodayUtc() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return today;
}

function isTransactionConflict(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2034"
  );
}

async function completeLessonTransaction(learnerEmail: string, lessonSlug: string) {
  return prisma.$transaction(
    async (transaction) => {
      const learner = await transaction.user.findUnique({
        where: { email: learnerEmail },
      });

      if (!learner) throw new Error("LEARNER_NOT_FOUND");

      const lesson = await transaction.lesson.findFirst({
        where: {
          slug: lessonSlug,
          published: true,
          module: {
            published: true,
            course: { published: true },
          },
        },
        include: { module: true },
      });

      if (!lesson) throw new Error("LESSON_NOT_FOUND");
      if (learner.xp < lesson.module.requiredXp) throw new Error("LESSON_LOCKED");

      const existingProgress = await transaction.lessonProgress.findUnique({
        where: {
          userId_lessonId: {
            userId: learner.id,
            lessonId: lesson.id,
          },
        },
      });

      if (existingProgress?.status === "COMPLETED") {
        return {
          status: "already-completed",
          alreadyCompleted: true,
          xpAwarded: 0,
          totalXp: learner.xp,
        };
      }

      const completedAt = new Date();

      await transaction.lessonProgress.upsert({
        where: {
          userId_lessonId: {
            userId: learner.id,
            lessonId: lesson.id,
          },
        },
        update: {
          status: "COMPLETED",
          score: 100,
          attempts: { increment: 1 },
          earnedXp: lesson.xpReward,
          startedAt: existingProgress?.startedAt ?? completedAt,
          completedAt,
        },
        create: {
          userId: learner.id,
          lessonId: lesson.id,
          status: "COMPLETED",
          score: 100,
          attempts: 1,
          earnedXp: lesson.xpReward,
          startedAt: completedAt,
          completedAt,
        },
      });

      const xpResult = await awardXp({
        tx: transaction,
        userId: learner.id,
        amount: lesson.xpReward,
        reason: "LESSON_COMPLETE",
        sourceType: "lesson",
        sourceId: lesson.id,
      });

      await transaction.user.update({
        where: { id: learner.id },
        data: { lastActivityAt: completedAt },
      });

      await transaction.dailyActivity.upsert({
        where: {
          userId_date: {
            userId: learner.id,
            date: getTodayUtc(),
          },
        },
        update: {
          xpEarned: { increment: xpResult.awarded ? lesson.xpReward : 0 },
          lessonsCompleted: { increment: 1 },
        },
        create: {
          userId: learner.id,
          date: getTodayUtc(),
          xpEarned: xpResult.awarded ? lesson.xpReward : 0,
          lessonsCompleted: 1,
          challengesCompleted: 0,
        },
      });

      return {
        status: "completed",
        alreadyCompleted: false,
        xpAwarded: xpResult.awarded ? lesson.xpReward : 0,
        totalXp: xpResult.totalXp,
      };
    },
    {
      isolationLevel: "Serializable",
      maxWait: 5000,
      timeout: 10000,
    },
  );
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ lessonSlug: string }> },
) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json(
      { status: "error", message: "Authentication required." },
      { status: 401 },
    );
  }

  const { lessonSlug } = await params;

  for (let attempt = 1; attempt <= MAX_TRANSACTION_ATTEMPTS; attempt++) {
    try {
      return NextResponse.json(
        await completeLessonTransaction(session.user.email, lessonSlug),
      );
    } catch (error) {
      if (isTransactionConflict(error) && attempt < MAX_TRANSACTION_ATTEMPTS) {
        continue;
      }

      const message = error instanceof Error ? error.message : "";

      if (message === "LEARNER_NOT_FOUND") {
        return NextResponse.json(
          { status: "error", message: "Learner not found." },
          { status: 404 },
        );
      }

      if (message === "LESSON_NOT_FOUND") {
        return NextResponse.json(
          { status: "error", message: "Lesson not found." },
          { status: 404 },
        );
      }

      if (message === "LESSON_LOCKED") {
        return NextResponse.json(
          { status: "error", message: "Earn more XP to unlock this lesson." },
          { status: 403 },
        );
      }

      console.error("Lesson completion failed:", error);
      return NextResponse.json(
        { status: "error", message: "Unable to complete the lesson." },
        { status: 500 },
      );
    }
  }

  return NextResponse.json(
    { status: "error", message: "Unable to complete the lesson after several attempts." },
    { status: 409 },
  );
}
