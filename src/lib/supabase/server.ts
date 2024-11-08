import { createServerComponentClient, createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { cache } from "react";
import type { Database, DbDataEntryWithUser } from "./client";

// Cached server component client
export const createServerClient = cache(() => {
  const cookieStore = cookies();
  return createServerComponentClient<Database>({ cookies: () => cookieStore });
});

// Server action client (for use in Server Actions)
export const createActionClient = () => {
  const cookieStore = cookies();
  return createServerActionClient<Database>({ cookies: () => cookieStore });
};

// Cached session getter
export const getSession = cache(async () => {
  const supabase = createServerClient();
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
});

// User profile getter with error handling
export const getUserProfile = cache(async () => {
  const session = await getSession();
  if (!session?.user.id) return null;

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('profiles')
    .select()
    .eq('user_id', session.user.id)
    .single();

  if (error) {
    console.error("Error:", error);
    return null;
  }

  return data;
});

// Data entries getter with pagination and error handling
export async function getDataEntries(page = 1, limit = 10) {
  const supabase = createServerClient();
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  try {
    const { data, error, count } = await supabase
      .from('data_entries')
      .select(`
        *,
        user:users!inner(*)
      `)
      .order('created_at', { ascending: false })
      .range(start, end);

    if (error) throw error;

    return {
      data: data as unknown as DbDataEntryWithUser[],
      count: count || 0
    };
  } catch (error) {
    console.error("Error:", error);
    return { data: [], count: 0 };
  }
}

// Protected route session checker
export async function checkSession() {
  const session = await getSession();
  return !!session;
}