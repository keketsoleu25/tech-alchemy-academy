"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type Course = {
  id: string;
  title: string;
  slug: string;
  description: string;
  order: number;
  published: boolean;
  modules: Array<{
    id: string;
    title: string;
    slug: string;
    description: string;
    order: number;
    requiredXp: number;
    published: boolean;
    lessons: Array<{
      id: string;
      title: string;
      slug: string;
      summary: string;
      order: number;
      published: boolean;
      xpReward: number;
      estimatedMinutes: number;
      difficulty: string;
    }>;
  }>;
};

type AdminData = {
  courses: Course[];
  challenges: Array<{ id: string; title: string; slug: string; published: boolean; difficulty: string; xpReward: number }>;
  achievements: Array<{ id: string; name: string; slug: string; description: string; icon: string; xpReward: number }>;
  users: Array<{ id: string; name: string | null; email: string; role: "LEARNER" | "ADMIN"; xp: number; createdAt: string; lastActivityAt: string | null }>;
  audits: Array<{ id: string; action: string; entityType: string; summary: string; createdAt: string; actor: { name: string | null; email: string } }>;
};

const tabs = ["Curriculum", "Publishing", "Achievements", "People", "Audit"] as const;
type Tab = (typeof tabs)[number];

function Field({ label, name, type = "text", required = true, defaultValue }: { label: string; name: string; type?: string; required?: boolean; defaultValue?: string | number }) {
  return (
    <label className="block text-xs font-bold text-gray-400">
      {label}
      <input name={name} type={type} required={required} defaultValue={defaultValue} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none transition focus:border-emerald-400/50" />
    </label>
  );
}

