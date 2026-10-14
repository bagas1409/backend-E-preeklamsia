# E-Preeklamsia | Backend Server 🩺

Backend API dan sistem manajemen *database* untuk proyek **E-Preeklamsia Mobile App**. Sistem ini dirancang untuk menangani otentikasi pengguna ganda (Tenaga Medis & Pasien Hamil), pemrosesan logika klinis diagnosa Preeklamsia, dan pencatatan riwayat rekam medis dengan tingkat keamanan data yang tinggi.

## 🛠 Tech Stack
Sistem Backend ini dibangun menggunakan tumpukan teknologi modern:
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework API**: [Express.js](https://expressjs.com/)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: `bcryptjs` (Password Hashing) & `helmet` (HTTP Headers Security)

---

## 🔒 Standar Keamanan (Security Policy)
Aplikasi kesehatan wajib menjaga privasi data medis pengguna. Backend ini mengimplementasikan:
1. **Stateless JWT**: Sesi otentikasi dikendalikan melalui Token, mencegah pembajakan sesi di memori server.
2. **Password Hashing**: Menggunakan `bcrypt` dengan *salt rounds* tingkat 10. Admin database sekalipun tidak akan bisa melihat password asli pengguna.
3. **Data Sanitization**: Payload diagnosa secara otomatis di-*parsing* (diubah ke tipe angka yang benar seperti `Integer`/`Float`) untuk mencegah *SQL Injection* atau manipulasi tipe data API.
4. **Vague Error Messages**: Respon kegagalan (seperti Lupa Password) disamarkan (Contoh: *"Data tidak ditemukan"*) agar *hacker* tidak bisa melacak atau mengekstrak daftar Email yang aktif di sistem.

---

## 🚀 Panduan Instalasi (Getting Started)

### 1. Persyaratan Sistem
Pastikan perangkat/server Anda sudah memiliki:
- **Node.js** (Versi 18.x atau lebih baru)
- **npm** atau **yarn**

### 2. Kloning & Instalasi
Buka terminal dan jalankan perintah berikut:
```bash
# Pindah ke direktori backend
cd backend

# Instal semua dependensi
npm install
```

### 3. Konfigurasi Lingkungan (Environment Variables)
1. Salin file contoh `.env` bawaan.
   ```bash
   cp .env.example .env
   ```
2. Buka file `.env` dan isi dengan konfigurasi server Anda:
   ```env
   # Contoh Konfigurasi
   PORT=5000
   DATABASE_URL="mysql://user:password@localhost:3306/epreeklamsia"
   JWT_SECRET="kunci_rahasia_jwt_anda_yang_sangat_panjang_dan_acak"
   JWT_EXPIRES_IN="7d"
   ```
   > **PERINGATAN**: Jangan pernah mempublikasikan file `.env` asli Anda ke repositori publik!

### 4. Setup Database (Prisma)
Setelah `DATABASE_URL` terhubung, jalankan perintah ini untuk menyinkronkan struktur tabel ke *database* asli Anda:
```bash
# Terapkan migrasi skema ke Database
npx prisma db push

# (Opsional) Generate Prisma Client jika error saat start
npx prisma generate
```

### 5. Menjalankan Server
```bash
# Menjalankan server untuk lingkungan produksi (Production)
npm start

# Menjalankan server untuk tahap pengembangan (Development - Auto Restart)
npm run dev
```
Server akan menyala di `http://localhost:5000` (atau *port* yang Anda tentukan).

---

## 📡 Daftar Endpoint API (Ringkasan)

### Otentikasi (`/api/auth`)
| Method | Endpoint | Kegunaan | Payload Wajib |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Mendaftarkan akun baru | `name`, `email`, `password` |
| `POST` | `/login` | Masuk ke sistem | `email`, `password` |
| `POST` | `/verify-reset` | Tahap 1 Lupa Password | `name`, `email` |
| `POST` | `/reset-password`| Tahap 2 Lupa Password | `reset_token`, `new_password` |

### Diagnosa Preeklamsia (`/api/diagnosa`)
| Method | Endpoint | Kegunaan | Keamanan |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Mengirim data medis (Tekanan darah, Proteinuria, dll) untuk dianalisis risikonya. | JWT Bearer Token |
| `GET`  | `/` | Mengambil seluruh histori rekam medis pengguna yang sedang *login*. | JWT Bearer Token |

---

*Hak Cipta © 2026 E-Preeklamsia Mobile. Dikembangkan secara eksklusif untuk Universitas Aisyiyah Pringsewu.*
