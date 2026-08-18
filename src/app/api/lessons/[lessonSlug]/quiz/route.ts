import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getLessonQuiz } from "@/lib/quizzes";
import { awardXp } from "@/lib/gamification/award-xp";
import { evaluateQuizAchievements } from "@/lib/gamification/achievements";

export const runtime = "nodejs";

const submissionSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string().min(1),
        selectedIndex: z.number().int().min(0).max(10),
      }),
    )
    .min(1)
    .max(20),
});

function getTodayUtc() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return today;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ lessonSlug: string }> },
) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json(
      { status: "error", message: "Authentication required." },
      { status: 401 },
    );
  }

  const parsed = submissionSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json(
      { status: "error", message: "Answer every quiz question before submitting." },
      { status: 400 },
    );
  }

  const { lessonSlug } = await params;
  const quiz = getLessonQuiz(lessonSlug);

  if (!quiz) {
    return NextResponse.json(
      { status: "error", message: "Quiz not found." },
      { status: 404 },
    );
  }

  const [learner, lesson] = await Promise.all([
    prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, xp: true },
    }),
    prisma.lesson.findFirst({
      where: {
        slug: lessonSlug,
        published: true,
        module: {
          published: true,
          course: { published: true },
        },
      },
      include: { module: true },
    }),
  ]);

  if (!learner || !lesson) {
    return NextResponse.json(
      { status: "error", message: "Lesson not found." },
      { status: 404 },
    );
  }

  if (learner.xp < lesson.module.requiredXp) {
    return NextResponse.json(
      { status: "error", message: "Earn more XP to unlock this quiz." },
      { status: 403 },
    );
  }

  const answerMap = new Map(
    parsed.data.answers.map((answer) => [answer.questionId, answer.selectedIndex]),
  );

  if (
    answerMap.size !== quiz.questions.length ||
    quiz.questions.some((question) => !answerMap.has(question.id))
  ) {
    return NextResponse.json(
      { status: "error", message: "Answer every quiz question before submitting." },
      { status: 400 },
    );
  }

  const correctAnswers = quiz.questions.filter(
    (question) => answerMap.get(question.id) === question.correctIndex,
  ).length;
  const score = Math.round((correctAnswers / quiz.questions.length) * 100);
  const passed = score >= quiz.passPercent;

  const result = await prisma.$transaction(async (tx) => {
    const previousPass = await tx.quizAttempt.findFirst({
      where: {
        userId: learner.id,
        lessonId: lesson.id,
        passed: true,
      },
      select: { id: true },
    });

    let quizXpAwarded = 0;

    if (passed && !previousPass) {
      const xpResult = await awardXp({
        tx,
        userId: learner.id,
        amount: quiz.xpReward,
        reason: "QUIZ_PASS",
        sourceType: "quiz",
        sourceId: lesson.id,
      });
      quizXpAwarded = xpResult.awarded ? quiz.xpReward : 0;
    }

    await tx.quizAttempt.create({
      data: {
        userId: learner.id,
        lessonId: lesson.id,
        score,
        passed,
        answers: parsed.data.answers,
        xpAwarded: quizXpAwarded,
      },
    });

    const unlockedAchievements = await evaluateQuizAchievements({
      tx,
      userId: learner.id,
      passed,
      score,
    });

    const achievementXp = unlockedAchievements.reduce(
      (total, achievement) => total + achievement.xpAwarded,
      0,
    );
    const earnedToday = quizXpAwarded + achievementXp;

    if (earnedToday > 0) {
      const today = getTodayUtc();
      await tx.dailyActivity.upsert({
        where: {
          userId_date: {
            userId: learner.id,
            date: today,
          },
        },
        update: {
          xpEarned: { increment: earnedToday },
        },
        create: {
          userId: learner.id,
          date: today,
          xpEarned: earnedToday,
          lessonsCompleted: 0,
          challengesCompleted: 0,
        },
      });
    }

    await tx.user.update({
      where: { id: learner.id },
      data: { lastActivityAt: new Date() },
    });

    const updatedLearner = await tx.user.findUniqueOrThrow({
      where: { id: learner.id },
      select: { xp: true },
    });

    return {
      quizXpAwarded,
      totalXp: updatedLearner.xp,
      unlockedAchievements,
    };
  });

  return NextResponse.json({
    status: "complete",
    score,
    passed,
    passPercent: quiz.passPercent,
    quizXpAwarded: result.quizXpAwarded,
    totalXp: result.totalXp,
    unlockedAchievements: result.unlockedAchievements,
    review: quiz.questions.map((question) => ({
      questionId: question.id,
      selectedIndex: answerMap.get(question.id),
      correctIndex: question.correctIndex,
      correct: answerMap.get(question.id) === question.correctIndex,
      explanation: question.explanation,
    })),
  });
}
