// app/layout.js
import "./globals.css";

export const metadata = {
  title: "Next + Supabase Starter",
  description: "Starter template with auth, dashboard, Tailwind and Supabase.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen">
        <div className="mx-auto max-w-3xl px-4 py-8">
          <header className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-semibold tracking-tight">
              Portal Starter
            </h1>
            <nav className="flex gap-4 text-sm">
              <a href="/" className="hover:text-emerald-300">Home</a>
              <a href="/dashboard" className="hover:text-emerald-300">Dashboard</a>
              <a href="/login" className="hover:text-emerald-300">Login</a>
            </nav>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
