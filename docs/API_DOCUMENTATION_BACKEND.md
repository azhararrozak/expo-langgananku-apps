# 📘 Langgananku API Documentation

> **Base URL:** `http://localhost:3000`  
> **Version:** 1.0.0  
> **Last Updated:** 12 April 2026

---

## Daftar Isi

- [Autentikasi](#-autentikasi)
- [Auth Endpoints](#1-auth-endpoints)
  - [Register](#11-register)
  - [Login](#12-login)
  - [Refresh Token](#13-refresh-token)
- [Subscription Endpoints](#2-subscription-endpoints)
  - [Tambah Langganan](#21-tambah-langganan)
  - [Daftar Langganan](#22-daftar-semua-langganan)
  - [Detail Langganan](#23-detail-langganan)
  - [Update Langganan](#24-update-langganan)
  - [Hapus Langganan](#25-hapus-langganan)
  - [Daftar Kategori](#26-daftar-kategori)
- [Dashboard Endpoints](#3-dashboard-endpoints)
  - [Ringkasan](#31-ringkasan-summary)
  - [Per Kategori](#32-pengeluaran-per-kategori)
  - [Tagihan Mendatang](#33-tagihan-mendatang)
  - [Pengeluaran Bulanan](#34-pengeluaran-bulanan-12-bulan)
- [Notification Endpoints](#4-notification-endpoints)
  - [Jadwal Notifikasi](#41-jadwal-notifikasi)
- [Premium Endpoints](#5-premium-endpoints)
  - [Status Premium](#51-status-premium)
- [Model Data](#-model-data)
- [Kode Error](#-kode-error)

---

## 🔐 Autentikasi

Sebagian besar endpoint membutuhkan autentikasi menggunakan **JWT Access Token**. Token dikirim melalui **header** pada setiap request.

### Header yang Dibutuhkan

| Header | Value | Keterangan |
|--------|-------|------------|
| `x-access-token` | `eyJhbGciOiJIUz...` | JWT access token dari response login |
| `Content-Type` | `application/json` | Wajib untuk request dengan body (POST, PUT) |

### Cara Mendapatkan Token

1. Panggil endpoint **Login** (`POST /api/auth/signin`)
2. Ambil `accessToken` dari response
3. Kirim token di header `x-access-token` pada setiap request yang membutuhkan autentikasi

### Token Expiry

| Token | Masa Berlaku | Cara Refresh |
|-------|-------------|--------------|
| `accessToken` | 24 jam | Gunakan endpoint Refresh Token |
| `refreshToken` | Sesuai config server | Login ulang jika expired |

> ⚠️ **Catatan:** Jika access token expired, API akan mengembalikan status `401` dengan pesan `"Unauthorized! Access Token was expired!"`. Gunakan refresh token untuk mendapatkan access token baru.

---

## 1. Auth Endpoints

### 1.1 Register

Mendaftarkan user baru.

```
POST /api/auth/signup
```

**Headers:**

| Header | Value | Wajib |
|--------|-------|-------|
| `Content-Type` | `application/json` | ✅ |

**Request Body:**

```json
{
  "username": "azhar",
  "email": "azhar@email.com",
  "password": "Password123"
}
```

| Field | Type | Wajib | Keterangan |
|-------|------|-------|------------|
| `username` | `string` | ✅ | Harus unik |
| `email` | `string` | ✅ | Harus unik |
| `password` | `string` | ✅ | Akan di-hash oleh server |

**Response Sukses — `200 OK`**

```json
{
  "message": "User was registered successfully!"
}
```

**Response Error:**

| Status | Kondisi | Response |
|--------|---------|----------|
| `400` | Username sudah dipakai | `{ "message": "Failed! Username is already in use!" }` |
| `400` | Email sudah dipakai | `{ "message": "Failed! Email is already in use!" }` |
| `500` | Server error | `{ "message": "..." }` |

---

### 1.2 Login

Login untuk mendapatkan access token.

```
POST /api/auth/signin
```

**Headers:**

| Header | Value | Wajib |
|--------|-------|-------|
| `Content-Type` | `application/json` | ✅ |

**Request Body:**

```json
{
  "username": "azhar",
  "password": "Password123"
}
```

| Field | Type | Wajib | Keterangan |
|-------|------|-------|------------|
| `username` | `string` | ✅ | Username yang terdaftar |
| `password` | `string` | ✅ | Password yang terdaftar |

**Response Sukses — `200 OK`**

```json
{
  "id": "69db92242b7b74a7dfb8f2b4",
  "username": "azhar",
  "email": "azhar@email.com",
  "roles": ["ROLE_USER"],
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "19fdd395-7dc8-436f-898a-2791054268be"
}
```

| Field | Type | Keterangan |
|-------|------|------------|
| `id` | `string` | User ID (MongoDB ObjectId) |
| `username` | `string` | Username |
| `email` | `string` | Email |
| `roles` | `string[]` | Daftar role (`ROLE_USER`, `ROLE_ADMIN`) |
| `accessToken` | `string` | JWT token untuk header `x-access-token` |
| `refreshToken` | `string` | Token untuk refresh access token |

**Response Error:**

| Status | Kondisi | Response |
|--------|---------|----------|
| `404` | User tidak ditemukan | `{ "message": "User Not found." }` |
| `401` | Password salah | `{ "accessToken": null, "message": "Invalid Password!" }` |

---

### 1.3 Refresh Token

Mendapatkan access token baru menggunakan refresh token.

```
POST /api/auth/refreshtoken
```

**Headers:**

| Header | Value | Wajib |
|--------|-------|-------|
| `Content-Type` | `application/json` | ✅ |

**Request Body:**

```json
{
  "refreshToken": "19fdd395-7dc8-436f-898a-2791054268be"
}
```

**Response Sukses — `200 OK`**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "19fdd395-7dc8-436f-898a-2791054268be"
}
```

**Response Error:**

| Status | Kondisi | Response |
|--------|---------|----------|
| `403` | Refresh token tidak ada | `{ "message": "Refresh Token is required!" }` |
| `403` | Token tidak ditemukan di DB | `{ "message": "Refresh token is not in database!" }` |
| `403` | Token expired | `{ "message": "Refresh token was expired. Please make a new signin request" }` |

---

## 2. Subscription Endpoints

> 🔑 Semua endpoint di bagian ini membutuhkan header `x-access-token` (kecuali **Daftar Kategori**).

### 2.1 Tambah Langganan

Menambahkan layanan langganan baru untuk user yang sedang login.

```
POST /api/subscriptions
```

**Headers:**

| Header | Value | Wajib |
|--------|-------|-------|
| `Content-Type` | `application/json` | ✅ |
| `x-access-token` | `<accessToken>` | ✅ |

**Request Body:**

```json
{
  "name": "Netflix",
  "cost": 54000,
  "billingCycle": "monthly",
  "nextBillingDate": "2026-04-15",
  "category": "Hiburan",
  "icon": null,
  "notes": "Paket Standard",
  "notifyBefore": 3
}
```

| Field | Type | Wajib | Default | Keterangan |
|-------|------|-------|---------|------------|
| `name` | `string` | ✅ | — | Nama layanan (maks. 100 karakter) |
| `cost` | `number` | ✅ | — | Biaya dalam Rupiah (IDR), angka positif |
| `billingCycle` | `string` | ✅ | — | Siklus tagihan: `"weekly"`, `"monthly"`, `"yearly"` |
| `nextBillingDate` | `string` | ✅ | — | Tanggal tagihan berikutnya (format ISO: `YYYY-MM-DD`) |
| `category` | `string` | ❌ | `"Lainnya"` | Kategori langganan (lihat [Daftar Kategori](#26-daftar-kategori)) |
| `icon` | `string` | ❌ | `null` | URL ikon atau identifier ikon |
| `notes` | `string` | ❌ | `""` | Catatan tambahan (maks. 500 karakter) |
| `notifyBefore` | `number` | ❌ | `3` | Notifikasi H-berapa sebelum tagihan (0–30) |

**Response Sukses — `201 Created`**

```json
{
  "message": "Langganan berhasil ditambahkan",
  "data": {
    "_id": "69db92472b7b74a7dfb8f2be",
    "userId": "69db92242b7b74a7dfb8f2b4",
    "name": "Netflix",
    "cost": 54000,
    "billingCycle": "monthly",
    "nextBillingDate": "2026-04-15T00:00:00.000Z",
    "category": "Hiburan",
    "icon": null,
    "notes": "Paket Standard",
    "status": "active",
    "notifyBefore": 3,
    "createdAt": "2026-04-12T12:38:31.566Z",
    "updatedAt": "2026-04-12T12:38:31.566Z",
    "monthlyCost": 54000,
    "yearlyCost": 648000,
    "id": "69db92472b7b74a7dfb8f2be"
  }
}
```

> 💡 **`monthlyCost`** dan **`yearlyCost`** adalah field virtual yang dihitung otomatis oleh server berdasarkan `cost` dan `billingCycle`. Berguna untuk normalisasi perbandingan biaya.

**Response Error:**

| Status | Kondisi | Response |
|--------|---------|----------|
| `400` | Validasi gagal | `{ "message": "Validasi gagal", "errors": ["Nama layanan wajib diisi", ...] }` |
| `403` | Batas free tier (5) tercapai | `{ "message": "Batas langganan gratis tercapai (5)...", "code": "SUBSCRIPTION_LIMIT_REACHED", "currentCount": 5, "limit": 5 }` |
| `403` | Token tidak ada | `{ "message": "No token provided!" }` |
| `401` | Token expired | `{ "message": "Unauthorized! Access Token was expired!" }` |

---

### 2.2 Daftar Semua Langganan

Mengambil seluruh langganan user yang sedang login, dengan opsi filter dan sorting.

```
GET /api/subscriptions
```

**Headers:**

| Header | Value | Wajib |
|--------|-------|-------|
| `x-access-token` | `<accessToken>` | ✅ |

**Query Parameters (Opsional):**

| Parameter | Type | Default | Keterangan |
|-----------|------|---------|------------|
| `status` | `string` | — | Filter status: `active`, `paused`, `cancelled` |
| `category` | `string` | — | Filter kategori (contoh: `Hiburan`) |
| `sort` | `string` | `nextBillingDate` | Kolom sorting: `nextBillingDate`, `cost`, `name`, `createdAt` |
| `order` | `string` | `asc` | Urutan: `asc` (naik), `desc` (turun) |

**Contoh Request:**

```
GET /api/subscriptions?status=active&sort=cost&order=desc
```

**Response Sukses — `200 OK`**

```json
{
  "message": "Berhasil mengambil daftar langganan",
  "count": 3,
  "data": [
    {
      "_id": "69db92482b7b74a7dfb8f2c6",
      "userId": "69db92242b7b74a7dfb8f2b4",
      "name": "Adobe Creative Cloud",
      "cost": 4800000,
      "billingCycle": "yearly",
      "nextBillingDate": "2026-06-01T00:00:00.000Z",
      "category": "Software Kerja",
      "icon": null,
      "notes": "",
      "status": "active",
      "notifyBefore": 7,
      "createdAt": "2026-04-12T12:38:32.219Z",
      "updatedAt": "2026-04-12T12:38:32.219Z",
      "monthlyCost": 400000,
      "yearlyCost": 4800000,
      "id": "69db92482b7b74a7dfb8f2c6"
    },
    {
      "_id": "69db92472b7b74a7dfb8f2be",
      "userId": "69db92242b7b74a7dfb8f2b4",
      "name": "Netflix",
      "cost": 65000,
      "billingCycle": "monthly",
      "nextBillingDate": "2026-04-15T00:00:00.000Z",
      "category": "Hiburan",
      "icon": null,
      "notes": "Harga naik April 2026",
      "status": "active",
      "notifyBefore": 3,
      "createdAt": "2026-04-12T12:38:31.566Z",
      "updatedAt": "2026-04-12T12:38:48.876Z",
      "monthlyCost": 65000,
      "yearlyCost": 780000,
      "id": "69db92472b7b74a7dfb8f2be"
    }
  ]
}
```

---

### 2.3 Detail Langganan

Mengambil detail satu langganan berdasarkan ID.

```
GET /api/subscriptions/:id
```

**Headers:**

| Header | Value | Wajib |
|--------|-------|-------|
| `x-access-token` | `<accessToken>` | ✅ |

**Path Parameters:**

| Parameter | Type | Keterangan |
|-----------|------|------------|
| `id` | `string` | ID langganan (`_id`) |

**Contoh Request:**

```
GET /api/subscriptions/69db92472b7b74a7dfb8f2be
```

**Response Sukses — `200 OK`**

```json
{
  "data": {
    "_id": "69db92472b7b74a7dfb8f2be",
    "userId": "69db92242b7b74a7dfb8f2b4",
    "name": "Netflix",
    "cost": 65000,
    "billingCycle": "monthly",
    "nextBillingDate": "2026-04-15T00:00:00.000Z",
    "category": "Hiburan",
    "icon": null,
    "notes": "Harga naik April 2026",
    "status": "active",
    "notifyBefore": 3,
    "createdAt": "2026-04-12T12:38:31.566Z",
    "updatedAt": "2026-04-12T12:38:48.876Z",
    "monthlyCost": 65000,
    "yearlyCost": 780000,
    "id": "69db92472b7b74a7dfb8f2be"
  }
}
```

**Response Error:**

| Status | Kondisi | Response |
|--------|---------|----------|
| `404` | ID tidak ditemukan / bukan milik user | `{ "message": "Langganan tidak ditemukan" }` |

---

### 2.4 Update Langganan

Memperbarui langganan yang sudah ada. Mendukung **partial update** — hanya kirim field yang ingin diubah.

```
PUT /api/subscriptions/:id
```

**Headers:**

| Header | Value | Wajib |
|--------|-------|-------|
| `Content-Type` | `application/json` | ✅ |
| `x-access-token` | `<accessToken>` | ✅ |

**Path Parameters:**

| Parameter | Type | Keterangan |
|-----------|------|------------|
| `id` | `string` | ID langganan (`_id`) |

**Request Body (partial — kirim field yang berubah saja):**

```json
{
  "cost": 65000,
  "notes": "Harga naik April 2026",
  "status": "paused"
}
```

| Field | Type | Keterangan |
|-------|------|------------|
| `name` | `string` | Nama layanan baru |
| `cost` | `number` | Biaya baru (IDR) |
| `billingCycle` | `string` | `"weekly"`, `"monthly"`, `"yearly"` |
| `nextBillingDate` | `string` | Tanggal tagihan baru (ISO format) |
| `category` | `string` | Kategori baru |
| `icon` | `string` | URL ikon baru |
| `notes` | `string` | Catatan baru |
| `status` | `string` | `"active"`, `"paused"`, `"cancelled"` |
| `notifyBefore` | `number` | Notifikasi H-berapa (0–30) |

> 💡 Untuk membatalkan langganan dari UI, cukup update `status` menjadi `"cancelled"`.

**Response Sukses — `200 OK`**

```json
{
  "message": "Langganan berhasil diperbarui",
  "data": {
    "_id": "69db92472b7b74a7dfb8f2be",
    "name": "Netflix",
    "cost": 65000,
    "status": "paused",
    "notes": "Harga naik April 2026",
    "updatedAt": "2026-04-12T12:38:48.876Z",
    "monthlyCost": 65000,
    "yearlyCost": 780000
  }
}
```

**Response Error:**

| Status | Kondisi | Response |
|--------|---------|----------|
| `400` | Validasi gagal | `{ "message": "Validasi gagal", "errors": [...] }` |
| `404` | ID tidak ditemukan / bukan milik user | `{ "message": "Langganan tidak ditemukan" }` |

---

### 2.5 Hapus Langganan

Menghapus langganan secara permanen dari database.

```
DELETE /api/subscriptions/:id
```

**Headers:**

| Header | Value | Wajib |
|--------|-------|-------|
| `x-access-token` | `<accessToken>` | ✅ |

**Path Parameters:**

| Parameter | Type | Keterangan |
|-----------|------|------------|
| `id` | `string` | ID langganan (`_id`) |

**Contoh Request:**

```
DELETE /api/subscriptions/69db92472b7b74a7dfb8f2be
```

**Response Sukses — `200 OK`**

```json
{
  "message": "Langganan berhasil dihapus",
  "data": {
    "_id": "69db92472b7b74a7dfb8f2be",
    "name": "Netflix",
    "cost": 65000
  }
}
```

> 💡 **Tips untuk frontend:** Sebaiknya tampilkan dialog konfirmasi sebelum menghapus. Alternatif: ubah `status` ke `"cancelled"` via endpoint Update agar data tetap tersimpan untuk histori.

**Response Error:**

| Status | Kondisi | Response |
|--------|---------|----------|
| `404` | ID tidak ditemukan / bukan milik user | `{ "message": "Langganan tidak ditemukan" }` |

---

### 2.6 Daftar Kategori

Mengambil daftar kategori yang tersedia. **Tidak membutuhkan autentikasi.**

```
GET /api/subscriptions/categories
```

**Headers:** Tidak ada header khusus yang dibutuhkan.

**Response Sukses — `200 OK`**

```json
{
  "data": [
    "Hiburan",
    "Produktivitas",
    "Software Kerja",
    "Gaming",
    "Kesehatan & Olahraga",
    "Pendidikan",
    "Cloud & Storage",
    "Musik",
    "Berita & Majalah",
    "Lainnya"
  ]
}
```

> 💡 Gunakan daftar ini untuk mengisi dropdown/picker kategori saat user menambah atau mengedit langganan.

---

## 3. Dashboard Endpoints

> 🔑 Semua endpoint dashboard membutuhkan header `x-access-token`.

### 3.1 Ringkasan (Summary)

Mengambil ringkasan keseluruhan langganan user: total pengeluaran, jumlah per status, dan tagihan terdekat.

```
GET /api/dashboard/summary
```

**Headers:**

| Header | Value | Wajib |
|--------|-------|-------|
| `x-access-token` | `<accessToken>` | ✅ |

**Response Sukses — `200 OK`**

```json
{
  "totalMonthly": 519990,
  "totalYearly": 6239880,
  "activeCount": 3,
  "pausedCount": 0,
  "cancelledCount": 0,
  "totalCount": 3,
  "nextBilling": {
    "id": "69db92472b7b74a7dfb8f2be",
    "name": "Netflix",
    "cost": 65000,
    "date": "2026-04-15T00:00:00.000Z",
    "billingCycle": "monthly"
  }
}
```

| Field | Type | Keterangan |
|-------|------|------------|
| `totalMonthly` | `number` | Total pengeluaran bulanan (sudah dikonversi, semua siklus → per bulan) |
| `totalYearly` | `number` | Total pengeluaran tahunan (semua siklus → per tahun) |
| `activeCount` | `number` | Jumlah langganan aktif |
| `pausedCount` | `number` | Jumlah langganan dijeda |
| `cancelledCount` | `number` | Jumlah langganan dibatalkan |
| `totalCount` | `number` | Total semua langganan |
| `nextBilling` | `object\|null` | Tagihan terdekat. `null` jika tidak ada langganan aktif |

> 💡 **Untuk UI:** Tampilkan `totalMonthly` sebagai angka besar di atas dashboard:  
> *"Total Pengeluaran Bulanan Anda: **Rp 519.990**"*

---

### 3.2 Pengeluaran Per Kategori

Mengambil breakdown pengeluaran per kategori. Cocok untuk **Pie Chart** atau **Donut Chart**.

```
GET /api/dashboard/by-category
```

**Headers:**

| Header | Value | Wajib |
|--------|-------|-------|
| `x-access-token` | `<accessToken>` | ✅ |

**Response Sukses — `200 OK`**

```json
{
  "grandTotal": 519990,
  "categories": [
    {
      "name": "Software Kerja",
      "total": 400000,
      "percentage": 77,
      "count": 1,
      "subscriptions": [
        {
          "name": "Adobe Creative Cloud",
          "cost": 4800000,
          "monthlyCost": 400000,
          "billingCycle": "yearly"
        }
      ]
    },
    {
      "name": "Hiburan",
      "total": 65000,
      "percentage": 13,
      "count": 1,
      "subscriptions": [
        {
          "name": "Netflix",
          "cost": 65000,
          "monthlyCost": 65000,
          "billingCycle": "monthly"
        }
      ]
    },
    {
      "name": "Musik",
      "total": 54990,
      "percentage": 11,
      "count": 1,
      "subscriptions": [
        {
          "name": "Spotify",
          "cost": 54990,
          "monthlyCost": 54990,
          "billingCycle": "monthly"
        }
      ]
    }
  ]
}
```

| Field | Type | Keterangan |
|-------|------|------------|
| `grandTotal` | `number` | Total biaya bulanan semua kategori |
| `categories` | `array` | List kategori, diurutkan dari terbesar |
| `categories[].name` | `string` | Nama kategori |
| `categories[].total` | `number` | Total biaya bulanan kategori ini |
| `categories[].percentage` | `number` | Persentase dari grand total (0–100) |
| `categories[].count` | `number` | Jumlah langganan di kategori ini |
| `categories[].subscriptions` | `array` | Detail langganan dalam kategori ini |

> 💡 **Untuk Pie Chart:** Gunakan `categories[].percentage` untuk ukuran slice, dan `categories[].name` untuk label.

---

### 3.3 Tagihan Mendatang

Mengambil langganan yang akan jatuh tempo dalam N hari ke depan.

```
GET /api/dashboard/upcoming?days=7
```

**Headers:**

| Header | Value | Wajib |
|--------|-------|-------|
| `x-access-token` | `<accessToken>` | ✅ |

**Query Parameters:**

| Parameter | Type | Default | Keterangan |
|-----------|------|---------|------------|
| `days` | `number` | `7` | Jumlah hari ke depan |

**Contoh Request:**

```
GET /api/dashboard/upcoming?days=14
```

**Response Sukses — `200 OK`**

```json
{
  "days": 7,
  "count": 1,
  "data": [
    {
      "_id": "69db92472b7b74a7dfb8f2be",
      "name": "Netflix",
      "cost": 65000,
      "billingCycle": "monthly",
      "nextBillingDate": "2026-04-15T00:00:00.000Z",
      "category": "Hiburan",
      "status": "active",
      "notifyBefore": 3,
      "monthlyCost": 65000,
      "yearlyCost": 780000
    }
  ]
}
```

> 💡 Cocok untuk menampilkan banner *"Tagihan Netflix Rp 65.000 dalam 3 hari"* di halaman utama.

---

### 3.4 Pengeluaran Bulanan (12 Bulan)

Mengambil data pengeluaran per bulan selama **12 bulan terakhir**. Cocok untuk **Bar Chart** atau **Line Chart**.

```
GET /api/dashboard/monthly-spending
```

**Headers:**

| Header | Value | Wajib |
|--------|-------|-------|
| `x-access-token` | `<accessToken>` | ✅ |

**Response Sukses — `200 OK`**

```json
{
  "period": "12 bulan terakhir",
  "trend": {
    "percentage": 15,
    "direction": "up",
    "description": "Naik 15% dari bulan sebelumnya"
  },
  "data": [
    { "year": 2025, "month": 5, "label": "Mei 2025", "total": 0 },
    { "year": 2025, "month": 6, "label": "Jun 2025", "total": 0 },
    { "year": 2025, "month": 7, "label": "Jul 2025", "total": 0 },
    { "year": 2025, "month": 8, "label": "Agu 2025", "total": 120000 },
    { "year": 2025, "month": 9, "label": "Sep 2025", "total": 120000 },
    { "year": 2025, "month": 10, "label": "Okt 2025", "total": 120000 },
    { "year": 2025, "month": 11, "label": "Nov 2025", "total": 120000 },
    { "year": 2025, "month": 12, "label": "Des 2025", "total": 174990 },
    { "year": 2026, "month": 1, "label": "Jan 2026", "total": 174990 },
    { "year": 2026, "month": 2, "label": "Feb 2026", "total": 174990 },
    { "year": 2026, "month": 3, "label": "Mar 2026", "total": 519990 },
    { "year": 2026, "month": 4, "label": "Apr 2026", "total": 519990 }
  ]
}
```

| Field | Type | Keterangan |
|-------|------|------------|
| `period` | `string` | Deskripsi rentang waktu |
| `trend.percentage` | `number` | Persentase perubahan dari bulan lalu |
| `trend.direction` | `string` | `"up"`, `"down"`, atau `"stable"` |
| `trend.description` | `string` | Keterangan trend dalam Bahasa Indonesia |
| `data` | `array` | 12 item, satu per bulan |
| `data[].year` | `number` | Tahun |
| `data[].month` | `number` | Bulan (1–12) |
| `data[].label` | `string` | Label bulan dalam Bahasa Indonesia |
| `data[].total` | `number` | Total pengeluaran bulan tersebut (IDR) |

> 💡 **Untuk Line Chart:** Gunakan `data[].label` sebagai sumbu X, dan `data[].total` sebagai sumbu Y. Tampilkan `trend` sebagai badge di sudut chart.

---

## 4. Notification Endpoints

### 4.1 Jadwal Notifikasi

Mengambil jadwal notifikasi yang siap digunakan untuk menjadwalkan **local push notification** di React Native menggunakan Notifee atau expo-notifications.

```
GET /api/notifications/schedule
```

**Headers:**

| Header | Value | Wajib |
|--------|-------|-------|
| `x-access-token` | `<accessToken>` | ✅ |

**Response Sukses — `200 OK`**

```json
{
  "count": 2,
  "data": [
    {
      "subscriptionId": "69db92472b7b74a7dfb8f2c2",
      "name": "Spotify",
      "cost": 54990,
      "formattedCost": "Rp 54.990",
      "billingCycle": "monthly",
      "billingDate": "2026-04-20T00:00:00.000Z",
      "notifyDate": "2026-04-17T00:00:00.000Z",
      "notifyBefore": 3,
      "category": "Musik",
      "icon": null,
      "message": "Tagihan Spotify Rp 54.990 akan jatuh tempo dalam 3 hari",
      "title": "💳 Pengingat Tagihan Spotify"
    },
    {
      "subscriptionId": "69db92482b7b74a7dfb8f2c6",
      "name": "Adobe Creative Cloud",
      "cost": 4800000,
      "formattedCost": "Rp 4.800.000",
      "billingCycle": "yearly",
      "billingDate": "2026-06-01T00:00:00.000Z",
      "notifyDate": "2026-05-25T00:00:00.000Z",
      "notifyBefore": 7,
      "category": "Software Kerja",
      "icon": null,
      "message": "Tagihan Adobe Creative Cloud Rp 4.800.000 akan jatuh tempo dalam 7 hari",
      "title": "💳 Pengingat Tagihan Adobe Creative Cloud"
    }
  ]
}
```

| Field | Type | Keterangan |
|-------|------|------------|
| `subscriptionId` | `string` | ID langganan terkait |
| `name` | `string` | Nama layanan |
| `cost` | `number` | Biaya (angka) |
| `formattedCost` | `string` | Biaya terformat ("Rp 54.990") |
| `billingDate` | `string` | Tanggal tagihan (ISO) |
| `notifyDate` | `string` | **Tanggal notifikasi harus dikirim** (ISO) |
| `notifyBefore` | `number` | H-berapa sebelum tagihan |
| `title` | `string` | Judul notifikasi (siap pakai) |
| `message` | `string` | Isi notifikasi (siap pakai) |

> 💡 **Contoh penggunaan di React Native (Notifee):**
> ```javascript
> import notifee, { TriggerType } from '@notifee/react-native';
>
> const scheduleNotification = async (item) => {
>   await notifee.createTriggerNotification(
>     {
>       title: item.title,
>       body: item.message,
>       data: { subscriptionId: item.subscriptionId },
>     },
>     {
>       type: TriggerType.TIMESTAMP,
>       timestamp: new Date(item.notifyDate).getTime(),
>     }
>   );
> };
> ```

---

## 5. Premium Endpoints

### 5.1 Status Premium

Mengecek status premium user dan sisa kuota langganan gratis.

```
GET /api/premium/status
```

**Headers:**

| Header | Value | Wajib |
|--------|-------|-------|
| `x-access-token` | `<accessToken>` | ✅ |

**Response Sukses — `200 OK`**

**User Free Tier:**

```json
{
  "isPremium": false,
  "plan": "free",
  "expiresAt": null,
  "subscriptionLimit": 5,
  "currentSubscriptionCount": 3,
  "remainingSlots": 2
}
```

**User Premium:**

```json
{
  "isPremium": true,
  "plan": "monthly",
  "expiresAt": "2026-05-12T00:00:00.000Z",
  "subscriptionLimit": null,
  "currentSubscriptionCount": 12,
  "remainingSlots": null
}
```

| Field | Type | Keterangan |
|-------|------|------------|
| `isPremium` | `boolean` | `true` jika user premium aktif |
| `plan` | `string` | `"free"`, `"monthly"`, `"yearly"` |
| `expiresAt` | `string\|null` | Tanggal expired premium. `null` jika free |
| `subscriptionLimit` | `number\|null` | Batas langganan. `null` jika premium (unlimited) |
| `currentSubscriptionCount` | `number` | Jumlah langganan aktif + paused saat ini |
| `remainingSlots` | `number\|null` | Sisa slot yang tersedia. `null` jika premium |

> 💡 **Untuk UI Paywall:** Ketika `remainingSlots === 0`, tampilkan layar paywall saat user mencoba menambah langganan baru. Gunakan `SUBSCRIPTION_LIMIT_REACHED` error code dari endpoint Create Subscription sebagai trigger alternatif.

---

## 📦 Model Data

### Subscription Object

```typescript
interface Subscription {
  _id: string;                    // MongoDB ObjectId
  userId: string;                 // ID pemilik
  name: string;                   // Nama layanan
  cost: number;                   // Biaya (IDR)
  billingCycle: "weekly" | "monthly" | "yearly";
  nextBillingDate: string;        // ISO date string
  category: string;               // Salah satu dari daftar kategori
  icon: string | null;            // URL ikon
  notes: string;                  // Catatan
  status: "active" | "paused" | "cancelled";
  notifyBefore: number;           // 0-30 hari
  createdAt: string;              // ISO date string
  updatedAt: string;              // ISO date string
  monthlyCost: number;            // Virtual: biaya per bulan (dihitung server)
  yearlyCost: number;             // Virtual: biaya per tahun (dihitung server)
  id: string;                     // Alias _id
}
```

### Konversi Biaya (Virtual Fields)

Server menghitung `monthlyCost` dan `yearlyCost` secara otomatis:

| billingCycle | monthlyCost | yearlyCost |
|-------------|-------------|------------|
| `weekly` | `cost × 4.33` | `cost × 52` |
| `monthly` | `cost` | `cost × 12` |
| `yearly` | `cost ÷ 12` | `cost` |

### Kategori yang Tersedia

| No | Kategori |
|----|----------|
| 1 | Hiburan |
| 2 | Produktivitas |
| 3 | Software Kerja |
| 4 | Gaming |
| 5 | Kesehatan & Olahraga |
| 6 | Pendidikan |
| 7 | Cloud & Storage |
| 8 | Musik |
| 9 | Berita & Majalah |
| 10 | Lainnya |

---

## ❌ Kode Error

### HTTP Status Codes

| Status | Keterangan |
|--------|------------|
| `200` | Berhasil |
| `201` | Berhasil dibuat (Create) |
| `400` | Request tidak valid (validasi gagal) |
| `401` | Tidak terautentikasi (token expired/invalid) |
| `403` | Tidak memiliki akses (token kosong / batas tercapai) |
| `404` | Data tidak ditemukan |
| `500` | Server error |

### Custom Error Codes

| Code | Keterangan | Kapan Muncul |
|------|------------|--------------|
| `SUBSCRIPTION_LIMIT_REACHED` | Batas langganan free tier tercapai | POST `/api/subscriptions` saat user free sudah punya 5 |

### Format Response Error

Semua error mengikuti format:

```json
{
  "message": "Pesan error yang bisa ditampilkan ke user"
}
```

Untuk error validasi (status `400`):

```json
{
  "message": "Validasi gagal",
  "errors": [
    "Nama layanan wajib diisi",
    "Biaya harus berupa angka positif"
  ]
}
```

Untuk error batas langganan (status `403`):

```json
{
  "message": "Batas langganan gratis tercapai (5). Upgrade ke Premium untuk langganan tanpa batas.",
  "code": "SUBSCRIPTION_LIMIT_REACHED",
  "currentCount": 5,
  "limit": 5
}
```

---

## 🧪 Contoh Penggunaan (React Native / Axios)

### Setup Axios

```javascript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: otomatis tambahkan token ke setiap request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) {
    config.headers['x-access-token'] = token;
  }
  return config;
});

// Interceptor: handle token expired
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, coba refresh
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      try {
        const { data } = await axios.post('/api/auth/refreshtoken', {
          refreshToken,
        });
        await AsyncStorage.setItem('accessToken', data.accessToken);
        // Retry original request
        error.config.headers['x-access-token'] = data.accessToken;
        return api(error.config);
      } catch (refreshError) {
        // Refresh juga gagal, redirect ke login
        await AsyncStorage.clear();
        // navigation.navigate('Login');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Contoh Pemanggilan API

```javascript
// Login
const login = async (username, password) => {
  const { data } = await api.post('/auth/signin', { username, password });
  await AsyncStorage.setItem('accessToken', data.accessToken);
  await AsyncStorage.setItem('refreshToken', data.refreshToken);
  return data;
};

// Fetch subscriptions
const getSubscriptions = async (status = null) => {
  const params = status ? { status } : {};
  const { data } = await api.get('/subscriptions', { params });
  return data.data; // array of subscriptions
};

// Create subscription
const createSubscription = async (subscription) => {
  const { data } = await api.post('/subscriptions', subscription);
  return data.data;
};

// Get dashboard summary
const getDashboardSummary = async () => {
  const { data } = await api.get('/dashboard/summary');
  return data;
};

// Get monthly spending chart data
const getMonthlySpendings = async () => {
  const { data } = await api.get('/dashboard/monthly-spending');
  return data;
};

// Check premium status
const getPremiumStatus = async () => {
  const { data } = await api.get('/premium/status');
  return data;
};
```

---

> 📌 **Kontak:** Jika ada pertanyaan terkait API, hubungi tim backend.
