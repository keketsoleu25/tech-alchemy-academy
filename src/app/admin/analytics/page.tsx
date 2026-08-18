import Link from "next/link";
import { getAdminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export default async function AdminAnalyticsPage() {
  await getAdminUser();

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [activeLearners, topLearners, quizAggregate, passedQuizzes, challengeAggregate, lessonCompletions, daily] = await Promise.all([
    prisma.user.count({ where: { role: "LEARNER", lastActivityAt: { gte: since } } }),
    prisma.user.findMany({ where: { role: "LEARNER" }, orderBy: { xp: "desc" }, take: 10, select: { id: true, name: true, email: true, xp: true, currentStreak: true } }),
    prisma.quizAttempt.aggregate({ _avg: { score: true }, _count: { id: true } }),
    prisma.quizAttempt.count({ where: { passed: true } }),
    prisma.submission.aggregate({ _count: { id: true }, _avg: { runtimeMs: true } }),
    prisma.lessonProgress.count({ where: { status: "COMPLETED" } }),
    prisma.dailyActivity.findMany({
      where: { date: { gte: since } },
      orderBy: { date: "asc" },
      select: { date: true, xpEarned: true, lessonsCompleted: true, challengesCompleted: true },
    }),
  ]);

  const quizAttempts = quizAggregate._count.id;
  const passRate = quizAttempts === 0 ? 0 : Math.round((passedQuizzes / quizAttempts) * 100);
  const byDate = new Map<string, { xp: number; lessons: number; challenges: number }>();
  for (const row of daily) {
    const key = row.date.toISOString().slice(0, 10);
    const current = byDate.get(key) ?? { xp: 0, lessons: 0, challenges: 0 };
    current.xp += row.xpEarned;
    current.lessons += row.lessonsCompleted;
    current.challenges += row.challengesCompleted;
    byDate.set(key, current);
  }
  const activity = [...byDate.entries()].slice(-14);
  const maxXp = Math.max(1, ...activity.map(([, value]) => value.xp));

  return (
    <main className="min-h-screen bg-[#050806] text-white">
      <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:py-10">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Academy intelligence</p>
            <h1 className="mt-2 text-3xl font-black">Learner analytics</h1>
            <p className="mt-2 text-sm text-gray-500">Use behaviour, mastery and activity signals to improve the curriculum.</p>
          </div>
          <Link href="/admin" className="rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-gray-300">← Control room</Link>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[
            ["30-day active", activeLearners.toLocaleString(), "learners with recent activity"],
            ["Lessons mastered", lessonCompletions.toLocaleString(), "all learner completions"],
            ["Quiz average", `${Math.round(quizAggregate._avg.score ?? 0)}%`, `${quizAttempts} attempts`],
            ["Quiz pass rate", `${passRate}%`, `${passedQuizzes} passed attempts`],
            ["Challenge runs", challengeAggregate._count.id.toLocaleString(), `${Math.round(challengeAggregate._avg.runtimeMs ?? 0)} ms avg runtime`],
          ].map(([label, value, detail]) => (
            <article key={label} className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"><p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-500">{label}</p><p className="mt-3 text-3xl font-black">{value}</p><p className="mt-2 text-xs text-gray-600">{detail}</p></article>
          ))}
        </section>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
          <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
            <div className="flex items-end justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Last 14 active days</p><h2 className="mt-2 text-xl font-black">XP momentum</h2></div><span className="text-xs text-gray-600">Academy-wide</span></div>
            <div className="mt-8 flex h-64 items-end gap-2">
              {activity.length === 0 ? <p className="text-sm text-gray-600">No activity recorded yet.</p> : activity.map(([date, value]) => (
                <div key={date} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2">
                  <span className="text-[10px] text-gray-600">{value.xp}</span>
                  <div className="w-full rounded-t-lg bg-gradient-to-t from-emerald-500/30 to-emerald-300" style={{ height: `${Math.max(6, Math.round((value.xp / maxXp) * 190))}px` }} />
                  <span className="max-w-full truncate text-[9px] text-gray-700">{date.slice(5)}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">Leaderboard</p>
            <h2 className="mt-2 text-xl font-black">Top learners</h2>
            <div className="mt-5 space-y-3">{topLearners.map((learner, index) => <article key={learner.id} className="flex items-center gap-3 rounded-xl border border-white/10 p-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-300/10 text-xs font-black text-amber-300">{index + 1}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{learner.name ?? learner.email}</p><p className="text-xs text-gray-600">{learner.currentStreak} day streak</p></div><span className="text-xs font-black text-emerald-300">{learner.xp.toLocaleString()} XP</span></article>)}</div>
          </section>
        </div>
      </div>
    </main>
  );
}
