import { connection } from "next/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDashboardData } from "@/lib/dashboard-data";

const navigation = [
  {
    label: "Dashboard",
    symbol: "DB",
    href: "/dashboard",
    active: true,
  },
  {
    label: "Learning Path",
    symbol: "LP",
    href: "#learning-path",
  },
  {
    label: "Challenges",
    symbol: "CH",
    href: "#daily-quest",
  },
  {
    label: "Leaderboard",
    symbol: "LB",
    href: "#leaderboard",
  },
];

export default async function DashboardPage() {
  await connection();

  const data = await getDashboardData();

  if (!data) {
    notFound();
  }

  const {
    learner,
    stats,
    modules,
    currentLesson,
    dailyQuest,
    leaderboard,
  } = data;

  const continueHref =
    currentLesson?.href ?? "#learning-path";

  return (
    <main className="min-h-screen bg-[#050806] text-white">
      <div className="lg:grid lg:grid-cols-[250px_1fr]">
        <aside className="sticky top-0 hidden h-screen flex-col border-r border-white/10 bg-[#070b08] px-5 py-6 lg:flex">
          <Link href="/" className="flex items-center gap-3 px-2">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-400/10 font-black text-emerald-300">
              TA
            </span>

            <div>
              <p className="font-bold">Tech Alchemy</p>
              <p className="text-[10px] uppercase tracking-[0.28em] text-gray-500">
                Academy
              </p>
            </div>
          </Link>

          <nav className="mt-12 space-y-2">
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                  item.active
                    ? "bg-emerald-400/10 text-emerald-300"
                    : "text-gray-500 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-black ${
                    item.active
                      ? "bg-emerald-300 text-black"
                      : "border border-white/10 bg-white/5"
                  }`}
                >
                  {item.symbol}
                </span>

                {item.label}
              </a>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-300 to-amber-300 font-black text-black">
                {learner.initials}
              </span>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold">
                  {learner.name}
                </p>
                <p className="text-xs text-emerald-300">
                  {learner.rank.name}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between gap-3 text-[11px] text-gray-500">
                <span>Next rank</span>
                <span>
                  {learner.xp.toLocaleString()} /{" "}
                  {learner.rank.nextRankXp.toLocaleString()} XP
                </span>
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-amber-300"
                  style={{
                    width: `${learner.rank.progress}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="flex items-center justify-between border-b border-white/10 px-5 py-5 lg:hidden">
            <Link
              href="/"
              className="flex items-center gap-3 font-bold"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-300 text-sm font-black text-black">
                TA
              </span>
              Academy
            </Link>

            <span className="rounded-full bg-emerald-400/10 px-3 py-2 text-xs font-bold text-emerald-300">
              {learner.xp.toLocaleString()} XP
            </span>
          </header>

          <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
            <header className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-300">
                  {learner.rank.name} Dashboard
                </p>

                <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                  Welcome back, {learner.name}.
                </h1>

                <p className="mt-2 text-gray-500">
                  Continue your journey from beginner to Grand Master.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-amber-300/20 bg-amber-300/5 px-4 py-3">
                  <p className="text-xs text-gray-500">
                    Current rank
                  </p>
                  <p className="mt-1 font-bold text-amber-300">
                    {learner.rank.name}
                  </p>
                </div>

                <Link
                  href={continueHref}
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-300 px-5 py-4 text-sm font-black text-black transition hover:bg-emerald-200"
                >
                  Continue learning
                </Link>
              </div>
            </header>

            <div className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <article
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"
                >
                  <p className="text-sm text-gray-500">
                    {stat.label}
                  </p>

                  <p className="mt-3 text-3xl font-black">
                    {stat.value}
                  </p>

                  <p
                    className={`mt-3 text-xs ${
                      stat.accent === "green"
                        ? "text-emerald-300"
                        : stat.accent === "amber"
                          ? "text-amber-300"
                          : stat.accent === "purple"
                            ? "text-purple-300"
                            : "text-blue-300"
                    }`}
                  >
                    {stat.detail}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-8 grid gap-8 xl:grid-cols-[1.55fr_0.85fr]">
              <div className="space-y-8">
                {currentLesson ? (
                  <article className="relative overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-400/10 via-[#0a110d] to-[#080a09] p-6 sm:p-8">
                    <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-emerald-300/10 blur-3xl" />

                    <div className="relative">
                      <div className="flex flex-col justify-between gap-5 sm:flex-row">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
                            Continue where you stopped
                          </p>

                          <h2 className="mt-4 text-2xl font-black">
                            {currentLesson.title}
                          </h2>

                          <p className="mt-3 max-w-xl leading-7 text-gray-400">
                            {currentLesson.description}
                          </p>
                        </div>

                        <span className="h-fit rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-gray-300">
                          {currentLesson.position}
                        </span>
                      </div>

                      <div className="mt-7">
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Module progress</span>
                          <span>{currentLesson.progress}%</span>
                        </div>

                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-amber-300"
                            style={{
                              width: `${currentLesson.progress}%`,
                            }}
                          />
                        </div>
                      </div>

                      <Link
                        href={currentLesson.href}
                        className="mt-7 inline-flex items-center justify-center rounded-xl bg-emerald-300 px-6 py-3.5 text-sm font-black text-black transition hover:bg-emerald-200"
                      >
                        Resume lesson
                      </Link>
                    </div>
                  </article>
                ) : (
                  <article className="rounded-3xl border border-white/10 bg-white/[0.025] p-8">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
                      Learning path
                    </p>

                    <h2 className="mt-4 text-2xl font-black">
                      Choose your next lesson
                    </h2>

                    <p className="mt-3 text-gray-500">
                      Select an available module below to continue.
                    </p>
                  </article>
                )}

                <section id="learning-path">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
                        Your curriculum
                      </p>

                      <h2 className="mt-2 text-2xl font-black">
                        Learning path
                      </h2>
                    </div>

                    <span className="text-sm text-gray-500">
                      {modules.length} modules
                    </span>
                  </div>

                  <div className="mt-5 space-y-4">
                    {modules.map((module) => (
                      <article
                        key={module.id}
                        className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-white/20"
                      >
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                          <span
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-bold ${
                              module.status === "Mastered"
                                ? "bg-emerald-300 text-black"
                                : module.status === "Continue"
                                  ? "border border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                                  : "border border-white/10 bg-white/5 text-gray-600"
                            }`}
                          >
                            {module.number}
                          </span>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col justify-between gap-2 sm:flex-row">
                              <div>
                                <h3 className="font-bold">
                                  {module.title}
                                </h3>

                                <p className="mt-1 text-sm text-gray-500">
                                  {module.description}
                                </p>
                              </div>

                              <span className="shrink-0 text-xs text-gray-500">
                                {module.lessons}
                              </span>
                            </div>

                            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                              <div
                                className="h-full rounded-full bg-emerald-300"
                                style={{
                                  width: `${module.progress}%`,
                                }}
                              />
                            </div>
                          </div>

                          {module.status === "Locked" ? (
                            <button
                              type="button"
                              disabled
                              title={`Requires ${module.requiredXp.toLocaleString()} XP`}
                              className="cursor-not-allowed rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-gray-700"
                            >
                              Locked
                            </button>
                          ) : module.status === "Continue" &&
                            currentLesson ? (
                            <Link
                              href={currentLesson.href}
                              className="rounded-lg border border-emerald-400/30 px-4 py-2 text-sm font-bold text-emerald-300 transition hover:bg-emerald-400/10"
                            >
                              Continue
                            </Link>
                          ) : (
                            <span className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-gray-400">
                              {module.status}
                            </span>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </div>

              <div className="space-y-8">
                {dailyQuest && (
                  <article
                    id="daily-quest"
                    className="rounded-3xl border border-amber-300/20 bg-amber-300/[0.04] p-6"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
                        Daily quest
                      </p>

                      <span className="rounded-lg bg-amber-300/10 px-3 py-2 text-xs font-bold text-amber-300">
                        +{dailyQuest.xpReward} XP
                      </span>
                    </div>

                    <h2 className="mt-5 text-xl font-black">
                      {dailyQuest.title}
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-gray-400">
                      {dailyQuest.description}
                    </p>

                    <div className="mt-6 grid grid-cols-2 gap-3 text-center text-xs">
                      <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                        <p className="font-bold">
                          {dailyQuest.difficulty}
                        </p>
                        <p className="mt-1 text-gray-600">
                          Difficulty
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                        <p className="font-bold">
                          {dailyQuest.estimatedMinutes} min
                        </p>
                        <p className="mt-1 text-gray-600">
                          Estimated
                        </p>
                      </div>
                    </div>

                    <Link
                      href={dailyQuest.href}
                      className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-amber-300/30 py-3.5 font-bold text-amber-300 transition hover:bg-amber-300/10"
                    >
                      Start daily quest
                    </Link>
                  </article>
                )}

                <article
                  id="leaderboard"
                  className="rounded-3xl border border-white/10 bg-white/[0.025] p-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black">
                      Leaderboard
                    </h2>

                    <span className="text-xs text-gray-600">
                      Live rankings
                    </span>
                  </div>

                  <div className="mt-5 space-y-3">
                    {leaderboard.map((entry) => (
                      <div
                        key={`${entry.rank}-${entry.name}`}
                        className={`flex items-center gap-3 rounded-xl p-3 ${
                          entry.current
                            ? "border border-emerald-400/20 bg-emerald-400/[0.06]"
                            : "bg-white/[0.025]"
                        }`}
                      >
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black ${
                            entry.rank <= 3
                              ? "bg-amber-300/10 text-amber-300"
                              : "bg-white/5 text-gray-500"
                          }`}
                        >
                          {entry.rank}
                        </span>

                        <p className="min-w-0 flex-1 truncate text-sm font-bold">
                          {entry.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          {entry.xp}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
                    Live database
                  </p>

                  <h2 className="mt-3 text-lg font-black">
                    Progress synced with Neon
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    XP, streaks, modules, lessons and rankings on this
                    dashboard now come directly from PostgreSQL.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}