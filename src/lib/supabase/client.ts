import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: string;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          email: string;
          role?: string;
          active?: boolean;
        };
        Update: {
          name?: string;
          email?: string;
          role?: string;
          active?: boolean;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          full_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          user_id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      data_entries: {
        Row: {
          id: string;
          title: string;
          content: string;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          content: string;
          user_id: string;
        };
        Update: {
          title?: string;
          content?: string;
          user_id?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};

// Helper Types
export type Tables = Database['public']['Tables'];
export type TableRow<T extends keyof Tables> = Tables[T]['Row'];

export type DbUser = TableRow<'users'>;
export type DbProfile = TableRow<'profiles'>;
export type DbDataEntry = TableRow<'data_entries'>;

export interface DbDataEntryWithUser extends DbDataEntry {
  user: DbUser;
}

// Create a singleton instance
let client: ReturnType<typeof createClientComponentClient<Database>>;

export const getSupabaseClient = () => {
  if (!client) {
    client = createClientComponentClient<Database>();
  }
  return client;
};