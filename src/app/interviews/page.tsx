import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import InterviewPractice from "@/components/interview-practice";

export const metadata: Metadata = {
  title: "Interview Practice",
  description: "Practice realistic junior developer interviews with timed answers and a structured review.",
};

export default async function InterviewsPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  return (
    <main className="min-h-screen bg-[#050806] text-white">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-7">
          <Link href="/dashboard" className="text-sm font-semibold text-emerald-300 hover:text-emerald-200">← Academy dashboard</Link>
          <span className="text-xs font-bold uppercase tracking-[0.24em] text-gray-500">Tech Alchemy Academy · Interview Lab</span>
        </header>
        <InterviewPractice />
      </div>
    </main>
  );
}
