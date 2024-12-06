import type { ReactNode } from 'react';

// Core Database Types
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
          id?: string;
          email: string;
          name?: string;
          role?: 'admin' | 'user';
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
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
          active?: boolean;
          updated_at?: string;
        };
      };

      menu_item_allergens: {
        Row: {
          menu_item_id: string;
          allergen_id: string;
          created_at: string;
        };
        Insert: {
          menu_item_id: string;
          allergen_id: string;
          created_at?: string;
        };
        Update: {
          menu_item_id?: string;
          allergen_id?: string;
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
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          updated_at?: string;
        };
      };

      menu_categories: {
        Row: {
          id: string;
          name: string;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          display_order?: number;
          updated_at?: string;
        };
      };

      // ===== Added daily_menus and daily_menu_items Tables =====
      daily_menus: {
  Row: {
    id: string;
    date: string;
    repeat_pattern: "none" | "weekly" | "monthly";
    active: boolean;
    scheduled_for: string;
    created_at: string;
    daily_menu_items?: {
      id: string;
      course_name: string;
      course_type: "first" | "second";
      display_order: number;
      daily_menu_id: string;
    }[];
  };
  Insert: {
    date: string;
    repeat_pattern?: "none" | "weekly" | "monthly";
    active?: boolean;
    scheduled_for: string;
    created_at?: string;
  };
  Update: {
    date?: string;
    repeat_pattern?: "none" | "weekly" | "monthly";
    active?: boolean;
    scheduled_for?: string;
  };
};

      daily_menu_items: {
        Row: {
          id: string;
          course_name: string;
          course_type: "first" | "second";
          display_order: number;
          daily_menu_id: string;
        };
        Insert: {
          course_name: string;
          course_type: "first" | "second";
          display_order: number;
          daily_menu_id: string;
        };
        Update: {
          course_name?: string;
          course_type?: "first" | "second";
          display_order?: number;
          daily_menu_id?: string;
        };
      };

      // ===== New Tables for Wines =====
      wines: {
        Row: {
          id: number;
          name: string;
          description: string;
          bottle_price: number;
          glass_price: number | null;
          active: boolean;
          created_at: string;
          image_path: string | null;
          image_url: string | null;
        };
        Insert: {
          name: string;
          description?: string;
          bottle_price: number;
          glass_price?: number | null;
          active?: boolean;
          created_at?: string;
          image_path?: string | null;
          image_url?: string | null;
        };
        Update: {
          name?: string;
          description?: string;
          bottle_price?: number;
          glass_price?: number | null;
          active?: boolean;
          image_path?: string | null;
          image_url?: string | null;
        };
      };

      wine_categories: {
        Row: {
          id: number;
          name: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          name: string;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          name?: string;
          display_order?: number;
        };
      };

      wine_category_assignments: {
        Row: {
          wine_id: number;
          category_id: number;
        };
        Insert: {
          wine_id: number;
          category_id: number;
        };
        Update: {
          wine_id?: number;
          category_id?: number;
        };
      };
      // ===== End of New Tables =====
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      match_user: {
        Args: { email: string };
        Returns: Array<{
          id: string;
          email: string;
          role: 'admin' | 'user';
          active: boolean;
        }>;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
};

// Component & Form Types
export type CommonProps = {
  className?: string;
  children?: ReactNode;
};

// User Related Types
export type User = Database['public']['Tables']['users']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];

export type UserRole = 'admin' | 'user';

export type UserFormData = {
  email: string;
  name: string;
  role: UserRole;
  active: boolean;
};

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
};

export type Session = {
  user: AuthUser;
  accessToken: string;
};

// Menu Related Types
export type MenuItem = Database['public']['Tables']['menu_items']['Row'] & {
  menu_categories?: {
    id: string;
    name: string;
    display_order: number;
  };
  menu_item_allergens?: Array<{
    allergens: {
      id: string;
      name: string;
    };
  }>;
};

export type MenuItemInsert = Database['public']['Tables']['menu_items']['Insert'];
export type MenuItemUpdate = Database['public']['Tables']['menu_items']['Update'];

export type MenuAllergen = Database['public']['Tables']['allergens']['Row'];
export type MenuCategory = Database['public']['Tables']['menu_categories']['Row'];

export type MenuItemAllergen = Database['public']['Tables']['menu_item_allergens']['Row'];

export type MenuItemFormData = {
  name: string;
  description: string;
  price: number;
  category_id: number;
  image_url?: string | null;
  image_path?: string | null;
  allergen_ids: string[];
  active?: boolean;
};

export type MenuItemEditFormData = Omit<MenuItemFormData, 'active'>;

// **Added Relation Types**
export type MenuItemWithRelations = MenuItem & {
  category: MenuCategory | null;
  allergens: MenuAllergen[];
};

export type MenuItemResponse = Database['public']['Tables']['menu_items']['Row'] & {
  menu_categories: Pick<MenuCategory, 'id' | 'name'>;
  menu_item_allergens: Array<{
    allergens: Pick<MenuAllergen, 'id' | 'name'>;
  }>;
};

// Form State Types
export type FormState = {
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
};

export type DialogState<T = unknown> = {
  isOpen: boolean;
  type: 'create' | 'edit' | 'delete' | null;
  data: T | null;
};

