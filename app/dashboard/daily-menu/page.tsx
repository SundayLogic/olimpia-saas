'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";

interface DailyMenu {
  id: number;
  date: string;
  price: number;
  active: boolean;
  created_at: string;
}

interface MenuItem {
  id: number;
  daily_menu_id: number;
  name: string;
  display_order: number;
}

interface FullDailyMenu extends DailyMenu {
  first_courses: MenuItem[];
  second_courses: MenuItem[];
}

export default function DailyMenuPage() {
  const [menus, setMenus] = useState<FullDailyMenu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  const loadMenus = async () => {
    try {
      setIsLoading(true);
      
      // First, get all daily menus
      const { data: dailyMenus, error: menusError } = await supabase
        .from('daily_menus')
        .select('*')
        .order('date', { ascending: false });

      if (menusError) throw menusError;

      // For each menu, get its courses
      const fullMenus = await Promise.all(dailyMenus.map(async (menu) => {
        // Get first courses
        const { data: firstCourses, error: firstCoursesError } = await supabase
          .from('daily_menu_first_courses')
          .select('*')
          .eq('daily_menu_id', menu.id)
          .order('display_order');

        if (firstCoursesError) throw firstCoursesError;

        // Get second courses
        const { data: secondCourses, error: secondCoursesError } = await supabase
          .from('daily_menu_second_courses')
          .select('*')
          .eq('daily_menu_id', menu.id)
          .order('display_order');

        if (secondCoursesError) throw secondCoursesError;

        return {
          ...menu,
          first_courses: firstCourses || [],
          second_courses: secondCourses || [],
        };
      }));

      setMenus(fullMenus);
    } catch (error) {
      console.error('Error loading menus:', error);
      toast({
        title: "Error",
        description: "Failed to load daily menus",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMenus();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Daily Menu Management</h1>
        <p className="text-muted-foreground">
          Manage your restaurant&apos;s daily menus
        </p>
      </div>

      <div className="grid gap-6">
        {menus.map((menu) => (
          <Card key={menu.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                Menu for {new Date(menu.date).toLocaleDateString()}
                <span className="ml-2 text-sm text-muted-foreground">
                  {menu.price.toFixed(2)}€
                </span>
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button 
                  variant={menu.active ? "default" : "secondary"}
                  onClick={async () => {
                    const { error } = await supabase
                      .from('daily_menus')
                      .update({ active: !menu.active })
                      .eq('id', menu.id);

                    if (error) {
                      toast({
                        title: "Error",
                        description: "Failed to update menu status",
                        variant: "destructive",
                      });
                    } else {
                      loadMenus();
                    }
                  }}
                >
                  {menu.active ? 'Active' : 'Inactive'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4">First Courses</h3>
                  <ul className="space-y-2">
                    {menu.first_courses.map((course) => (
                      <li key={course.id} className="flex items-center justify-between">
                        <span>{course.name}</span>
                        <span className="text-sm text-muted-foreground">
                          Order: {course.display_order}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Second Courses</h3>
                  <ul className="space-y-2">
                    {menu.second_courses.map((course) => (
                      <li key={course.id} className="flex items-center justify-between">
                        <span>{course.name}</span>
                        <span className="text-sm text-muted-foreground">
                          Order: {course.display_order}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button 
          className="fixed bottom-6 right-6"
          size="lg"
          onClick={() => {
            // Add logic to create new menu
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Menu
        </Button>
      </div>
    </div>
  );
}