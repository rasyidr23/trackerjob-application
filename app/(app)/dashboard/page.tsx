"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface DashboardStats {
  total: number;
  accepted: number;
  rejected: number;
  interview: number;
  administration: number;
  offering: number;
  technicalTest: number;
  hrInterview: number;
  applied: number;
  statusCounts: Record<string, number>;
}

const statCards = [
  { key: "total", label: "Total Lamaran", color: "bg-blue-600", textColor: "text-blue-600", icon: "💼" },
  { key: "accepted", label: "Diterima", color: "bg-green-600", textColor: "text-green-600", icon: "✅" },
  { key: "rejected", label: "Ditolak", color: "bg-red-600", textColor: "text-red-600", icon: "❌" },
  { key: "interview", label: "Interview", color: "bg-purple-600", textColor: "text-purple-600", icon: "🎤" },
  { key: "administration", label: "Administrasi", color: "bg-yellow-600", textColor: "text-yellow-600", icon: "📋" },
  { key: "offering", label: "Offering", color: "bg-teal-600", textColor: "text-teal-600", icon: "🤝" },
  { key: "technicalTest", label: "Technical Test", color: "bg-orange-600", textColor: "text-orange-600", icon: "💻" },
  { key: "hrInterview", label: "HR Interview", color: "bg-pink-600", textColor: "text-pink-600", icon: "👥" },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((data) => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const chartData = stats
    ? Object.entries(stats.statusCounts).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Ringkasan aktivitas lamaran kerja Anda</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {statCards.map((card) => (
              <div key={card.key} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200 dark:bg-zinc-900 dark:ring-zinc-800">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{card.icon}</span>
                  <span className={`text-3xl font-bold ${card.textColor}`}>
                    {stats ? (stats as unknown as Record<string, number>)[card.key] ?? 0 : 0}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">{card.label}</p>
              </div>
            ))}
          </div>

          {/* Bar Chart */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 dark:bg-zinc-900 dark:ring-zinc-800">
            <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Statistik Status Lamaran</h2>
            {stats && stats.total === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="text-5xl mb-4">📭</div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Belum ada data lamaran</p>
                <p className="text-sm text-gray-400 mt-1">Mulai tambah lamaran kerja di halaman Tracker Loker</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: 13 }}
                    cursor={{ fill: "#eff6ff" }}
                  />
                  <Bar dataKey="value" name="Jumlah" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </>
      )}
    </div>
  );
}
