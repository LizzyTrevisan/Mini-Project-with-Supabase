// app/login/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if(error){
      setLoading(false);
      setError(error.message);
      return;
    }

    const user =  data.user;

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
      
  
    setLoading(false);


    if (profileError) {
      console.error("Error fetching profile:", profileError);
      setError("Could not load the profile");
      return;
    }

    //validation
    if(profileData.role === "admin"){
      router.push("/admin")
    } else {
      router.push("/dashboard");
  }
}

  return (
    <section className="max-w-md mx-auto space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">Login</h2>
      <p className="text-sm text-slate-300">
        Use the email and password you registered with.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1 text-sm">
          <label htmlFor="email" className="block text-slate-200">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-emerald-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1 text-sm">
          <label htmlFor="password" className="block text-slate-200">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-emerald-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <p className="text-xs text-red-400 bg-red-950/40 border border-red-900 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium hover:bg-emerald-400 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </section>
  );
}
