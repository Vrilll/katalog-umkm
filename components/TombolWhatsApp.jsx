"use client";

import { useState } from "react";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

export default function TombolWhatsApp({ produk }) {
  const [jumlah, setJumlah] = useState(1);
  const total = (Number(produk?.harga) || 0) * jumlah;
  const pesan =
    `Halo, saya ingin memesan ${produk?.nama} sebanyak ${jumlah} ` +
    `(${formatRupiah(produk?.harga)} per item, total ${formatRupiah(total)}).`;
  const urlWhatsApp = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 text-sm font-semibold">
        <span>Jumlah</span>
        <div className="inline-flex items-center rounded-lg border border-garis">
          <button
            type="button"
            aria-label="Kurangi jumlah"
            onClick={() => setJumlah((j) => Math.max(1, j - 1))}
            className="px-3 py-2 hover:text-utama"
          >
            −
          </button>
          <span className="min-w-8 text-center" aria-live="polite">
            {jumlah}
          </span>
          <button
            type="button"
            aria-label="Tambah jumlah"
            onClick={() => setJumlah((j) => Math.min(99, j + 1))}
            className="px-3 py-2 hover:text-utama"
          >
            +
          </button>
        </div>
      </div>
      <a
        href={urlWhatsApp}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white hover:bg-utama-gelap sm:w-auto"
      >
        Pesan via WhatsApp
      </a>
    </div>
  );
}
