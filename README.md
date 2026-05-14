# Job Application Tracker

Website modern untuk membantu pengguna melacak semua lamaran pekerjaan yang pernah mereka kirim. Dibangun dengan Next.js 16, Prisma ORM, MySQL (Laragon), dan Tailwind CSS.

## Fitur Utama

- **Authentication System:** Register dan Login yang aman dengan hashing password (bcrypt) dan JWT.
- **Dashboard:** Ringkasan statistik lamaran (Total, Diterima, Ditolak, dll) dengan visualisasi Bar Chart (Recharts).
- **Tracker Loker:** Kelola data lamaran (CRUD) dengan fitur:
  - Pencarian (Search)
  - Filter berdasarkan status
  - Pengurutan (Sorting)
  - Paginasi (Pagination)
- **Responsive Design:** Tampilan optimal di desktop dan mobile.
- **Dark Mode:** Mendukung tema gelap yang modern.
- **Toast Notifications:** Notifikasi interaktif untuk setiap aksi.

## Stack Teknologi

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS
- **Backend:** Next.js Route Handlers (API)
- **Database:** MySQL (Laragon)
- **ORM:** Prisma
- **Auth:** JWT & Bcryptjs
- **Charts:** Recharts
- **Icons:** Lucide React

## Prasyarat (Prerequisites)

Sebelum menjalankan project ini, pastikan Anda sudah menginstal:
- [Node.js](https://nodejs.org/) (Versi 18 atau lebih baru)
- [Laragon](https://laragon.org/) atau server MySQL lainnya

## Cara Instalasi di Lokal

Ikuti langkah-langkah berikut untuk menjalankan project di komputer Anda:

### 1. Clone Repository
```bash
git clone https://github.com/rasyidr23/trackerjob-application.git
cd trackerjob-application
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Buat file bernama `.env` di direktori root dan tambahkan konfigurasi database Anda:
```env
DATABASE_URL="mysql://root:@localhost:3306/job_tracker"
JWT_SECRET="ganti_dengan_secret_key_anda"
```
*Catatan: Pastikan MySQL di Laragon sudah berjalan.*

### 4. Setup Database (Prisma)
Jalankan perintah berikut untuk membuat database dan tabel secara otomatis:
```bash
npx prisma db push
```

### 5. Jalankan Project
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## Struktur Project

- `/app`: Halaman utama dan API routes.
- `/components`: Komponen UI yang dapat digunakan kembali (Sidebar, Toast, dll).
- `/lib`: Utilitas untuk Prisma client, JWT, dan autentikasi.
- `/prisma`: Schema database.
- `/public`: Aset statis.

## Lisensi
[MIT](LICENSE)
