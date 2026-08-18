import Link from "next/link";
import { getAdminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { AdminAcademyStudio } from "@/components/admin-academy-studio";

export default async function AdminPage() {
  const admin = await getAdminUser();

  const [learners, courses, lessons, challenges, quizAttempts, submissions, totalXp, recentActivity] =
    await Promise.all([
      prisma.user.count({ where: { role: "LEARNER" } }),
      prisma.course.count(),
      prisma.lesson.count(),
      prisma.challenge.count(),
      prisma.quizAttempt.count(),
      prisma.submission.count(),
      prisma.user.aggregate({ where: { role: "LEARNER" }, _sum: { xp: true } }),
      prisma.dailyActivity.aggregate({
        where: { date: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
        _sum: { xpEarned: true, lessonsCompleted: true, challengesCompleted: true },
      }),
    ]);

  const stats = [
    { label: "Learners", value: learners.toLocaleString(), detail: "registered learner accounts" },
    { label: "Curriculum", value: `${courses} / ${lessons}`, detail: "courses / lessons" },
    { label: "Challenges", value: challenges.toLocaleString(), detail: `${submissions.toLocaleString()} submissions` },
    { label: "Quiz attempts", value: quizAttempts.toLocaleString(), detail: "mastery checks submitted" },
    { label: "Learner XP", value: (totalXp._sum.xp ?? 0).toLocaleString(), detail: "XP in circulation" },
    { label: "7-day XP", value: (recentActivity._sum.xpEarned ?? 0).toLocaleString(), detail: `${recentActivity._sum.lessonsCompleted ?? 0} lessons · ${recentActivity._sum.challengesCompleted ?? 0} challenges` },
  ];

  return (
    <main className="min-h-screen bg-[#050806] text-white">
      <header className="border-b border-white/10 bg-[#070b08]">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-5 px-5 py-6 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-300">Academy Control Room</p>
            <h1 className="mt-2 text-3xl font-black">Admin & curriculum operations</h1>
            <p className="mt-2 text-sm text-gray-500">Signed in as {admin.name ?? admin.email}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard" className="rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-gray-300 transition hover:border-white/20 hover:text-white">Learner view</Link>
            <Link href="/" className="rounded-xl bg-emerald-300 px-4 py-3 text-sm font-black text-black transition hover:bg-emerald-200">Academy home</Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8 lg:py-10">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          {stats.map((stat) => (
            <article key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-500">{stat.label}</p>
              <p className="mt-3 text-3xl font-black">{stat.value}</p>
              <p className="mt-2 text-xs leading-5 text-gray-600">{stat.detail}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-[#080c09] p-5 sm:p-7">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Operations</p>
              <h2 className="mt-2 text-2xl font-black">Run the Academy without touching Prisma Studio.</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-gray-500">Create curriculum, publish content, manage achievements, control roles, and inspect the audit trail from one place. Every mutation is server-authorized and logged.</p>
          </div>
          <AdminAcademyStudio currentAdminId={admin.id} />
        </section>
      </div>
    </main>
  );
}
