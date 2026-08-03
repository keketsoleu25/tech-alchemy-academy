import Link from "next/link";
import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { SubmitButton } from "@/components/submit-button";

const registrationSchema = z
  .object({
    name: z.string().trim().min(2).max(80),
    email: z.string().trim().email(),
    password: z.string().min(8).max(72),
    confirmPassword: z.string().min(8).max(72),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

type RegisterPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

async function registerLearner(formData: FormData) {
  "use server";

  const parsed = registrationSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    redirect("/register?error=invalid");
  }

  const email = parsed.data.email.toLowerCase();
  const existingLearner = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  if (existingLearner) {
    redirect("/register?error=exists");
  }

  const passwordHash = await hash(parsed.data.password, 12);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email,
      passwordHash,
    },
  });

  redirect("/login?registered=1");
}

const errorMessages: Record<string, string> = {
  invalid:
    "Use a valid name and email, matching passwords, and at least 8 password characters.",
  exists: "An account with that email already exists.",
};

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const params = await searchParams;
  const errorMessage = params.error
    ? errorMessages[params.error] ?? errorMessages.invalid
    : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050806] px-5 py-12 text-white">
      <section className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#090d0a] p-7 shadow-2xl shadow-emerald-950/20 sm:p-9">
        <Link href="/" className="inline-flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-400/10 font-black text-emerald-300">
            TA
          </span>
          <span>
            <span className="block font-black">Tech Alchemy</span>
            <span className="block text-[10px] uppercase tracking-[0.28em] text-gray-500">
              Academy
            </span>
          </span>
        </Link>

        <p className="mt-9 text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">
          Begin your training
        </p>
        <h1 className="mt-3 text-3xl font-black">Create your learner profile.</h1>
        <p className="mt-3 text-sm leading-6 text-gray-500">
          Your account keeps XP, lesson progress, streaks, and achievements tied to you.
        </p>

        {errorMessage && (
          <p className="mt-6 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm leading-6 text-red-200">
            {errorMessage}
          </p>
        )}

        <form action={registerLearner} className="mt-7 grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-bold text-gray-300 sm:col-span-2">
            Display name
            <input
              required
              minLength={2}
              maxLength={80}
              type="text"
              name="name"
              autoComplete="name"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 font-normal text-white outline-none transition placeholder:text-gray-700 focus:border-emerald-400/60"
              placeholder="Keketso Leu"
            />
          </label>

          <label className="block text-sm font-bold text-gray-300 sm:col-span-2">
            Email
            <input
              required
              type="email"
              name="email"
              autoComplete="email"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 font-normal text-white outline-none transition placeholder:text-gray-700 focus:border-emerald-400/60"
              placeholder="learner@example.com"
            />
          </label>

          <label className="block text-sm font-bold text-gray-300">
            Password
            <input
              required
              minLength={8}
              maxLength={72}
              type="password"
              name="password"
              autoComplete="new-password"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 font-normal text-white outline-none transition placeholder:text-gray-700 focus:border-emerald-400/60"
              placeholder="8+ characters"
            />
          </label>

          <label className="block text-sm font-bold text-gray-300">
            Confirm password
            <input
              required
              minLength={8}
              maxLength={72}
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 font-normal text-white outline-none transition placeholder:text-gray-700 focus:border-emerald-400/60"
              placeholder="Repeat password"
            />
          </label>

          <SubmitButton
            idleText="Create Learner Account"
            pendingText="Creating account..."
            className="rounded-xl bg-emerald-300 py-3.5 font-black text-black transition hover:bg-emerald-200 sm:col-span-2"
          />
        </form>

        <p className="mt-7 text-center text-sm text-gray-500">
          Already registered?{" "}
          <Link href="/login" className="font-bold text-emerald-300 hover:text-emerald-200">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
