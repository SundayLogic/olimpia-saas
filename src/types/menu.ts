// src/types/menu.ts

// Basic Types
export interface MenuItem {
  id: number;              // Changed to number since it's bigint in DB
  name: string;
  description: string;
  price: number;
  image_url: string | null;     // Added from DB structure
  image_path: string | null;    // Made nullable
  image_alt: string | null;     // Added from DB structure
  image_thumbnail_path: string | null;  // Added from DB structure
  category_id: number;    // Changed to number
  active: boolean;       // Added from DB structure
  allergens: number[];   // Changed to number array
  created_at: string;
  updated_at: string;
}

export interface Wine {
  id: number;
  name: string;
  description: string;
  bottle_price: number;
  glass_price: number;
  category_id: number;
  active: boolean;
  created_at: string;
}


export interface Category {
  id: number;          // Changed to number
  name: string;
  display_order: number; // Added from DB structure
}

export interface Allergen {
  id: number;         // Changed to number
  name: string;
}

// Form Types
export interface MenuItemFormData {
  name: string;
  description: string;
  price: number;
  category_id: number;    // Changed to number
  image_url?: string;     // Made optional
  image_path?: string;    // Made optional
  image_alt?: string;     // Added
  image_thumbnail_path?: string;  // Added
  active?: boolean;       // Added
  allergens: number[];    // Changed to number array
}

export interface WineFormData {
  name: string;
  description: string;
  bottle_price: number;   // Changed to match DB
  glass_price: number;    // Changed to match DB
  category_id: number;    // Changed to number
  active?: boolean;       // Added
}

// Response Types
export interface MenuItemResponse {
  data: MenuItem | null;
  error: Error | null;
}

export interface WineResponse {
  data: Wine | null;
  error: Error | null;
}

// Props Types (keeping the same but updating types)
export interface MenuCardProps {
  item: MenuItem | Wine;
  type: 'menu' | 'wine';
  onEdit: (id: number, data: MenuItemFormData | WineFormData) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  categories: Category[];
  allergens?: Allergen[];
  isEditing: boolean;
  onEditToggle: (id: number | null) => void;
}

export interface MenuNavProps {
  categories: Category[];
  activeCategory: number | null;  // Changed to number | null
  onCategoryChange: (id: number | null) => void;  // Changed to number | null
  type: 'menu' | 'wine';
}

export interface MenuSearchProps {
  onSearch: (query: string) => void;
  onCategoryFilter: (categoryId: number | null) => void;  // Changed to number | null
  categories: Category[];
}

export interface MenuEditorProps {
  item?: MenuItem | Wine;
  type: 'menu' | 'wine';
  onSave: (data: MenuItemFormData | WineFormData) => Promise<void>;
  onCancel: () => void;
  categories: Category[];
  allergens?: Allergen[];
}

// Supabase Realtime Types
export interface RealtimePayload<T> {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: T;
  old: {
    id: number;  // Changed to number
  };
}