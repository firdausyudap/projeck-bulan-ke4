# Pajajaran Digital — Ensiklopedia Sejarah Sunda

Website ensiklopedia digital tentang sejarah Kerajaan Sunda dan Pajajaran.

## Struktur Proyek

```
pajajaran-digital/
  apps/
    web/              # Frontend React + Vite + TypeScript
    api/              # Backend Express + TypeScript
    python-service/   # Layanan Python FastAPI (opsional, pendukung)
  packages/
    shared/           # Tipe dan utilitas bersama
  prisma/
    schema.prisma     # Skema database Prisma
    seed.ts           # Seed data awal
  docs/               # Dokumentasi
  .env.example        # Contoh environment variables
  package.json        # Root workspace
  README.md
```

## Prasyarat

- Node.js 20+ (terpasang di `C:\Program Files\nodejs`)
- npm
- PostgreSQL (Neon) — opsional untuk pengembangan lokal
- Python 3.10+ — opsional untuk python-service

## Instalasi

```bash
# Tambahkan Node.js ke PATH (Windows)
set PATH=C:\Program Files\nodejs;%PATH%

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Jalankan migration (pastikan DATABASE_URL sudah diatur)
npm run prisma:migrate

# Seed database
npm run prisma:seed
```

## Menjalankan Development

```bash
# Jalankan semua (frontend + backend)
npm run dev

# Atau terpisah:
npm run dev:web    # Frontend di http://localhost:5173
npm run dev:api    # Backend di http://localhost:4000
```

## Environment Variables

Salin `.env.example` ke `.env` dan isi nilai yang diperlukan:

```bash
cp .env.example .env
```

Variabel yang diperlukan:
- `DATABASE_URL` — URL koneksi Neon PostgreSQL
- `JWT_SECRET` — Secret untuk JWT (minimal 32 karakter)
- `CORS_ORIGIN` — Origin frontend (default: http://localhost:5173)
- `PORT` — Port backend (default: 4000)
- `VITE_API_URL` — URL backend untuk frontend

## Build

```bash
npm run build        # Build semua
npm run build:web    # Build frontend
npm run build:api    # Build backend
```

## Test

```bash
npm run test         # Jalankan semua test
npm run test:api     # Test backend
npm run test:web     # Test frontend
```

## Layanan Python (Opsional)

Layanan Python FastAPI tersedia di `apps/python-service/`. Ini adalah layanan pendukung untuk pencarian dan pemrosesan metadata. Website dapat berjalan tanpa layanan ini.

```bash
cd apps/python-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Catatan Penting

- Jangan menyimpan file video besar di PostgreSQL. Gunakan object storage dan simpan URL di database.
- Semua gambar yang digunakan sebagai placeholder ditandai sebagai ilustrasi.
- Data sejarah yang belum terverifikasi ditandai dengan `verificationStatus`.
- Autentikasi menggunakan JWT dengan httpOnly cookie.
- Password di-hash menggunakan bcrypt.

## Sumber Sejarah

Data sejarah dalam seed didasarkan pada sumber-sumber yang tersedia secara publik. Fakta yang belum dapat diverifikasi ditandai dengan jelas. Jangan mengarang tanggal, silsilah, atau kutipan prasasti.
