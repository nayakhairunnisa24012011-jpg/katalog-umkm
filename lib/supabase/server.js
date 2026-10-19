import { createClient } from "@supabase/supabase-js";

export function createServerClient() {
  const supabaseUrl = process.env.SUPABASE_URL?.trim();
  const supabaseKey = process.env.SUPABASE_SECRET_KEY?.trim();

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_SECRET_KEY belum diatur di environment variable."
    );
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export { createServerClient as createClient };
export default createServerClient;
