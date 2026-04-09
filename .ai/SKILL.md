# KatakanPeta

KatakanPeta adalah platform untuk mencari data calon klien dari Google Maps secara otomatis, menggantikan proses manual menjadi lebih efisien.

---

# Role AI

* Kamu adalah seorang Fullstack Engineer.
* Bangun backend dan frontend production-ready untuk aplikasi SaaS bernama "KatakanPeta".
* Semua arsitektur sudah disediakan, kamu hanya perlu mengikuti rules yang ada.
* Lakukan eksekusi secara berurutan (Backend terlebih dahulu, kemudian Frontend).
* Baca seluruh isi folder backend dan frontend sebelum mengeksekusi.
* Jika terdapat Enum, buatkan file Enum di backend (database tetap menggunakan string).
* Frontend hanya mengonsumsi endpoint yang sudah dibuat.
* Frontend menggunakan ShadcnUI.
* Frontend dan backend menggunakan runtime Bun.

---

# Execution Rules

1. Selalu baca Backend / Frontend terlebih dahulu
2. Pastikan semua endpoint dibuat sesuai SPEC API
3. Gunakan dan ikuti architecture dan penulisan kode yang sudah ada
4. Gunakan TypeScript strict mode
5. Gunakan environment variables
6. Jangan hardcode credential
7. Gunakan reusable service
8. Gunakan dependency injection
9. Gunakan repository pattern

---

# Struktur Proyek

katakanpeta/
│
├── frontend/
└── backend/

---

# Tujuan Backend

Fitur:

* Autentikasi pengguna (Sign in, Sign up, Forgot Password)
* Role Based Access (ADMIN, USER)
* Subscription bulanan (approve manual)
* Scraper data Google Maps (Serper.dev)
* Logging penggunaan
* Admin approval pembayaran
* Dashboard Admin & User

---

# Tech Stack

