"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function LanguageFlagSwitcher() {
  const { i18n } = useTranslation();

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "ro", name: "Română", flag: "🇷🇴" },
  ];

  // e.g. "en", "es", etc.
  const currentLang = i18n.language;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-black">
          {/* Show the current language's flag & label */}
          {languages.map((lang) =>
            lang.code === currentLang ? (
              <React.Fragment key={lang.code}>
                <span className="mr-2">{lang.flag}</span>
                <span>{lang.name}</span>
              </React.Fragment>
            ) : null
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            className="cursor-pointer"
            onClick={() => i18n.changeLanguage(lang.code)}
          >
            <span className="mr-2">{lang.flag}</span>
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
