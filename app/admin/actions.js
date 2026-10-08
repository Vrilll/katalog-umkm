"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerClient } from "@/lib/supabase/server";
import { ambilAdmin } from "@/lib/auth";

export async function loginAction(prevStateOrFormData, maybeFormData) {
  const formData = maybeFormData instanceof FormData ? maybeFormData : prevStateOrFormData;
  const email = formData?.get?.("email");
  const password = formData?.get?.("password");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  let sukses = false;
  try {
    const supabase = await createAdminClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: String(email).trim(),
      password: String(password),
    });

    if (error) {
      return {
        error:
          error.message === "Invalid login credentials"
            ? "Email atau password salah."
            : error.message || "Gagal masuk. Periksa kembali email dan password.",
      };
    }

    sukses = true;
  } catch (err) {
    return {
      error: err.message || "Terjadi kesalahan saat memproses login.",
    };
  }

  if (sukses) {
    redirect("/admin");
  }
}

export const login = loginAction;
export const masuk = loginAction;

export async function logoutAction() {
  const supabase = await createAdminClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export const logout = logoutAction;
export const keluar = logoutAction;

export async function gantiPasswordAction(prevStateOrFormData, maybeFormData) {
  const formData = maybeFormData instanceof FormData ? maybeFormData : prevStateOrFormData;
  const passwordBaru = formData?.get?.("password_baru");
  const konfirmasiPassword = formData?.get?.("konfirmasi_password");

  if (!passwordBaru || !konfirmasiPassword) {
    return { error: "Semua kolom password wajib diisi." };
  }

  const passStr = String(passwordBaru);
  const konfStr = String(konfirmasiPassword);

  if (passStr.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passStr !== konfStr) {
    return { error: "Konfirmasi password tidak sama dengan password baru." };
  }

  try {
    const supabase = await createAdminClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        error: "Kamu belum login atau sesi telah berakhir. Silakan login kembali.",
      };
    }

    const { error } = await supabase.auth.updateUser({
      password: passStr,
    });

    if (error) {
      return {
        error: error.message || "Gagal mengganti password. Silakan coba lagi.",
      };
    }

    return { success: "Password berhasil diganti." };
  } catch (err) {
    return {
      error: err.message || "Terjadi kesalahan saat mengganti password.",
    };
  }
}

export const gantiPassword = gantiPasswordAction;
export const changePassword = gantiPasswordAction;

// ---------- Produk (US-08, US-09, US-10, US-14) ----------
// Setiap aksi memeriksa di server bahwa admin sudah login sebelum mengubah data.

const PESAN_BELUM_LOGIN = "Kamu belum login atau sesi telah berakhir. Silakan login kembali.";

function bacaFormProduk(formData) {
  const nama = String(formData?.get?.("nama") ?? "").trim();
  const hargaMentah = String(formData?.get?.("harga") ?? "").trim();
  const harga = Number(hargaMentah);
  const kategori = String(formData?.get?.("kategori") ?? "").trim();
  const foto_url = String(formData?.get?.("foto_url") ?? "").trim();
  const deskripsi = String(formData?.get?.("deskripsi") ?? "").trim();

  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }
  if (hargaMentah === "" || !Number.isInteger(harga) || harga < 0) {
    return { error: "Harga harus berupa bilangan bulat 0 atau lebih." };
  }

  return {
    data: {
      nama,
      harga,
      kategori: kategori || null,
      foto_url: foto_url || null,
      deskripsi: deskripsi || null,
    },
  };
}

const BUCKET_FOTO = "produk";
const BATAS_FOTO = 2 * 1024 * 1024; // 2 MB
const TIPE_FOTO = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

// Jika admin memilih file foto, unggah ke Supabase Storage dan isi data.foto_url.
async function unggahFoto(supabase, formData, data) {
  const file = formData?.get?.("foto");
  if (!file || typeof file === "string" || file.size === 0) {
    return null;
  }
  const ekstensi = TIPE_FOTO[file.type];
  if (!ekstensi) {
    return "Foto harus berformat JPG, PNG, atau WebP.";
  }
  if (file.size > BATAS_FOTO) {
    return "Ukuran foto maksimal 2 MB.";
  }

  const namaFile = `${crypto.randomUUID()}.${ekstensi}`;
  const { error } = await supabase.storage
    .from(BUCKET_FOTO)
    .upload(namaFile, file, { contentType: file.type });
  if (error) {
    return `Gagal mengunggah foto: ${error.message}`;
  }

  data.foto_url = supabase.storage.from(BUCKET_FOTO).getPublicUrl(namaFile).data.publicUrl;
  return null;
}

