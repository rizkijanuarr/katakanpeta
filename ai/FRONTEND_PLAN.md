# KatakanPeta - Frontend Development Plan

## 📋 Overview

**Project:** KatakanPeta - Platform pencarian data calon klien dari Google Maps  
**Frontend Stack:** React + TypeScript + Shadcn UI + Tailwind + TanStack Router + Zustand  
**Backend:** Express.js + TypeScript + PostgreSQL (NeonDB)  
**Architecture:** MVVM (Model-View-ViewModel) + Repository Pattern  

---

## ⚠️ PENTING - Rules & Konvensi

### 1. Selalu Perhatikan File Core Ini:

#### `core/common/AppRoutes.ts`
- **Fungsi:** Menyimpan semua endpoint API backend
- **Update setiap:** Ada endpoint baru atau perubahan path
- **Contoh:**
  ```typescript
  export const AppRoutes = {
    AUTH: {
      LOGIN: '/api/v1/auth/login',
      REGISTER: '/api/v1/auth/register',
    },
    USERS: {
      GET_ALL: '/api/v1/users',
    },
  }
  ```

#### `core/common/AppScreen.ts`
- **Fungsi:** Menyimpan semua route/screen frontend
- **Update setiap:** Ada halaman baru atau perubahan URL
- **Gunakan `as const`** untuk type safety
- **Contoh:**
  ```typescript
  export const AppScreen = {
    SIGN_IN: '/sign-in-2',
    SIGN_UP: '/sign-up',
    DASHBOARD: '/',
    USERS: '/users',
  } as const
  ```

#### `core/common/Constant.ts`
- **Fungsi:** Menyimpan constanta global (BASE_URL, error messages, dll)
- **Update setiap:** Ada constanta baru yang dipakai di banyak tempat
- **BASE_URL** sudah diset untuk API base URL

### 2. Workflow Saat Membuat Fitur Baru:

1. ✅ **Tambahkan endpoint ke `AppRoutes.ts`**
2. ✅ **Tambahkan screen path ke `AppScreen.ts`**
3. ✅ **Buat feature folder** (Model → Repository → Response → ViewModel → Screen)
4. ✅ **Buat route file** di `navigation/routes/`
5. ✅ **Update sidebar** jika perlu navigation baru
6. ✅ **Test & commit**

### 3. Pattern Repository:
- Selalu pakai `AppRoutes` untuk endpoint, jangan hardcode
- Gunakan `networkModule.request<T>(endpoint, config)`
- Response type harus sesuai dengan backend response

### 4. Pattern Navigation:
- Pakai `useNavigate()` dari TanStack Router
- Pakai `AppScreen` constant untuk route paths
- Redirect berdasarkan role user (ADMIN vs USER)

---

## 🗺️ Flow Halaman & Routing Structure

### 📍 Halaman Utama

```
/                      → Landing Page (simple, public)
                         - Hero section
                         - Features overview
                         - CTA to Login/Register

/sign-in-2             → Login Page (public)
                         - Form email + password
                         - Link ke Register & Forgot Password

/sign-up               → Register Page (public)
                         - Form name, email, password
                         - Link ke Login

/forgot-password       → Forgot Password Page (public)
                         - Form email + new password
                         - Link ke Login

/dashboard             → Dashboard (authenticated, role-based)
                         - USER: User Dashboard stats
                         - ADMIN: Admin Dashboard stats

/scraper               → Scraper Page (authenticated, active subscription required)
                         - Form query
                         - Results display
                         - Export options

/scraper/logs          → Scrape Logs History (authenticated)
                         - List semua scrape history user

/subscription          → Subscription Management (authenticated)
                         - Current subscription status
                         - Subscribe button
                         - Transaction history

/users                 → Users Management (ADMIN only)
                         - CRUD users
                         - Table with search & filter

/transactions          → Transaction List (ADMIN only)
                         - All transactions
                         - Approve/Reject buttons

/settings/account      → Account Settings (authenticated)
                         - Profile info
                         - Change password
```

### 🔀 Role-Based Access Flow

