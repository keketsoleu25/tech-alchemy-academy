import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin";
import { writeAuditEvent } from "@/lib/audit";

export const runtime = "nodejs";

const slug = z.string().trim().min(2).max(100).regex(/^[a-z0-9-]+$/);
const difficulty = z.enum(["BEGINNER", "EASY", "MEDIUM", "HARD", "EXPERT"]);

const createSchema = z.discriminatedUnion("entity", [
  z.object({
    entity: z.literal("course"),
    title: z.string().trim().min(2).max(120),
    slug,
    description: z.string().trim().min(2).max(1000),
    order: z.number().int().min(0).max(1000).default(0),
  }),
  z.object({
    entity: z.literal("module"),
    courseId: z.string().min(1),
    title: z.string().trim().min(2).max(120),
    slug,
    description: z.string().trim().min(2).max(1000),
    order: z.number().int().min(0).max(1000),
    requiredXp: z.number().int().min(0).max(100000).default(0),
  }),
  z.object({
    entity: z.literal("lesson"),
    moduleId: z.string().min(1),
    title: z.string().trim().min(2).max(140),
    slug,
    summary: z.string().trim().min(2).max(1000),
    order: z.number().int().min(0).max(1000),
    xpReward: z.number().int().min(0).max(10000).default(100),
    estimatedMinutes: z.number().int().min(1).max(600).default(10),
    difficulty: difficulty.default("BEGINNER"),
  }),
  z.object({
    entity: z.literal("challenge"),
    lessonId: z.string().min(1).nullable().optional(),
    title: z.string().trim().min(2).max(140),
    slug,
    description: z.string().trim().min(2).max(1000),
    instructions: z.string().trim().min(2).max(5000),
    starterCode: z.string().max(20000).default("function solve(input) {\n  // Your code here\n}"),
    solutionCode: z.string().max(20000).default(""),
    functionName: z.string().trim().min(1).max(80),
    testCases: z.array(z.object({ input: z.array(z.unknown()), expected: z.unknown() })).min(1).max(50),
    difficulty: difficulty.default("EASY"),
    xpReward: z.number().int().min(0).max(10000).default(100),
    estimatedMinutes: z.number().int().min(1).max(600).default(15),
  }),
  z.object({
    entity: z.literal("achievement"),
    name: z.string().trim().min(2).max(120),
    slug,
    description: z.string().trim().min(2).max(500),
    icon: z.string().trim().min(1).max(16),
    xpReward: z.number().int().min(0).max(10000).default(0),
  }),
]);

const mutateSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("publish-course"), id: z.string().min(1), published: z.boolean() }),
  z.object({ action: z.literal("publish-module"), id: z.string().min(1), published: z.boolean() }),
  z.object({ action: z.literal("publish-lesson"), id: z.string().min(1), published: z.boolean() }),
  z.object({ action: z.literal("publish-challenge"), id: z.string().min(1), published: z.boolean() }),
  z.object({ action: z.literal("set-user-role"), id: z.string().min(1), role: z.enum(["LEARNER", "ADMIN"]) }),
]);

function prismaErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = (error as { code?: string }).code;
    if (code === "P2002") return "That slug or unique value is already in use.";
    if (code === "P2003") return "The selected parent record no longer exists.";
  }
  return null;
}

export async function GET() {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [courses, challenges, achievements, users, audits] = await Promise.all([
    prisma.course.findMany({
      orderBy: { order: "asc" },
      include: {
        modules: {
          orderBy: { order: "asc" },
          include: {
            lessons: {
              orderBy: { order: "asc" },
              select: {
                id: true,
                title: true,
                slug: true,
                summary: true,
                order: true,
                published: true,
                xpReward: true,
                estimatedMinutes: true,
                difficulty: true,
              },
            },
          },
        },
      },
    }),
    prisma.challenge.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, slug: true, published: true, difficulty: true, xpReward: true },
    }),
    prisma.achievement.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.user.findMany({
      orderBy: [{ role: "desc" }, { createdAt: "desc" }],
      take: 100,
      select: { id: true, name: true, email: true, role: true, xp: true, createdAt: true, lastActivityAt: true },
    }),
    prisma.auditEvent.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
      include: { actor: { select: { name: true, email: true } } },
    }),
  ]);

  return NextResponse.json({ courses, challenges, achievements, users, audits });
}

