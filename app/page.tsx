import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  try {
    // Check auth status
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Redirect based on auth status
    if (!session) {
      redirect("/login");
    } else {
      // Get user profile
      const { data: profile } = await supabase
        .from('users')
        .select('role, active')
        .eq('id', session.user.id)
        .single();

      // Check if user is active
      if (profile && !profile.active) {
        // Sign out inactive users
        await supabase.auth.signOut();
        redirect("/login?error=Account%20is%20inactive");
      }

      // Redirect to dashboard for active users
      redirect("/dashboard");
    }
  } catch (error) {
    console.error('Error in root page:', error);
    redirect("/login?error=Something%20went%20wrong");
  }

  // This return is technically unreachable but satisfies TypeScript
  return null;
}