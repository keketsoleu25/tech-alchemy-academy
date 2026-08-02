import Link from "next/link";

const navigation = [
  { label: "Dashboard", symbol: "DB", href: "/dashboard", active: true },
  { label: "Learning Path", symbol: "LP", href: "#learning-path" },
  { label: "Challenges", symbol: "CH", href: "#daily-quest" },
  { label: "Leaderboard", symbol: "LB", href: "#leaderboard" },
];

const stats = [
  {
    label: "Total XP",
    value: "720",
    detail: "+250 this week",
    accent: "green",
  },
  {
    label: "Current streak",
    value: "4 days",
    detail: "Best: 7 days",
    accent: "amber",
  },
  {
    label: "Trials completed",
    value: "18",
    detail: "68% success rate",
    accent: "purple",
  },
  {
    label: "Global rank",
    value: "#1,248",
    detail: "Top 18% of learners",
    accent: "blue",
  },
];

const modules = [
  {
    number: "01",
    title: "Programming Foundations",
    description: "Variables, loops, functions and Big O notation",
    progress: 100,
    lessons: "8/8 lessons",
    status: "Mastered",
  },
  {
    number: "02",
    title: "Arrays & Strings",
    description: "Traversal, two pointers and sliding window techniques",
    progress: 62,
    lessons: "5/8 lessons",
    status: "Continue",
  },
  {
    number: "03",
    title: "Stacks & Queues",
    description: "LIFO, FIFO, monotonic stacks and practical applications",
    progress: 0,
    lessons: "0/7 lessons",
    status: "Locked",
  },
];

const leaderboard = [
  { rank: 1, name: "Naledi M.", xp: "12,480 XP" },
  { rank: 2, name: "Thabo K.", xp: "11,920 XP" },
  { rank: 3, name: "Amina J.", xp: "10,875 XP" },
  { rank: 1248, name: "Keketso L.", xp: "720 XP", current: true },
];

export default function DashboardPage() {
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
                KL
              </span>

              <div>
                <p className="text-sm font-bold">Keketso Leu</p>
                <p className="text-xs text-emerald-300">Apprentice</p>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-[11px] text-gray-500">
                <span>Next rank</span>
                <span>720 / 1,000 XP</span>
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-emerald-400 to-amber-300" />
              </div>
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="flex items-center justify-between border-b border-white/10 px-5 py-5 lg:hidden">
            <Link href="/" className="flex items-center gap-3 font-bold">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-300 text-sm font-black text-black">
                TA
              </span>
              Academy
            </Link>

            <span className="rounded-full bg-emerald-400/10 px-3 py-2 text-xs font-bold text-emerald-300">
              720 XP
            </span>
          </header>

          <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
            <header className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-300">
                  Apprentice Dashboard
                </p>

                <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                  Welcome back, Keketso.
                </h1>

                <p className="mt-2 text-gray-500">
                  Continue your journey from beginner to Grand Master.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-amber-300/20 bg-amber-300/5 px-4 py-3">
                  <p className="text-xs text-gray-500">Current rank</p>
                  <p className="mt-1 font-bold text-amber-300">
                    Apprentice II
                  </p>
                </div>

                <Link
                  href="/learn/arrays/two-pointers"
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
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="mt-3 text-3xl font-black">{stat.value}</p>

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
                <article className="relative overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-400/10 via-[#0a110d] to-[#080a09] p-6 sm:p-8">
                  <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-emerald-300/10 blur-3xl" />

                  <div className="relative">
                    <div className="flex flex-col justify-between gap-5 sm:flex-row">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
                          Continue where you stopped
                        </p>

                        <h2 className="mt-4 text-2xl font-black">
                          Arrays: The Two-Pointer Technique
                        </h2>

                        <p className="mt-3 max-w-xl leading-7 text-gray-400">
                          Learn how two pointers reduce nested loops and solve
                          array problems with better time complexity.
                        </p>
                      </div>

                      <span className="h-fit rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-gray-300">
                        Lesson 6 of 8
                      </span>
                    </div>

                    <div className="mt-7">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Module progress</span>
                        <span>62%</span>
                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-emerald-400 to-amber-300" />
                      </div>
                    </div>

                    <Link
                      href="/learn/arrays/two-pointers"
                      className="mt-7 inline-flex items-center justify-center rounded-xl bg-emerald-300 px-6 py-3.5 text-sm font-black text-black transition hover:bg-emerald-200"
                    >
                      Resume lesson
                    </Link>
                  </div>
                </article>

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
                      4 of 23 lessons
                    </span>
                  </div>

                  <div className="mt-5 space-y-4">
                    {modules.map((module) => (
                      <article
                        key={module.number}
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
                                <h3 className="font-bold">{module.title}</h3>

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
                                style={{ width: `${module.progress}%` }}
                              />
                            </div>
                          </div>

                          <button
                            type="button"
                            disabled={module.status === "Locked"}
                            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-gray-300 transition hover:border-emerald-400/30 hover:text-emerald-300 disabled:cursor-not-allowed disabled:text-gray-700"
                          >
                            {module.status}
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </div>

              <div className="space-y-8">
                <article
                  id="daily-quest"
                  className="rounded-3xl border border-amber-300/20 bg-amber-300/[0.04] p-6"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
                      Daily quest
                    </p>

                    <span className="rounded-lg bg-amber-300/10 px-3 py-2 text-xs font-bold text-amber-300">
                      +100 XP
                    </span>
                  </div>

                  <h2 className="mt-5 text-xl font-black">Reverse an array</h2>

                  <p className="mt-3 text-sm leading-6 text-gray-400">
                    Solve today&apos;s challenge without using the built-in
                    reverse method.
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-3 text-center text-xs">
                    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                      <p className="font-bold">Easy</p>
                      <p className="mt-1 text-gray-600">Difficulty</p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                      <p className="font-bold">10 min</p>
                      <p className="mt-1 text-gray-600">Estimated</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="mt-5 w-full rounded-xl border border-amber-300/30 py-3.5 font-bold text-amber-300 transition hover:bg-amber-300/10"
                  >
                    Start daily quest
                  </button>
                </article>

                <article
                  id="leaderboard"
                  className="rounded-3xl border border-white/10 bg-white/[0.025] p-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black">Leaderboard</h2>
                    <span className="text-xs text-gray-600">This week</span>
                  </div>

                  <div className="mt-5 space-y-3">
                    {leaderboard.map((learner) => (
                      <div
                        key={`${learner.rank}-${learner.name}`}
                        className={`flex items-center gap-3 rounded-xl p-3 ${
                          learner.current
                            ? "border border-emerald-400/20 bg-emerald-400/[0.06]"
                            : "bg-white/[0.025]"
                        }`}
                      >
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black ${
                            learner.rank <= 3
                              ? "bg-amber-300/10 text-amber-300"
                              : "bg-white/5 text-gray-500"
                          }`}
                        >
                          {learner.rank}
                        </span>

                        <p className="min-w-0 flex-1 truncate text-sm font-bold">
                          {learner.name}
                        </p>

                        <p className="text-xs text-gray-500">{learner.xp}</p>
                      </div>
                    ))}
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}