export async function POST(request: Request) {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json().catch(() => null);
  const create = createSchema.safeParse(body);

  try {
    if (create.success) {
      const result = await prisma.$transaction(async (tx) => {
        if (create.data.entity === "course") {
          const { entity, ...data } = create.data;
          const item = await tx.course.create({ data: { ...data, published: false } });
          await writeAuditEvent({ tx, actorId: admin.id, action: "CREATE", entityType: "course", entityId: item.id, summary: `Created course ${item.title}` });
          return item;
        }

        if (create.data.entity === "module") {
          const { entity, ...data } = create.data;
          const item = await tx.module.create({ data: { ...data, published: false } });
          await writeAuditEvent({ tx, actorId: admin.id, action: "CREATE", entityType: "module", entityId: item.id, summary: `Created module ${item.title}` });
          return item;
        }

        if (create.data.entity === "lesson") {
          const { entity, ...data } = create.data;
          const item = await tx.lesson.create({ data: { ...data, published: false } });
          await writeAuditEvent({ tx, actorId: admin.id, action: "CREATE", entityType: "lesson", entityId: item.id, summary: `Created lesson ${item.title}` });
          return item;
        }

        if (create.data.entity === "challenge") {
          const { entity, ...data } = create.data;
          const item = await tx.challenge.create({
            data: {
              ...data,
              lessonId: data.lessonId || null,
              testCases: data.testCases,
              published: false,
            },
          });
          await writeAuditEvent({ tx, actorId: admin.id, action: "CREATE", entityType: "challenge", entityId: item.id, summary: `Created challenge ${item.title}` });
          return item;
        }

        const { entity, ...data } = create.data;
        const item = await tx.achievement.create({ data });
        await writeAuditEvent({ tx, actorId: admin.id, action: "CREATE", entityType: "achievement", entityId: item.id, summary: `Created achievement ${item.name}` });
        return item;
      });

      return NextResponse.json({ ok: true, result });
    }

    const mutation = mutateSchema.safeParse(body);
    if (!mutation.success) {
      return NextResponse.json({ error: "Invalid admin operation" }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const op = mutation.data;

      if (op.action === "publish-course") {
        const item = await tx.course.update({ where: { id: op.id }, data: { published: op.published } });
        await writeAuditEvent({ tx, actorId: admin.id, action: op.published ? "PUBLISH" : "UNPUBLISH", entityType: "course", entityId: item.id, summary: `${op.published ? "Published" : "Unpublished"} course ${item.title}` });
        return item;
      }

      if (op.action === "publish-module") {
        const item = await tx.module.update({ where: { id: op.id }, data: { published: op.published } });
        await writeAuditEvent({ tx, actorId: admin.id, action: op.published ? "PUBLISH" : "UNPUBLISH", entityType: "module", entityId: item.id, summary: `${op.published ? "Published" : "Unpublished"} module ${item.title}` });
        return item;
      }

      if (op.action === "publish-lesson") {
        const item = await tx.lesson.update({ where: { id: op.id }, data: { published: op.published } });
        await writeAuditEvent({ tx, actorId: admin.id, action: op.published ? "PUBLISH" : "UNPUBLISH", entityType: "lesson", entityId: item.id, summary: `${op.published ? "Published" : "Unpublished"} lesson ${item.title}` });
        return item;
      }

      if (op.action === "publish-challenge") {
        const item = await tx.challenge.update({ where: { id: op.id }, data: { published: op.published } });
        await writeAuditEvent({ tx, actorId: admin.id, action: op.published ? "PUBLISH" : "UNPUBLISH", entityType: "challenge", entityId: item.id, summary: `${op.published ? "Published" : "Unpublished"} challenge ${item.title}` });
        return item;
      }

      if (op.id === admin.id && op.role !== "ADMIN") {
        throw new Error("ADMIN_CANNOT_DEMOTE_SELF");
      }

      const item = await tx.user.update({ where: { id: op.id }, data: { role: op.role } });
      await writeAuditEvent({ tx, actorId: admin.id, action: "SET_ROLE", entityType: "user", entityId: item.id, summary: `Set ${item.email} role to ${op.role}` });
      return { id: item.id, email: item.email, role: item.role };
    });

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    if (error instanceof Error && error.message === "ADMIN_CANNOT_DEMOTE_SELF") {
      return NextResponse.json({ error: "You cannot remove your own admin access." }, { status: 400 });
    }

    const message = prismaErrorMessage(error);
    if (message) return NextResponse.json({ error: message }, { status: 409 });

    console.error("Admin content operation failed:", error);
    return NextResponse.json({ error: "Admin operation failed." }, { status: 500 });
  }
}