export function AdminAcademyStudio({ currentAdminId }: { currentAdminId: string }) {
  const [data, setData] = useState<AdminData | null>(null);
  const [tab, setTab] = useState<Tab>("Curriculum");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    const response = await fetch("/api/admin/content", { cache: "no-store" });
    if (!response.ok) throw new Error("Could not load admin data.");
    setData(await response.json());
  }, []);

  useEffect(() => {
    load().catch((error) => setMessage(error instanceof Error ? error.message : "Could not load admin data."));
  }, [load]);

  async function mutate(payload: Record<string, unknown>) {
    setBusy(true);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Operation failed.");
      await load();
      setMessage("Saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Operation failed.");
    } finally {
      setBusy(false);
    }
  }

  function values(form: HTMLFormElement) {
    return Object.fromEntries(new FormData(form).entries());
  }

  async function createCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const v = values(form);
    await mutate({ entity: "course", title: v.title, slug: v.slug, description: v.description, order: Number(v.order) });
    form.reset();
  }

  async function createModule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const v = values(form);
    await mutate({ entity: "module", courseId: v.courseId, title: v.title, slug: v.slug, description: v.description, order: Number(v.order), requiredXp: Number(v.requiredXp) });
    form.reset();
  }

  async function createLesson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const v = values(form);
    await mutate({ entity: "lesson", moduleId: v.moduleId, title: v.title, slug: v.slug, summary: v.summary, order: Number(v.order), xpReward: Number(v.xpReward), estimatedMinutes: Number(v.estimatedMinutes), difficulty: v.difficulty });
    form.reset();
  }

  async function createAchievement(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const v = values(form);
    await mutate({ entity: "achievement", name: v.name, slug: v.slug, description: v.description, icon: v.icon, xpReward: Number(v.xpReward) });
    form.reset();
  }

  const allModules = useMemo(() => data?.courses.flatMap((course) => course.modules.map((module) => ({ ...module, courseTitle: course.title }))) ?? [], [data]);

  if (!data) {
    return <div className="rounded-2xl border border-white/10 p-8 text-sm text-gray-500">Loading control room…</div>;
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-5">
        {tabs.map((item) => (
          <button key={item} type="button" onClick={() => setTab(item)} className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${tab === item ? "bg-emerald-300 text-black" : "border border-white/10 text-gray-400 hover:text-white"}`}>
            {item}
          </button>
        ))}
      </div>

      {message && <p className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-gray-300">{message}</p>}

      {tab === "Curriculum" && (
        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          <form onSubmit={createCourse} className="space-y-4 rounded-2xl border border-white/10 bg-black/20 p-5">
            <h3 className="font-black">Create course</h3>
            <Field label="Title" name="title" /><Field label="Slug" name="slug" /><Field label="Description" name="description" /><Field label="Order" name="order" type="number" defaultValue={data.courses.length + 1} />
            <button disabled={busy} className="w-full rounded-xl bg-emerald-300 py-3 text-sm font-black text-black disabled:opacity-50">Create course</button>
          </form>

          <form onSubmit={createModule} className="space-y-4 rounded-2xl border border-white/10 bg-black/20 p-5">
            <h3 className="font-black">Create module</h3>
            <label className="block text-xs font-bold text-gray-400">Course<select name="courseId" required className="mt-2 w-full rounded-xl border border-white/10 bg-[#070b08] px-3 py-3 text-sm"><option value="">Select course</option>{data.courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}</select></label>
            <Field label="Title" name="title" /><Field label="Slug" name="slug" /><Field label="Description" name="description" /><div className="grid grid-cols-2 gap-3"><Field label="Order" name="order" type="number" defaultValue={1} /><Field label="Required XP" name="requiredXp" type="number" defaultValue={0} /></div>
            <button disabled={busy} className="w-full rounded-xl bg-emerald-300 py-3 text-sm font-black text-black disabled:opacity-50">Create module</button>
          </form>

          <form onSubmit={createLesson} className="space-y-4 rounded-2xl border border-white/10 bg-black/20 p-5">
            <h3 className="font-black">Create lesson</h3>
            <label className="block text-xs font-bold text-gray-400">Module<select name="moduleId" required className="mt-2 w-full rounded-xl border border-white/10 bg-[#070b08] px-3 py-3 text-sm"><option value="">Select module</option>{allModules.map((module) => <option key={module.id} value={module.id}>{module.courseTitle} · {module.title}</option>)}</select></label>
            <Field label="Title" name="title" /><Field label="Slug" name="slug" /><Field label="Summary" name="summary" /><div className="grid grid-cols-3 gap-3"><Field label="Order" name="order" type="number" defaultValue={1} /><Field label="XP" name="xpReward" type="number" defaultValue={100} /><Field label="Minutes" name="estimatedMinutes" type="number" defaultValue={10} /></div>
            <label className="block text-xs font-bold text-gray-400">Difficulty<select name="difficulty" className="mt-2 w-full rounded-xl border border-white/10 bg-[#070b08] px-3 py-3 text-sm">{["BEGINNER","EASY","MEDIUM","HARD","EXPERT"].map((value) => <option key={value}>{value}</option>)}</select></label>
            <button disabled={busy} className="w-full rounded-xl bg-emerald-300 py-3 text-sm font-black text-black disabled:opacity-50">Create lesson</button>
          </form>
        </div>
      )}

      {tab === "Publishing" && (
        <div className="mt-6 space-y-5">
          {data.courses.map((course) => (
            <article key={course.id} className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs text-gray-600">Course</p><h3 className="font-black">{course.title}</h3></div><button disabled={busy} onClick={() => mutate({ action: "publish-course", id: course.id, published: !course.published })} className={`rounded-xl px-4 py-2 text-sm font-bold ${course.published ? "border border-amber-300/30 text-amber-300" : "bg-emerald-300 text-black"}`}>{course.published ? "Unpublish" : "Publish"}</button></div>
              <div className="mt-4 space-y-3">{course.modules.map((module) => <div key={module.id} className="rounded-xl border border-white/10 p-4"><div className="flex items-center justify-between gap-3"><div><p className="font-bold">{module.title}</p><p className="text-xs text-gray-600">{module.requiredXp} XP gate · {module.lessons.length} lessons</p></div><button disabled={busy} onClick={() => mutate({ action: "publish-module", id: module.id, published: !module.published })} className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold">{module.published ? "Unpublish" : "Publish"}</button></div><div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">{module.lessons.map((lesson) => <div key={lesson.id} className="flex items-center justify-between gap-2 rounded-lg bg-white/[0.03] p-3"><span className="truncate text-xs">{lesson.title}</span><button disabled={busy} onClick={() => mutate({ action: "publish-lesson", id: lesson.id, published: !lesson.published })} className={`text-[11px] font-black ${lesson.published ? "text-amber-300" : "text-emerald-300"}`}>{lesson.published ? "LIVE" : "DRAFT"}</button></div>)}</div></div>)}</div>
            </article>
          ))}
          <article className="rounded-2xl border border-white/10 bg-black/20 p-5"><h3 className="font-black">Challenges</h3><div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{data.challenges.map((challenge) => <div key={challenge.id} className="rounded-xl border border-white/10 p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-bold">{challenge.title}</p><p className="mt-1 text-xs text-gray-600">{challenge.difficulty} · +{challenge.xpReward} XP</p></div><button disabled={busy} onClick={() => mutate({ action: "publish-challenge", id: challenge.id, published: !challenge.published })} className={`text-xs font-black ${challenge.published ? "text-amber-300" : "text-emerald-300"}`}>{challenge.published ? "LIVE" : "DRAFT"}</button></div></div>)}</div></article>
        </div>
      )}

      {tab === "Achievements" && (
        <div className="mt-6 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <form onSubmit={createAchievement} className="space-y-4 rounded-2xl border border-white/10 bg-black/20 p-5"><h3 className="font-black">Create achievement</h3><Field label="Name" name="name" /><Field label="Slug" name="slug" /><Field label="Description" name="description" /><div className="grid grid-cols-2 gap-3"><Field label="Icon" name="icon" defaultValue="★" /><Field label="XP reward" name="xpReward" type="number" defaultValue={50} /></div><button disabled={busy} className="w-full rounded-xl bg-emerald-300 py-3 text-sm font-black text-black">Create achievement</button></form>
          <div className="grid gap-3 sm:grid-cols-2">{data.achievements.map((achievement) => <article key={achievement.id} className="rounded-2xl border border-white/10 bg-black/20 p-5"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-300/10 text-amber-300">{achievement.icon}</span><div><h3 className="font-black">{achievement.name}</h3><p className="text-xs text-amber-300">+{achievement.xpReward} XP</p></div></div><p className="mt-3 text-sm leading-6 text-gray-500">{achievement.description}</p></article>)}</div>
        </div>
      )}

      {tab === "People" && (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10"><table className="min-w-full text-left text-sm"><thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-gray-500"><tr><th className="p-4">Learner</th><th className="p-4">XP</th><th className="p-4">Role</th><th className="p-4">Last activity</th></tr></thead><tbody>{data.users.map((user) => <tr key={user.id} className="border-t border-white/10"><td className="p-4"><p className="font-bold">{user.name ?? "Unnamed learner"}</p><p className="text-xs text-gray-600">{user.email}</p></td><td className="p-4 font-mono text-emerald-300">{user.xp.toLocaleString()}</td><td className="p-4"><select value={user.role} disabled={busy || user.id === currentAdminId} onChange={(event) => mutate({ action: "set-user-role", id: user.id, role: event.target.value })} className="rounded-lg border border-white/10 bg-[#070b08] px-3 py-2 text-xs"><option value="LEARNER">LEARNER</option><option value="ADMIN">ADMIN</option></select></td><td className="p-4 text-xs text-gray-500">{user.lastActivityAt ? new Date(user.lastActivityAt).toLocaleDateString() : "Never"}</td></tr>)}</tbody></table></div>
      )}

      {tab === "Audit" && (
        <div className="mt-6 space-y-3">{data.audits.map((audit) => <article key={audit.id} className="flex flex-col justify-between gap-3 rounded-xl border border-white/10 bg-black/20 p-4 md:flex-row md:items-center"><div><p className="font-bold">{audit.summary}</p><p className="mt-1 text-xs text-gray-600">{audit.actor.name ?? audit.actor.email} · {audit.entityType} · {audit.action}</p></div><time className="text-xs text-gray-600">{new Date(audit.createdAt).toLocaleString()}</time></article>)}</div>
      )}
    </div>
  );
}
