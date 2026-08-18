import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { runChallenge } from "@/lib/challenge-runner";
import { awardXp } from "@/lib/gamification/award-xp";

export const runtime = "nodejs";

const submissionSchema = z.object({
  code: z.string().trim().min(1).max(20_000),
  language: z.literal("javascript").default("javascript"),
});

const storedTestCasesSchema = z.array(
  z.object({
    input: z.array(z.unknown()),
    expected: z.unknown(),
  }),
);

function getTodayUtc() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return today;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ challengeSlug: string }> },
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
      { status: "error", message: "Enter a valid JavaScript solution." },
      { status: 400 },
    );
  }

  const { challengeSlug } = await params;
  const [learner, challenge] = await Promise.all([
    prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, xp: true },
    }),
    prisma.challenge.findFirst({
      where: { slug: challengeSlug, published: true },
      include: {
        lesson: {
          include: {
            module: true,
          },
        },
      },
    }),
  ]);

  if (!learner) {
    return NextResponse.json(
      { status: "error", message: "Learner not found." },
      { status: 404 },
    );
  }

  if (!challenge) {
    return NextResponse.json(
      { status: "error", message: "Challenge not found." },
      { status: 404 },
    );
  }

  if (challenge.lesson && learner.xp < challenge.lesson.module.requiredXp) {
    return NextResponse.json(
      { status: "error", message: "Earn more XP to unlock this challenge." },
      { status: 403 },
    );
  }

  const testCases = storedTestCasesSchema.safeParse(challenge.testCases);

  if (!testCases.success || testCases.data.length === 0) {
    console.error("Challenge has invalid stored test cases:", challenge.id);
    return NextResponse.json(
      { status: "error", message: "Challenge tests are not configured correctly." },
      { status: 500 },
    );
  }

  const submission = await prisma.submission.create({
    data: {
      userId: learner.id,
      challengeId: challenge.id,
      code: parsed.data.code,
      language: parsed.data.language,
      status: "PENDING",
    },
  });

  let runResult;

  try {
    runResult = await runChallenge({
      code: parsed.data.code,
      functionName: challenge.functionName,
      testCases: testCases.data,
    });
  } catch (error) {
    console.error("Challenge runner failed:", error);

    const runnerNotConfigured =
      error instanceof Error && error.message === "CHALLENGE_RUNNER_NOT_CONFIGURED";

    await prisma.submission.update({
      where: { id: submission.id },
      data: {
        status: "FAILED",
        result: {
          error: runnerNotConfigured
            ? "Challenge runner is not configured."
            : "Challenge runner is temporarily unavailable.",
        },
      },
    });

    return NextResponse.json(
      {
        status: "error",
        message: runnerNotConfigured
          ? "Challenge execution is not configured yet."
          : "Challenge execution is temporarily unavailable.",
      },
      { status: 503 },
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    const firstPreviousPass = await tx.submission.findFirst({
      where: {
        userId: learner.id,
        challengeId: challenge.id,
        status: "PASSED",
        id: { not: submission.id },
      },
      select: { id: true },
    });

    const passed = runResult.passed;
    let xpAwarded = 0;
    let totalXp: number | null = null;

    if (passed && !firstPreviousPass) {
      const xpResult = await awardXp({
        tx,
        userId: learner.id,
        amount: challenge.xpReward,
        reason: "CHALLENGE_FIRST_PASS",
        sourceType: "challenge",
        sourceId: challenge.id,
      });

      xpAwarded = xpResult.awarded ? challenge.xpReward : 0;
      totalXp = xpResult.totalXp;

      if (xpAwarded > 0) {
        await tx.dailyActivity.upsert({
          where: {
            userId_date: {
              userId: learner.id,
              date: getTodayUtc(),
            },
          },
          update: {
            xpEarned: { increment: xpAwarded },
            challengesCompleted: { increment: 1 },
          },
          create: {
            userId: learner.id,
            date: getTodayUtc(),
            xpEarned: xpAwarded,
            lessonsCompleted: 0,
            challengesCompleted: 1,
          },
        });

        await tx.user.update({
          where: { id: learner.id },
          data: { lastActivityAt: new Date() },
        });
      }
    }

    await tx.submission.update({
      where: { id: submission.id },
      data: {
        status: passed ? "PASSED" : "FAILED",
        passedTests: runResult.passedTests,
        totalTests: runResult.totalTests,
        runtimeMs: runResult.runtimeMs,
        xpAwarded,
        result: {
          error: runResult.error,
        },
      },
    });

    return {
      passed,
      passedTests: runResult.passedTests,
      totalTests: runResult.totalTests,
      runtimeMs: runResult.runtimeMs,
      error: runResult.error,
      xpAwarded,
      totalXp,
    };
  });

  return NextResponse.json({ status: "complete", ...result });
}
