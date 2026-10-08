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

**Hasil:**

**Perbaikan:**

## US-04 Login admin

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-05 Ganti password

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-06 Proteksi halaman admin

**Prompt:**

**Hasil:**

**Perbaikan:**

## Debugging dan fitur bonus

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.