#### **Public (Tidak perlu login):**
- Landing Page (`/`)
- Login (`/sign-in-2`)
- Register (`/sign-up`)
- Forgot Password (`/forgot-password`)

#### **Authenticated (Sudah login):**
- Semua halaman di bawah

#### **User Role:**
- ✅ Dashboard (`/dashboard`)
- ✅ Scraper (`/scraper`) - dengan active subscription
- ✅ Scrape Logs (`/scraper/logs`)
- ✅ Subscription (`/subscription`)
- ✅ Account Settings (`/settings/account`)
- ❌ Users Management
- ❌ Admin Dashboard
- ❌ Transaction List

#### **Admin Role:**
- ✅ Semua User features
- ✅ Admin Dashboard (stats global)
- ✅ Users Management (`/users`)
- ✅ Transaction List (`/transactions`)

### 🚪 Redirect Rules:

1. **User sudah login →** redirect ke `/dashboard`
2. **User belum login →** redirect ke `/sign-in-2`
3. **User tanpa active subscription coba scrape →** redirect ke `/subscription`
4. **User biasa coba akses admin page →** show 403 Forbidden
5. **Admin login →** redirect ke `/dashboard` (admin view)

---

## 🎯 Goal

Membangun frontend yang lengkap untuk menghubungkan user dengan semua backend API endpoints yang sudah tersedia, dengan UX yang modern, responsif, dan user-friendly.

---

## 🏗️ Arsitektur Frontend

Setiap feature mengikuti struktur berikut:

```
features/{feature-name}/
├── Model/           # Type definitions
├── Repository/      # API calls (NetworkModule)
├── Response/        # Response types
├── Service/         # Business logic (optional)
├── Screen/          # UI Components (View)
├── ViewModel/       # State & logic (Zustand + React Hook Form)
└── components/      # Feature-specific components
```

---

## 📁 Fitur yang Harus Dibangun

### Phase 1: Authentication & Core Setup (Priority: HIGH)

#### 1.1 Login Screen Enhancement
- [ ] Connect to backend login API
- [ ] Save JWT token to authStore
- [ ] Redirect to dashboard after login
- [ ] Show error toast on failed login
- [ ] Remember me functionality
- **Files:** `features/auth/sign-in/`

#### 1.2 Register Screen
- [ ] Connect to backend register API
- [ ] Form validation (name, email, password)
- [ ] Success redirect to login
- [ ] Show error messages
- **Files:** `features/auth/sign-up/`

#### 1.3 Forgot Password Screen
- [ ] Connect to backend forgot-password API
- [ ] Form validation
- [ ] Success notification
- **Files:** `features/auth/forgot-password/`

#### 1.4 Auth Store Enhancement
- [ ] Add `user` object to authStore (id, name, email, role)
- [ ] Add `role` field (ADMIN | USER)
- [ ] Decode JWT token to extract user info
- [ ] Auto-redirect based on auth state
- **Files:** `core/store/authStore.ts`

---

### Phase 2: Dashboard (Priority: HIGH)

#### 2.1 User Dashboard
- [ ] Fetch dashboard data from `GET /api/v1/dashboard`
- [ ] Display subscription status card:
  - Status badge (PENDING/ACTIVE/EXPIRED/REJECTED)
  - Start date & end date
  - Days remaining countdown
- [ ] Display total scrapes stat
- [ ] Display recent scrapes table:
  - Query, date, result count
  - Link to scrape logs
- [ ] Loading states & error handling
- **Files:** `features/dashboard/`
- **Endpoint:** `GET /api/v1/dashboard`

#### 2.2 Admin Dashboard
- [ ] Fetch admin dashboard data from `GET /api/v1/admin/dashboard`
- [ ] Display stats cards:
  - Total Users
  - Total Transactions
  - Pending Approvals (with badge)
  - Active Subscriptions
  - Total Scrapes
- [ ] Display recent transactions table
- [ ] Display recent users table
- [ ] Role-based access (ADMIN only)
- **Files:** `features/dashboard/admin/`
- **Endpoint:** `GET /api/v1/admin/dashboard`

