// Remove "use client"; we'll do server-side fetching
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types";
import { Card, PageHeader } from "@/components/core/layout";
import { ClipboardList, Users, TrendingUp, Calendar } from "lucide-react";

export const dynamic = 'force-dynamic'; // If needed due to session
export const revalidate = 60; // Revalidate every 60s if acceptable

export default async function DashboardPage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  // Run queries in parallel
  const [
    { count: menuCount },
    { count: usersCount },
    { count: activeMenusCount },
    { count: wineCount }
  ] = await Promise.all([
    supabase.from('menu_items').select('id', { count: 'exact', head: true }),
    supabase.from('users').select('id', { count: 'exact', head: true }),
    supabase.from('daily_menus').select('id', { count: 'exact', head: true }).eq('active', true),
    supabase.from('wines').select('id', { count: 'exact', head: true }),
  ]);

  const stats = {
    total_menu_items: menuCount || 0,
    total_users: usersCount || 0,
    daily_menus_active: activeMenusCount || 0,
    total_wine_items: wineCount || 0,
  };

  // No isLoading state needed, data is ready at render time
  return (
    <div className="p-6">
      <PageHeader
        heading="Dashboard Overview"
        text="Welcome to your restaurant management dashboard"
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-100 p-3">
              <ClipboardList className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Menu Items</p>
              <h3 className="text-2xl font-bold">{stats.total_menu_items}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-green-100 p-3">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Menus</p>
              <h3 className="text-2xl font-bold">{stats.daily_menus_active}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-purple-100 p-3">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Wine Selection</p>
              <h3 className="text-2xl font-bold">{stats.total_wine_items}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-yellow-100 p-3">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <h3 className="text-2xl font-bold">{stats.total_users}</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Additional dashboard widgets can be added here */}
      </div>
    </div>
  );
}
