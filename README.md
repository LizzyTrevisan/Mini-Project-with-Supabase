# Simple Mini Supabase Project (Testing Authentication  + Supabase DB

This project is a simple web to test and explore Supabase as DB and automatic form of Authentication.

FIRST MAKE THESE FOLLOWING CHANGES:
---

## 🧠 To get it started:
1) Make sure you create the following:<br>

rename .env.example <b> into <b> .env.local -> <br> then go to your supabase -> <br>
create a .gitignore file from app root -> <br>
add this: .env.local 
--
Then go to Supabase  and follow this: <br>
Project Settings -> <br> Data API  -> <br> copy the Project URL ->  paste it as quotes into your .env.local file where it says Supabase URL.
          -> <br> then on Supabase again go to API Keys -> <br> Legacy anon -> <br> copy anon public  -> <br> go back to .env.local -> <br> add into supabase anon key within quotes.

2) Add a file into the root of the project called -> jsconfig.json with the following:

   ```
   { "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["*"]
      }
     }
   }
   ```
   
3) Find package.json and replace to the following:
   ```
   {
      "name": "next-supabase-tailwind-starter",
      "version": "1.0.0",
      "private": true,
      "scripts": {
        "dev": "next dev",
        "build": "next build",
        "start": "next start",
        "lint": "next lint"
      },
      "dependencies": {
        "@supabase/supabase-js": "^2.45.0",
        "next": "14.1.0",
        "react": "18.2.0",
        "react-dom": "18.2.0"
      },
      "devDependencies": {
        "autoprefixer": "^10.4.0",
        "postcss": "^8.4.0",
        "tailwindcss": "^3.4.0"
      }
    }
   ```

4)Replace page.js file into the following to handle a logout btn component:

   ```
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

```

5) Replace Login Page for the following:

```
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
```
6) Add The Admin Dashboard -> app folder -> add admin folder -> add the file page.js inside add:
   ```
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
   ```
# In Supabase do the DB role creation:
- First go to -> <br>
Authenticaton -> <br>
Policies -> <br>
Profiles -> <br>
Click on Disable RLS **this approach is just for this project which is not a real one-> <br>
Deactivate the email confirmation for this project only  go to Policies -> <br>
Profiles -> <br>
Sing In/ Providers -> <br>
Disable Confirm email. <br>
Save Changes.<br>


## Creating Roles:
- Use the script below and execute it:

```
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'student',
  full_name text,
  createat timestamp default now()
);

--activate RLS

alter table public.profiles enable row level security;

--users can edit their own profile
create policy "Users can manage their profile"
on public.profiles
for all
using (auth.uid() = id)
with check(auth.uid() = id);
```

8) In the localhost page, create an admin account. Keep in mind the role created in this project will always be a student. It will be manually changed on Supabase next.

   ![BTNS.png](https://raw.githubusercontent.com/LizzyTrevisan/Mini-Project-with-Supabase/refs/heads/main/Screenshot%202025-11-26%20001440.png)
   
10)  Finally, go to Table Editor -> br>
    - Find the user as admin -> <br>
    Select the role -> <br>
    type admin -> <br>
    Save it.

   
---
## Run on Terminal:
- npm install <br>
- npm run dev<br>

---

## 🧪 Technologies Used

- Next.js
- Tailwind.css
- Node.js
- Supabase

---

