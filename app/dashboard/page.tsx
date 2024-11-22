"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card } from "@/components/core/layout";
import { PageHeader } from "@/components/core/layout";
import {
  ClipboardList,
  Users,
  TrendingUp,
  Calendar,
} from "lucide-react";

type DashboardStats = {
  total_menu_items: number;
  total_users: number;
  daily_menus_active: number;
  total_wine_items: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    total_menu_items: 0,
    total_users: 0,
    daily_menus_active: 0,
    total_wine_items: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);

        // Fetch menu items count
        const { count: menuCount } = await supabase
          .from('menu_items')
          .select('*', { count: 'exact', head: true });

        // Fetch users count
        const { count: usersCount } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });

        // Fetch active daily menus
        const { count: activeMenusCount } = await supabase
          .from('daily_menus')
          .select('*', { count: 'exact', head: true })
          .eq('active', true);

        // Fetch wine items count
        const { count: wineCount } = await supabase
          .from('wines')
          .select('*', { count: 'exact', head: true });

        setStats({
          total_menu_items: menuCount || 0,
          total_users: usersCount || 0,
          daily_menus_active: activeMenusCount || 0,
          total_wine_items: wineCount || 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [supabase]);

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
              <h3 className="text-2xl font-bold">
                {isLoading ? "..." : stats.total_menu_items}
              </h3>
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
              <h3 className="text-2xl font-bold">
                {isLoading ? "..." : stats.daily_menus_active}
              </h3>
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
              <h3 className="text-2xl font-bold">
                {isLoading ? "..." : stats.total_wine_items}
              </h3>
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
              <h3 className="text-2xl font-bold">
                {isLoading ? "..." : stats.total_users}
              </h3>
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