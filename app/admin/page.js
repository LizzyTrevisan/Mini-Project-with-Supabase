"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
   
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error(profileError);
        router.push("/dashboard"); // fallback
        return;
      }

      
      if (!profile || profile.role !== "admin") {
        router.push("/dashboard"); 
        return;
      }

      setUser(user);
      setLoading(false);
    }

    
    loadUser();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return <p className="text-sm text-slate-300">Loading admin dashboard...</p>;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Admin Dashboard
          </h2>
          <p className="text-sm text-slate-300">
            Logged in as <span className="font-medium">{user.email}</span>
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-500 px-4 py-2 text-xs font-medium hover:bg-red-400"
        >
          Logout
        </button>
      </div>

      <p className="text-sm text-slate-300">
        This is the admin dashboard. Only users with the "admin" role can access
        this page.
      </p>
    </section>
  );
}