// Component Specific Types
export type TableColumn<T> = {
  title: string;
  field: keyof T;
  render?: (value: T[keyof T], item: T) => ReactNode;
};

export type ImageUploadState = {
  file: File | null;
  preview: string | null;
  error: string | null;
  isUploading: boolean;
};

// API Response Types
export type ApiSuccessResponse<T> = {
  data: T;
  error: null;
  status: 200 | 201 | 204;
  count?: number;
};

export type ApiErrorResponse = {
  data: null;
  error: {
    message: string;
    code?: string;
    details?: unknown;
    hint?: string;
    status?: number;
  };
  status: 400 | 401 | 403 | 404 | 500;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Pagination Types
export type PaginationParams = {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

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

// Filter Types
export type FilterParams = {
  search?: string;
  category?: string;
  status?: 'active' | 'inactive';
  startDate?: string;
  endDate?: string;
};

export type RequestParams = PaginationParams & FilterParams;

// Supabase Response Types
export type SupabaseResponse<T> = {
  data: T | null;
  error: {
    message: string;
    details?: string;
    hint?: string;
    code?: string;
  } | null;
  count?: number | null;
  status: number;
  statusText: string;
};

// Error Types
export type ErrorResponse = {
  message: string;
  code?: string;
  status: number;
  details?: Record<string, unknown>;
};

// File & Image Types
export type FileUpload = {
  file: File;
  path: string;
  category: string;
};

export type ImageMetadata = {
  width: number;
  height: number;
  format: string;
  size: number;
  url: string;
};

export type ImageUploadResponse = {
  url: string;
  path: string;
  metadata: ImageMetadata;
};

// Utility Types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type ValueOf<T> = T[keyof T];

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P];
};

// Object Key Types
export type ObjectKeys<T> = keyof T;
export type ObjectValues<T> = T[keyof T];

// Function Types
export type AsyncFunction<T = void> = () => Promise<T>;
export type AsyncFunctionWithParam<P, T = void> = (param: P) => Promise<T>;
export type VoidFunction = () => void;
export type ErrorHandler = (error: unknown) => void;

// Event Types
export type EventHandler<T = void> = (event: Event) => T;
export type ChangeHandler<T = string> = (value: T) => void;
export type SubmitHandler<T> = (data: T) => void | Promise<void>;

// Realtime Types
export type RealtimeSubscription = {
  unsubscribe: () => void;
};

export type RealtimeMessage<T> = {
  event: string;
  payload: T;
};

export type RealtimeChannel<T = unknown> = {
  subscribe: (callback: (payload: T) => void) => RealtimeSubscription;
  unsubscribe: () => void;
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

export function isMenuItem(value: unknown): value is MenuItem {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'price' in value &&
    'category_id' in value
  );
}

export function isValidImage(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  return validTypes.includes(file.type) && file.size <= MAX_FILE_SIZE;
}

// Constants
export const ROLES = ['admin', 'user'] as const;
export type Role = typeof ROLES[number];

export const IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'webp'] as const;
export type ImageFormat = typeof IMAGE_FORMATS[number];

export const SORT_ORDERS = ['asc', 'desc'] as const;
export type SortOrder = typeof SORT_ORDERS[number];

export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE'] as const;
export type HttpMethod = typeof HTTP_METHODS[number];

export const MENU_CATEGORIES = [
  'appetizers',
  'main-courses',
  'desserts',
  'beverages',
  'specials'
] as const;
export type MenuCategoryType = typeof MENU_CATEGORIES[number];

export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
export const MAX_IMAGE_DIMENSION = 2048; // pixels
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp'
] as const;

// Validation Types
export type ValidationError = {
  path: string[];
  message: string;
  type?: string;
  value?: unknown;
};

export type ValidationResult = {
  valid: boolean;
  errors: ValidationError[];
};

export type FormValidation = {
  [key: string]: boolean | string | undefined;
  isValid: boolean;
  message?: string;
};

export type ValidationRule = {
  type: 'required' | 'email' | 'min' | 'max' | 'pattern' | 'custom';
  value?: number | string | RegExp;
  message: string;
  validator?: (value: unknown) => boolean;
};

export type ValidationSchema = {
  [key: string]: ValidationRule[];
};

// Form Control Types
export type FormControl = {
  value: unknown;
  error: string | null;
  touched: boolean;
  dirty: boolean;
};

export type FormControls = {
  [key: string]: FormControl;
};

// Status Types
export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type StatusCode = typeof STATUS_CODES[keyof typeof STATUS_CODES];

export class ValidationException extends Error {
  constructor(message: string, public errors: ValidationError[]) {
    super(message);
    this.name = 'ValidationException';
    Object.setPrototypeOf(this, ValidationException.prototype);
  }
}

export class ApiError extends Error {
  constructor(message: string, public status: number, public code?: string) {
    super(message);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// Utility Functions
export function createFormControl(initialValue: unknown = ''): FormControl {
  return {
    value: initialValue,
    error: null,
    touched: false,
    dirty: false,
  };
}

export function isFormValid(controls: FormControls): boolean {
  return Object.values(controls).every(
    control => !control.error && control.touched
  );
}