---

### Phase 3: Subscription & Transactions (Priority: HIGH)

#### 3.1 Subscription Management
- [ ] Subscribe button (calls `POST /api/v1/transactions/subscribe`)
- [ ] Show current subscription status
- [ ] Display subscribe history
- [ ] Toast notifications for actions
- **Files:** `features/subscription/`
- **Endpoints:**
  - `POST /api/v1/transactions/subscribe`
  - `GET /api/v1/transactions/me`

#### 3.2 Transaction List (Admin)
- [ ] Table with all transactions
- [ ] Filter by status (PENDING/ACTIVE/REJECTED)
- [ ] Search by user email/name
- [ ] Approve/Reject buttons
- [ ] Confirmation dialogs
- **Files:** `features/transactions/admin/`
- **Endpoints:**
  - `GET /api/v1/transactions`
  - `POST /api/v1/transactions/:id/approve`
  - `POST /api/v1/transactions/:id/reject`

---

### Phase 4: Scraper Module (Priority: CRITICAL - Core Feature)

#### 4.1 Scraper Form
- [ ] Input form:
  - Query (text input, required)
  - Number of results (number input, default 10)
  - Page number (number input, default 1)
- [ ] Submit button with loading state
- [ ] Check subscription status before scrape
- [ ] Error handling if no active subscription
- **Files:** `features/scraper/`
- **Endpoint:** `POST /api/v1/scrape`

#### 4.2 Scraper Results Display
- [ ] Results in table/card view
- [ ] Columns: Position, Title, Address, Rating, Type, Website, Phone
- [ ] Pagination
- [ ] Export to CSV button
- [ ] Click to view details
- **Components:** `features/scraper/components/`

#### 4.3 Scrape Logs History
- [ ] List all user's scrape history
- [ ] Display: Query, date, total results
- [ ] Click to view past results
- **Endpoint:** `GET /api/v1/scrape/logs`

---

### Phase 5: Users Management (Admin Only) (Priority: MEDIUM)

