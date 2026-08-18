import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function isBootstrapAdmin(email: string) {
  const configured = process.env.ACADEMY_ADMIN_EMAIL?.trim().toLowerCase();
  return Boolean(configured && configured === email.trim().toLowerCase());
}

async function resolveAdminUser(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user) return null;
  return user.role === "ADMIN" || isBootstrapAdmin(user.email) ? user : null;
}

export async function getAdminUser() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await resolveAdminUser(session.user.email);

  if (!user) {
    redirect("/dashboard");
  }

  return user;
}

export async function requireAdminApi() {
  const session = await auth();
  if (!session?.user?.email) return null;
  return resolveAdminUser(session.user.email);
}
