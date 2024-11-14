// Basic Types
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_path: string;
  category_id: string;
  is_daily_menu: boolean;
  created_at: string;
  updated_at: string;
  allergens: string[];
}

export interface Wine {
  id: string;
  name: string;
  description: string;
  price: number;
  image_path: string;
  category_id: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Allergen {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

// Form Types
export interface MenuItemFormData {
  name: string;
  description: string;
  price: number;
  category_id: string;
  image_path: string;
  allergens: string[];
}

export interface WineFormData {
  name: string;
  description: string;
  price: number;
  category_id: string;
  image_path: string;
}

// Props Types
export interface MenuCardProps {
  item: MenuItem | Wine;
  type: 'menu' | 'wine';
  onEdit: (id: string, data: MenuItemFormData | WineFormData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  categories: Category[];
  allergens?: Allergen[];
  isEditing: boolean;
  onEditToggle: (id: string | null) => void;
}

export interface MenuNavProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
  type: 'menu' | 'wine';
}

export interface MenuSearchProps {
  onSearch: (query: string) => void;
  onCategoryFilter: (categoryId: string) => void;
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