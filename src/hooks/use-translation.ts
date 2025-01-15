// /src/hooks/use-translation.ts
import { useTranslation as useReactI18Next } from 'react-i18next';

// Simple wrapper to keep a consistent naming or custom logic:
export function useTranslation(ns?: string) {
  // If you have a specific namespace, you can pass it, e.g., "sidebar"
  return useReactI18Next(ns);
}
