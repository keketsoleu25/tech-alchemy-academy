import Link from "next/link";
import { getAdminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { AdminChallengeForm } from "@/components/admin-challenge-form";

export default async function AdminChallengesPage() {
  await getAdminUser();

  const lessons = await prisma.lesson.findMany({
    orderBy: { order: "asc" },
    select: {
      id: true,
      title: true,
      module: { select: { title: true, course: { select: { title: true } } } },
    },
  });

  return (
    <main className="min-h-screen bg-[#050806] text-white">
      <div className="mx-auto max-w-[1300px] px-5 py-8 sm:px-8 lg:py-10">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Challenge Forge</p>
            <h1 className="mt-2 text-3xl font-black">Author coding challenges</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">Create challenges as drafts, keep hidden tests server-side, then publish them from the control room after review.</p>
          </div>
          <Link href="/admin" className="rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-gray-300">← Control room</Link>
        </div>

        <section className="mt-8 rounded-3xl border border-white/10 bg-[#080c09] p-5 sm:p-7">
          <AdminChallengeForm lessons={lessons.map((lesson) => ({ id: lesson.id, label: `${lesson.module.course.title} · ${lesson.module.title} · ${lesson.title}` }))} />
        </section>
      </div>
    </main>
  );
}
