"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSessionClient } from "@/lib/supabase/session";

export async function masukAdmin(prevState, formData) {
  const data = formData instanceof FormData ? formData : (prevState instanceof FormData ? prevState : null);

  const email = data?.get("email")?.toString().trim();
  const password = data?.get("password")?.toString();

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Email atau password salah. Silakan periksa kembali." };
  }

  redirect("/admin");
}

export async function keluarAdmin() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function gantiPassword(prevState, formData) {
  const data = formData instanceof FormData ? formData : (prevState instanceof FormData ? prevState : null);

  const passwordBaru = data?.get("password_baru")?.toString() || "";
  const konfirmasiPassword = data?.get("konfirmasi_password")?.toString() || "";

  if (!passwordBaru || !konfirmasiPassword) {
    return { error: "Semua kolom password wajib diisi." };
  }

  if (passwordBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Konfirmasi password tidak cocok dengan password baru." };
  }

  const supabase = await createSessionClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Anda belum login atau sesi telah berakhir. Silakan login kembali." };
  }

  const { error } = await supabase.auth.updateUser({
    password: passwordBaru,
  });

  if (error) {
    return { error: error.message || "Gagal mengganti password." };
  }

  return { success: true, message: "Password berhasil diganti." };
}

export async function tambahProduk(prevState, formData) {
  const data = formData instanceof FormData ? formData : (prevState instanceof FormData ? prevState : null);

  const nama = data?.get("nama")?.toString().trim();
  const hargaRaw = data?.get("harga")?.toString().trim();
  const kategori = data?.get("kategori")?.toString().trim() || null;
  const foto_url = data?.get("foto_url")?.toString().trim() || null;
  const deskripsi = data?.get("deskripsi")?.toString().trim() || null;

  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }

  if (hargaRaw === undefined || hargaRaw === null || hargaRaw === "") {
    return { error: "Harga produk wajib diisi." };
  }

  const harga = parseInt(hargaRaw, 10);
  if (isNaN(harga) || harga < 0) {
    return { error: "Harga harus berupa angka dan tidak boleh negatif." };
  }

  const supabase = await createSessionClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Anda belum login atau sesi telah berakhir. Silakan login kembali." };
  }

  const { error } = await supabase.from("produk").insert([
    {
      nama,
      harga,
      kategori,
      foto_url,
      deskripsi,
    },
  ]);

  if (error) {
    return { error: error.message || "Gagal menyimpan produk ke database." };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}
