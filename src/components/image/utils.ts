// components/image/utils.ts
import { ValidationResult } from './types';

export const validateFile = (file: File): ValidationResult => {
  // Check file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Only JPG, PNG or WebP files are allowed'
    };
  }

  // Check file size (2MB max)
  const maxSize = 2 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File is too large. Maximum size is 2MB'
    };
  }

  return { isValid: true };
};

export const generateFileName = (itemName: string, originalName: string): string => {
  const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  const cleanName = itemName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '')     // Remove special characters
    .trim()
    .replace(/\s+/g, '-');            // Replace spaces with hyphens

  const timestamp = Date.now();
  return `${cleanName}-${timestamp}.${extension}`;
};