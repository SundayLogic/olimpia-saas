import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  // If there's an error, just redirect without logging to console
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      redirect("/login");
    }

    const { data: profile } = await supabase
      .from('users')
      .select('active') // only select what we need
      .eq('id', session.user.id)
      .single();

    if (profile && !profile.active) {
      await supabase.auth.signOut();
      redirect("/login?error=Account%20is%20inactive");
    }

    redirect("/dashboard");
  } catch {
    redirect("/login?error=Something%20went%20wrong");
  }

  return null; // unreachable, satisfies TypeScript
}
