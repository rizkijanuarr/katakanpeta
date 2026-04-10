# KatakanPeta 

KatakanPeta adalah platform untuk mencari data calon klien dari Google Maps secara otomatis.

Fokus utama: **Backend terlebih dahulu**, untuk **Frontend** nanti saja.

---

# Stack

Backend:

* Express.js
* TypeScript (strict)
* PostgreSQL (NeonDB)
* Runtime: Bun
* Auth: JWT
* Architecture: Clean Architecture
* API Style: REST

Frontend:

* React
* Shadcn UI
* Tailwind
* Runtime: Bun

---

# Kondisi Saat Ini

Sudah tersedia:

* Migration database ✅
* Auth (login, register, forgot-password) ✅
* Role USER & ADMIN sudah ada ✅

Belum dibuat:

* Users module
* Transactions module
* Subscription middleware
* Scraper module
* Dashboard module
* Admin module

---

# Data Login

ADMIN
{
"email": "[admin@gmail.com]",
"password": "password123"
}

USER
{
"email": "[user@gmail.com]",
"password": "password123"
}

---

# Perbaikan Forgot Password

Ubah logic menjadi:

* Request: email + password baru
* Jika email terdaftar → update password
* Tidak perlu kirim email asli

Endpoint:
POST /api/v1/auth/forgot-password

---

# Role AI

Kamu adalah Fullstack Engineer

Tugas:

1. Fokus backend terlebih dahulu
2. Setelah backend selesai baru kerjakan frontend
3. Baca folder backend sebelum memulai
4. Ikuti arsitektur yang sudah ada
5. Gunakan repository pattern + service layer
6. Gunakan dependency injection
7. Gunakan enum di backend (database tetap string)
8. Jangan hardcode credential
9. Gunakan environment variables

---

# Testing Rules

Setiap satu fitur endpoint selesai:

1. Test menggunakan CURL di terminal langsung
   - Jika bug → perbaiki
   - Jika sukses → commit langsung
2. Push ke GitHub

Gunakan conventional commit:

feat:
fix:
refactor:
chore:

---

# Struktur Project

katakanpeta/
├── backend/
└── frontend/

---

# Target Backend Features

1. Authentication
2. Role Based Access (ADMIN, USER)
3. Subscription system
4. Scraper Google Maps (Serper)
5. Logging scrape
6. Admin approval
7. Dashboard user & admin

---

# Middleware

* authMiddleware (JWT)
* roleMiddleware
* subscriptionMiddleware
* errorHandlerMiddleware

---

# API List

Auth
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/forgot-password
GET  /api/v1/me

Dashboard
GET /api/v1/dashboard

Subscription
POST /api/v1/transactions/subscribe
GET  /api/v1/transactions/me

Scraper
POST /api/v1/scrape

Users (Admin)
GET    /api/v1/users
POST   /api/v1/users
GET    /api/v1/users/:id
PUT    /api/v1/users/:id
DELETE /api/v1/users/:id

Admin Dashboard
GET /api/v1/admin/dashboard

Transactions Admin
GET  /api/v1/transactions
POST /api/v1/transactions/:id/approve
POST /api/v1/transactions/:id/reject

---

# Flow Subscription

User register
→ subscribe
→ transaction PENDING
→ admin approve
→ status ACTIVE
→ end_date +30 days

---

# Flow Scraper

User request scrape
→ cek subscription aktif
→ call Serper API
→ simpan scrape_logs
→ return data

---

# Contoh kode Scrapper
- SERPER_API_KEY=70b6e0bfbc9079ef7860c4c088a777135e1bc68a

- Contoh Kode:

```typescript
const myHeaders = new Headers();
myHeaders.append("X-API-KEY", "70b6e0bfbc9079ef7860c4c088a777135e1bc68a");
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "q": "construction chicago"
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

try {
  const response = await fetch("https://google.serper.dev/maps", requestOptions);
  const result = await response.text();
  console.log(result)
} catch (error) {
  console.error(error);
};
```

- Contoh Response :
```json
{
    "searchParameters": {
        "q": "construction chicago",
        "type": "maps",
        "num": 10,
        "page": 1,
        "engine": "google"
    },
    "ll": "@40.9710005,-89.262644,8z",
    "places": [
        {
            "position": 1,
            "title": "Chicago Constructions",
            "address": "141 W Jackson Blvd, Chicago, IL 60604",
            "latitude": 41.878023,
            "longitude": -87.632401,
            "rating": 4.6,
            "ratingCount": 31,
            "type": "General contractor",
            "types": [
                "General contractor"
            ],
            "website": "http://www.chicagoconstructions.com/",
            "phoneNumber": "(312) 313-2315",
            "openingHours": {
                "Thursday": "Open 24 hours",
                "Friday": "Open 24 hours",
                "Saturday": "Closed",
                "Sunday": "Closed",
                "Monday": "Open 24 hours",
                "Tuesday": "Open 24 hours",
                "Wednesday": "Open 24 hours"
            },
            "bookingLinks": [
                "https://calendly.com/constructions/site-visit-with-client"
            ],
            "thumbnailUrl": "https://lh3.googleusercontent.com/gps-cs-s/AHVAweo9jemnaWVrG9YdJhYbI13z5SGdV3hiXamiPqbo1ODoKOXYknsTOrVKFLGc-tkhnH5v-nurI_OmXcYBQUudDGy8DV5l3XFNrOlYSmPIK_RmxsRuANSXxAJHQ_PQvT5DiDK9MfLpFtRb-fTP",
            "cid": "16079726055744600223",
            "fid": "0x880e2d579de85293:0xdf26a9a7563ff89f",
            "placeId": "ChIJk1LonVctDogRn_g_VqepJt8"
        },
        ...
    ],
    "credits": 3
}
```
