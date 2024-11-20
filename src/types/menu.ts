// src/types/menu.ts

// Utility Types
export type ImagePath = string | null;
export type ValidImageSource = `/images/${string}` | `http${string}` | null;

// Basic Types
export interface MenuItem {
  id: number;              
  name: string;
  description: string;
  price: number;
  image_url: ValidImageSource;     
  image_path: ValidImageSource;    
  image_alt: string | null;     
  image_thumbnail_path: ValidImageSource;  
  category_id: number;    
  active: boolean;       
  allergens: number[];   
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
  id: number;          
  name: string;
  display_order: number; 
}

export interface Allergen {
  id: number;         
  name: string;
}

// Image Related Types
export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageMetadata {
  dimensions: ImageDimensions;
  format: string;
  size: number;
}

// Form Types
export interface MenuItemFormData {
  name: string;
  description: string;
  price: number;
  category_id: number;    
  image_url?: ValidImageSource;     
  image_path?: ValidImageSource;    
  image_alt?: string;     
  image_thumbnail_path?: ValidImageSource;  
  active?: boolean;       
  allergens: number[];    
}

export interface WineFormData {
  name: string;
  description: string;
  bottle_price: number;   
  glass_price: number;    
  category_id: number;    
  active?: boolean;       
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

// Image Response Types
export interface ImageUploadResponse {
  path: ValidImageSource;
  error: Error | null;
}

export interface ImageValidationError {
  code: string;
  message: string;
  field?: string;
}

// Props Types
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
  activeCategory: number | null;  
  onCategoryChange: (id: number | null) => void;  
  type: 'menu' | 'wine';
}

export interface MenuSearchProps {
  onSearch: (query: string) => void;
  onCategoryFilter: (categoryId: number | null) => void;  
  categories: Category[];
}

export interface MenuEditorProps {
  item: MenuItem | Wine;
  type: 'menu' | 'wine';
  onSave: (data: MenuItemFormData | WineFormData) => Promise<void>;
  onCancel: () => void;
  categories: Category[];
  allergens?: Allergen[];
}

// Image Related Props
export interface ImageDisplayProps {
  src: ValidImageSource;
  alt: string;
  fallback?: string;
  onError?: (error: ImageValidationError) => void;
}

// Supabase Realtime Types
export interface RealtimePayload<T> {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: T;
  old: {
    id: number;
  };
}

// Utility Type Guards
export const isMenuItem = (item: MenuItem | Wine): item is MenuItem => {
  return 'image_path' in item;
};

export const isValidImagePath = (path: unknown): path is ValidImageSource => {
  if (path === null) return true;
  if (typeof path !== 'string') return false;
  
  return (
    path.startsWith('/images/') ||
    path.startsWith('http://') ||
    path.startsWith('https://')
  );
};

// Constants
export const DEFAULT_IMAGE_PLACEHOLDER = '/images/placeholder-menu-item.jpg';
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp'
] as const;

export const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB