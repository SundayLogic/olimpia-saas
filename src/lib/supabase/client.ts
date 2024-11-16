
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
      menu_items: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          image_path: string;
          category_id: string;
          is_daily_menu: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          description: string;
          price: number;
          category_id: string;
          image_path?: string;
          is_daily_menu?: boolean;
        };
        Update: {
          name?: string;
          description?: string;
          price?: number;
          category_id?: string;
          image_path?: string;
          is_daily_menu?: boolean;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          description?: string;
        };
        Update: {
          name?: string;
          description?: string;
          updated_at?: string;
        };
      };
      allergens: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
        };
        Update: {
          name?: string;
          updated_at?: string;
        };
      };
      menu_item_allergens: {
        Row: {
          id: string;
          menu_item_id: string;
          allergen_id: string;
          created_at: string;
        };
        Insert: {
          menu_item_id: string;
          allergen_id: string;
        };
        Update: {
          menu_item_id?: string;
          allergen_id?: string;
        };
      };
      daily_menus: {
        Row: {
          id: number;
          date: string;
          price: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          date: string;
          price: number;
          active?: boolean;
        };
        Update: {
          date?: string;
          price?: number;
          active?: boolean;
          updated_at?: string;
        };
      };
      daily_menu_first_courses: {
        Row: {
          id: number;
          daily_menu_id: number;
          name: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          daily_menu_id: number;
          name: string;
          display_order: number;
        };
        Update: {
          name?: string;
          display_order?: number;
        };
      };
      daily_menu_second_courses: {
        Row: {
          id: number;
          daily_menu_id: number;
          name: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          daily_menu_id: number;
          name: string;
          display_order: number;
        };
        Update: {
          name?: string;
          display_order?: number;
        };
      };
      wines: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          category_id: string;
          grape_varieties: string;
          aging_info: string;
          denomination: string;
          image_path: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          description: string;
          price: number;
          category_id: string;
          grape_varieties?: string;
          aging_info?: string;
          denomination?: string;
          image_path?: string;
        };
        Update: {
          name?: string;
          description?: string;
          price?: number;
          category_id?: string;
          grape_varieties?: string;
          aging_info?: string;
          denomination?: string;
          image_path?: string;
          updated_at?: string;
        };
      };
      wine_categories: {
        Row: {
          id: string;
          name: string;
          description: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          description?: string;
        };
        Update: {
          name?: string;
          description?: string;
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

// Entity Types
export type DbUser = TableRow<'users'>;
export type DbProfile = TableRow<'profiles'>;
export type DbDataEntry = TableRow<'data_entries'>;
export type DbMenuItem = TableRow<'menu_items'>;
export type DbCategory = TableRow<'categories'>;
export type DbAllergen = TableRow<'allergens'>;
export type DbMenuItemAllergen = TableRow<'menu_item_allergens'>;
export type DbDailyMenu = TableRow<'daily_menus'>;
export type DbDailyMenuFirstCourse = TableRow<'daily_menu_first_courses'>;
export type DbDailyMenuSecondCourse = TableRow<'daily_menu_second_courses'>;
export type DbWine = TableRow<'wines'>;
export type DbWineCategory = TableRow<'wine_categories'>;

// Extended Types
export interface DbDataEntryWithUser extends DbDataEntry {
  user: DbUser;
}

export interface DbMenuItemWithRelations extends DbMenuItem {
  category: DbCategory;
  allergens: DbAllergen[];
}

export interface DbWineWithRelations extends DbWine {
  category: DbWineCategory;
}

// Create a singleton instance
let client: ReturnType<typeof createClientComponentClient<Database>>;

export const getSupabaseClient = () => {
  if (!client) {
    client = createClientComponentClient<Database>();
  }
  return client;
};