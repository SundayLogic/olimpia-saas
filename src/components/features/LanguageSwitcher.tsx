// /src/components/features/LanguageSwitcher.tsx
"use client";

import React, { useState } from "react";
import i18n from "@/lib/i18n";
import { useTranslation } from "@/hooks/use-translation";

// If you placed flags in public/flags
import Image from "next/image";

// Example: each object has language code + path to the PNG or SVG
const LANGUAGES = [
  { code: "es", label: "Español", flagSrc: "/flags/es.png" },
  { code: "en", label: "English", flagSrc: "/flags/en.png" },
  { code: "ro", label: "Română", flagSrc: "/flags/ro.png" },
];

export default function LanguageSwitcher() {
  // We'll re-render when user picks a new language
  const [currentLng, setCurrentLng] = useState(i18n.language);

  // For any translation text in the switcher itself (optional).
  const { t } = useTranslation("common");

  const handleChange = async (lngCode: string) => {
    await i18n.changeLanguage(lngCode);
    setCurrentLng(lngCode);
    // Optionally store chosen language in localStorage
    localStorage.setItem("appLang", lngCode);
  };

  return (
    <div className="flex flex-col gap-2 pt-2">
      <span className="text-sm font-semibold">
        {t("chooseLanguage") /* a key from your JSON, e.g. "Choose language" */}
      </span>
      <div className="flex gap-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleChange(lang.code)}
            className={`rounded p-1 ${
              lang.code === currentLng ? "border border-primary" : "border"
            }`}
          >
            <Image
              src={lang.flagSrc}
              alt={lang.label}
              width={24}
              height={16}
              style={{ objectFit: "cover" }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
