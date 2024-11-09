'use client';

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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

interface EditingState {
  menuId: number | null;
  courseType: 'first' | 'second' | null;
  courseId: number | null;
  value: string;
}

export default function DailyMenuPage() {
  const [menus, setMenus] = useState<FullDailyMenu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<EditingState>({
    menuId: null,
    courseType: null,
    courseId: null,
    value: ''
  });
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  const loadMenus = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Starting to load menus...');
      
      // First fetch the daily menus
      const { data: dailyMenus, error: menusError } = await supabase
        .from('daily_menus')
        .select('*')
        .order('date', { ascending: false });

      console.log('Daily menus response:', { dailyMenus, menusError });

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

      console.log('Full menus:', fullMenus);
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
  }, [supabase, toast]);

  useEffect(() => {
    loadMenus();
  }, [loadMenus]);

  const handleEdit = (menuId: number, courseType: 'first' | 'second', course: MenuItem) => {
    setEditing({
      menuId,
      courseType,
      courseId: course.id,
      value: course.name
    });
  };

  const handleSave = async () => {
    if (!editing.courseId || !editing.courseType || !editing.value.trim()) return;

    try {
      const tableName = editing.courseType === 'first' 
        ? 'daily_menu_first_courses' 
        : 'daily_menu_second_courses';

      console.log('Updating course:', {
        tableName,
        courseId: editing.courseId,
        newName: editing.value
      });

      const { data, error } = await supabase
        .from(tableName)
        .update({ name: editing.value.trim() })
        .eq('id', editing.courseId)
        .select();

      if (error) throw error;

      console.log('Update response:', data);

      toast({
        title: "Success",
        description: "Course updated successfully",
      });

      // Update local state
      setMenus(prevMenus => 
        prevMenus.map(menu => ({
          ...menu,
          first_courses: editing.courseType === 'first'
            ? menu.first_courses.map(course =>
                course.id === editing.courseId
                  ? { ...course, name: editing.value.trim() }
                  : course
              )
            : menu.first_courses,
          second_courses: editing.courseType === 'second'
            ? menu.second_courses.map(course =>
                course.id === editing.courseId
                  ? { ...course, name: editing.value.trim() }
                  : course
              )
            : menu.second_courses,
        }))
      );

      setEditing({
        menuId: null,
        courseType: null,
        courseId: null,
        value: ''
      });

    } catch (error) {
      console.error('Error updating course:', error);
      toast({
        title: "Error",
        description: "Failed to update course",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = useCallback(async (menuId: number, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from('daily_menus')
        .update({ active: !currentActive })
        .eq('id', menuId);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update menu status",
          variant: "destructive",
        });
      } else {
        setMenus(prevMenus =>
          prevMenus.map(menu =>
            menu.id === menuId
              ? { ...menu, active: !currentActive }
              : menu
          )
        );

        toast({
          title: "Success",
          description: "Menu status updated successfully",
        });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update menu status",
        variant: "destructive",
      });
    }
  }, [supabase, toast]);

  const renderCourse = (course: MenuItem, menuId: number, type: 'first' | 'second') => {
    const isEditing = editing.courseId === course.id && 
                     editing.menuId === menuId && 
                     editing.courseType === type;

    if (isEditing) {
      return (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={editing.value}
            onChange={(e) => setEditing(prev => ({ ...prev, value: e.target.value }))}
            className="flex-1 px-2 py-1 border rounded-md"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSave();
              } else if (e.key === 'Escape') {
                setEditing({ menuId: null, courseType: null, courseId: null, value: '' });
              }
            }}
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSave}
          >
            Save
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setEditing({ menuId: null, courseType: null, courseId: null, value: '' })}
          >
            Cancel
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between group">
        <span>{course.name}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Order: {course.display_order}
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => handleEdit(menuId, type, course)}
          >
            Edit
          </Button>
        </div>
      </div>
    );
  };

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
                  onClick={() => handleUpdateStatus(menu.id, menu.active)}
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
                      <li key={course.id}>
                        {renderCourse(course, menu.id, 'first')}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Second Courses</h3>
                  <ul className="space-y-2">
                    {menu.second_courses.map((course) => (
                      <li key={course.id}>
                        {renderCourse(course, menu.id, 'second')}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}