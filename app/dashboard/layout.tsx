"use client";

import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Loader2,
  ImageIcon,
  MenuSquare, // Add this import for the menu icon
} from "lucide-react";
import { useState, useEffect } from "react";
import type { Database } from "@/lib/supabase/client";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else if (session.user?.email) {
        setUserEmail(session.user.email);
      }
    };

    checkSession();
  }, [supabase, router]);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });

      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!userEmail) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background">
        <div className="flex h-full flex-col">
          <div className="border-b px-6 py-4">
            <h1 className="text-lg font-semibold">Your App Name</h1>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className="w-full justify-start"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/users">
              <Button
                variant="ghost"
                className="w-full justify-start"
              >
                <Users className="mr-2 h-4 w-4" />
                Users
              </Button>
            </Link>
            <Link href="/dashboard/images">
              <Button
                variant="ghost"
                className="w-full justify-start"
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Images
              </Button>
            </Link>
            {/* Add Daily Menu Link */}
            <Link href="/dashboard/daily-menu">
              <Button
                variant="ghost"
                className="w-full justify-start"
              >
                <MenuSquare className="mr-2 h-4 w-4" />
                Daily Menu
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button
                variant="ghost"
                className="w-full justify-start"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
          </nav>

          <div className="border-t p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium">
                    {userEmail}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleSignOut}
                variant="ghost"
                size="icon"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </aside>

      <main className="pl-64">
        <div className="h-full py-12">
          {children}
        </div>
      </main>
    </div>
  );
}