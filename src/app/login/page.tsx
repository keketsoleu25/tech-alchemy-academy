import Link from "next/link";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    registered?: string;
  }>;
};

async function authenticate(formData: FormData) {
  "use server";

  try {
    await signIn("credentials", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?error=credentials");
    }

    throw error;
  }
}

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050806] px-5 py-12 text-white">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-[#090d0a] p-7 shadow-2xl shadow-emerald-950/20 sm:p-9">
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
          Learner access
        </p>
        <h1 className="mt-3 text-3xl font-black">Continue your journey.</h1>
        <p className="mt-3 text-sm leading-6 text-gray-500">
          Sign in to restore your XP, streak, lessons, and achievements.
        </p>

        {params.registered === "1" && (
          <p className="mt-6 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-200">
            Account created successfully. You can now sign in.
          </p>
        )}

        {params.error && (
          <p className="mt-6 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
            The email or password is incorrect.
          </p>
        )}

        <form action={authenticate} className="mt-7 space-y-5">
          <label className="block text-sm font-bold text-gray-300">
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
              autoComplete="current-password"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 font-normal text-white outline-none transition placeholder:text-gray-700 focus:border-emerald-400/60"
              placeholder="At least 8 characters"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-300 py-3.5 font-black text-black transition hover:bg-emerald-200"
          >
            Enter Academy
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-gray-500">
          New learner?{" "}
          <Link href="/register" className="font-bold text-emerald-300 hover:text-emerald-200">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}
