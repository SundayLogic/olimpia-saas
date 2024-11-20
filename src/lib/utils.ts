import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Classname utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

// Format date
export function formatDate(date: string | Date, formatString: string = "PP"): string {
  return format(new Date(date), formatString, { locale: es });
}

// Format relative time
export function formatRelativeTime(date: string | Date): string {
  const now = Date.now();
  const timestamp = new Date(date).getTime();
  const seconds = Math.floor((now - timestamp) / 1000);

  // Less than a minute
  if (seconds < 60) {
    return "just now";
  }

  // Less than an hour
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  }

  // Less than a day
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }

  // For older dates, use date-fns format
  return format(new Date(date), "PP", { locale: es });
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// File size formatter
export function formatFileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

// Slug generator
export function generateSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// URL validator
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Email validator
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Random ID generator
export function generateId(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => 
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('');
}

// Deep clone utility
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// Object comparison
export function isEqual(obj1: any, obj2: any): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

// Array shuffle utility
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Truncate text
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

// Parse boolean
export function parseBoolean(value: any): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }
  return !!value;
}

// Check if object is empty
export function isEmpty(obj: object): boolean {
  return Object.keys(obj).length === 0;
}

// Remove undefined values from object
export function removeUndefined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined)
  ) as Partial<T>;
}