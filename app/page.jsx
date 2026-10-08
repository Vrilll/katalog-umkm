import KartuProduk from "@/components/KartuProduk";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { toko } from "@/lib/toko";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanKatalog({ searchParams }) {
  const { q = "", kategori = "" } = await searchParams;
  const kata = String(q).trim();
  const kategoriDipilih = String(kategori).trim();

  let daftarProduk = [];
  let daftarKategori = [];
  let pesanError = null;

  try {
    const supabase = createServerClient();

    // Daftar kategori untuk pilihan filter (US-11).
    const { data: semua } = await supabase.from("produk").select("kategori");
    daftarKategori = [...new Set((semua || []).map((p) => p.kategori).filter(Boolean))].sort();

    let query = supabase.from("produk").select("*").order("id", { ascending: true });
    if (kategoriDipilih) {
      query = query.eq("kategori", kategoriDipilih);
    }
    if (kata) {
      // Buang karakter yang punya arti khusus di filter PostgREST.
      query = query.ilike("nama", `%${kata.replace(/[%,()*\\]/g, " ")}%`);
    }

    const { data, error } = await query;
    if (error) {
      pesanError = error.message;
    } else {
      daftarProduk = data || [];
    }
  } catch (error) {
    pesanError = error.message || "Terjadi kesalahan saat mengambil data produk.";
  }

  const sedangMenyaring = Boolean(kata || kategoriDipilih);

  return (
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      <section aria-labelledby="judul-produk" className="flex flex-col gap-5">
        <h2 id="judul-produk" className="text-xl font-bold">
          Produk kami
        </h2>

        <form method="get" className="flex flex-wrap items-end gap-3">
          <div className="min-w-48 flex-1">
            <Input label="Cari produk" name="q" type="search" defaultValue={kata} placeholder="Nama produk" />
          </div>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Kategori
            <select
              name="kategori"
              defaultValue={kategoriDipilih}
              className="rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks focus:border-utama focus:outline-none"
            >
              <option value="">Semua</option>
              {daftarKategori.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </label>
          <Tombol type="submit">Cari</Tombol>
          {sedangMenyaring && (
            <Tombol href="/" varian="garis">
              Reset
            </Tombol>
          )}
        </form>

        {pesanError ? (
          <div className="rounded-xl border border-garis bg-permukaan p-4">
            <p className="font-semibold text-bahaya">Gagal memuat produk</p>
            <p className="mt-1 text-sm text-teks-lembut">{pesanError}</p>
          </div>
        ) : daftarProduk.length === 0 ? (
          <p className="py-8 text-center text-teks-lembut">
            {sedangMenyaring ? "Produk tidak ditemukan" : "Belum ada produk"}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {daftarProduk.map((produk) => (
              <KartuProduk key={produk.id} produk={produk} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
