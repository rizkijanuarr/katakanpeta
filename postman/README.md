# KatakanPeta API - Postman Collection

## 📁 File Structure

```
postman/
├── katakanpeta-api.postman_collection.json      # Full API collection
├── katakanpeta-environment.postman_environment.json  # Environment variables
└── README.md                                    # This file
```

---

## 🚀 Cara Import ke Postman

### 1. Import Collection
1. Buka Postman
2. Klik **Import** (tombol di kiri atas)
3. Pilih file `katakanpeta-api.postman_collection.json`
4. Collection **"KatakanPeta API"** akan muncul dengan 5 folder

### 2. Import Environment
1. Klik **Environments** di sidebar kiri
2. Klik **Import**
3. Pilih file `katakanpeta-environment.postman_environment.json`
4. Aktifkan environment **"KatakanPeta Environment"**

### 3. Setup
- Pastikan backend running: `cd backend && bun dev`
- Environment sudah diset `BASE_URL = http://localhost:3000`

---

## 📂 Folder Structure

### 1. **Auth** (Authentication)
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/v1/auth/register` | POST | ❌ | Register user baru |
| `/api/v1/auth/login` | POST | ❌ | Login & dapat token (auto-save) |
| `/api/v1/auth/forgot-password` | POST | ❌ | Reset password |
| `/api/v1/me` | GET | ✅ | Get profil user yang sedang login |

**💡 Tips:**
- Setelah login, token otomatis tersimpan di variable `{{TOKEN}}`
- Role user juga tersimpan di `{{USER_ROLE}}`

---

### 2. **Users (Admin)**
| Endpoint | Method | Auth | Role | Description |
|----------|--------|------|------|-------------|
| `/api/v1/users` | GET | ✅ | ADMIN | Get semua users |
| `/api/v1/users` | POST | ✅ | ADMIN | Create user baru |
| `/api/v1/users/:id` | GET | ✅ | ADMIN/USER | Get user by ID |
| `/api/v1/users/:id` | PUT | ✅ | ADMIN | Update user |
| `/api/v1/users/:id` | DELETE | ✅ | ADMIN | Delete user |

**💡 Tips:**
- Set `{{USER_ID}}` di environment atau ambil dari response Get All Users

---

### 3. **Transactions** (Subscription)
| Endpoint | Method | Auth | Role | Description |
|----------|--------|------|------|-------------|
| `/api/v1/transactions/subscribe` | POST | ✅ | USER/ADMIN | Request subscription (PENDING) |
| `/api/v1/transactions/me` | GET | ✅ | USER/ADMIN | Get transaksi user ini |
| `/api/v1/transactions` | GET | ✅ | ADMIN | Get semua transaksi |
| `/api/v1/transactions/:id/approve` | POST | ✅ | ADMIN | Approve transaksi → ACTIVE (+30 hari) |
| `/api/v1/transactions/:id/reject` | POST | ✅ | ADMIN | Reject transaksi → REJECTED |

**💡 Flow Subscription:**
1. User subscribe → status PENDING
2. Admin approve → status ACTIVE, end_date +30 days
3. User bisa pakai scraper

---

### 4. **Scraper**
| Endpoint | Method | Auth | Role | Description |
|----------|--------|------|------|-------------|
| `/api/v1/scrape` | POST | ✅ | USER/ADMIN | Scrape Google Maps (butuh subscription ACTIVE) |
| `/api/v1/scrape/logs` | GET | ✅ | USER/ADMIN | Get history scrape user ini |

**Request Body (Scrape):**
```json
{
  "query": "restaurant jakarta",
  "num": 10,
  "page": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Scraping completed successfully",
  "data": {
    "query": "restaurant jakarta",
    "totalResults": 20,
    "places": [...],
    "creditsUsed": 3
  }
}
```

**💡 Tips:**
- Query: kata kunci pencarian Google Maps
- num: jumlah results (default 10)
- page: halaman (default 1)
- Harus punya subscription ACTIVE dulu!

---

### 5. **Dashboard**
| Endpoint | Method | Auth | Role | Description |
|----------|--------|------|------|-------------|
| `/api/v1/dashboard` | GET | ✅ | USER/ADMIN | User dashboard stats |
| `/api/v1/admin/dashboard` | GET | ✅ | ADMIN | Admin dashboard stats |

**User Dashboard Response:**
```json
{
  "success": true,
  "data": {
    "subscription": {
      "status": "ACTIVE",
      "start_date": "2026-04-10T09:37:01.873Z",
      "end_date": "2026-05-10T09:37:01.873Z",
      "days_remaining": 30
    },
    "total_scrapes": 2,
    "recent_scrapes": [...]
  }
}
```

**Admin Dashboard Response:**
```json
{
  "success": true,
  "data": {
    "total_users": 2,
    "total_transactions": 3,
    "pending_approvals": 0,
    "active_subscriptions": 2,
    "total_scrapes": 2,
    "recent_transactions": [...],
    "recent_users": [...]
  }
}
```

---

## 🔑 Default Credentials

### Admin
```json
{
  "email": "admin@gmail.com",
  "password": "password123"
}
```

### User
```json
{
  "email": "user@gmail.com",
  "password": "password123"
}
```

---

## 📝 Environment Variables

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `BASE_URL` | `http://localhost:3000` | Backend server URL |
| `TOKEN` | *(empty)* | JWT token (auto-set after login) |
| `USER_EMAIL` | `user@gmail.com` | Default user email |
| `USER_PASSWORD` | `password123` | Default user password |
| `ADMIN_EMAIL` | `admin@gmail.com` | Default admin email |
| `ADMIN_PASSWORD` | `password123` | Default admin password |
| `USER_ID` | *(empty)* | User ID untuk testing |
| `TRANSACTION_ID` | *(empty)* | Transaction ID untuk testing |
| `USER_ROLE` | *(empty)* | Role user (auto-set after login) |

