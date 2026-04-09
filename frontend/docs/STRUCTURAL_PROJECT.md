# Struktur Proyek React MVVM Terpadu

Dokumen ini menjelaskan struktur lengkap dan penjelasan arsitektur Frontend (*React Vite + Tanstack Router + Shadcn*) yang menggunakan gaya pengembangan *Mobile-like MVVM* murni yang sangat bersih ('Clean Architecture').

Pusat seluruh aplikasi ini berada dalam folder `src/` yang ditata sangat ketat ke dalam dua sumbu fundamental: **`core/`** (Infrastruktur / Logika Global) dan **`presentation/`** (Tampilan Layar / UI).

---

## 📁 `src/` (Root Source)

Folder utama tempat seluruh alur hidup kode React ditulis. Di luar folder ini hanya berisi konfigurasi bawaan mesin `Vite` dan `Node.js` (`package.json`, `vite.config.ts`, `tsconfig.json`).

*   📄 `main.tsx`: Pintu gerbang utama. Menghubungkan langsung `index.html` dengan seluruh kerangka React. File ini tempat di mana Provider Root, Router TanStack, dan QueryClient mem-booting aplikasi pertama kali.

---

### 📂 `src/core/` (Logika & Infrastruktur Sistem)

Bagian ini benar-benar tidak peduli tentang bagaimana visual aplikasi ditampilkan. Ini adalah "Mesin Kapal" tak terlihat yang bekerja secara terpusat untuk *Networking*, *Storage*, *Security Token*, *Type Declarations*, dsb.

*   **`common/`**: Tempat konstanta mutlak aplikasi (Kamus).
    *   `AppRoutes.ts`: Kamus berisi semua *string* rute endpoint Backend API (URL database).
    *   `AppScreen.ts`: Kamus spesifik menampung *string* URL layar navigasi untuk membantu pindah halaman (tanpa takut *typo*).
    *   `Constant.ts`: Variabel-variabel umum atau error dictionary.

*   **`config/`**: Tempat konfigurasi utilitas statis takan-ubah.
    *   `fonts.ts`: Pengaturan mapping font.

*   **`context/`**: React Context murni untuk hal-hal berbau infrastruktur perenderan Root UI.
    *   `theme-provider.tsx`, `font-provider.tsx`, `layout-provider.tsx`: Mesin penyuntik class Light/Dark mode dan pengaturan global ke struktur asli HTML Document.

*   **`hooks/`**: Custom hooks fungsional murni.
    *   `use-mobile.tsx`: Sensor layar untuk ngedeteksi pengguna memakai HP/Desktop.
    *   `use-dialog-state.tsx`, dsb.: Manipulator status komponen tanpa duplikasi block `useState` di manapun.

*   **`network/`**: Native/Mobile-like *Fetch Api* Engine.
    *   `NetworkModule.ts`, `ResponseInterceptor.ts`, `ResponseJsonChecker.ts`: *Wrapper HTTP client* Singleton yang mencegat *request* untuk memasukkan Auth Token, mengecek *response error*, serta mencegah *loading infinite*.

*   **`plugins/`**: Tempat register plugin.
    *   `index.ts`: Sentralisasi *export* untuk kemudahan *importing* modul pihak ketiga.

*   **`store/`**: *Zustand RAM / Local Storage* untuk Global Management (Persist).
    *   `authStore.ts`, `userStore.ts`: Berisi parameter login user, token di memori awet lokal, yang jika ter-update bisa men-trigger layar untuk *Re-render*.

*   **`types/`**: Deklarasi Tipedata Kompilator (Pembantu Typescript).
    *   `vite-env.d.ts`, `tanstack-table.d.ts`: Syarat murni TS Server agar paham variabel `import.meta.env` dll.

*   **`utils/`**: Helpper dan Fungsi utilitas kecil.
    *   `utils.ts`: Utilitas paling umum (terutama `cn` untuk menyatukan kelas Tailwind CSS Shadcn).
    *   `cookies.ts`, `handle-server-error.ts`: Fungsi-fungsi murni untuk operasional spesifik non-react.

---

### 📂 `src/presentation/` (Garis Depan Penampilan Visual & Fitur)

Bagian ini menampung segala hal yang berhubungan dengan "Mata Pengguna". Di dalamnya dipecah sangat granular, MVVM menguasai folder fitur di dalam sini.

*   **`assets/`**: Media Grafis dan Base Komponen SVG.
    *   `brand-icons/`, `custom/`, `logo.tsx`: Merupakan komponen React murni `.tsx` spesialis rendernya SVG (membuat kualitas logo jadi pixel-perfect).

*   **`styles/`**: File Style.
    *   `index.css`, `theme.css`: Dasar root Tailwind dan variabel palet warna global.

*   **`components/`**: Katalog Koleksi Aksesoris UI / Generic Components. (Shadcn/UI components). Posisinya *dumb component* murni yang tidak pernah panggil *Store* atau *Network*.
    *   Terdiri atas serangkaian blok siap rakit seperti `ui/button.tsx`, `ui/sidebar.tsx`, `layout/...` yang bisa dipanggil fitur mana saja berkali-kali secara fleksibel, dan komponen *wrapper* layout inti `app-sidebar.tsx` dll.

*   **`navigation/`**: Pusat Kendali Navigasi Otomatis (Zonasi Rute) yang dibaca oleh sistem `@tanstack/react-router`.
    *   `routeTree.gen.ts`: File Auto-generator peta navigasi hasil deteksi sistem.
    *   `routes/`: Struktur hierarkis file navigasi (`__root.tsx`, `_authenticated/`, `(auth)/`) yang jika file-nya ada otomatis menjadi route URL di browser. File di folder ini pada hierarki terbawah merujuk ke Screen masing-masing fitur.

*   **`features/`**: Inti Bisnis Aplikasi (Di sinilah MVVM Paling Bersinar).

    *Setiap folder di bawah ini (misal `auth/` atau `users/`) memegang struktur pola MVVM yang ketat untuk mengisolasi setiap alur datanya.*
    Contoh dalam `users/`:
    *   `Model/`: *Data class* MURNI dan Schema (seperti `UserSchema.ts`).
    *   `Repository/`: Lapisan perantara untuk membungkus komunikasi ke luar (misal: `UsersRepository.ts`).
    *   `Service/`: Pemanggil Endpoint mentah (`UsersService.ts`) (berinteraksi dengan `NetworkModule`).
    *   `ViewModel/`: Penghuni logika, memanggil *Store*, *Repository*, serta menampung logika Validasi dan *Loading parameter* (Misal `useUsersViewModel.ts`).
    *   `Screen/`: Satu-satunya wadah murni yang menge-print komponen UI. Ini cuma nge-render JSX yang datanya ditransfer hidup-hidup dari *ViewModel* (`UsersScreen.tsx`).

    Daftar Fitur saat ini yang di-isolasi:
    1.  `auth/` (Terdiri atas `sign-in`, `sign-up`, `forgot-password`).
    2.  `dashboard/` (Halaman pendaratan Utama pengguna yang berhasil otentikasi).
    3.  `users/` (Modul pengelolaan penuh data tabel Data Pengguna).
    4.  `settings/` (Kumpulan form spesifikasi sistem Account. Terdiri atas `account` dan `components` spesifik pendukung Settings).

---
> Arsitektur ini membuktikan bahwa Front-End berbasis Component dapat dinavigasi dan dipelihara secara *Scalable* melalui pemisahan yang terstruktur ala sistem kerja Engineer Platform Native (iOS / Android), menghapus kerancuan *State*, *Logic* dan DOM yang saling menindih.
