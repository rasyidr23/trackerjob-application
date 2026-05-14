import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          </div>
          <span className="text-xl font-bold">JobTracker</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="rounded-xl px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Login
          </Link>
          <Link href="/register" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
            Daftar Gratis
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 py-24 max-w-4xl mx-auto">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-300">
          <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
          Gratis untuk digunakan
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
          Lacak Semua<br />Lamaran Kerja Anda
        </h1>
        <p className="text-lg text-gray-400 max-w-xl mb-10">
          Pantau status lamaran pekerjaan, jadwal interview, dan progress karir Anda dalam satu dashboard yang rapi dan mudah digunakan.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/register" className="rounded-xl bg-blue-600 px-7 py-3.5 text-base font-semibold text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30">
            Mulai Sekarang →
          </Link>
          <Link href="/login" className="rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 text-base font-medium text-white hover:bg-white/10 transition-colors">
            Masuk ke Akun
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-24 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { emoji: "📊", title: "Dashboard Statistik", desc: "Visualisasikan progress lamaran Anda dengan chart interaktif yang mudah dipahami." },
            { emoji: "✏️", title: "CRUD Lengkap", desc: "Tambah, edit, dan hapus data lamaran kerja dengan mudah dan cepat." },
            { emoji: "🔍", title: "Filter & Pencarian", desc: "Temukan lamaran spesifik dengan fitur search, filter status, dan pengurutan." },
          ].map((f, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="text-3xl mb-3">{f.emoji}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center py-8 text-sm text-gray-600 border-t border-white/10">
        © 2025 JobTracker. Dibuat dengan ❤️ untuk para job seeker Indonesia.
      </footer>
    </div>
  );
}
