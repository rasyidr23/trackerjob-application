"use client";
import { useEffect, useState, useCallback } from "react";
import { showToast } from "@/components/Toast";

interface Job {
  id: string;
  company: string;
  position: string;
  link?: string;
  appliedAt: string;
  status: string;
  location?: string;
  salaryRange?: string;
  notes?: string;
  deadline?: string;
}

const STATUS_LIST = ["Applied", "Administration", "Interview", "Technical Test", "HR Interview", "Offering", "Accepted", "Rejected"];

const STATUS_COLORS: Record<string, string> = {
  Applied: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Administration: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Interview: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "Technical Test": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "HR Interview": "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  Offering: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  Accepted: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const emptyForm = {
  company: "", position: "", link: "", appliedAt: new Date().toISOString().split("T")[0],
  status: "Applied", location: "", salaryRange: "", notes: "", deadline: "",
};

export default function TrackerPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "10", search, sort, order: "desc" });
    if (statusFilter) params.set("status", statusFilter);
    const res = await fetch(`/api/jobs?${params}`);
    const data = await res.json();
    setJobs(data.jobs ?? []);
    setTotal(data.total ?? 0);
    setTotalPages(data.totalPages ?? 1);
    setLoading(false);
  }, [page, search, statusFilter, sort]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  function openAdd() {
    setEditJob(null);
    setForm(emptyForm);
    setShowModal(true);
  }

  function openEdit(job: Job) {
    setEditJob(job);
    setForm({
      company: job.company, position: job.position, link: job.link ?? "",
      appliedAt: job.appliedAt?.split("T")[0] ?? new Date().toISOString().split("T")[0],
      status: job.status, location: job.location ?? "", salaryRange: job.salaryRange ?? "",
      notes: job.notes ?? "", deadline: job.deadline?.split("T")[0] ?? "",
    });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const url = editJob ? `/api/jobs/${editJob.id}` : "/api/jobs";
    const method = editJob ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) {
      showToast(editJob ? "Lamaran berhasil diupdate!" : "Lamaran berhasil ditambahkan!", "success");
      setShowModal(false);
      fetchJobs();
    } else {
      const err = await res.json();
      showToast(err.error ?? "Terjadi kesalahan", "error");
    }
    setSubmitting(false);
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    if (res.ok) {
      showToast("Lamaran berhasil dihapus", "success");
      fetchJobs();
    } else {
      showToast("Gagal menghapus lamaran", "error");
    }
    setDeleteId(null);
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tracker Loker</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Total {total} lamaran kerja</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
          Tambah Lamaran
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            type="text" placeholder="Cari perusahaan atau posisi..."
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          />
        </div>
        <select
          value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
        >
          <option value="">Semua Status</option>
          {STATUS_LIST.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={sort} onChange={(e) => setSort(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
        >
          <option value="createdAt">Terbaru</option>
          <option value="appliedAt">Tgl Melamar</option>
          <option value="deadline">Deadline</option>
          <option value="company">Perusahaan (A-Z)</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 dark:bg-zinc-900 dark:ring-zinc-800">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">📭</div>
            <p className="font-semibold text-gray-900 dark:text-white">Belum ada lamaran</p>
            <p className="mt-1 text-sm text-gray-500">Klik tombol &quot;Tambah Lamaran&quot; untuk mulai melacak</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-zinc-800 dark:bg-zinc-800/50">
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Perusahaan</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Posisi</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Tgl Melamar</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Deadline</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Lokasi</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 dark:text-white">{job.company}</div>
                      {job.salaryRange && <div className="text-xs text-gray-400 mt-0.5">💰 {job.salaryRange}</div>}
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{job.position}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[job.status] ?? "bg-gray-100 text-gray-700"}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {new Date(job.appliedAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {job.deadline ? new Date(job.deadline).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{job.location || "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {job.link && (
                          <a href={job.link} target="_blank" rel="noopener noreferrer" className="rounded-lg p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Buka Link">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                          </a>
                        )}
                        <button onClick={() => openEdit(job)} className="rounded-lg p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Edit">
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button onClick={() => setDeleteId(job.id)} className="rounded-lg p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Hapus">
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Halaman {page} dari {totalPages}</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-lg border border-gray-200 px-3 py-1.5 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-zinc-700 dark:hover:bg-zinc-800">Prev</button>
            <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="rounded-lg border border-gray-200 px-3 py-1.5 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-zinc-700 dark:hover:bg-zinc-800">Next</button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900 max-h-[90vh] overflow-y-auto">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{editJob ? "Edit Lamaran" : "Tambah Lamaran"}</h2>
              <button onClick={() => setShowModal(false)} className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Perusahaan *</label>
                  <input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="input-field" placeholder="Nama perusahaan" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Posisi *</label>
                  <input required value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="input-field" placeholder="Posisi pekerjaan" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Link Lowongan</label>
                <input type="url" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="input-field" placeholder="https://..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Melamar</label>
                  <input type="date" value={form.appliedAt} onChange={(e) => setForm({ ...form, appliedAt: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Deadline</label>
                  <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field">
                    {STATUS_LIST.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Lokasi</label>
                  <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input-field" placeholder="Kota / Remote" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Range Gaji</label>
                <input value={form.salaryRange} onChange={(e) => setForm({ ...form, salaryRange: e.target.value })} className="input-field" placeholder="Rp 5.000.000 - 8.000.000" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Catatan</label>
                <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field resize-none" placeholder="Catatan pribadi..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-zinc-700 dark:text-gray-300">
                  Batal
                </button>
                <button type="submit" disabled={submitting} className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
                  {submitting ? "Menyimpan..." : editJob ? "Simpan Perubahan" : "Tambah Lamaran"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Hapus Lamaran?</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-zinc-700 dark:text-gray-300">Batal</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