#### 5.1 Users List
- [ ] Data table with all users
- [ ] Columns: Name, Email, Role, Status, Created Date
- [ ] Search & filter
- [ **Files:** `features/users/` (partially exists)
- **Endpoint:** `GET /api/v1/users`

#### 5.2 Create User
- [ ] Modal/form for new user
- [ ] Fields: Name, Email, Password, Role (dropdown)
- [ ] Validation
- **Endpoint:** `POST /api/v1/users`

#### 5.3 Edit User
- [ ] Pre-filled form
- [ ] Update name, email, password, role
- **Endpoint:** `PUT /api/v1/users/:id`

#### 5.4 Delete User
- [ ] Confirmation dialog
- [ ] Success/error toast
- **Endpoint:** `DELETE /api/v1/users/:id`

---

### Phase 6: UI/UX Enhancements (Priority: MEDIUM)

#### 6.1 Sidebar Navigation Update
- [ ] Update sidebar menu items:
  ```
  General:
    - Dashboard (User/Admin adaptive)
    - Scraper
    - Scrape Logs
    - Subscription
  
  Admin:
    - Users Management
    - Transactions
    - Admin Dashboard
  
  Settings:
    - Account
    - Help Center
  ```
- [ ] Role-based menu (show/hide based on user role)
- **Files:** `components/layout/data/sidebar-data.ts`

#### 6.2 Layout Improvements
- [ ] Responsive design for mobile
- [ ] Loading skeletons
- [ ] Error boundaries
- [ ] Breadcrumbs
- [ ] Toast notifications setup

#### 6.3 Common Components
- [ ] StatCard (for dashboard stats)
- [ ] StatusBadge (PENDING/ACTIVE/REJECTED)
- [ ] EmptyState
- [ ] ConfirmDialog (reuse existing)
- [ ] DataTable (reuse existing)

---

## 🗺️ Routing Structure (Updated)

### TanStack Router File Structure:

```
navigation/routes/
├── __root.tsx                           # Root layout
├── (auth)/                              # Public auth routes (no layout)
│   ├── sign-in-2.tsx                    # Login page
│   ├── sign-up.tsx                      # Register page
│   └── forgot-password.tsx              # Forgot password page
│
├── _authenticated/                      # Protected routes (need login)
│   ├── route.tsx                        # Authenticated layout
│   ├── index.tsx                        # → Redirect to /dashboard
│   │
│   ├── dashboard/
│   │   └── index.tsx                    # Dashboard (role-based view)
│   │
│   ├── scraper/
│   │   ├── index.tsx                    # Scraper form & results
│   │   └── logs.tsx                     # Scrape logs history
│   │
│   ├── subscription/
│   │   └── index.tsx                    # Subscription management
│   │
│   ├── users/
│   │   └── index.tsx                    # Users management (Admin)
│   │
│   ├── transactions/
│   │   └── index.tsx                    # Transaction list (Admin)
│   │
│   └── settings/
│       ├── route.tsx                    # Settings layout
│       └── account.tsx                  # Account settings
│
└── (errors)/                            # Error pages
    ├── 401.tsx                          # Unauthorized
    ├── 403.tsx                          # Forbidden
    ├── 404.tsx                          # Not Found
    ├── 500.tsx                          # Server Error
    └── 503.tsx                          # Maintenance
```

### ⚠️ IMPORTANT: Landing Page

**Route `/` adalah Landing Page (public), BUKAN dashboard!**

Struktur:
```
/ (root)                → Landing Page (simple, public)
/sign-in-2              → Login
/dashboard              → Dashboard (authenticated)
```

Update yang diperlukan:
1. Buat landing page di root
2. Pindahkan dashboard ke `/dashboard`
3. Update `AppScreen.ts`:
   ```typescript
   export const AppScreen = {
     LANDING: '/',
     SIGN_IN: '/sign-in-2',
     SIGN_UP: '/sign-up',
     FORGOT_PASSWORD: '/forgot-password',
     DASHBOARD: '/dashboard',
     SCRAPER: '/scraper',
     SCRAPER_LOGS: '/scraper/logs',
     SUBSCRIPTION: '/subscription',
     USERS: '/users',
     TRANSACTIONS: '/transactions',
     SETTINGS: '/settings/account',
   } as const
   ```

4. Update `AppRoutes.ts` dengan semua endpoint:
   ```typescript
   export const AppRoutes = {
     AUTH: {
       LOGIN: '/api/v1/auth/login',
       REGISTER: '/api/v1/auth/register',
       FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
       ME: '/api/v1/me',
     },
     DASHBOARD: {
       USER: '/api/v1/dashboard',
       ADMIN: '/api/v1/admin/dashboard',
     },
     USERS: {
       GET_ALL: '/api/v1/users',
       CREATE: '/api/v1/users',
       GET_ONE: '/api/v1/users/:id',
       UPDATE: '/api/v1/users/:id',
       DELETE: '/api/v1/users/:id',
     },
     TRANSACTIONS: {
       SUBSCRIBE: '/api/v1/transactions/subscribe',
       MY_TRANSACTIONS: '/api/v1/transactions/me',
       GET_ALL: '/api/v1/transactions',
       APPROVE: '/api/v1/transactions/:id/approve',
       REJECT: '/api/v1/transactions/:id/reject',
     },
     SCRAPER: {
       SCRAPE: '/api/v1/scrape',
       LOGS: '/api/v1/scrape/logs',
     },
   }
   ```

---

## 📊 State Management

### Zustand Stores

#### 1. `authStore` (existing, needs enhancement)
```typescript
interface AuthState {
  token: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'USER';
  } | null;
  isLoggedIn: boolean;
  
  setToken: (token: string, user: User) => void;
  logout: () => void;
}
```

#### 2. `scraperStore` (new)
```typescript
interface ScraperState {
  lastQuery: string;
  lastResults: ScrapePlaceResult[];
  isLoading: boolean;
  
  setResults: (results: ScrapePlaceResult[]) => void;
  setLoading: (loading: boolean) => void;
}
```

---

## 🔗 Network Layer

### Repository Pattern (existing)
```typescript
class AuthRepository {
  static async login(data: LoginRequest): Promise<LoginResponse>
  static async register(data: RegisterRequest): Promise<RegisterResponse>
  static async forgotPassword(data: ForgotPasswordRequest): Promise<void>
}

class DashboardRepository {
  static async getUserDashboard(): Promise<UserDashboardResponse>
  static async getAdminDashboard(): Promise<AdminDashboardResponse>
}

class ScraperRepository {
  static async scrape(data: ScrapeRequest): Promise<ScrapeResponse>
  static async getLogs(): Promise<ScrapeLog[]>
}

class TransactionRepository {
  static async subscribe(): Promise<TransactionResponse>
  static async getMyTransactions(): Promise<Transaction[]>
  static async getAllTransactions(): Promise<Transaction[]>
  static async approveTransaction(id: string): Promise<TransactionResponse>
  static async rejectTransaction(id: string): Promise<TransactionResponse>
}

class UserRepository {
  static async getUsers(): Promise<User[]>
  static async createUser(data: CreateUserRequest): Promise<UserResponse>
  static async updateUser(id: string, data: UpdateUserRequest): Promise<UserResponse>
  static async deleteUser(id: string): Promise<void>
}
```

---

## 🎨 UI Components to Build/Reuse

### Reuse Existing (Shadcn Admin)
- ✅ DataTable (with pagination, filters)
- ✅ Dialog/AlertDialog
- ✅ Forms (react-hook-form + zod)
- ✅ Toast (Sonner)
- ✅ Tabs, Cards, Badges
- ✅ Skeleton loaders

### Build New
- 🆕 StatCard (dashboard metrics)
- 🆕 StatusBadge (subscription status colors)
- 🆕 SubscriptionCard (user subscription display)
- 🆕 ScrapeResultCard (place details)
- 🆕 CountdownTimer (days remaining)

---

## 🔐 Role-Based Access Control

### User Role
- ✅ Dashboard (user stats)
- ✅ Scraper (with active subscription)
- ✅ Scrape Logs (own)
- ✅ Subscription Management
- ❌ Users Management
- ❌ Admin Dashboard
- ❌ Transaction List

### Admin Role
- ✅ All User features
- ✅ Admin Dashboard
- ✅ Users CRUD
- ✅ Transaction List & Approvals

---

## 📅 Timeline Estimate

| Phase | Priority | Estimated Effort |
|-------|----------|------------------|
| 1. Auth & Core | HIGH | 2-3 hours |
| 2. Dashboard | HIGH | 3-4 hours |
| 3. Subscription | HIGH | 2-3 hours |
| 4. Scraper | CRITICAL | 4-5 hours |
| 5. Users Management | MEDIUM | 2-3 hours |
| 6. UI/UX Polish | MEDIUM | 2-3 hours |

**Total:** ~15-21 hours

---

## ✅ Definition of Done

Setiap fitur dianggap selesai jika:
1. ✅ UI implemented & responsive
2. ✅ Connected to backend API
3. ✅ Error handling & loading states
4. ✅ Toast notifications for actions
5. ✅ Tested manually di browser
6. ✅ No TypeScript errors
7. ✅ Follows MVVM pattern

---

## 🛠️ Development Workflow

Untuk setiap fitur:

1. **Define Types** (Model/ & Response/)
2. **Create Repository** (API calls)
3. **Create ViewModel** (state & logic)
4. **Build Screen** (UI components)
5. **Add Route** (TanStack Router)
6. **Update Sidebar** (navigation)
7. **Test** (manual testing)
8. **Commit & Push**

---

## 📝 Notes

- Gunakan **TanStack Router** untuk file-based routing
- Gunakan **Zustand** untuk global state
- Gunakan **react-hook-form** + **zod** untuk form validation
- Gunakan **Sonner** untuk toast notifications
- Gunakan **@tanstack/react-query** untuk data fetching (optional, bisa pakai Repository langsung)
- Semua API calls lewat **NetworkModule** (sudah ada interceptor & token handling)
- Ikuti pattern yang sudah ada di `features/users/` dan `features/auth/`

---

## 🔗 Backend API Reference

Semua endpoint sudah terdokumentasi di Postman collection:
- Location: `postman/katakanpeta-api.postman_collection.json`
- Total: 18 endpoints
- Base URL: `http://localhost:3000/api/v1`

---

**Last Updated:** 10 April 2026  
**Status:** Ready for Development  
**Next Step:** Review & adjust planning sesuai kebutuhan

---

## 🛠️ Development Workflow (UPDATED)

Untuk setiap fitur, **IKUTI LANGKAH INI SECARA BERURUTAN**:

### Step 1: Update Core Files (WAJIB!)
1. ✅ **Tambahkan endpoint ke `AppRoutes.ts`**
   - Group by feature (AUTH, DASHBOARD, USERS, dll)
   - Gunakan path yang sama dengan backend
   - Support path params (`:id`)

2. ✅ **Tambahkan screen path ke `AppScreen.ts`**
   - Gunakan `as const` untuk type safety
   - Naming: UPPER_SNAKE_CASE
   - Path harus konsisten dengan routing structure

3. ✅ **Tambahkan constants jika perlu ke `Constant.ts`**
   - Error messages
   - Base URLs
   - Global constants

### Step 2: Build Feature (MVVM Pattern)
4. ✅ **Define Types** (Model/ & Response/)
5. ✅ **Create Repository** (API calls, **PAKAI AppRoutes!**)
6. ✅ **Create ViewModel** (state & logic dengan Zustand)
7. ✅ **Build Screen** (UI components)

### Step 3: Setup Routing
8. ✅ **Buat route file** di `navigation/routes/`
9. ✅ **Update sidebar** jika perlu navigation baru
10. ✅ **Test navigation flow** (redirect, guards, dll)

### Step 4: Test & Deploy
11. ✅ **Test manual** di browser
12. ✅ **Check all roles** (USER vs ADMIN)
13. ✅ **Verify error handling**
14. ✅ **Commit & Push**

---

## ✅ Checklist Sebelum Commit

Setiap fitur dianggap selesai jika:

### Code Quality
- [ ] ✅ TypeScript: No errors (`tsc --noEmit`)
- [ ] ✅ ESLint: No errors (`npm run lint`)
- [ ] ✅ Format: Formatted (`npm run format`)
- [ ] ✅ Follows MVVM pattern

### Core Files Updated
- [ ] ✅ `AppRoutes.ts` updated (if new endpoint)
- [ ] ✅ `AppScreen.ts` updated (if new screen)
- [ ] ✅ `Constant.ts` updated (if new constant)

### Features
- [ ] ✅ UI implemented & responsive
- [ ] ✅ Connected to backend API
- [ ] ✅ Error handling & loading states
- [ ] ✅ Toast notifications for actions
- [ ] ✅ Role-based access working

### Testing
- [ ] ✅ Tested manually di browser
- [ ] ✅ Both roles tested (USER & ADMIN jika applicable)
- [ ] ✅ Error scenarios tested
- [ ] ✅ No console errors

---

## 📝 Notes & Best Practices

### DO ✅
- **Selalu pakai `AppRoutes`** untuk API endpoints
- **Selalu pakai `AppScreen`** untuk navigation paths
- Pakai type-safe patterns (`as const`, TypeScript)
- Follow existing patterns (lihat `features/users/` dan `features/auth/`)
- Gunakan toast notifications (Sonner) untuk user feedback
- Handle loading & error states dengan baik
- Test dengan kedua role (USER & ADMIN)

### DON'T ❌
- **JANGAN hardcode API endpoints** (selalu pakai `AppRoutes`)
- **JANGAN hardcode paths** (selalu pakai `AppScreen`)
- JANGAN skip error handling
- JANGAN lupa test role-based access
- JANGAN commit tanpa type check
- JANGAN lupa update sidebar jika ada menu baru

---

**Last Updated:** 10 April 2026  
**Status:** Ready for Development  
**Next Step:** Review & adjust planning sesuai kebutuhan
