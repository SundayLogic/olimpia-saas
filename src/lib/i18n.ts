// /src/lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Example local JSON resources
import en from '@/locales/en.json';
import es from '@/locales/es.json';
import ro from '@/locales/ro.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en,
      es,
      ro,
    },
    lng: 'es', // default language
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false, 
    },
  })
  .catch((err) => console.error('i18n init error:', err));

export default i18n;
