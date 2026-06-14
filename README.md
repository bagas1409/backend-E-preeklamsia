# Express.js + Prisma ORM + PostgreSQL Backend Boilerplate (Production-Ready)

Template starter backend Node.js & Express yang clean, scalable, dan reusable untuk berbagai kebutuhan aplikasi (UMKM, SIAKAD, SaaS, mobile app). Menggunakan JavaScript (CommonJS) dengan PostgreSQL dan Prisma ORM.

---

## 📁 Struktur Project

Struktur folder dirancang menggunakan pola **Service-Repository/Controller** yang memisahkan antara routing, validasi, logika bisnis, dan akses database.

```text
backend/
├── prisma/
│   ├── schema.prisma   # Skema Database Prisma (PostgreSQL)
│   └── seed.js         # Script Data Awal (Seeding) untuk testing
├── src/
│   ├── config/
│   │   └── env.config.js     # Validasi & Konfigurasi Env terpusat
│   ├── controllers/
│   │   ├── auth.controller.js # Controller Registrasi & Login
│   │   └── user.controller.js # Controller CRUD User
│   ├── db/
│   │   └── prisma.js         # Singleton instance Prisma Client
│   ├── middlewares/
│   │   ├── auth.middleware.js # Guard token JWT & role-based access
│   │   ├── error.middleware.js # Global error handler & log detail
│   │   ├── logging.middleware.js # Request HTTP logger (winston)
│   │   └── validator.middleware.js # Interceptor request parser Zod
│   ├── routes/
│   │   ├── auth.routes.js    # Definisi route registrasi & login
│   │   ├── user.routes.js    # Definisi route CRUD users (protected)
│   │   └── index.js          # Master router untuk menggabungkan modul
│   ├── services/
│   │   ├── auth.service.js   # Bisnis logika otentikasi & hashing
│   │   └── user.service.js   # Bisnis logika manajemen akun
│   ├── utils/
│   │   ├── custom-error.util.js # Class kustom HTTP Error (400, 401, 404, dll)
│   │   ├── logger.util.js       # Winston logger console terformat
│   │   └── response.util.js     # Standard response payload format
│   ├── validators/
│   │   ├── auth.validator.js # Zod validation schema untuk login/register
│   │   └── user.validator.js # Zod validation schema untuk parameter/profile
│   ├── app.js          # Inisialisasi Express & middleware global
│   └── server.js       # Entry point boot server & shutdown safety
├── .env                # File Environment Variables (Sensitif)
├── package.json        # Dependensi & NPM scripts
└── README.md           # Dokumentasi ini
```

### Penjelasan Fungsi Bagian:
1. **Config**: Berfungsi memvalidasi apakah variable `.env` yang dibutuhkan sudah diset saat server dinyalakan. Menghindari crash di tengah jalan akibat nilai config undefined.
2. **Controllers**: Hanya bertugas menerima request (`req`), mengirim input ke service, dan mengembalikan response (`res`) menggunakan format standard JSON.
3. **Services**: Berisi seluruh logic bisnis aplikasi, manipulasi data, kalkulasi, enkripsi, dan interaksi langsung dengan database melalui Prisma.
4. **Middlewares**: Fungsi interceptor untuk validasi input, verifikasi token JWT, pembatasan hak akses role, serta penangkapan error global.
5. **Utils**: Helper penunjang seperti standardisasi format JSON API response, custom error instansiasi, dan Winston logger formatting.

---

## 🚀 Panduan Memulai

### 1. Prasyarat
* Node.js v16+ terinstal.
* PostgreSQL berjalan lokal/online.

### 2. Instalasi Dependensi
Jalankan perintah berikut di folder root backend:
```bash
npm install
```

### 3. Setup Environment Variables
Buat file bernama `.env` di root folder backend (sudah terbuat otomatis), dan pastikan nilainya sesuai:
```env
# Port aplikasi berjalan
PORT=5000
NODE_ENV=development

# Database Connection (PostgreSQL)
DATABASE_URL="postgresql://postgres:bagas@localhost:5432/e-preeklamsia?schema=public"

# JWT Secret Configuration
JWT_SECRET="supersecretkeyforjwtauthenticationdevelopment12345!"
JWT_EXPIRES_IN="1d"
```

### 4. Sinkronisasi Database (Prisma Migrations)
Gunakan Prisma CLI untuk memigrasikan skema database dan membuat tabel di PostgreSQL:
```bash
# Membuat migrasi dan mengaplikasikannya ke database
npm run db:migrate
```

### 5. Seeding Data Awal
Masukkan data uji (Admin dan User biasa) dengan menjalankan script seed:
```bash
npm run db:seed
```

### 6. Jalankan Aplikasi
* **Mode Development (dengan reload otomatis):**
  ```bash
  npm run dev
  ```
* **Mode Production:**
  ```bash
  npm run start
  ```

---

## 📊 Daftar Endpoint API & Pengujian

Gunakan **Postman** atau **cURL** untuk melakukan pengujian endpoint.

### 1. Registrasi Akun Baru (`POST /auth/register`)
* **URL:** `http://localhost:5000/auth/register`
* **Body (JSON):**
  ```json
  {
    "name": "Bagas Setia",
    "email": "bagas@example.com",
    "password": "mysecurepassword",
    "role": "USER"
  }
  ```