export async function tambahProdukAction(prevState, formData) {
  if (!(await ambilAdmin())) {
    return { error: PESAN_BELUM_LOGIN };
  }

  const { data, error } = bacaFormProduk(formData);
  if (error) {
    return { error };
  }

  try {
    const supabase = createServerClient();
    const errorFoto = await unggahFoto(supabase, formData, data);
    if (errorFoto) {
      return { error: errorFoto };
    }
    const { error: errorDb } = await supabase.from("produk").insert(data);
    if (errorDb) {
      return { error: errorDb.message || "Gagal menyimpan produk." };
    }
  } catch (err) {
    return { error: err.message || "Terjadi kesalahan saat menyimpan produk." };
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function ubahProdukAction(prevState, formData) {
  if (!(await ambilAdmin())) {
    return { error: PESAN_BELUM_LOGIN };
  }

  const id = Number(formData?.get?.("id"));
  if (!Number.isInteger(id)) {
    return { error: "ID produk tidak valid." };
  }

  const { data, error } = bacaFormProduk(formData);
  if (error) {
    return { error };
  }

  try {
    const supabase = createServerClient();
    const errorFoto = await unggahFoto(supabase, formData, data);
    if (errorFoto) {
      return { error: errorFoto };
    }
    const { error: errorDb } = await supabase.from("produk").update(data).eq("id", id);
    if (errorDb) {
      return { error: errorDb.message || "Gagal menyimpan perubahan." };
    }
  } catch (err) {
    return { error: err.message || "Terjadi kesalahan saat menyimpan perubahan." };
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function hapusProdukAction(formData) {
  if (!(await ambilAdmin())) {
    redirect("/admin/login");
  }

  const id = Number(formData?.get?.("id"));
  if (!Number.isInteger(id)) {
    return;
  }

  const supabase = createServerClient();
  await supabase.from("produk").delete().eq("id", id);

  revalidatePath("/", "layout");
  redirect("/admin");
}

// US-14: buat deskripsi produk dengan Gemini API dari nama dan kategori.
export async function buatDeskripsiAction(nama, kategori) {
  if (!(await ambilAdmin())) {
    return { error: PESAN_BELUM_LOGIN };
  }

  const namaBersih = String(nama ?? "").trim();
  const kategoriBersih = String(kategori ?? "").trim();
  if (!namaBersih) {
    return { error: "Isi nama produk dulu sebelum membuat deskripsi." };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { error: "GEMINI_API_KEY belum diatur di environment variable." };
  }

  // Model utama dulu; jika sibuk (503/429) atau tidak tersedia (404), coba model cadangan.
  const daftarModel = [
    process.env.GEMINI_MODEL || "gemini-3.8-flash",
    "gemini-3.5-flash",
    "gemini-3.5-flash-lite",
  ];
  const prompt =
    `Tulis deskripsi produk dalam bahasa Indonesia untuk katalog toko UMKM, 2 sampai 3 kalimat, ` +
    `ramah dan jujur, tanpa emoji, tanpa tanda kutip, dan jangan mengarang klaim kesehatan.
` +
    `Nama produk: ${namaBersih}
Kategori: ${kategoriBersih || "-"}`;

  try {
    let respons = null;
    for (const model of daftarModel) {
      respons = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );
      if (respons.ok || ![404, 429, 500, 503].includes(respons.status)) {
        break;
      }
    }

    if (!respons.ok) {
      return {
        error:
          respons.status === 503 || respons.status === 429
            ? "Gemini sedang sibuk. Tunggu sebentar lalu klik tombol lagi."
            : `Gemini menolak permintaan (kode ${respons.status}).`,
      };
    }

    const hasil = await respons.json();
    const teks = (hasil?.candidates?.[0]?.content?.parts ?? [])
      .filter((bagian) => !bagian.thought && bagian.text)
      .map((bagian) => bagian.text)
      .join("")
      .trim();
    if (!teks) {
      return { error: "Gemini tidak mengembalikan teks. Coba lagi." };
    }
    return { deskripsi: teks };
  } catch (err) {
    return { error: err.message || "Gagal menghubungi Gemini." };
  }
}
