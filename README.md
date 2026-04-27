# Smart Library API - Kelompok 44
Aplikasi RESTful API untuk Sistem Manajemen Perpustakaan Digital (Smart Library). API ini mengelola data buku, penulis, kategori, anggota perpustakaan, serta transaksi peminjaman buku secara terintegrasi.

## Teknologi yang Digunakan
- **Node.js** & **Express.js** (Web Framework)
- **PostgreSQL** (Database Relasional)
- **node-postgres (pg)** (PostgreSQL client untuk Node.js)
- **Vercel** (Platform Deployment)

## Base URL
API dapat diakses melalui:
```text
https://smart-library-kel44.vercel.app
```

---

## Daftar API Endpoints

### 1. Root Endpoint
- **Kegunaan:** Memverifikasi bahwa server API sedang berjalan dengan normal.
- **Method:** `GET`
- **URL:** `/`
- **Body Request:** *None*
- **Response:** `Smart Library API is Running...`

---

### 2. Authors (Penulis)
#### Ambil Semua Penulis
- **Kegunaan:** Mengambil seluruh data penulis yang tersimpan, diurutkan berdasarkan nama secara Ascending.
- **Method:** `GET`
- **URL:** `/api/authors`
- **Body Request:** *None*

#### Tambah Penulis Baru
- **Kegunaan:** Menyimpan data penulis baru ke dalam sistem.
- **Method:** `POST`
- **URL:** `/api/authors`
- **Body Request:** (JSON)
```json
  {
    "name": "Nama Penulis",
    "nationality": "Kewarganegaraan"
  }
```

---

### 3. Categories (Kategori)
#### Ambil Semua Kategori
- **Kegunaan:** Mengambil seluruh data kategori buku yang tersedia.
- **Method:** `GET`
- **URL:** `/api/categories`
- **Body Request:** *None*

#### Tambah Kategori Baru
- **Kegunaan:** Menyimpan data kategori buku baru ke dalam sistem.
- **Method:** `POST`
- **URL:** `/api/categories`
- **Body Request:** (JSON)
```json
  {
    "name": "Nama Kategori (misal: Fiksi, Sains)"
  }
```

---

### 4. Books (Buku)
#### Ambil Semua Buku
- **Kegunaan:** Mengambil seluruh data buku beserta nama penulis dan kategorinya melalui proses JOIN antar tabel.
- **Method:** `GET`
- **URL:** `/api/books`
- **Body Request:** *None*

#### Tambah Buku Baru
- **Kegunaan:** Menyimpan data buku baru ke dalam sistem. Nilai `available_copies` akan otomatis mengikuti `total_copies` saat pertama kali dibuat.
- **Method:** `POST`
- **URL:** `/api/books`
- **Body Request:** (JSON)
```json
  {
    "isbn": "Nomor ISBN Buku",
    "title": "Judul Buku",
    "author_id": 1,
    "category_id": 2,
    "total_copies": 10
  }
```
*(Catatan: `author_id` dan `category_id` harus menggunakan ID yang sudah tersedia di database)*

---

### 5. Members (Anggota)
#### Ambil Semua Anggota
- **Kegunaan:** Mengambil seluruh data anggota perpustakaan, diurutkan dari yang paling baru mendaftar.
- **Method:** `GET`
- **URL:** `/api/members`
- **Body Request:** *None*

#### Daftarkan Anggota Baru
- **Kegunaan:** Mendaftarkan anggota perpustakaan baru ke dalam sistem.
- **Method:** `POST`
- **URL:** `/api/members`
- **Body Request:** (JSON)
```json
  {
    "full_name": "Nama Lengkap Anggota",
    "email": "email.anggota@example.com",
    "member_type": "STUDENT"
  }
```

---

### 6. Loans (Peminjaman)
#### Ambil Semua Data Peminjaman
- **Kegunaan:** Mengambil seluruh histori peminjaman beserta judul buku dan nama anggota yang meminjam.
- **Method:** `GET`
- **URL:** `/api/loans`
- **Body Request:** *None*

#### Buat Peminjaman Baru
- **Kegunaan:** Mencatat transaksi peminjaman buku baru. Sistem menggunakan Database Transaction untuk memvalidasi stok, mengurangi `available_copies`, dan menyimpan data peminjaman. Jika stok habis, seluruh proses dibatalkan secara otomatis.
- **Method:** `POST`
- **URL:** `/api/loans`
- **Body Request:** (JSON)
```json
  {
    "book_id": 1,
    "member_id": 1,
    "due_date": "2026-04-10"
  }
```
*(Catatan: `book_id` dan `member_id` harus menggunakan ID yang sudah tersedia di database)*