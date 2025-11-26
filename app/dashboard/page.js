// app/dashboard/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient(); 

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);
      setLoading(false);
    }

    loadUser();
  }, [router, supabase]);

  async function handleCallAi() {
    setAiLoading(true);
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: "Give me a career tip for students." }),
    });

    const data = await res.json();
    setAiResponse(data.message);
    setAiLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) {
    return <p className="text-sm text-slate-300">Loading dashboard...</p>;
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
          <p className="text-sm text-slate-300">
            Welcome, <span className="font-medium">{user.email}</span>.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-500 px-4 py-2 text-xs font-medium hover:bg-red-400"
        >
          Logout
        </button>
      </div>

      <div className="space-y-3 rounded-lg border border-slate-700 bg-slate-900 p-4">
        <h3 className="text-sm font-semibold">AI helper (placeholder)</h3>
        <p className="text-xs text-slate-400">
          Right now this calls a fake API route. Later you can plug in a real AI
          API (OpenAI, etc.).
        </p>
        <button
          onClick={handleCallAi}
          disabled={aiLoading}
          className="mt-2 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-medium hover:bg-emerald-400 disabled:opacity-60"
        >
          {aiLoading ? "Thinking..." : "Ask AI for a tip"}
        </button>

        {aiResponse && (
          <p className="mt-3 text-sm text-emerald-200 bg-emerald-950/40 border border-emerald-800 rounded-md px-3 py-2">
            {aiResponse}
          </p>
        )}
      </div>
    </section>
  );
}
