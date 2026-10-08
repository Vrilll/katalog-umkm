# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**

```
Baca AGENTS.md dan docs/user-stories.md bagian US-01.

Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase.

Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.
```

**Hasil:** Dibuat `lib/supabase/server.js` (client Supabase khusus server). `app/page.jsx` mengambil semua produk dari tabel `produk` lewat Server Component dan menampilkannya dengan `KartuProduk`. Ada pesan "Gagal memuat produk" jika query error, tulisan "Belum ada produk" jika tabel kosong, dan `CatatanBelumAktif` sudah dihapus.

**Perbaikan:** (isi jika ada revisi setelah prompt ini)

## US-02 Detail produk

**Prompt:**

```
Baca docs/user-stories.md bagian US-02.

Ubah app/produk/[id]/page.jsx supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL, di sisi server, memakai koneksi Supabase yang sudah dibuat di lib/supabase. Kalau produk tidak ditemukan, panggil notFound(). Jangan ubah tampilannya. Hapus CatatanBelumAktif dari halaman ini, tapi biarkan tombol WhatsApp.
```

**Hasil:** `app/produk/[id]/page.jsx` memakai `const { id } = await params`, mengambil satu produk dengan `.eq("id", id).maybeSingle()`, dan memanggil `notFound()` jika produk tidak ada atau query gagal. Tampilan dan tombol WhatsApp tidak berubah, `CatatanBelumAktif` dihapus.

**Perbaikan:** (isi jika ada revisi setelah prompt ini)

## US-03 Pesan via WhatsApp

**Prompt:**

```
Baca docs/rancangan-teknis.md bagian "Pesan WhatsApp (US-03)".

Ubah components/TombolWhatsApp.jsx menjadi tautan yang membuka https://wa.me/ ke nomor di lib/toko.js, dengan pesan otomatis berisi nama dan harga produk dalam format rupiah. Pesan di-encode dengan encodeURIComponent dan dibuka di tab baru. Pertahankan tampilan tombolnya. Hapus CatatanBelumAktif yang menyebut US-03 di halaman detail produk.
```

**Hasil:** `TombolWhatsApp.jsx` menjadi tautan `https://wa.me/<nomor dari lib/toko.js>?text=...` dengan pesan "Halo, saya ingin memesan <nama> seharga <harga rupiah>.", di-encode dengan `encodeURIComponent`, dibuka di tab baru (`target="_blank"`). Tampilan tombol tetap.

**Perbaikan:** (isi jika ada revisi setelah prompt ini)

## US-04 Login admin

**Prompt:**

```
Baca AGENTS.md bagian aturan keamanan dan docs/user-stories.md bagian US-04.

Buat login admin memakai Supabase Auth (email dan password) dengan @supabase/ssr dan cookie, memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY. Login diproses dengan Server Action di app/admin/actions.js dan disambungkan ke form di app/admin/login/page.jsx. Login berhasil diarahkan ke /admin; login gagal menampilkan pesan error yang jelas di halaman login. Buat juga tombol "Keluar" di components/NavAdmin.jsx berfungsi: mengakhiri sesi lalu kembali ke /admin/login. Jangan ubah tampilan. Hapus CatatanBelumAktif dari halaman login.
```

**Hasil:** Dibuat `lib/supabase/admin.js` (client Supabase berbasis cookie via `@supabase/ssr`). `loginAction` di `app/admin/actions.js` memanggil `signInWithPassword`, redirect ke `/admin` bila berhasil, dan menampilkan "Email atau password salah." bila gagal. `logoutAction` memanggil `signOut` lalu redirect ke `/admin/login`, disambungkan ke tombol Keluar di `NavAdmin.jsx`.

**Perbaikan:** (isi jika ada revisi setelah prompt ini)

## US-05 Ganti password

**Prompt:**

```
Baca docs/user-stories.md bagian US-05.

Buat Server Action ganti password di app/admin/actions.js untuk admin yang sedang login, memakai Supabase Auth. Validasi di server: password baru minimal 8 karakter dan harus sama dengan konfirmasi. Tampilkan pesan berhasil atau pesan error yang jelas di halaman. Sambungkan ke form di app/admin/password/page.jsx tanpa mengubah tampilannya. Hapus CatatanBelumAktif dari halaman ini.
```

**Hasil:** `gantiPasswordAction` memvalidasi di server (minimal 8 karakter, harus sama dengan konfirmasi), memastikan admin login lewat `auth.getUser()`, lalu memanggil `auth.updateUser({ password })`. Halaman `/admin/password` menampilkan "Password berhasil diganti." atau pesan error.

**Perbaikan:** (isi jika ada revisi setelah prompt ini)

## US-06 Proteksi halaman admin

**Prompt:**

```
Baca AGENTS.md aturan keamanan nomor 3 dan 4, dan docs/user-stories.md bagian US-06.

Buat file proxy.js di root proyek (Next.js 16). Semua rute /admin kecuali /admin/login wajib login dengan Supabase Auth; kalau belum login, alihkan ke /admin/login. Pastikan juga setiap Server Action yang mengubah data memeriksa login di server. Hapus CatatanBelumAktif dari halaman /admin.
```

**Hasil:** `proxy.js` di root memeriksa sesi Supabase lewat cookie dan mengalihkan semua `/admin/*` (kecuali `/admin/login`) ke `/admin/login` bila belum login. Matcher `/admin/:path*`. `CatatanBelumAktif` dihapus dari `/admin`.

