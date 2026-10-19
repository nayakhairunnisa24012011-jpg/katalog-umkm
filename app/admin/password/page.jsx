import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/session";
import NavAdmin from "@/components/NavAdmin";
import FormGantiPassword from "@/components/FormGantiPassword";

export const dynamic = "force-dynamic";

export default async function HalamanGantiPassword() {
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
      <div>
        <h1 className="text-2xl font-extrabold">Ganti password</h1>
        <p className="mt-1 text-sm text-teks-lembut">
          Ganti password bawaan segera setelah pertama kali masuk. Minimal 8 karakter.
        </p>
      </div>
      <FormGantiPassword />
    </div>
  );
}
