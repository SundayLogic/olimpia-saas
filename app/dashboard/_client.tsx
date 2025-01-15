"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  LogOut,
  LayoutDashboard,
  Users,
  Settings,
  ImageIcon,
  MenuSquare,
  ClipboardList,
  Wine,
  BookOpen,
} from "lucide-react";
import LanguageFlagSwitcher from "@/components/features/LanguageSwitcher";

export default function DashboardClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation("sidebar"); // Using "sidebar" namespace

  // Example user data
  const userName = "John Doe";
  const userRole = "admin";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b px-6 py-4">
            <Link href="/dashboard" className="flex items-center text-lg font-semibold">
              {t("dashboard")}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            <Link href="/dashboard">
              <div className="flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                {t("dashboard")}
              </div>
            </Link>

            <div className="pt-4">
              <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("menuManagement")}
              </h2>
              <Link href="/dashboard/menu">
                <div className="flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  {t("menuItems")}
                </div>
              </Link>
              <Link href="/dashboard/menu/daily">
                <div className="flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                  <MenuSquare className="mr-2 h-4 w-4" />
                  {t("dailyMenu")}
                </div>
              </Link>
              <Link href="/dashboard/menu/wine">
                <div className="flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                  <Wine className="mr-2 h-4 w-4" />
                  {t("wineList")}
                </div>
              </Link>
            </div>

            <div className="pt-4">
              <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("blog")}
              </h2>
              <Link href="/dashboard/blog">
                <div className="flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                  <BookOpen className="mr-2 h-4 w-4" />
                  {t("blogPosts")}
                </div>
              </Link>
            </div>

            <div className="pt-4">
              <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("assets")}
              </h2>
              <Link href="/dashboard/images">
                <div className="flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  {t("images")}
                </div>
              </Link>
            </div>

            {userRole === "admin" && (
              <div className="pt-4">
                <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("admin")}
                </h2>
                <Link href="/dashboard/users">
                  <div className="flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                    <Users className="mr-2 h-4 w-4" />
                    {t("users")}
                  </div>
                </Link>
                <Link href="/dashboard/settings">
                  <div className="flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                    <Settings className="mr-2 h-4 w-4" />
                    {t("settings")}
                  </div>
                </Link>
              </div>
            )}
          </nav>

          {/* Bottom row: user info + language switcher */}
          <div className="border-t p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
              </div>
              <button
                type="button"
                className="rounded-full p-2 hover:bg-accent hover:text-accent-foreground"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>

            {/* Language Switcher with flags */}
            <div className="mt-3">
              <LanguageFlagSwitcher />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pl-64 w-full">
        <div className="h-full min-h-screen bg-background">{children}</div>
      </main>
    </div>
  );
}