* Runtime: Bun
* Bahasa: TypeScript
* Framework: Express.js
* Database: PostgreSQL (Neon DB) (https://neon.com/)
* Autentikasi: JWT
* Arsitektur: Clean Architecture
* API Style: REST

---

# ERD Database

USERS
│
├── TRANSACTIONS
│
└── SCRAPE_LOGS

---

# Tabel Database

## users

* id (string, PK)
* name (string)
* email (string)
* password (string)
* role (string) → ADMIN | USER
* active (boolean)
* createdDate
* modifiedDate
* deletedDate

---

## transactions

* id (string, PK)
* user_id (FK users.id)
* status (string) → PENDING | ACTIVE | EXPIRED | REJECTED
* start_date (datetime)
* end_date (datetime)
* active (boolean)
* createdDate
* modifiedDate
* deletedDate

Status Rules:

PENDING  : User baru checkout
ACTIVE   : Admin sudah approve
EXPIRED  : Subscription habis
REJECTED : Pembayaran ditolak

---

## scrape_logs

* id (string, PK)
* user_id (FK users.id)
* query (string)
* request_body (json)
* response_body (json)
* active (boolean)
* createdDate
* modifiedDate
* deletedDate

---

# Middleware yang harus dibuat

* authMiddleware (JWT)
* roleMiddleware (ADMIN, USER)
* subscriptionMiddleware
* errorHandlerMiddleware

---

# SPEC API

## Auth

POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/forgot-password
GET  /api/v1/me

---

## Dashboard User

GET /api/v1/dashboard

Return:

* transaksi terakhir milik user

---

## Subscription

POST /api/v1/transactions/subscribe
GET  /api/v1/transactions/me

---

## Scraper

POST /api/v1/scrape

Flow:

* cek subscription aktif
* panggil API Google Maps
* simpan scrape_logs
* return data

---

## Admin

### User Management

GET    /api/v1/users
POST   /api/v1/users
GET    /api/v1/users/:id
PUT    /api/v1/users/:id
DELETE /api/v1/users/:id

---

### Admin Dashboard

GET /api/v1/admin/dashboard

Return:

* total user
* total scrape logs
* transaksi terakhir

---

### Transactions

GET  /api/v1/transactions
POST /api/v1/transactions/:id/approve
POST /api/v1/transactions/:id/reject

---

# Flow Subscription

User register
↓
User klik subscribe
↓
Insert transaction (PENDING)
↓
User bayar QRIS
↓
User konfirmasi via WhatsApp
↓
Admin approve
↓
Update:

status = ACTIVE
start_date = now
end_date = now + 30 days
active = true

---

# Flow Scraper

User request scrape
↓
Cek subscription aktif
↓
Call API scraper
↓
Save scrape_logs
↓
Return response

---

# Behavior Endpoint Scraper

POST /api/v1/scrape

Request:

[
{ "q": "coffee shop surabaya" }
]

Langkah:

1. Validasi JWT
2. Cek subscription aktif
3. Panggil API scraper
4. Simpan scrape_logs
5. Return hasil

---

# External API SERPER

- Gunakan environment variable:

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
        {
            "position": 2,
            "title": "Big City Construction Inc.",
            "address": "1925 W Hubbard St, Chicago, IL 60622",
            "latitude": 41.889482,
            "longitude": -87.6755263,
            "rating": 4.5,
            "ratingCount": 98,
            "type": "Construction company",
            "types": [
                "Construction company"
            ],
            "website": "https://www.bigcityconstruction.com/",
            "phoneNumber": "(312) 421-4447",
            "openingHours": {
                "Thursday": "9 AM–4 PM",
                "Friday": "9 AM–4 PM",
                "Saturday": "Closed",
                "Sunday": "Closed",
                "Monday": "9 AM–4 PM",
                "Tuesday": "9 AM–4 PM",
                "Wednesday": "9 AM–4 PM"
            },
            "thumbnailUrl": "https://lh3.googleusercontent.com/gps-cs-s/AHVAwep7Rqh4whZYIctY4AsNPuO8U49QHF8U_Gj_msvA9j9f3XawITo9gYj0U_KyBtFLxqR4ddpUl2_4Vp0gsoZnqiUjdWy2G7L0cybfLevAQpdKRUFoTOX9TcXvOXTzuhK8FTWqNuz9",
            "cid": "7505916888086801842",
            "fid": "0x880e2d3659068033:0x682a5fa44404edb2",
            "placeId": "ChIJM4AGWTYtDogRsu0ERKRfKmg"
        },
        {
            "position": 3,
            "title": "Chicago Building Group Inc",
            "address": "2649 S Kostner Ave, Chicago, IL 60623",
            "latitude": 41.8426611,
            "longitude": -87.7339891,
            "rating": 4.8,
            "ratingCount": 130,
            "type": "General contractor",
            "types": [
                "General contractor",
                "Design engineer",
                "Roofing contractor",
                "Siding contractor"
            ],
            "website": "http://chicagobuildinggroupinc.com/",
            "phoneNumber": "(773) 396-4930",
            "openingHours": {
                "Thursday": "Open 24 hours",
                "Friday": "Open 24 hours",
                "Saturday": "Open 24 hours",
                "Sunday": "Open 24 hours",
                "Monday": "Open 24 hours",
                "Tuesday": "Open 24 hours",
                "Wednesday": "Open 24 hours"
            },
            "thumbnailUrl": "https://lh3.googleusercontent.com/gps-cs-s/AHVAweo-JsoEpn7aRXeddS1BFJ2m-2fZDnEnwPmWX0o3ysDJo9kvqrHG_gS7doR7yoJrWizrOew92RVCeBc6OU36kLBQ5MkFJsiHT6azVSSxm2cK5eir23QWpz5ioAkubx5hZV1tD9ZR1l3cBhw",
            "cid": "2851697814575067933",
            "fid": "0x880e33c2ff4c12b9:0x2793440dac81331d",
            "placeId": "ChIJuRJM_8IzDogRHTOBrA1Ekyc"
        },
        {
            "position": 4,
            "title": "IRPINO Construction",
            "address": "4234 N Broadway, Chicago, IL 60613",
            "latitude": 41.9593177,
            "longitude": -87.6538676,
            "rating": 5,
            "ratingCount": 45,
            "type": "Construction company",
            "types": [
                "Construction company"
            ],
            "website": "http://www.irpinoconstruction.com/",
            "phoneNumber": "(773) 525-7345",
            "openingHours": {
                "Thursday": "10 AM–5 PM",
                "Friday": "10 AM–5 PM",
                "Saturday": "10 AM–4 PM",
                "Sunday": "Closed",
                "Monday": "10 AM–5 PM",
                "Tuesday": "10 AM–5 PM",
                "Wednesday": "10 AM–5 PM"
            },
            "thumbnailUrl": "https://lh3.googleusercontent.com/gps-cs-s/AHVAwep0gnybD9glC-dsdG7977BWzLSdTnbNdfhAzqAdd6rVta1xytDW_DdFWBTywV7k4lupc02BOaBDLXF7zbvbiYwouoS5WuP2dtwKP95r6OJBFiHgDpYLS0oaNkK2UOOr7j8wIto4cg",
            "cid": "6799713265051159134",
            "fid": "0x880fd2152b505f2b:0x5e5d6f3029e2ca5e",
            "placeId": "ChIJK19QKxXSD4gRXsriKTBvXV4"
        },
        {
            "position": 5,
            "title": "Skyline Construction",
            "address": "1 E Wacker Dr, Chicago, IL 60601",
            "latitude": 41.8866984,
            "longitude": -87.627736,
            "rating": 5,
            "ratingCount": 13,
            "type": "Construction company",
            "types": [
                "Construction company"
            ],
            "website": "https://www.skylineconstruction.build/illinois/",
            "phoneNumber": "(312) 815-5300",
            "openingHours": {
                "Thursday": "8 AM–5 PM",
                "Friday": "8 AM–5 PM",
                "Saturday": "Closed",
                "Sunday": "Closed",
                "Monday": "8 AM–5 PM",
                "Tuesday": "8 AM–5 PM",
                "Wednesday": "8 AM–5 PM"
            },
            "thumbnailUrl": "https://lh3.googleusercontent.com/gps-cs-s/AHVAwerux-i1p2w4Xaw15ZbStgwNv-x4i35H2US0XBBYHJJbOoH3PheIFgUt-cfgJ_yxpF6ihYdf5iaF8kwIZbk274D-s1mz3eBZlrclXg-3Jb3jsqH_iK4RrhbstRg7EHunFcTf2nUPdw",
            "cid": "13377796034150077000",
            "fid": "0x880e2de2919c848f:0xb9a77a9d4d251248",
            "placeId": "ChIJj4SckeItDogRSBIlTZ16p7k"
        },
        {
            "position": 6,
            "title": "JC General Construction, Inc.",
            "address": "159 N Sangamon St Suite 200, Chicago, IL 60607",
            "latitude": 41.8860253,
            "longitude": -87.6492145,
            "rating": 4.6,
            "ratingCount": 25,
            "type": "General contractor",
            "types": [
                "General contractor"
            ],
            "website": "https://contractorjc.com/",
            "phoneNumber": "(773) 923-1158",
            "openingHours": {
                "Thursday": "8 AM–4 PM",
                "Friday": "8 AM–4 PM",
                "Saturday": "Closed",
                "Sunday": "Closed",
                "Monday": "8 AM–4 PM",
                "Tuesday": "8 AM–4 PM",
                "Wednesday": "8 AM–4 PM"
            },
            "bookingLinks": [
                "http://www.contractorjc.com/"
            ],
            "thumbnailUrl": "https://lh3.googleusercontent.com/gps-cs-s/AHVAwepy1H50H_IEyQwg7UJ6SbEDv9YjlRYfmRGNPmjkC-hLT1hSiQvzzKCZVp0cghJUuyQ1J3iwDJC2E2OPMIUfFPt6_DPff7GRvOjbVIE_2rmfwP6DZ1ra_ZrlNlTGnYcVI1D_oOnR",
            "cid": "12375908143464763987",
            "fid": "0x880fcd47e45a0b7d:0xabc00ee2d814d253",
            "placeId": "ChIJfQta5EfND4gRU9IU2OIOwKs"
        },
        {
            "position": 7,
            "title": "Athens Construction Co., Inc.",
            "address": "613 W 16th St, Chicago, IL 60616",
            "latitude": 41.859758,
            "longitude": -87.64244699999999,
            "rating": 4.1,
            "ratingCount": 14,
            "type": "Construction company",
            "types": [
                "Construction company",
                "General contractor"
            ],
            "website": "https://www.athensconstruction.com/",
            "phoneNumber": "(312) 243-2727",
            "thumbnailUrl": "https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=vdQDhFg3qO_whH91RywqMg&cb_client=search.gws-prod.gps&w=80&h=92&yaw=163.07797&pitch=0&thumbfov=100",
            "cid": "7726330082514533824",
            "fid": "0x880e2cf41131f3c7:0x6b39704631b17dc0",
            "placeId": "ChIJx_MxEfQsDogRwH2xMUZwOWs"
        },
        {
            "position": 8,
            "title": "Maya Construction Group",
            "address": "4408 N Milwaukee Ave, Chicago, IL 60630",
            "latitude": 41.9609009,
            "longitude": -87.75491439999999,
            "rating": 4.8,
            "ratingCount": 101,
            "type": "General contractor",
            "types": [
                "General contractor",
                "Bathroom remodeler",
                "Kitchen remodeler",
                "Remodeler"
            ],
            "website": "https://mayaconstructioninc.com/",
            "phoneNumber": "(773) 305-5789",
            "openingHours": {
                "Thursday": "8 AM–6 PM",
                "Friday": "8 AM–6 PM",
                "Saturday": "Closed",
                "Sunday": "9 AM–3 PM",
                "Monday": "8 AM–6 PM",
                "Tuesday": "8 AM–6 PM",
                "Wednesday": "8 AM–6 PM"
            },
            "bookingLinks": [
                "https://mayaconstructioninc.com/contact-us/"
            ],
            "thumbnailUrl": "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqRN5_ExU109t9u6GiHZGwuKqrcy9dSHqpCJsZcgWhDMTYAETRiyFx_v5HmNOkH_u4su4oWPu6v1Gk_bLu8Gl1E4nhmW38gO89RmGjaB771vTXsUViE3xfiW8L9BnUAHxCpQE-NmQ",
            "cid": "16577543270961033521",
            "fid": "0x880e2cd2b1412065:0xe60f43c5fa4cb131",
            "placeId": "ChIJZSBBsdIsDogRMbFM-sVDD-Y"
        },
        {
            "position": 9,
            "title": "Budget Construction Company - Chicago's Renovation and Remodeling Experts",
            "address": "5334 N Kedzie Ave, Chicago, IL 60625",
            "latitude": 41.9786608,
            "longitude": -87.7090594,
            "rating": 4,
            "ratingCount": 88,
            "type": "General contractor",
            "types": [
                "General contractor",
                "Bathroom remodeler",
                "Construction company",
                "Home builder",
                "Kitchen remodeler",
                "Remodeler"
            ],
            "website": "https://budgetconstructioncompany.com/",
            "phoneNumber": "(773) 283-9200",
            "openingHours": {
                "Thursday": "9 AM–6 PM",
                "Friday": "9 AM–6 PM",
                "Saturday": "10 AM–1 PM",
                "Sunday": "Closed",
                "Monday": "9 AM–6 PM",
                "Tuesday": "9 AM–6 PM",
                "Wednesday": "9 AM–6 PM"
            },
            "bookingLinks": [
                "https://budgetconstructioncompany.com/request-quote/",
                "https://link.mylovelystartup.com/widget/group/3pHiD0hAYlCGy7npDtSF?rwg_token=AFd1xnGkz-GxLdhOFF6P1jQ11B85flGPVTBeiV9YYWeUgxMJhzYSCRUc1hyHAbhALAfBCpXQZhCzLNpL2wooQrLYj3nRyz7m_w%3D%3D"
            ],
            "thumbnailUrl": "https://lh3.googleusercontent.com/gps-cs-s/AHVAwep2EZbnVHVC-mRxMhUaPMi5x1kNdrQ79kPv_hzDReZyfzrOKnNrY5pTyYDakZdmbHLYKlKPHX04KnWOp_j_VrHatH4q6s65XEuE_BAi3csn37yGauF6Lk0R89CZxk7gumqBHqDPkY3QKrxx",
            "cid": "15033577659776564825",
            "fid": "0x880fce67a33593ab:0xd0a1ff3af23afe59",
            "placeId": "ChIJq5M1o2fOD4gRWf468jr_odA"
        },
        {
            "position": 10,
            "title": "Chicago Grace Construction",
            "latitude": 40.971000499999995,
            "longitude": -89.262644,
            "rating": 4.8,
            "ratingCount": 77,
            "type": "Roofing contractor",
            "types": [
                "Roofing contractor",
                "Service establishment",
                "Masonry contractor",
                "Pressure washing service",
                "Siding contractor"
            ],
            "website": "https://www.cgcroofing.com/",
            "phoneNumber": "(708) 639-5457",
            "openingHours": {
                "Thursday": "Open 24 hours",
                "Friday": "Open 24 hours",
                "Saturday": "Open 24 hours",
                "Sunday": "Closed",
                "Monday": "Open 24 hours",
                "Tuesday": "Open 24 hours",
                "Wednesday": "Open 24 hours"
            },
            "bookingLinks": [
                "https://www.cgcroofing.com/contact"
            ],
            "thumbnailUrl": "https://lh3.googleusercontent.com/gps-cs-s/AHVAwert_Uof-g_mnhZtKxlCiqb26QYCfqY818h4iEW1oDuf6TQdtPXCAHMKk-72z-frfDuwoHdgyBVmu_Bz-2s28d4VrxCnicyT-yeGe4To1wb6JlbJJbuiwrhAJ0PFxJ5CJWzwNovI",
            "cid": "17437756182178433655",
            "fid": "0x880e393f4f9b2597:0xf1ff5adbc69e0a77",
            "placeId": "ChIJlyWbTz85DogRdwqextta__E"
        },
        {
            "position": 11,
            "title": "MK Construction & Builders, Inc.",
            "address": "2000 N Milwaukee Ave, Chicago, IL 60647",
            "latitude": 41.917680999999995,
            "longitude": -87.68915799999999,
            "rating": 4.1,
            "ratingCount": 51,
            "type": "Home builder",
            "types": [
                "Home builder",
                "Bathroom remodeler",
                "Carport and pergola builder",
                "Contractor",
                "Kitchen remodeler"
            ],
            "website": "https://mkconstructioninc.net/",
            "phoneNumber": "(773) 817-1861",
            "openingHours": {
                "Thursday": "9 AM–5 PM",
                "Friday": "9 AM–5 PM",
                "Saturday": "Closed",
                "Sunday": "Closed",
                "Monday": "9 AM–5 PM",
                "Tuesday": "9 AM–5 PM",
                "Wednesday": "9 AM–5 PM"
            },
            "thumbnailUrl": "https://lh3.googleusercontent.com/gps-cs-s/AHVAwepyZypxsu5o6rOTL6AqPMe4tLXLMGS5WO--IH63cZVCYmrPJEJyJPVvWiqvv4TdUDlfB-uC3oWO1xFyLomYblYqcKZvYBYdqd5YCbgFieUnRKPtIvw1FaYDwWE50AWokzjQTcJL",
            "cid": "1212619955689485751",
            "fid": "0x880fd2984157dabf:0x10d4176cca6bf5b7",
            "placeId": "ChIJv9pXQZjSD4gRt_VrymwX1BA"
        },
        {
            "position": 12,
            "title": "Bowa Construction",
            "address": "222 S Jefferson St, Chicago, IL 60661",
            "latitude": 41.8785015,
            "longitude": -87.6429096,
            "rating": 3.1,
            "ratingCount": 33,
            "type": "Construction company",
            "types": [
                "Construction company"
            ],
            "website": "http://www.bowaconstruction.com/",
            "phoneNumber": "(312) 238-9899",
            "openingHours": {
                "Thursday": "6 AM–5 PM",
                "Friday": "6 AM–5 PM",
                "Saturday": "Closed",
                "Sunday": "Closed",
                "Monday": "6:30 AM–5 PM",
                "Tuesday": "6:30 AM–5 PM",
                "Wednesday": "6 AM–5 PM"
            },
            "thumbnailUrl": "https://lh3.googleusercontent.com/gps-cs-s/AHVAweo3KWbtLCNncLE5PbTnNADDFa_shJ0ZCqAzgHSi4poGMZXF0I63nKOGv99xURL0nEXbm6IKyOAwifeYi-I2SEXzptFE2JFLFvPGa6uyHDDl9MZ6XvrShOBsZzzT3F-cCIVIbLGgKoZJdqgU",
            "cid": "5391758551500629844",
            "fid": "0x880e28fa6038c15f:0x4ad35fd5f8dea754",
            "placeId": "ChIJX8E4YPooDogRVKfe-NVf00o"
        },
        {
            "position": 13,
            "title": "Power Construction Company, LLC",
            "address": "8750 W Bryn Mawr Ave #500, Chicago, IL 60631",
            "latitude": 41.9830305,
            "longitude": -87.84427699999999,
            "rating": 3.9,
            "ratingCount": 30,
            "type": "Construction company",
            "types": [
                "Construction company"
            ],
            "website": "http://www.powerconstruction.net/",
            "phoneNumber": "(312) 596-6960",
            "openingHours": {
                "Thursday": "8 AM–5 PM",
                "Friday": "8 AM–5 PM",
                "Saturday": "Closed",
                "Sunday": "Closed",
                "Monday": "8 AM–5 PM",
                "Tuesday": "8 AM–5 PM",
                "Wednesday": "8 AM–5 PM"
            },
            "thumbnailUrl": "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqO1Lsf3JL1wt-JiCLFBfLgeyeOHQKqUyt5zjAS-Ag02tk77p_Hnm3DqFRh1J1kLMNAtPdkCF-wVjiXydM1YOqB7r69EdUQTbkZG8JFqlfSDmv6QZRcQE2bE87P7DBBRYQ7gEo",
            "cid": "11252296456481223489",
            "fid": "0x880fc9f75dcc6dbb:0x9c2830028bf33341",
            "placeId": "ChIJu23MXffJD4gRQTPziwIwKJw"
        },
        {
            "position": 14,
            "title": "Buildmax Design & Construction Inc - Masonry Contractors Chicago",
            "address": "1200 N Ashland Ave #406, Chicago, IL 60622",
            "latitude": 41.903683699999995,
            "longitude": -87.6677265,
            "rating": 5,
            "ratingCount": 63,
            "type": "Masonry contractor",
            "types": [
                "Masonry contractor"
            ],
            "website": "https://buildmaxdc.com/",
            "phoneNumber": "(773) 501-4107",
            "openingHours": {
                "Thursday": "8 AM–5 PM",
                "Friday": "8 AM–5 PM",
                "Saturday": "9 AM–2 PM",
                "Sunday": "Closed",
                "Monday": "8 AM–5 PM",
                "Tuesday": "8 AM–5 PM",
                "Wednesday": "8 AM–5 PM"
            },
            "thumbnailUrl": "https://lh3.googleusercontent.com/gps-cs-s/AHVAweq4d1zI_USYkKRg_Ii8bDrW9LdgwdkpmgTU45fTSqjJNU3FjYCdQ9fv604MBPZew9va_GfSZhz49Mg8dBQ4siafXEuzDSwJpJcpClkym6sfxf-A4tprbAcnUxznHassrZHnsFgR",
            "cid": "9166810297301389312",
            "fid": "0x880fd2d02abffbdb:0x7f370d65c60ad000",
            "placeId": "ChIJ2_u_KtDSD4gRANAKxmUNN38"
        },
        {
            "position": 15,
            "title": "Sumit Construction Co., Inc.",
            "address": "4150 W Wrightwood Ave, Chicago, IL 60639",
            "latitude": 41.9284919,
            "longitude": -87.7310909,
            "rating": 4.3,
            "ratingCount": 13,
            "type": "Construction company",
            "types": [
                "Construction company"
            ],
            "website": "http://www.sumitconstruction.com/",
            "phoneNumber": "(773) 276-4600",
            "openingHours": {
                "Thursday": "8 AM–4 PM",
                "Friday": "8 AM–4 PM",
                "Saturday": "Closed",
                "Sunday": "Closed",
                "Monday": "8 AM–4 AM",
                "Tuesday": "8 AM–4 PM",
                "Wednesday": "8 AM–4 PM"
            },
            "thumbnailUrl": "https://lh3.googleusercontent.com/gps-cs-s/AHVAweru4Ro_DirgJHubngXBvc4M7RrqCuKX28sgsc9f4E2Xgi2j-BhfxQtkAMTM2Syw_tYTVBOm_kASVprb5N0XU0oEtXMgT6Awlau9FYcKURRtv_OtqFGlA7vGtIHP51HF24obNUAZqXXK82Lc",
            "cid": "7455826046620535560",
            "fid": "0x880fcd04bf186bbd:0x67786a4967ec0b08",
            "placeId": "ChIJvWsYvwTND4gRCAvsZ0lqeGc"
        },
        {
            "position": 16,
            "title": "Macon Construction Group, Inc.",
            "address": "3401 N California Ave, Chicago, IL 60618",
            "latitude": 41.9432358,
            "longitude": -87.6971458,
            "rating": 4.3,
            "ratingCount": 7,
            "type": "Construction company",
            "types": [
                "Construction company"
            ],
            "website": "http://www.macongroup.com/",
            "phoneNumber": "(773) 665-9252",
            "openingHours": {
                "Thursday": "7 AM–4 PM",
                "Friday": "7 AM–4 PM",
                "Saturday": "Closed",
                "Sunday": "Closed",
                "Monday": "7 AM–4 PM",
                "Tuesday": "7 AM–4 PM",
                "Wednesday": "7 AM–4 PM"
            },
            "thumbnailUrl": "https://lh3.googleusercontent.com/gps-cs-s/AHVAwerceGm0C6gUaqMvkF7zIQVDqHWZAdQXHohTsbzHVyIyFtx9xmbCd1gvzca6xbW4oy0j-jiSGdqMgLGdPX1fYKn6oOtSyruRHiopQ19CLjlhgpqBTbFXq9aESjO4Cc9beJL6aB9arg",
            "cid": "10952426934076935252",
            "fid": "0x880fd2d8df14bb31:0x97fed644a2138c54",
            "placeId": "ChIJMbsU39jSD4gRVIwTokTW_pc"
        },
        {
            "position": 17,
            "title": "Novak Construction",
            "address": "3423 N Drake Ave, Chicago, IL 60618",
            "latitude": 41.9438763,
            "longitude": -87.71582049999999,
            "rating": 4,
            "ratingCount": 46,
            "type": "General contractor",
            "types": [
                "General contractor"
            ],
            "website": "https://www.novakconstruction.com/",
            "phoneNumber": "(773) 278-1100",
            "openingHours": {
                "Thursday": "8 AM–5 PM",
                "Friday": "8 AM–3:30 PM",
                "Saturday": "Closed",
                "Sunday": "Closed",
                "Monday": "8 AM–5 PM",
                "Tuesday": "8 AM–5 PM",
                "Wednesday": "8 AM–5 PM"
            },
            "thumbnailUrl": "https://lh3.googleusercontent.com/gps-cs-s/AHVAwer6oVqH2HzmfN39Fxj4J7yJRLnFhSw4Fu9dsDnO0GPK6zMAuiv51iv1PZFFaW9_Prfc3OXBy_t2NO07vxBTzUS3LD5QMQKRTyf3YX57vx_hZWIh1IkpAbIqPoSuHSBM1ZB-FY4GwA",
            "cid": "3580726742263090518",
            "fid": "0x880fcd988ccc80e7:0x31b14c0026554d56",
            "placeId": "ChIJ54DMjJjND4gRVk1VJgBMsTE"
        },
        {
            "position": 18,
            "title": "BIG Construction",
            "address": "125 S Wacker Dr, Chicago, IL 60606",
            "latitude": 41.879706299999995,
            "longitude": -87.63641129999999,
            "rating": 5,
            "ratingCount": 4,
            "type": "Construction company",
            "types": [
                "Construction company",
                "General contractor"
            ],
            "website": "http://www.buildbig.com/",
            "phoneNumber": "(312) 940-3770",
            "openingHours": {
                "Thursday": "8 AM–5 PM",
                "Friday": "8 AM–5 PM",
                "Saturday": "Closed",
                "Sunday": "Closed",
                "Monday": "8 AM–5 PM",
                "Tuesday": "8 AM–5 PM",
                "Wednesday": "8 AM–5 PM"
            },
            "thumbnailUrl": "https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=fbQeqSWlgdOKZLmgA_yrVQ&cb_client=search.gws-prod.gps&w=80&h=92&yaw=87.116394&pitch=0&thumbfov=100",
            "cid": "11667601644582595168",
            "fid": "0x880e2cdc2e5f57fd:0xa1eba5e0ce1bea60",
            "placeId": "ChIJ_VdfLtwsDogRYOobzuCl66E"
        },
        {
            "position": 19,
            "title": "Reed Construction",
            "address": "600 W Jackson Blvd 8th floor, Chicago, IL 60661",
            "latitude": 41.8782795,
            "longitude": -87.642859,
            "rating": 5,
            "ratingCount": 7,
            "type": "General contractor",
            "types": [
                "General contractor",
                "Building firm",
                "Construction company",
                "Contractor",
                "Demolition contractor",
                "Interior construction contractor"
            ],
            "website": "http://www.reedcorp.com/",
            "phoneNumber": "(312) 943-8100",
            "openingHours": {
                "Thursday": "8 AM–5 AM",
                "Friday": "8 AM–5 PM",
                "Saturday": "Closed",
                "Sunday": "Closed",
                "Monday": "8 AM–5 PM",
                "Tuesday": "8 AM–5 PM",
                "Wednesday": "8 AM–5 PM"
            },
            "thumbnailUrl": "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqEEyKrQ3PbLiCNVgIRduzBV1LsWZCpFnyimWEj1TP2sKK8Ip2N85ynWMalb9j0t5fC-WhC_3UvivAlp1329k2j54hW32aFnxqTGk52ivLlTfeA8ljpSfqU_WTjJRGEFuxWY_Qa",
            "cid": "8073216038215178994",
            "fid": "0x880e2cc19d0114b1:0x7009d33688cd5af2",
            "placeId": "ChIJsRQBncEsDogR8lrNiDbTCXA"
        },
        {
            "position": 20,
            "title": "Trice Construction Co",
            "address": "438 W 43rd St, Chicago, IL 60609",
            "latitude": 41.8165975,
            "longitude": -87.63768549999999,
            "rating": 4.4,
            "ratingCount": 16,
            "type": "Construction company",
            "types": [
                "Construction company"
            ],
            "website": "http://www.triceconstruction.com/",
            "phoneNumber": "(773) 548-4000",
            "thumbnailUrl": "https://lh3.googleusercontent.com/gps-cs-s/AHVAweoaeqW6r7MqoNtlBhNZhLV0itiMYJInB6jSEcefOBHN29DzYhnQkUy4soF9FPkTGpyuKRzZKc63Bt7olZTYoKFu0ulWq7DCwEqj6SsrH-frE6QJmE-rZ7St6f1U5bGOaECtdEorxQ",
            "cid": "1709817439287194543",
            "fid": "0x880e2c1fe5ed5e11:0x17ba7de6eb7b33af",
            "placeId": "ChIJEV7t5R8sDogRrzN76-Z9uhc"
        }
    ],
    "credits": 3
}
```

---

# Urutan Implementasi

1. Database Schema
2. Authentication
3. Users Module
4. Transactions Module
5. Subscription Middleware
6. Scraper Module
7. Dashboard Module
8. Admin Module
9. Testing With CURL
10. Frontend Integration
