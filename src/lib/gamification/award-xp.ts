import type { Prisma } from "@/generated/prisma/client";

type XpReason =
  | "LESSON_COMPLETE"
  | "CHALLENGE_FIRST_PASS"
  | "CHALLENGE_RETRY"
  | "QUIZ_PASS"
  | "ACHIEVEMENT_UNLOCK"
  | "STREAK_BONUS";

interface AwardXpParams {
  tx: Prisma.TransactionClient;
  userId: string;
  amount: number;
  reason: XpReason;
  sourceType: string;
  sourceId: string;
}

function isUniqueConstraintViolation(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}

export async function awardXp({
  tx,
  userId,
  amount,
  reason,
  sourceType,
  sourceId,
}: AwardXpParams) {
  const idempotencyKey = sourceType + ":" + sourceId + ":" + reason + ":" + userId;

  try {
    await tx.xpTransaction.create({
      data: {
        userId,
        amount,
        reason,
        sourceType,
        sourceId,
        idempotencyKey,
      },
    });
  } catch (error) {
    if (isUniqueConstraintViolation(error)) {
      const existing = await tx.user.findUniqueOrThrow({
        where: { id: userId },
      });

      return { awarded: false, totalXp: existing.xp };
    }

    throw error;
  }

  const updated = await tx.user.update({
    where: { id: userId },
    data: {
      xp: {
        increment: amount,
      },
    },
  });

  return { awarded: true, totalXp: updated.xp };
}


