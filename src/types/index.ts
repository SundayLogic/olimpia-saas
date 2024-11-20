// Supabase Database Types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'admin' | 'user';
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          email: string;
          name?: string;
          role?: 'admin' | 'user';
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string;
          name?: string;
          role?: 'admin' | 'user';
          active?: boolean;
          updated_at?: string;
        };
      };
      menu_items: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          category_id: number;
          image_url: string | null;
          image_path: string | null;
          allergens: string[];
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          description: string;
          price: number;
          category_id: number;
          image_url?: string | null;
          image_path?: string | null;
          allergens?: string[];
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string;
          price?: number;
          category_id?: number;
          image_url?: string | null;
          image_path?: string | null;
          allergens?: string[];
          active?: boolean;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: number;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          updated_at?: string;
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
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          date?: string;
          price?: number;
          active?: boolean;
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

// Component Props Types
export interface CommonProps {
  className?: string;
  children?: React.ReactNode;
}

// Auth Types
export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Session {
  user: AuthUser;
  accessToken: string;
}

// Menu Types
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: number;
  image_url: string | null;
  image_path: string | null;
  allergens: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
}

export interface DailyMenu {
  id: number;
  date: string;
  price: number;
  active: boolean;
  items: MenuItem[];
  created_at: string;
  updated_at: string;
}

// Form Types
export interface MenuItemFormData {
  name: string;
  description: string;
  price: number;
  category_id: number;
  image_url?: string | null;
  image_path?: string | null;
  allergens?: string[];
  active?: boolean;
}

export interface UserFormData {
  email: string;
  name: string;
  role: 'admin' | 'user';
  active: boolean;
}

// API Response Types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

// Error Types
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// Image Types
export interface ImageUpload {
  file: File;
  path: string;
  category: string;
}

export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  size: number;
}

// Utility Types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type ValueOf<T> = T[keyof T];
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Constants
export const ROLES = ['admin', 'user'] as const;
export type Role = typeof ROLES[number];

export const IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'webp'] as const;
export type ImageFormat = typeof IMAGE_FORMATS[number];

export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

// Validation Schemas (if using Zod)
export interface ValidationError {
  path: string[];
  message: string;
}