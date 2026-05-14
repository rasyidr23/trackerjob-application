"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) { setError("Password minimal 6 karakter"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Pendaftaran gagal"); setLoading(false); return; }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-lg dark:bg-zinc-900">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            </div>
          </Link>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Buat Akun</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Mulai lacak lamaran kerja Anda hari ini</p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nama Lengkap</label>
            <input
              id="name" name="name" type="text" required
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="block w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white sm:text-sm"
              placeholder="Nama lengkap Anda"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
            <input
              id="email" name="email" type="email" autoComplete="email" required
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="block w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white sm:text-sm"
              placeholder="email@contoh.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
            <input
              id="password" name="password" type="password" autoComplete="new-password" required
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="block w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white sm:text-sm"
              placeholder="Minimal 6 karakter"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="flex w-full justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none disabled:opacity-60 transition-colors mt-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                Mendaftar...
              </span>
            ) : "Daftar Sekarang"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}
