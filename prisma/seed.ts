import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString =
  process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DIRECT_URL or DATABASE_URL must be configured.");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Seeding Tech Alchemy Academy...");

  const course = await prisma.course.upsert({
    where: {
      slug: "dsa-mastery",
    },
    update: {
      title: "Data Structures & Algorithms Mastery",
      description:
        "A guided journey from programming foundations to advanced algorithmic problem-solving.",
      published: true,
      order: 1,
    },
    create: {
      slug: "dsa-mastery",
      title: "Data Structures & Algorithms Mastery",
      description:
        "A guided journey from programming foundations to advanced algorithmic problem-solving.",
      published: true,
      order: 1,
    },
  });

  const foundationsModule = await prisma.module.upsert({
    where: {
      courseId_slug: {
        courseId: course.id,
        slug: "programming-foundations",
      },
    },
    update: {
      title: "Programming Foundations",
      description:
        "Build the reasoning skills required for algorithmic problem-solving.",
      order: 1,
      requiredXp: 0,
      published: true,
    },
    create: {
      courseId: course.id,
      slug: "programming-foundations",
      title: "Programming Foundations",
      description:
        "Build the reasoning skills required for algorithmic problem-solving.",
      order: 1,
      requiredXp: 0,
      published: true,
    },
  });

  const arraysModule = await prisma.module.upsert({
    where: {
      courseId_slug: {
        courseId: course.id,
        slug: "arrays-and-strings",
      },
    },
    update: {
      title: "Arrays & Strings",
      description:
        "Master traversal, two pointers and sliding-window techniques.",
      order: 2,
      requiredXp: 500,
      published: true,
    },
    create: {
      courseId: course.id,
      slug: "arrays-and-strings",
      title: "Arrays & Strings",
      description:
        "Master traversal, two pointers and sliding-window techniques.",
      order: 2,
      requiredXp: 500,
      published: true,
    },
  });

  const stacksModule = await prisma.module.upsert({
    where: {
      courseId_slug: {
        courseId: course.id,
        slug: "stacks-and-queues",
      },
    },
    update: {
      title: "Stacks & Queues",
      description:
        "Learn LIFO, FIFO and the structures behind many real systems.",
      order: 3,
      requiredXp: 1000,
      published: true,
    },
    create: {
      courseId: course.id,
      slug: "stacks-and-queues",
      title: "Stacks & Queues",
      description:
        "Learn LIFO, FIFO and the structures behind many real systems.",
      order: 3,
      requiredXp: 1000,
      published: true,
    },
  });

  const bigOLesson = await prisma.lesson.upsert({
    where: {
      moduleId_slug: {
        moduleId: foundationsModule.id,
        slug: "big-o-basics",
      },
    },
    update: {
      title: "Big O Basics",
      summary:
        "Understand how execution time and memory usage grow as input increases.",
      content: {
        objectives: [
          "Describe constant and linear time",
          "Compare common complexity classes",
          "Identify inefficient nested loops",
        ],
      },
      type: "THEORY",
      difficulty: "BEGINNER",
      order: 1,
      xpReward: 100,
      estimatedMinutes: 12,
      published: true,
    },
    create: {
      moduleId: foundationsModule.id,
      slug: "big-o-basics",
      title: "Big O Basics",
      summary:
        "Understand how execution time and memory usage grow as input increases.",
      content: {
        objectives: [
          "Describe constant and linear time",
          "Compare common complexity classes",
          "Identify inefficient nested loops",
        ],
      },
      type: "THEORY",
      difficulty: "BEGINNER",
      order: 1,
      xpReward: 100,
      estimatedMinutes: 12,
      published: true,
    },
  });

  const controlFlowLesson = await prisma.lesson.upsert({
    where: {
      moduleId_slug: {
        moduleId: foundationsModule.id,
        slug: "control-flow",
      },
    },
    update: {
      title: "Control Flow",
      summary:
        "Use conditions and loops to control how an algorithm executes.",
      content: {
        objectives: [
          "Use conditional statements",
          "Choose an appropriate loop",
          "Trace program execution",
        ],
      },
      type: "THEORY",
      difficulty: "BEGINNER",
      order: 2,
      xpReward: 100,
      estimatedMinutes: 10,
      published: true,
    },
    create: {
      moduleId: foundationsModule.id,
      slug: "control-flow",
      title: "Control Flow",
      summary:
        "Use conditions and loops to control how an algorithm executes.",
      content: {
        objectives: [
          "Use conditional statements",
          "Choose an appropriate loop",
          "Trace program execution",
        ],
      },
      type: "THEORY",
      difficulty: "BEGINNER",
      order: 2,
      xpReward: 100,
      estimatedMinutes: 10,
      published: true,
    },
  });

  const arrayFoundationsLesson = await prisma.lesson.upsert({
    where: {
      moduleId_slug: {
        moduleId: arraysModule.id,
        slug: "array-foundations",
      },
    },
    update: {
      title: "Array Foundations",
      summary:
        "Learn indexing, traversal and the cost of common array operations.",
      content: {
        objectives: [
          "Access values using indexes",
          "Traverse an array",
          "Explain common array-operation complexity",
        ],
      },
      type: "THEORY",
      difficulty: "EASY",
      order: 1,
      xpReward: 120,
      estimatedMinutes: 14,
      published: true,
    },
    create: {
      moduleId: arraysModule.id,
      slug: "array-foundations",
      title: "Array Foundations",
      summary:
        "Learn indexing, traversal and the cost of common array operations.",
      content: {
        objectives: [
          "Access values using indexes",
          "Traverse an array",
          "Explain common array-operation complexity",
        ],
      },
      type: "THEORY",
      difficulty: "EASY",
      order: 1,
      xpReward: 120,
      estimatedMinutes: 14,
      published: true,
    },
  });

  const twoPointersLesson = await prisma.lesson.upsert({
    where: {
      moduleId_slug: {
        moduleId: arraysModule.id,
        slug: "two-pointer-technique",
      },
    },
    update: {
      title: "The Two-Pointer Technique",
      summary:
        "Search sorted arrays efficiently by moving pointers from both ends.",
      content: {
        objectives: [
          "Explain why sorting enables pointer movement",
          "Trace pointer positions",
          "Implement an O(n) pair search",
        ],
      },
      type: "INTERACTIVE",
      difficulty: "MEDIUM",
      order: 2,
      xpReward: 150,
      estimatedMinutes: 12,
      published: true,
    },
    create: {
      moduleId: arraysModule.id,
      slug: "two-pointer-technique",
      title: "The Two-Pointer Technique",
      summary:
        "Search sorted arrays efficiently by moving pointers from both ends.",
      content: {
        objectives: [
          "Explain why sorting enables pointer movement",
          "Trace pointer positions",
          "Implement an O(n) pair search",
        ],
      },
      type: "INTERACTIVE",
      difficulty: "MEDIUM",
      order: 2,
      xpReward: 150,
      estimatedMinutes: 12,
      published: true,
    },
  });

  await prisma.lesson.upsert({
    where: {
      moduleId_slug: {
        moduleId: arraysModule.id,
        slug: "sliding-window",
      },
    },
    update: {
      title: "Sliding Window",
      summary:
        "Process continuous sections of an array without repeated work.",
      type: "INTERACTIVE",
      difficulty: "MEDIUM",
      order: 3,
      xpReward: 180,
      estimatedMinutes: 16,
      published: true,
    },
    create: {
      moduleId: arraysModule.id,
      slug: "sliding-window",
      title: "Sliding Window",
      summary:
        "Process continuous sections of an array without repeated work.",
      type: "INTERACTIVE",
      difficulty: "MEDIUM",
      order: 3,
      xpReward: 180,
      estimatedMinutes: 16,
      published: true,
    },
  });

  await prisma.lesson.upsert({
    where: {
      moduleId_slug: {
        moduleId: stacksModule.id,
        slug: "stack-foundations",
      },
    },
    update: {
      title: "Stack Foundations",
      summary:
        "Understand last-in-first-out behaviour and common stack operations.",
      type: "THEORY",
      difficulty: "EASY",
      order: 1,
      xpReward: 150,
      estimatedMinutes: 14,
      published: true,
    },
    create: {
      moduleId: stacksModule.id,
      slug: "stack-foundations",
      title: "Stack Foundations",
      summary:
        "Understand last-in-first-out behaviour and common stack operations.",
      type: "THEORY",
      difficulty: "EASY",
      order: 1,
      xpReward: 150,
      estimatedMinutes: 14,
      published: true,
    },
  });

  await prisma.challenge.upsert({
    where: {
      slug: "reverse-an-array",
    },
    update: {
      lessonId: arrayFoundationsLesson.id,
      title: "Reverse an Array",
      description:
        "Reverse the supplied array without using the built-in reverse method.",
      instructions:
        "Return a new array containing the values in reverse order.",
      starterCode: `function reverseArray(numbers) {
  // Write your solution here
}`,
      solutionCode: `function reverseArray(numbers) {
  const result = [];

  for (let index = numbers.length - 1; index >= 0; index--) {
    result.push(numbers[index]);
  }

  return result;
}`,
      functionName: "reverseArray",
      testCases: [
        {
          input: [[1, 2, 3]],
          expected: [3, 2, 1],
        },
        {
          input: [["a", "b", "c"]],
          expected: ["c", "b", "a"],
        },
        {
          input: [[]],
          expected: [],
        },
      ],
      difficulty: "EASY",
      xpReward: 100,
      estimatedMinutes: 10,
      published: true,
    },
    create: {
      lessonId: arrayFoundationsLesson.id,
      slug: "reverse-an-array",
      title: "Reverse an Array",
      description:
        "Reverse the supplied array without using the built-in reverse method.",
      instructions:
        "Return a new array containing the values in reverse order.",
      starterCode: `function reverseArray(numbers) {
  // Write your solution here
}`,
      solutionCode: `function reverseArray(numbers) {
  const result = [];

  for (let index = numbers.length - 1; index >= 0; index--) {
    result.push(numbers[index]);
  }

  return result;
}`,
      functionName: "reverseArray",
      testCases: [
        {
          input: [[1, 2, 3]],
          expected: [3, 2, 1],
        },
        {
          input: [["a", "b", "c"]],
          expected: ["c", "b", "a"],
        },
        {
          input: [[]],
          expected: [],
        },
      ],
      difficulty: "EASY",
      xpReward: 100,
      estimatedMinutes: 10,
      published: true,
    },
  });

  const learner = await prisma.user.upsert({
    where: {
      email: "learner@techalchemy.academy",
    },
    update: {
      name: "Keketso Leu",
      role: "LEARNER",
      xp: 720,
      currentStreak: 4,
      longestStreak: 7,
      lastActivityAt: new Date(),
    },
    create: {
      name: "Keketso Leu",
      email: "learner@techalchemy.academy",
      role: "LEARNER",
      xp: 720,
      currentStreak: 4,
      longestStreak: 7,
      lastActivityAt: new Date(),
    },
  });

  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: learner.id,
        lessonId: bigOLesson.id,
      },
    },
    update: {
      status: "COMPLETED",
      score: 90,
      attempts: 1,
      earnedXp: 100,
      startedAt: new Date(),
      completedAt: new Date(),
    },
    create: {
      userId: learner.id,
      lessonId: bigOLesson.id,
      status: "COMPLETED",
      score: 90,
      attempts: 1,
      earnedXp: 100,
      startedAt: new Date(),
      completedAt: new Date(),
    },
  });

  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: learner.id,
        lessonId: controlFlowLesson.id,
      },
    },
    update: {
      status: "COMPLETED",
      score: 85,
      attempts: 1,
      earnedXp: 100,
      startedAt: new Date(),
      completedAt: new Date(),
    },
    create: {
      userId: learner.id,
      lessonId: controlFlowLesson.id,
      status: "COMPLETED",
      score: 85,
      attempts: 1,
      earnedXp: 100,
      startedAt: new Date(),
      completedAt: new Date(),
    },
  });

  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: learner.id,
        lessonId: arrayFoundationsLesson.id,
      },
    },
    update: {
      status: "COMPLETED",
      score: 88,
      attempts: 1,
      earnedXp: 120,
      startedAt: new Date(),
      completedAt: new Date(),
    },
    create: {
      userId: learner.id,
      lessonId: arrayFoundationsLesson.id,
      status: "COMPLETED",
      score: 88,
      attempts: 1,
      earnedXp: 120,
      startedAt: new Date(),
      completedAt: new Date(),
    },
  });

  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: learner.id,
        lessonId: twoPointersLesson.id,
      },
    },
    update: {
      status: "IN_PROGRESS",
      attempts: 1,
      earnedXp: 0,
      startedAt: new Date(),
      completedAt: null,
    },
    create: {
      userId: learner.id,
      lessonId: twoPointersLesson.id,
      status: "IN_PROGRESS",
      attempts: 1,
      earnedXp: 0,
      startedAt: new Date(),
    },
  });

  const firstStepsAchievement = await prisma.achievement.upsert({
    where: {
      slug: "first-steps",
    },
    update: {
      name: "First Steps",
      description: "Complete your first Academy lesson.",
      icon: "spark",
      xpReward: 50,
    },
    create: {
      slug: "first-steps",
      name: "First Steps",
      description: "Complete your first Academy lesson.",
      icon: "spark",
      xpReward: 50,
    },
  });

  await prisma.achievement.upsert({
    where: {
      slug: "four-day-streak",
    },
    update: {
      name: "Momentum",
      description: "Maintain a four-day learning streak.",
      icon: "flame",
      xpReward: 100,
    },
    create: {
      slug: "four-day-streak",
      name: "Momentum",
      description: "Maintain a four-day learning streak.",
      icon: "flame",
      xpReward: 100,
    },
  });

  await prisma.achievement.upsert({
    where: {
      slug: "array-apprentice",
    },
    update: {
      name: "Array Apprentice",
      description: "Complete the Array Foundations lesson.",
      icon: "array",
      xpReward: 75,
    },
    create: {
      slug: "array-apprentice",
      name: "Array Apprentice",
      description: "Complete the Array Foundations lesson.",
      icon: "array",
      xpReward: 75,
    },
  });

  await prisma.userAchievement.upsert({
    where: {
      userId_achievementId: {
        userId: learner.id,
        achievementId: firstStepsAchievement.id,
      },
    },
    update: {},
    create: {
      userId: learner.id,
      achievementId: firstStepsAchievement.id,
    },
  });

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  await prisma.dailyActivity.upsert({
    where: {
      userId_date: {
        userId: learner.id,
        date: today,
      },
    },
    update: {
      xpEarned: 250,
      lessonsCompleted: 1,
      challengesCompleted: 1,
    },
    create: {
      userId: learner.id,
      date: today,
      xpEarned: 250,
      lessonsCompleted: 1,
      challengesCompleted: 1,
    },
  });

  const counts = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.module.count(),
    prisma.lesson.count(),
    prisma.challenge.count(),
    prisma.achievement.count(),
  ]);

  console.log("Seed completed successfully.");
  console.log({
    users: counts[0],
    courses: counts[1],
    modules: counts[2],
    lessons: counts[3],
    challenges: counts[4],
    achievements: counts[5],
  });
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });