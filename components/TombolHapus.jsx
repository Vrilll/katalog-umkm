"use client";

import Tombol from "@/components/Tombol";
import { hapusProdukAction } from "@/app/admin/actions";

export default function TombolHapus({ id, nama }) {
  return (
    <form
      action={hapusProdukAction}
      onSubmit={(e) => {
        if (!window.confirm(`Hapus produk "${nama}"? Tindakan ini tidak bisa dibatalkan.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Tombol type="submit" varian="bahaya">
        Hapus
      </Tombol>
    </form>
  );
}
