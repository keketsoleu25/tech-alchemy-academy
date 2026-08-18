import type { Prisma } from "@/generated/prisma/client";
import { awardXp } from "@/lib/gamification/award-xp";

type AchievementDefinition = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
};

const FIRST_QUIZ: AchievementDefinition = {
  slug: "quiz-initiate",
  name: "Quiz Initiate",
  description: "Pass your first Academy lesson quiz.",
  icon: "brain",
  xpReward: 25,
};

const PERFECT_QUIZ: AchievementDefinition = {
  slug: "perfect-recall",
  name: "Perfect Recall",
  description: "Score 100% on an Academy lesson quiz.",
  icon: "crown",
  xpReward: 50,
};

async function unlockAchievement(
  tx: Prisma.TransactionClient,
  userId: string,
  definition: AchievementDefinition,
) {
  const achievement = await tx.achievement.upsert({
    where: { slug: definition.slug },
    update: {
      name: definition.name,
      description: definition.description,
      icon: definition.icon,
      xpReward: definition.xpReward,
    },
    create: definition,
  });

  const existing = await tx.userAchievement.findUnique({
    where: {
      userId_achievementId: {
        userId,
        achievementId: achievement.id,
      },
    },
  });

  if (existing) return null;

  await tx.userAchievement.create({
    data: {
      userId,
      achievementId: achievement.id,
    },
  });

  const xpResult = await awardXp({
    tx,
    userId,
    amount: achievement.xpReward,
    reason: "ACHIEVEMENT_UNLOCK",
    sourceType: "achievement",
    sourceId: achievement.id,
  });

  return {
    slug: achievement.slug,
    name: achievement.name,
    description: achievement.description,
    xpAwarded: xpResult.awarded ? achievement.xpReward : 0,
  };
}

export async function evaluateQuizAchievements({
  tx,
  userId,
  passed,
  score,
}: {
  tx: Prisma.TransactionClient;
  userId: string;
  passed: boolean;
  score: number;
}) {
  if (!passed) return [];

  const unlocked = [];
  const firstQuiz = await unlockAchievement(tx, userId, FIRST_QUIZ);
  if (firstQuiz) unlocked.push(firstQuiz);

  if (score === 100) {
    const perfectQuiz = await unlockAchievement(tx, userId, PERFECT_QUIZ);
    if (perfectQuiz) unlocked.push(perfectQuiz);
  }

  return unlocked;
}
