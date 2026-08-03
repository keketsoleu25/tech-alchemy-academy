export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050806] px-5 text-white">
      <div role="status" aria-live="polite" className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-300 border-r-transparent" />
        </div>
        <p className="mt-5 text-sm font-bold uppercase tracking-[0.22em] text-emerald-300">
          Loading academy...
        </p>
      </div>
    </main>
  );
}
