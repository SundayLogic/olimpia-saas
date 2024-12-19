export const dynamic = 'force-dynamic'; // Keep if needed due to session checks
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { LayoutDashboard, Users, Settings, LogOut, ImageIcon, MenuSquare, ClipboardList, Wine, BookOpen } from "lucide-react";
import type { Database } from "@/types";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Restaurant management dashboard",
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect("/login");
  }

  const { data: userProfile } = await supabase
    .from("users")
    .select("role, name")
    .eq("id", session.user.id)
    .single();

  // If userProfile doesn't matter for some routes, consider conditional fetch or omit entirely.
  // If userProfile is always needed:
  const userName = userProfile?.name || session.user.email;
  const userRole = userProfile?.role || 'user';

  return (
    <div className="flex min-h-screen">
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background">
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="border-b px-6 py-4">
            <Link href="/dashboard" className="flex items-center text-lg font-semibold">
              Restaurant Dashboard
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            <Link href="/dashboard">
              <div className="flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </div>
            </Link>

            <div className="pt-4">
              <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Menu Management
              </h2>
              {/* Menu items */}
              <Link href="/dashboard/menu">
                <div className="flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Menu Items
                </div>
              </Link>
              <Link href="/dashboard/menu/daily">
                <div className="flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                  <MenuSquare className="mr-2 h-4 w-4" />
                  Daily Menu
                </div>
              </Link>
              <Link href="/dashboard/menu/wine">
                <div className="flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                  <Wine className="mr-2 h-4 w-4" />
                  Wine List
                </div>
              </Link>
            </div>

            <div className="pt-4">
              <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Blog
              </h2>
              <Link href="/dashboard/blog">
                <div className="flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Blog Posts
                </div>
              </Link>
            </div>

            <div className="pt-4">
              <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Assets
              </h2>
              <Link href="/dashboard/images">
                <div className="flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Images
                </div>
              </Link>
            </div>

            {userRole === 'admin' && (
              <div className="pt-4">
                <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Admin
                </h2>
                <Link href="/dashboard/users">
                  <div className="flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                    <Users className="mr-2 h-4 w-4" />
                    Users
                  </div>
                </Link>
                <Link href="/dashboard/settings">
                  <div className="flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </div>
                </Link>
              </div>
            )}
          </nav>

          {/* User Section */}
          <div className="border-t p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
              </div>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="rounded-full p-2 hover:bg-accent hover:text-accent-foreground"
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pl-64 w-full">
        <div className="h-full min-h-screen bg-background">
          {children}
        </div>
      </main>
    </div>
  );
}