* **cURL Command:**
  ```bash
  curl -X POST http://localhost:5000/auth/register \
    -H "Content-Type: application/json" \
    -d '{"name": "Bagas Setia", "email": "bagas@example.com", "password": "mysecurepassword", "role": "USER"}'
  ```

### 2. Login Akun (`POST /auth/login`)
* **URL:** `http://localhost:5000/auth/login`
* **Body (JSON):**
  ```json
  {
    "email": "admin@example.com",
    "password": "admin123"
  }
  ```
* **cURL Command:**
  ```bash
  curl -X POST http://localhost:5000/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email": "admin@example.com", "password": "admin123"}'
  ```
  *Copy `token` yang dikembalikan dari response login untuk digunakan di endpoint terproteksi.*

### 3. Ambil Semua User (`GET /users` - PROTECTED & ADMIN ONLY)
* **URL:** `http://localhost:5000/users`
* **Headers:** `Authorization: Bearer <TOKEN_JWT_ADMIN>`
* **cURL Command:**
  ```bash
  curl -X GET http://localhost:5000/users \
    -H "Authorization: Bearer <GANTI_DENGAN_TOKEN_JWT>"
  ```

### 4. Ambil Detail User (`GET /users/:id` - PROTECTED)
* **URL:** `http://localhost:5000/users/<UUID-USER>`
* **Headers:** `Authorization: Bearer <TOKEN_JWT>`
* **cURL Command:**
  ```bash
  curl -X GET http://localhost:5000/users/d290f1ee-6c54-4b01-90e6-d701748f0851 \
    -H "Authorization: Bearer <GANTI_DENGAN_TOKEN_JWT>"
  ```

### 5. Perbarui User (`PUT /users/:id` - PROTECTED)
* **URL:** `http://localhost:5000/users/<UUID-USER>`
* **Headers:** `Authorization: Bearer <TOKEN_JWT>`
* **Body (JSON):**
  ```json
  {
    "name": "Bagas Terupdate",
    "password": "newpassword123"
  }
  ```
* **cURL Command:**
  ```bash
  curl -X PUT http://localhost:5000/users/d290f1ee-6c54-4b01-90e6-d701748f0851 \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <GANTI_DENGAN_TOKEN_JWT>" \
    -d '{"name": "Bagas Terupdate", "password": "newpassword123"}'
  ```

### 6. Hapus User (`DELETE /users/:id` - PROTECTED & ADMIN ONLY)
* **URL:** `http://localhost:5000/users/<UUID-USER>`
* **Headers:** `Authorization: Bearer <TOKEN_JWT_ADMIN>`
* **cURL Command:**
  ```bash
  curl -X DELETE http://localhost:5000/users/d290f1ee-6c54-4b01-90e6-d701748f0851 \
    -H "Authorization: Bearer <GANTI_DENGAN_TOKEN_JWT_ADMIN>"
  ```

---

## 🛠 Panduan Menambahkan Fitur Baru

Misalkan Anda ingin membuat modul/layanan **Product**:

### Langkah 1: Update Skema Database
Edit `prisma/schema.prisma` dan tambahkan model baru:
```prisma
model Product {
  id          String   @id @default(uuid())
  title       String
  price       Int
  createdAt   DateTime @default(now())
}
```
Jalankan migrasi database:
```bash
npx prisma migrate dev --name add_product_model
```

### Langkah 2: Buat File Validasi (Validators)
Buat file `src/validators/product.validator.js`:
```javascript
const { z } = require("zod");
const createProductSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    price: z.number().positive(),
  }),
});
module.exports = { createProductSchema };
```

### Langkah 3: Buat File Service
Buat file `src/services/product.service.js`:
```javascript
const prisma = require("../db/prisma");
const createProduct = async (data) => {
  return await prisma.product.create({ data });
};
module.exports = { createProduct };
```

### Langkah 4: Buat File Controller
Buat file `src/controllers/product.controller.js`:
```javascript
const productService = require("../services/product.service");
const { sendSuccess } = require("../utils/response.util");
const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);
    return sendSuccess(res, "Product berhasil ditambahkan", product, 201);
  } catch (error) {
    next(error);
  }
};
module.exports = { createProduct };
```

### Langkah 5: Buat File Routes & Registrasikan
Buat file `src/routes/product.routes.js`:
```javascript
const express = require("express");
const productController = require("../controllers/product.controller");
const validate = require("../middlewares/validator.middleware");
const { createProductSchema } = require("../validators/product.validator");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();
router.post("/", protect, validate(createProductSchema), productController.createProduct);
module.exports = router;
```
Daftarkan di `src/routes/index.js`:
```javascript
router.use("/products", require("./product.routes"));
```

---

## 🔐 Keamanan & Standar Production (Best Practices)
1. **Helmet & CORS:** Sudah aktif secara bawaan untuk memproteksi header HTTP dan mengatur pembatasan domain pengakses API.
2. **Rate Limiting:** Mengamankan API dari serangan Brute-Force (default diset 100 request per 15 menit per IP).
3. **Validasi Input Zod:** Memastikan input data tidak berbahaya (melindungi SQL injection melalui Prisma ORM secara bawaan).
4. **Global Error Logger:** Error level 500 akan tercatat dengan stack trace lengkap beserta metode HTTP dan URL endpoint untuk investigasi log produksi, sedangkan user hanya menerima response generic "Internal Server Error" demi alasan keamanan (agar stacktrace tidak bocor).
