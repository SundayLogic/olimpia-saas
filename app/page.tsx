import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export default async function HomePage() {
  const supabase = createServerComponentClient({ cookies });

  // Check auth status
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redirect based on auth status
  if (!session) {
    redirect("/login");
  } else {
    redirect("/dashboard");
  }

  // This return is technically unreachable but satisfies TypeScript
  return null;
}

// Prevent caching of this page
export const revalidate = 0;

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Disable static generation
export const fetchCache = 'force-no-store';