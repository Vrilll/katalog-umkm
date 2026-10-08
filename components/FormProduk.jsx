"use client";

import { useActionState, useState, useTransition } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { buatDeskripsiAction } from "@/app/admin/actions";

// Dipakai untuk tambah produk (US-08) dan ubah produk (US-09).
// Nama field sama dengan kolom tabel "produk".
export default function FormProduk({ produk = {}, labelTombol, aksi }) {
  const [state, formAction, sedangMenyimpan] = useActionState(aksi, null);
  const [nama, setNama] = useState(produk.nama ?? "");
  const [kategori, setKategori] = useState(produk.kategori ?? "");
  const [deskripsi, setDeskripsi] = useState(produk.deskripsi ?? "");
  const [pesanAI, setPesanAI] = useState(null);
  const [sedangMembuat, mulaiMembuat] = useTransition();

  function buatDenganAI() {
    setPesanAI(null);
    mulaiMembuat(async () => {
      const hasil = await buatDeskripsiAction(nama, kategori);
      if (hasil?.deskripsi) {
        setDeskripsi(hasil.deskripsi);
      } else {
        setPesanAI(hasil?.error ?? "Gagal membuat deskripsi.");
      }
    });
  }

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      {state?.error && (
        <p className="rounded-lg border border-garis bg-permukaan px-3 py-2 text-sm text-bahaya">
          {state.error}
        </p>
      )}
      {produk.id !== undefined && <input type="hidden" name="id" value={produk.id} />}
      <Input
        label="Nama produk"
        name="nama"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        required
      />
      <Input
        label="Harga (Rp)"
        name="harga"
        type="number"
        min="0"
        defaultValue={produk.harga}
        required
      />
      <Input
        label="Kategori"
        name="kategori"
        value={kategori}
        onChange={(e) => setKategori(e.target.value)}
      />
      <Input
        label="Link foto"
        name="foto_url"
        placeholder="https://... atau /produk/nama-file.svg"
        defaultValue={produk.foto_url}
      />
      <Input
        label="Deskripsi"
        name="deskripsi"
        textarea
        value={deskripsi}
        onChange={(e) => setDeskripsi(e.target.value)}
      />
      <div className="flex flex-col items-start gap-2">
        <Tombol type="button" varian="garis" onClick={buatDenganAI} disabled={sedangMembuat}>
          {sedangMembuat ? "Membuat deskripsi..." : "Buat deskripsi dengan AI"}
        </Tombol>
        {pesanAI && <p className="text-sm text-bahaya">{pesanAI}</p>}
      </div>
      <div className="flex gap-3">
        <Tombol type="submit" disabled={sedangMenyimpan}>
          {sedangMenyimpan ? "Menyimpan..." : labelTombol}
        </Tombol>
        <Tombol href="/admin" varian="garis">
          Batal
        </Tombol>
      </div>
    </form>
  );
}
