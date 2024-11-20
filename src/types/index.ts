import type { ReactNode } from 'react';

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
export type CommonProps = {
  className?: string;
  children?: ReactNode;
};

// User Types
export type User = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type UserFormData = {
  email: string;
  name: string;
  role: 'admin' | 'user';
  active: boolean;
};

// Auth Types
export type AuthUser = {
  id: string;
  email: string;
  role: 'admin' | 'user';
};

export type Session = {
  user: AuthUser;
  accessToken: string;
};

// Menu Types
export type MenuItem = {
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
};

export type Category = {
  id: number;
  name: string;
  description: string | null;
};

export type DailyMenu = {
  id: number;
  date: string;
  price: number;
  active: boolean;
  items: MenuItem[];
  created_at: string;
  updated_at: string;
};

// Form Types
export type MenuItemFormData = {
  name: string;
  description: string;
  price: number;
  category_id: number;
  image_url?: string | null;
  image_path?: string | null;
  allergens?: string[];
  active?: boolean;
};

// API Response Types
export type ApiSuccessResponse<T> = {
  data: T;
  error: null;
  status: 200 | 201 | 204;
};

export type ApiErrorResponse = {
  data: null;
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
  status: 400 | 401 | 403 | 404 | 500;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Paginated Response Types
export type PaginatedData<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
};

export type PaginatedResponse<T> = ApiSuccessResponse<PaginatedData<T>> & {
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

// Error Types
export type ErrorResponse = {
  message: string;
  code?: string;
  status: number;
  details?: Record<string, unknown>;
};

// Image Types
export type ImageUpload = {
  file: File;
  path: string;
  category: string;
};

export type ImageMetadata = {
  width: number;
  height: number;
  format: string;
  size: number;
};

// Request Types
export type PaginationParams = {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export type FilterParams = {
  search?: string;
  category?: string;
  status?: 'active' | 'inactive';
  startDate?: string;
  endDate?: string;
};

export type RequestParams = PaginationParams & FilterParams;

// Utility Types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type ValueOf<T> = T[keyof T];
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Strongly typed object keys
export type ObjectKeys<T> = keyof T;
export type ObjectValues<T> = T[keyof T];

// Function Types
export type AsyncFunction<T = void> = () => Promise<T>;
export type AsyncFunctionWithParam<P, T = void> = (param: P) => Promise<T>;

// Constants
export const ROLES = ['admin', 'user'] as const;
export type Role = typeof ROLES[number];

export const IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'webp'] as const;
export type ImageFormat = typeof IMAGE_FORMATS[number];

export const SORT_ORDERS = ['asc', 'desc'] as const;
export type SortOrder = typeof SORT_ORDERS[number];

export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE'] as const;
export type HttpMethod = typeof HTTP_METHODS[number];

export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

// Validation Types
export type ValidationError = {
  path: string[];
  message: string;
};

export type ValidationResult = {
  valid: boolean;
  errors: ValidationError[];
};

// Event Types
export type EventHandler<T = void> = (event: Event) => T;

// Realtime Types
export type RealtimeSubscription = {
  unsubscribe: () => void;
};

export type RealtimeMessage<T> = {
  event: string;
  payload: T;
};

// Type Guards
export function isApiSuccessResponse<T>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T> {
  return response.error === null;
}

export function isApiErrorResponse(
  response: ApiResponse<unknown>
): response is ApiErrorResponse {
  return response.error !== null;
}

export function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'email' in value &&
    'role' in value
  );
}