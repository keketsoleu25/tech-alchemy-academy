import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { ChallengeEditor } from "@/components/challenge-editor";
import { prisma } from "@/lib/prisma";

export default async function ChallengePage({
  params,
}: {
  params: Promise<{ challengeSlug: string }>;
}) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const { challengeSlug } = await params;
  const challenge = await prisma.challenge.findFirst({
    where: {
      slug: challengeSlug,
      published: true,
    },
    select: {
      slug: true,
      title: true,
      description: true,
      instructions: true,
      starterCode: true,
      functionName: true,
      difficulty: true,
      xpReward: true,
      estimatedMinutes: true,
      lesson: {
        select: {
          title: true,
          module: {
            select: {
              slug: true,
              title: true,
              requiredXp: true,
            },
          },
        },
      },
    },
  });

  if (!challenge) {
    notFound();
  }

  if (challenge.lesson?.module.requiredXp) {
    const learner = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { xp: true },
    });

    if (!learner || learner.xp < challenge.lesson.module.requiredXp) {
      redirect("/dashboard#learning-path");
    }
  }

  const difficulty =
    challenge.difficulty.charAt(0) + challenge.difficulty.slice(1).toLowerCase();

  return (
    <main className="min-h-screen bg-[#050806] text-white">
      <header className="border-b border-white/10 bg-[#070b08]">
        <div className="mx-auto flex max-w-[1450px] items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 text-sm font-bold text-gray-400 transition hover:text-white"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5">←</span>
            Dashboard
          </Link>

          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
              Challenge Arena
            </p>
            <p className="mt-1 text-xs text-gray-600">Server-authoritative XP</p>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1450px] gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:py-12">
        <section>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-amber-300/20 bg-amber-300/[0.06] px-3 py-1.5 text-xs font-bold text-amber-300">
              {difficulty}
            </span>
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.05] px-3 py-1.5 text-xs font-bold text-emerald-300">
              +{challenge.xpReward} XP
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-gray-500">
              ~{challenge.estimatedMinutes} min
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
            {challenge.title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-gray-400">{challenge.description}</p>

          <article className="mt-8 rounded-3xl border border-white/10 bg-white/[0.025] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
              Your task
            </p>
            <p className="mt-4 leading-7 text-gray-300">{challenge.instructions}</p>
          </article>

          <article className="mt-5 rounded-3xl border border-white/10 bg-white/[0.025] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
              Contract
            </p>
            <p className="mt-4 text-sm leading-7 text-gray-400">
              Define a JavaScript function named <code className="rounded bg-white/5 px-2 py-1 font-mono text-emerald-300">{challenge.functionName}</code>.
              Your solution is tested against hidden cases in an isolated runner. Test data and the reference solution never reach the browser.
            </p>
          </article>

          {challenge.lesson && (
            <p className="mt-6 text-sm text-gray-600">
              Related lesson: {challenge.lesson.module.title} · {challenge.lesson.title}
            </p>
          )}
        </section>

        <section>
          <ChallengeEditor
            challengeSlug={challenge.slug}
            starterCode={challenge.starterCode}
          />
        </section>
      </div>
    </main>
  );
}
