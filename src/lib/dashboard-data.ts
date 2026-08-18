import { prisma } from "@/lib/prisma";

function getLessonHref(moduleSlug: string, lessonSlug: string) {
  return `/learn/${moduleSlug}/${lessonSlug}`;
}

function getRankDetails(xp: number) {
  if (xp >= 8000) {
    return { name: "Grand Master", nextRankXp: 8000, progress: 100 };
  }

  if (xp >= 4000) {
    return {
      name: "Alchemist",
      nextRankXp: 8000,
      progress: Math.round((xp / 8000) * 100),
    };
  }

  if (xp >= 1000) {
    return {
      name: "Apprentice III",
      nextRankXp: 4000,
      progress: Math.round((xp / 4000) * 100),
    };
  }

  if (xp >= 500) {
    return {
      name: "Apprentice II",
      nextRankXp: 1000,
      progress: Math.round((xp / 1000) * 100),
    };
  }

  if (xp >= 250) {
    return {
      name: "Apprentice I",
      nextRankXp: 500,
      progress: Math.round((xp / 500) * 100),
    };
  }

  return {
    name: "Initiate",
    nextRankXp: 250,
    progress: Math.round((xp / 250) * 100),
  };
}

function getInitials(name: string | null) {
  if (!name) return "TA";

  return name
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export async function getDashboardData(learnerEmail: string) {
  const learner = await prisma.user.findUnique({
    where: { email: learnerEmail },
    include: {
      lessonProgress: {
        include: {
          lesson: {
            include: { module: true },
          },
        },
        orderBy: { updatedAt: "desc" },
      },
      dailyActivity: {
        orderBy: { date: "desc" },
        take: 1,
      },
      achievements: {
        include: { achievement: true },
        orderBy: { unlockedAt: "desc" },
        take: 6,
      },
    },
  });

  if (!learner) return null;

  const [modules, leaderboardUsers, higherRankedLearners, dailyQuest, passedChallenges] =
    await Promise.all([
      prisma.module.findMany({
        where: {
          published: true,
          course: { published: true },
        },
        include: {
          lessons: {
            where: { published: true },
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      }),
      prisma.user.findMany({
        where: { role: "LEARNER" },
        orderBy: [{ xp: "desc" }, { createdAt: "asc" }],
        take: 5,
        select: { id: true, name: true, xp: true },
      }),
      prisma.user.count({
        where: {
          role: "LEARNER",
          xp: { gt: learner.xp },
        },
      }),
      prisma.challenge.findFirst({
        where: { published: true },
        orderBy: { createdAt: "asc" },
        select: {
          slug: true,
          title: true,
          description: true,
          difficulty: true,
          xpReward: true,
          estimatedMinutes: true,
        },
      }),
      prisma.submission.count({
        where: { userId: learner.id, status: "PASSED" },
      }),
    ]);

  const progressByLesson = new Map(
    learner.lessonProgress.map((progress) => [progress.lessonId, progress]),
  );

  const moduleCards = modules.map((module) => {
    const completedLessons = module.lessons.filter(
      (lesson) => progressByLesson.get(lesson.id)?.status === "COMPLETED",
    ).length;
    const totalLessons = module.lessons.length;
    const progress = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);
    const isUnlocked = learner.xp >= module.requiredXp;
    const nextLesson = module.lessons.find(
      (lesson) => progressByLesson.get(lesson.id)?.status !== "COMPLETED",
    );

    const status =
      completedLessons === totalLessons && totalLessons > 0
        ? "Mastered"
        : isUnlocked
          ? "Continue"
          : "Locked";

    return {
      id: module.id,
      slug: module.slug,
      number: String(module.order).padStart(2, "0"),
      title: module.title,
      description: module.description,
      progress,
      lessons: `${completedLessons}/${totalLessons} lessons`,
      status,
      requiredXp: module.requiredXp,
      href:
        isUnlocked && nextLesson
          ? getLessonHref(module.slug, nextLesson.slug)
          : null,
    };
  });

  const activeProgress =
    learner.lessonProgress.find((progress) => progress.status === "IN_PROGRESS") ??
    learner.lessonProgress.find((progress) => progress.status === "AVAILABLE");

  let activeLesson = activeProgress?.lesson ?? null;

  if (!activeLesson) {
    for (const module of modules) {
      if (learner.xp < module.requiredXp) continue;

      const lesson = module.lessons.find(
        (item) => progressByLesson.get(item.id)?.status !== "COMPLETED",
      );

      if (lesson) {
        activeLesson = {
          ...lesson,
          module,
        };
        break;
      }
    }
  }

  let currentLesson = null;

  if (activeLesson) {
    const currentModule = modules.find((module) => module.id === activeLesson.moduleId);
    const currentModuleCard = moduleCards.find((module) => module.id === activeLesson.moduleId);
    const lessonIndex = currentModule?.lessons.findIndex((lesson) => lesson.id === activeLesson?.id) ?? -1;

    currentLesson = {
      title: `${activeLesson.module.title}: ${activeLesson.title}`,
      description: activeLesson.summary,
      href: getLessonHref(activeLesson.module.slug, activeLesson.slug),
      progress: currentModuleCard?.progress ?? 0,
      position:
        currentModule && lessonIndex >= 0
          ? `Lesson ${lessonIndex + 1} of ${currentModule.lessons.length}`
          : "Current lesson",
    };
  }

  const completedLessons = learner.lessonProgress.filter(
    (progress) => progress.status === "COMPLETED",
  ).length;
  const recentXp = learner.dailyActivity[0]?.xpEarned ?? 0;
  const globalRank = higherRankedLearners + 1;
  const rank = getRankDetails(learner.xp);

  return {
    learner: {
      id: learner.id,
      name: learner.name ?? "Academy Learner",
      initials: getInitials(learner.name),
      xp: learner.xp,
      currentStreak: learner.currentStreak,
      longestStreak: learner.longestStreak,
      globalRank,
      rank,
    },
    stats: [
      {
        label: "Total XP",
        value: learner.xp.toLocaleString(),
        detail: `+${recentXp} today`,
        accent: "green",
      },
      {
        label: "Current streak",
        value: `${learner.currentStreak} days`,
        detail: `Best: ${learner.longestStreak} days`,
        accent: "amber",
      },
      {
        label: "Lessons mastered",
        value: completedLessons.toString(),
        detail: `${passedChallenges} challenges passed`,
        accent: "purple",
      },
      {
        label: "Global rank",
        value: `#${globalRank.toLocaleString()}`,
        detail: "Academy leaderboard",
        accent: "blue",
      },
    ],
    modules: moduleCards,
    currentLesson,
    dailyQuest: dailyQuest
      ? {
          title: dailyQuest.title,
          description: dailyQuest.description,
          difficulty:
            dailyQuest.difficulty.charAt(0) + dailyQuest.difficulty.slice(1).toLowerCase(),
          xpReward: dailyQuest.xpReward,
          estimatedMinutes: dailyQuest.estimatedMinutes,
          href: `/challenges/${dailyQuest.slug}`,
        }
      : null,
    achievements: learner.achievements.map((entry) => ({
      slug: entry.achievement.slug,
      name: entry.achievement.name,
      description: entry.achievement.description,
      icon: entry.achievement.icon,
      xpReward: entry.achievement.xpReward,
      unlockedAt: entry.unlockedAt,
    })),
    leaderboard: leaderboardUsers.map((user, index) => ({
      rank: index + 1,
      name: user.name ?? "Anonymous learner",
      xp: `${user.xp.toLocaleString()} XP`,
      current: user.id === learner.id,
    })),
  };
}
