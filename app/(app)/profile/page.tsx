"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { showToast } from "@/components/Toast";

interface UserData {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        setUser(data);
        setFetching(false);
      })
      .catch(() => setFetching(false));
  }, []);

  async function handleLogout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    showToast("Berhasil logout", "success");
    router.push("/login");
    router.refresh();
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profil Saya</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Kelola informasi akun Anda</p>
      </div>

      <div className="max-w-md space-y-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 dark:bg-zinc-900 dark:ring-zinc-800">
          {fetching ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white select-none">
                  {initials}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-lg">
                    {user?.name ?? "Tidak diketahui"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-3 border-t border-gray-100 dark:border-zinc-800 pt-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Nama Lengkap</span>
                  <span className="font-medium text-gray-900 dark:text-white">{user?.name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Email</span>
                  <span className="font-medium text-gray-900 dark:text-white">{user?.email}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Bergabung</span>
                  <span className="font-medium text-gray-900 dark:text-white">{joinDate}</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                {loading ? "Logging out..." : "Logout"}
              </button>
            </>
          )}
        </div>

        {/* Form Ubah Password */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 dark:bg-zinc-900 dark:ring-zinc-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ubah Password</h2>
          
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const currentPassword = formData.get("currentPassword");
              const newPassword = formData.get("newPassword");
              const confirmPassword = formData.get("confirmPassword");

              if (newPassword !== confirmPassword) {
                showToast("Konfirmasi password baru tidak cocok", "error");
                return;
              }

              const btn = e.currentTarget.querySelector("button");
              if (btn) btn.disabled = true;

              try {
                const res = await fetch("/api/auth/change-password", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ currentPassword, newPassword }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error);
                showToast("Password berhasil diubah", "success");
                (e.target as HTMLFormElement).reset();
              } catch (err: any) {
                showToast(err.message, "error");
              } finally {
                if (btn) btn.disabled = false;
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password Saat Ini</label>
              <input name="currentPassword" type="password" required className="input-field" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password Baru</label>
              <input name="newPassword" type="password" required className="input-field" placeholder="Minimal 6 karakter" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Konfirmasi Password Baru</label>
              <input name="confirmPassword" type="password" required className="input-field" placeholder="Ulangi password baru" />
            </div>
            <button type="submit" className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
