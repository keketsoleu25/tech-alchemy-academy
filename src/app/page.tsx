const learningPath = [
  {
    level: "01",
    rank: "Initiate",
    title: "Programming Foundations",
    topics: "Variables, loops, functions and complexity",
    xp: "0–1,000 XP",
  },
  {
    level: "02",
    rank: "Apprentice",
    title: "Core Data Structures",
    topics: "Arrays, strings, stacks, queues and hash maps",
    xp: "1,000–4,000 XP",
  },
  {
    level: "03",
    rank: "Alchemist",
    title: "Algorithms",
    topics: "Searching, sorting, recursion and backtracking",
    xp: "4,000–8,000 XP",
  },
  {
    level: "04",
    rank: "Grand Master",
    title: "Advanced Problem Solving",
    topics: "Trees, graphs, dynamic programming and mastery trials",
    xp: "8,000+ XP",
  },
];

const stats = [
  { value: "120+", label: "Coding challenges" },
  { value: "10", label: "Mastery ranks" },
  { value: "4", label: "Learning paths" },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050806] text-white">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(rgba(57,255,136,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(57,255,136,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="absolute left-1/2 top-[-250px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-400/10 blur-[120px]" />

      <div className="relative">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
          <a href="#" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-400/10 font-black text-emerald-300">
              TA
            </span>

            <div>
              <p className="font-bold tracking-wide">Tech Alchemy</p>
              <p className="text-xs uppercase tracking-[0.28em] text-gray-500">
                Academy
              </p>
            </div>
          </a>

          <div className="hidden items-center gap-8 text-sm text-gray-400 md:flex">
            <a href="#path" className="transition hover:text-emerald-300">
              Learning Path
            </a>
            <a href="#challenge" className="transition hover:text-emerald-300">
              Challenges
            </a>
            <a href="#ranks" className="transition hover:text-emerald-300">
              Ranks
            </a>
          </div>

          <a
            href="#path"
            className="rounded-lg border border-emerald-400/40 px-4 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/10"
          >
            Enter Academy
          </a>
        </nav>

        <section className="mx-auto grid min-h-[760px] max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
          <div>
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
              DSA Mastery System
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.05em] sm:text-7xl lg:text-[88px]">
              Turn logic
              <span className="block bg-gradient-to-r from-emerald-300 via-green-400 to-amber-300 bg-clip-text text-transparent">
                into power.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-gray-400">
              Master data structures and algorithms through guided lessons,
              coding trials, XP rewards and rank progression—from complete
              beginner to Grand Master.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#path"
                className="rounded-xl bg-emerald-300 px-7 py-4 text-center font-bold text-black transition hover:bg-emerald-200"
              >
                Begin Your Journey
              </a>

              <a
                href="#challenge"
                className="rounded-xl border border-white/15 bg-white/5 px-7 py-4 text-center font-bold transition hover:border-white/30 hover:bg-white/10"
              >
                Explore Challenges
              </a>
            </div>

            <div className="mt-14 grid max-w-2xl grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                  <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div id="challenge" className="relative">
            <div className="absolute -inset-8 rounded-full bg-emerald-400/10 blur-3xl" />

            <div className="relative rounded-3xl border border-white/10 bg-[#0b100d]/90 p-6 shadow-2xl shadow-emerald-950/40 backdrop-blur">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
                    Apprentice Trial
                  </p>
                  <h2 className="mt-2 text-xl font-bold">The Missing Element</h2>
                </div>

                <span className="rounded-lg bg-amber-300/10 px-3 py-2 text-xs font-bold text-amber-300">
                  +250 XP
                </span>
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Rank progress</span>
                  <span>720 / 1,000 XP</span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-emerald-400 to-amber-300" />
                </div>
              </div>

              <div className="mt-7 rounded-2xl border border-white/10 bg-black/50 p-5 font-mono text-sm leading-7">
                <p className="text-gray-500">{"// Find the missing number"}</p>
                <p className="mt-3">
                  <span className="text-purple-300">const</span>{" "}
                  <span className="text-blue-300">numbers</span>{" "}
                  <span className="text-gray-500">=</span>{" "}
                  <span className="text-amber-200">[1, 2, 3, 5, 6]</span>;
                </p>
                <p>
                  <span className="text-purple-300">return</span>{" "}
                  <span className="text-emerald-300">findMissing</span>
                  <span className="text-gray-400">(numbers)</span>;
                </p>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="font-bold text-white">Medium</p>
                  <p className="mt-1 text-gray-500">Difficulty</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="font-bold text-white">68%</p>
                  <p className="mt-1 text-gray-500">Success</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="font-bold text-white">15 min</p>
                  <p className="mt-1 text-gray-500">Average</p>
                </div>
              </div>

              <button className="mt-6 w-full rounded-xl border border-emerald-400/30 bg-emerald-400/10 py-4 font-bold text-emerald-300 transition hover:bg-emerald-400/20">
                Attempt Challenge
              </button>
            </div>
          </div>
        </section>

        <section
          id="path"
          className="border-t border-white/10 bg-black/20 px-6 py-24 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-300">
              The Alchemist Roadmap
            </p>

            <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <h2 className="max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">
                From your first loop to advanced algorithms.
              </h2>

              <p className="max-w-md leading-7 text-gray-400">
                Every lesson unlocks the next challenge. Earn XP, maintain your
                streak and prove your mastery.
              </p>
            </div>

            <div
              id="ranks"
              className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4"
            >
              {learningPath.map((item) => (
                <article
                  key={item.level}
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-emerald-400/[0.04]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-emerald-300">
                      LEVEL {item.level}
                    </span>
                    <span className="text-xs text-gray-600">{item.xp}</span>
                  </div>

                  <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
                    {item.rank}
                  </p>
                  <h3 className="mt-3 text-xl font-bold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    {item.topics}
                  </p>

                  <div className="mt-8 text-sm font-semibold text-gray-400 transition group-hover:text-emerald-300">
                    View curriculum →
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}