import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { LessonCompleteButton } from "@/components/lesson-complete-button";
import { LessonQuiz } from "@/components/lesson-quiz";
import { getLessonContent } from "@/lib/lesson-content";
import { getPublicQuiz } from "@/lib/quizzes";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{
    moduleSlug: string;
    lessonSlug: string;
  }>;
};

export default async function LessonPage({ params }: Props) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const { moduleSlug, lessonSlug } = await params;

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
          slug: moduleSlug,
          published: true,
          course: { published: true },
        },
      },
      include: {
        module: {
          include: {
            lessons: {
              where: { published: true },
              orderBy: { order: "asc" },
              select: { id: true, slug: true, title: true, order: true },
            },
          },
        },
      },
    }),
  ]);

  if (!learner || !lesson) {
    notFound();
  }

  if (learner.xp < lesson.module.requiredXp) {
    redirect("/dashboard#learning-path");
  }

  const [progress, quizAttempts] = await Promise.all([
    prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: learner.id,
          lessonId: lesson.id,
        },
      },
    }),
    prisma.quizAttempt.findMany({
      where: {
        userId: learner.id,
        lessonId: lesson.id,
      },
      orderBy: { createdAt: "desc" },
      select: { score: true, passed: true },
      take: 20,
    }),
  ]);

  const lessonIndex = lesson.module.lessons.findIndex((item) => item.id === lesson.id);
  const nextLesson = lesson.module.lessons[lessonIndex + 1] ?? null;
  const previousLesson = lesson.module.lessons[lessonIndex - 1] ?? null;
  const content = getLessonContent(lesson.slug, lesson.title, lesson.summary);
  const quiz = getPublicQuiz(lesson.slug);
  const bestQuizScore =
    quizAttempts.length > 0
      ? Math.max(...quizAttempts.map((attempt) => attempt.score))
      : null;
  const quizPassed = quizAttempts.some((attempt) => attempt.passed);
  const moduleProgress = Math.round(
    ((lessonIndex + (progress?.status === "COMPLETED" ? 1 : 0)) /
      lesson.module.lessons.length) *
      100,
  );

  return (
    <main className="min-h-screen bg-[#050806] text-white">
      <header className="border-b border-white/10 bg-[#070b08]">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-5 px-5 py-5 sm:px-8">
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
              {lesson.module.title}
            </p>
            <p className="mt-1 text-sm text-gray-400">
              Lesson {lessonIndex + 1} of {lesson.module.lessons.length}
            </p>
          </div>

          <div className="min-w-28">
            <div className="flex justify-between text-[11px] text-gray-500">
              <span>Progress</span>
              <span>{moduleProgress}%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-amber-300"
                style={{ width: `${moduleProgress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1400px] gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-12">
        <div className="space-y-8">
          <section>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 text-xs font-bold text-emerald-300">
                {content.eyebrow}
              </span>
              <span className="rounded-full border border-amber-300/20 bg-amber-300/5 px-3 py-1.5 text-xs font-bold text-amber-300">
                +{lesson.xpReward} XP
              </span>
              <span className="text-xs text-gray-600">
                {lesson.estimatedMinutes} minute lesson
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
              {content.headline}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-400">
              {content.intro}
            </p>
          </section>

          <section className="grid gap-4 sm:grid-cols-3">
            {content.steps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"
              >
                <span className="font-mono text-xs font-bold text-emerald-300">
                  STEP {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-4 font-bold">{step.title}</h2>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {step.text}
                </p>
              </article>
            ))}
          </section>

          <section className="rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.04] p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
              Core idea
            </p>
            <p className="mt-4 text-lg leading-8 text-gray-300">
              {content.keyIdea}
            </p>
          </section>

          {content.code && (
            <section>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
                    Implementation
                  </p>
                  <h2 className="mt-2 text-2xl font-black">
                    Read the state changes.
                  </h2>
                </div>
                <span className="text-xs text-gray-600">JavaScript</span>
              </div>

              <pre className="mt-5 overflow-x-auto rounded-2xl border border-white/10 bg-black/40 p-5 text-sm leading-7 text-gray-300">
                <code>{content.code}</code>
              </pre>
            </section>
          )}

          <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
              Checkpoint
            </p>
            <h2 className="mt-3 text-xl font-black">
              Can you explain this without the notes?
            </h2>
            <p className="mt-3 leading-7 text-gray-400">
              {content.checkpoint}
            </p>
          </section>

          {quiz && (
            <LessonQuiz
              quiz={quiz}
              bestScore={bestQuizScore}
              alreadyPassed={quizPassed}
            />
          )}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-8 lg:h-fit">
          <article className="rounded-3xl border border-white/10 bg-[#080c09] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
              Lesson objective
            </p>
            <h2 className="mt-4 text-lg font-black">{lesson.title}</h2>
            <p className="mt-3 text-sm leading-6 text-gray-500">
              {lesson.summary}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 text-center text-xs">
              <div className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
                <p className="font-bold">
                  {lesson.difficulty.charAt(0) +
                    lesson.difficulty.slice(1).toLowerCase()}
                </p>
                <p className="mt-1 text-gray-600">Difficulty</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
                <p className="font-bold">{lesson.estimatedMinutes} min</p>
                <p className="mt-1 text-gray-600">Estimated</p>
              </div>
            </div>

            {quiz && (
              <div className="mt-4 rounded-xl border border-purple-400/15 bg-purple-400/[0.04] p-3 text-xs">
                <div className="flex justify-between gap-3">
                  <span className="text-gray-500">Quiz mastery</span>
                  <span className={quizPassed ? "text-emerald-300" : "text-purple-300"}>
                    {quizPassed
                      ? `Passed · ${bestQuizScore}% best`
                      : bestQuizScore === null
                        ? "Not attempted"
                        : `${bestQuizScore}% best`}
                  </span>
                </div>
              </div>
            )}

            <div className="mt-6">
              <LessonCompleteButton
                lessonSlug={lesson.slug}
                xpReward={lesson.xpReward}
                completed={progress?.status === "COMPLETED"}
              />
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/[0.025] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
              Navigate module
            </p>
            <div className="mt-4 space-y-3">
              {previousLesson ? (
                <Link
                  href={`/learn/${moduleSlug}/${previousLesson.slug}`}
                  className="block rounded-xl border border-white/10 p-4 transition hover:border-white/20"
                >
                  <span className="text-xs text-gray-600">Previous</span>
                  <p className="mt-1 text-sm font-bold">
                    {previousLesson.title}
                  </p>
                </Link>
              ) : (
                <div className="rounded-xl border border-white/5 p-4 text-sm text-gray-700">
                  First lesson in module
                </div>
              )}

              {nextLesson ? (
                <Link
                  href={`/learn/${moduleSlug}/${nextLesson.slug}`}
                  className="block rounded-xl border border-emerald-400/20 bg-emerald-400/[0.04] p-4 transition hover:bg-emerald-400/[0.08]"
                >
                  <span className="text-xs text-emerald-300">Next</span>
                  <p className="mt-1 text-sm font-bold">{nextLesson.title}</p>
                </Link>
              ) : (
                <Link
                  href="/dashboard#learning-path"
                  className="block rounded-xl border border-emerald-400/20 bg-emerald-400/[0.04] p-4 text-sm font-bold text-emerald-300"
                >
                  Return to learning path
                </Link>
              )}
            </div>
          </article>
        </aside>
      </div>
    </main>
  );
}
