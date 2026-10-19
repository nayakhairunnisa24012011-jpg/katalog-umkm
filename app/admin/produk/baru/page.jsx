import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/session";
import NavAdmin from "@/components/NavAdmin";
import FormProduk from "@/components/FormProduk";
import { tambahProduk } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function HalamanTambahProduk() {
  const supabase = await createSessionClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Tambah produk</h1>
      <FormProduk action={tambahProduk} labelTombol="Simpan produk" />
    </div>
  );
}
