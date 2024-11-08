// src/components/image/types.ts
export type MenuCategory = 
  | 'arroces' 
  | 'carnes' 
  | 'del-huerto' 
  | 'del-mar' 
  | 'para-compartir' 
  | 'para-peques' 
  | 'para-veganos' 
  | 'postres';

export interface ImageUploadProps {
  category: MenuCategory;
  itemName: string;
  onUploadComplete: (url: string) => void;
  onError: (error: string) => void;
}

export interface FilePreview {
  file: File;
  preview: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}