---

## 🧪 Quick Test Flow

### 1. Login & Get Token
```
1. Buka folder "Auth" → "Login"
2. Kirim request
3. Token otomatis tersimpan
```

### 2. Subscribe
```
1. Buka folder "Transactions" → "Subscribe"
2. Kirim request
3. Copy transaction ID dari response
4. Paste ke variable TRANSACTION_ID
```

### 3. Approve (sebagai Admin)
```
1. Login sebagai admin
2. Buka "Transactions" → "Approve Transaction"
3. Kirim request
```

### 4. Scrape
```
1. Login kembali sebagai user
2. Buka "Scraper" → "Scrape Google Maps"
3. Kirim request dengan query yang diinginkan
```

### 5. Check Dashboard
```
1. User: "Dashboard" → "User Dashboard"
2. Admin: "Dashboard" → "Admin Dashboard"
```

---

## ⚠️ Notes

- Semua endpoint yang butuh auth akan otomatis pakai `{{TOKEN}}`
- Login endpoint otomatis save token ke environment
- Role-based access: Admin bisa akses semua, User terbatas
- Scraper butuh subscription ACTIVE
- Subscription aktif 30 hari setelah di-approve

---

## 📊 Complete API List

Total: **18 endpoints**

- **Auth**: 4 endpoints
- **Users (Admin)**: 5 endpoints
- **Transactions**: 5 endpoints
- **Scraper**: 2 endpoints
- **Dashboard**: 2 endpoints

---

## 🛠️ Troubleshooting

### "Unauthorized" error
- Pastikan sudah login dan token tersimpan
- Cek apakah token expired (24 jam)

### "Active subscription required" error
- User harus subscribe dulu
- Admin harus approve subscription tersebut

### "Connection refused" error
- Pastikan backend running: `cd backend && bun dev`
- Cek BASE_URL di environment

---

**Dibuat:** 10 April 2026  
**Version:** 1.0.0  
**Backend Stack:** Express.js + TypeScript + PostgreSQL (NeonDB) + Bun
