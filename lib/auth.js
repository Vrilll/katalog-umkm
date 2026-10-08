import { createAdminClient } from "@/lib/supabase/admin";

// Mengembalikan user admin yang sedang login, atau null jika belum login.
// Dipakai di setiap Server Action yang mengubah data.
export async function ambilAdmin() {
  const supabase = await createAdminClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }
  return user;
}
