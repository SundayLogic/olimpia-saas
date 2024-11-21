// src/lib/supabase.ts
import { createClientComponentClient, createServerComponentClient, createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { cache } from "react";
import type { Database } from "@/types";
import type {  RealtimePostgresChangesPayload } from '@supabase/supabase-js';

// Client Component Client (for client-side)
export const createClient = () => {
  return createClientComponentClient<Database>();
};

// Cached Server Component Client (for server components)
export const createServerClient = cache(() => {
  const cookieStore = cookies();
  return createServerComponentClient<Database>({ cookies: () => cookieStore });
});

// Server Action Client (for use in Server Actions)
export const createActionClient = () => {
  const cookieStore = cookies();
  return createServerActionClient<Database>({ cookies: () => cookieStore });
};

// Authentication Helper Functions
export const getSession = async () => {
  const supabase = createServerClient();
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export const getUserProfile = async () => {
  const session = await getSession();
  if (!session?.user?.id) return null;

  const supabase = createServerClient();
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

// Database Helper Functions
export const getMenuItems = async () => {
  const supabase = createServerClient();
  try {
    const { data, error } = await supabase
      .from("menu_items")
      .select(`
        *,
        category:categories(id, name),
        menu_item_allergens!inner(
          allergen:allergens(*)
        )
      `)
      .order("name");

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

export const getCategories = async () => {
  const supabase = createServerClient();
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

// Storage Helper Functions
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File
) => {
  const supabase = createClient();
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const deleteFile = async (
  bucket: string,
  path: string
) => {
  const supabase = createClient();
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Types for Realtime Subscriptions
type TableName = Database['public']['Tables'][keyof Database['public']['Tables']];
type RealtimePayload<T extends TableName> = RealtimePostgresChangesPayload<T['Row']>;

// Realtime Subscription Helper Functions
export const subscribeToChanges = <T extends TableName>(
  table: string,
  callback: (payload: RealtimePayload<T>) => void
): (() => void) => {
  const supabase = createClient();
  
  const subscription = supabase
    .channel('db_changes')
    .on<T['Row']>(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table
      },
      (payload) => callback(payload as RealtimePayload<T>)
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
};

// Error Types
export interface SupabaseErrorDetails {
  message: string;
  code: string;
  details?: string;
}

// Error Handling Helper
export class SupabaseError extends Error {
  constructor(
    message: string,
    public code: string,
    public details: string
  ) {
    super(message);
    this.name = "SupabaseError";
  }
}

export const handleError = (error: unknown) => {
  console.error("Supabase Error:", error);
  
  if (
    error &&
    typeof error === 'object' &&
    'code' in error &&
    'message' in error &&
    typeof error.message === 'string' &&
    typeof error.code === 'string'
  ) {
    throw new SupabaseError(
      error.message,
      error.code,
      'details' in error && typeof error.details === 'string' ? error.details : ""
    );
  }
  
  throw new Error("An unexpected error occurred");
};