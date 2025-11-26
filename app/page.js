// app/page.js
import Link from "next/link";

export default function Home() {
  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">
        Hello 👋
      </h2>
      <p className="text-sm text-slate-300 max-w-xl">
        This is your Next.js + Tailwind + Supabase starter. It includes basic auth pages,
        a protected dashboard, and a placeholder API route for future AI integration.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/signup"
          className="px-4 py-2 rounded-lg bg-emerald-500 text-sm font-medium hover:bg-emerald-400"
        >
          Create account
        </Link>
        <Link
          href="/login"
          className="px-4 py-2 rounded-lg border border-slate-600 text-sm font-medium hover:border-emerald-300"
        >
          Login
        </Link>
        <Link
          href="/dashboard"
          className="px-4 py-2 rounded-lg border border-slate-600 text-sm font-medium hover:border-emerald-300"
        >
          Go to dashboard
        </Link>
      </div>
    </section>
  );
}
