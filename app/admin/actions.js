"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

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