**Perbaikan:** (isi jika ada revisi setelah prompt ini)

## Fitur bonus

### US-07 List produk admin [SENDIRI]

**Prompt:**

```
Baca AGENTS.md dan docs/user-stories.md bagian US-07. Ubah app/admin/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase di sisi server (lib/supabase/server.js), bukan data contoh. Tampilkan lewat TabelProduk tanpa mengubah tampilannya. Jika gagal tampilkan pesan error, jika kosong tampilkan "Belum ada produk".
```

**Hasil:** `/admin` mengambil produk dari database; data contoh tidak dipakai lagi di halaman ini.

**Perbaikan:** (isi jika ada)

### US-08 Tambah produk [SENDIRI]

**Prompt:**

```
Baca docs/user-stories.md bagian US-08. Buat Server Action tambahProdukAction di app/admin/actions.js yang menyimpan produk ke tabel "produk". Wajib memeriksa di server bahwa admin sudah login sebelum menyimpan (helper di lib/auth.js), validasi nama wajib dan harga bilangan bulat >= 0, lalu redirect ke /admin. Sambungkan ke FormProduk di /admin/produk/baru, tampilkan pesan error di form, dan hapus CatatanBelumAktif.
```

**Hasil:** Form tambah produk menyimpan ke database lewat Server Action yang terkunci login, lalu kembali ke `/admin`. `FormProduk` menjadi client component dengan `useActionState` untuk menampilkan error.

**Perbaikan:** (isi jika ada)

### US-09 Ubah produk [SENDIRI]

**Prompt:**

```
Baca docs/user-stories.md bagian US-09. Ubah app/admin/produk/[id]/ubah/page.jsx agar mengambil produk dari database berdasarkan id (notFound() jika tidak ada), dan buat ubahProdukAction di app/admin/actions.js yang memeriksa login admin di server sebelum meng-update. Form harus terisi data lama. Hapus CatatanBelumAktif.
```

**Hasil:** Form ubah terisi data lama dari database dan menyimpan perubahan lewat `ubahProdukAction` (terkunci login), lalu kembali ke `/admin`.

**Perbaikan:** (isi jika ada)

### US-10 Hapus produk [SENDIRI]

**Prompt:**

```
Baca docs/user-stories.md bagian US-10. Buat hapusProdukAction di app/admin/actions.js yang memeriksa login admin di server sebelum menghapus. Buat components/TombolHapus.jsx yang meminta konfirmasi (window.confirm) lalu memanggil aksi itu, dan pakai di TabelProduk.
```

**Hasil:** Tombol "Hapus" menampilkan konfirmasi, lalu menghapus produk dari database. Jika belum login, aksi dialihkan ke `/admin/login`.

**Perbaikan:** (isi jika ada)

### US-11 Filter kategori dan pencarian [SENDIRI]

**Prompt:**

```
Baca docs/user-stories.md bagian US-11. Di app/page.jsx tambahkan form GET dengan kolom cari nama dan pilihan kategori (diambil dari data produk). Filter dilakukan di server lewat searchParams (ilike untuk nama, eq untuk kategori). Tampilkan "Produk tidak ditemukan" jika hasil kosong dan tombol Reset.
```

**Hasil:** Katalog bisa dicari dan difilter lewat URL (`/?q=kopi&kategori=Minuman`), tanpa JavaScript client.

**Perbaikan:** Karakter khusus pada kata cari (`% , ( ) * \`) dibuang agar tidak merusak filter.

### US-12 Pilih jumlah [SENDIRI]

**Prompt:**

```
Baca docs/user-stories.md bagian US-12. Ubah components/TombolWhatsApp.jsx menjadi client component dengan pemilih jumlah (tombol - dan +, minimal 1, maksimal 99). Jumlah dan total harga ikut tertulis di pesan WhatsApp.
```

**Hasil:** Pengunjung memilih jumlah sebelum memesan; pesan WhatsApp memuat jumlah, harga per item, dan total.

**Perbaikan:** (isi jika ada)

### US-13 PWA [SENDIRI]

**Prompt:**

```
Baca docs/user-stories.md bagian US-13. Buat app/manifest.js memakai data dari lib/toko.js dan ikon di public/icons, buat public/sw.js minimal, dan daftarkan service worker lewat komponen client kecil di app/layout.jsx.
```

**Hasil:** Katalog menyediakan `/manifest.webmanifest`, ikon 192 dan 512, serta service worker minimal sehingga bisa dipasang di HP.

**Perbaikan:** (isi jika ada)

### US-14 Deskripsi produk dibuat AI [SENDIRI]

**Prompt:**

```
Baca docs/user-stories.md bagian US-14. Tambahkan tombol "Buat deskripsi dengan AI" di FormProduk. Buat Server Action buatDeskripsiAction di app/admin/actions.js yang memeriksa login admin, lalu memanggil Gemini API (fetch, tanpa paket baru) dengan nama dan kategori produk. API key dari GEMINI_API_KEY (tanpa NEXT_PUBLIC_) dan tambahkan ke .env.example. Hasilnya mengisi kolom deskripsi.
```

**Hasil:** Tombol mengisi kolom deskripsi dari Gemini; key hanya dibaca di server. Perlu `GEMINI_API_KEY` di `.env.local` dan Vercel.

**Perbaikan:** (isi jika ada)

## Debugging dan fitur bonus

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.
