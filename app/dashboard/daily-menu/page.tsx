"use client";

import { useState, useCallback, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  Loader2,
  Pencil,
  Save,
  X,
  Calendar,
  CheckCircle2,
  XCircle,
  Info,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  courseType: "first" | "second" | null;
  courseId: number | null;
  value: string;
}

export default function DailyMenuPage() {
  const [menus, setMenus] = useState<FullDailyMenu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"active" | "inactive">("active");
  const [editing, setEditing] = useState<EditingState>({
    menuId: null,
    courseType: null,
    courseId: null,
    value: "",
  });
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  const loadMenus = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log("Starting to load menus...");

      const { data: dailyMenus, error: menusError } = await supabase
        .from("daily_menus")
        .select("*")
        .order("date", { ascending: false });

      if (menusError) throw menusError;

      const fullMenus = await Promise.all(
        dailyMenus.map(async (menu) => {
          const { data: firstCourses, error: firstCoursesError } =
            await supabase
              .from("daily_menu_first_courses")
              .select("*")
              .eq("daily_menu_id", menu.id)
              .order("display_order");

          if (firstCoursesError) throw firstCoursesError;

          const { data: secondCourses, error: secondCoursesError } =
            await supabase
              .from("daily_menu_second_courses")
              .select("*")
              .eq("daily_menu_id", menu.id)
              .order("display_order");

          if (secondCoursesError) throw secondCoursesError;

          return {
            ...menu,
            first_courses: firstCourses || [],
            second_courses: secondCourses || [],
          };
        })
      );

      console.log("Full menus loaded:", fullMenus);
      setMenus(fullMenus);
    } catch (error) {
      console.error("Error loading menus:", error);
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

  const handleEdit = useCallback(
    (menuId: number, courseType: "first" | "second", course: MenuItem) => {
      setEditing({
        menuId,
        courseType,
        courseId: course.id,
        value: course.name,
      });
    },
    []
  );

  const handleSave = async () => {
    if (!editing.courseId || !editing.courseType || !editing.value.trim())
      return;

    try {
      const tableName =
        editing.courseType === "first"
          ? "daily_menu_first_courses"
          : "daily_menu_second_courses";

      console.log("Updating course:", {
        tableName,
        courseId: editing.courseId,
        newName: editing.value,
      });

      const { data, error } = await supabase
        .from(tableName)
        .update({
          name: editing.value.trim(),
        })
        .eq("id", editing.courseId)
        .select();

      if (error) throw error;

      console.log("Update response:", data);

      toast({
        title: "Success",
        description: "Course name updated successfully",
      });

      // Update local state
      setMenus((prevMenus) =>
        prevMenus.map((menu) => ({
          ...menu,
          first_courses:
            editing.courseType === "first"
              ? menu.first_courses.map((course) =>
                  course.id === editing.courseId
                    ? { ...course, name: editing.value.trim() }
                    : course
                )
              : menu.first_courses,
          second_courses:
            editing.courseType === "second"
              ? menu.second_courses.map((course) =>
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
        value: "",
      });
    } catch (error) {
      console.error("Error updating course:", error);
      toast({
        title: "Error",
        description: "Failed to update course name",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = useCallback(
    async (menuId: number, currentActive: boolean) => {
      try {
        const { error } = await supabase
          .from("daily_menus")
          .update({ active: !currentActive })
          .eq("id", menuId)
          .select();

        if (error) throw error;

        setMenus((prevMenus) =>
          prevMenus.map((menu) =>
            menu.id === menuId ? { ...menu, active: !currentActive } : menu
          )
        );

        toast({
          title: "Success",
          description: `Menu ${!currentActive ? "activated" : "deactivated"} successfully`,
        });
      } catch (error) {
        console.error("Error updating status:", error);
        toast({
          title: "Error",
          description: "Failed to update menu status",
          variant: "destructive",
        });
      }
    },
    [supabase, toast]
  );

  // Filter menus based on active status
  const activeMenus = menus.filter((menu) => menu.active);
  const inactiveMenus = menus.filter((menu) => !menu.active);

  const renderMenuCard = (menu: FullDailyMenu) => (
    <Card
      key={menu.id}
      className={`
      transition-all duration-200 
      ${menu.active ? "border-primary/50" : "opacity-75 hover:opacity-100"}
    `}
    >
      <CardHeader className="flex flex-row items-center justify-between bg-muted/50">
        <div className="flex items-center gap-4">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <div>
            <CardTitle className="flex items-center gap-2">
              <span>
                {new Date(menu.date).toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              {menu.active ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Active Menu</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <XCircle className="h-5 w-5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Inactive Menu</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </CardTitle>
            <div className="text-sm text-muted-foreground mt-1">
              Price: {menu.price.toFixed(2)}€
            </div>
          </div>
        </div>
        <Button
          variant={menu.active ? "secondary" : "outline"}
          onClick={() => handleUpdateStatus(menu.id, menu.active)}
          className="transition-all duration-200"
        >
          {menu.active ? "Deactivate" : "Activate"}
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Label className="font-semibold">First Courses</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click on a course to edit</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <ul className="space-y-2">
              {menu.first_courses.map((course) => (
                <li
                  key={course.id}
                  className="rounded-md border bg-card text-card-foreground shadow-sm"
                >
                  {renderCourse(course, menu.id, "first")}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Label className="font-semibold">Second Courses</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click on a course to edit</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <ul className="space-y-2">
              {menu.second_courses.map((course) => (
                <li
                  key={course.id}
                  className="rounded-md border bg-card text-card-foreground shadow-sm"
                >
                  {renderCourse(course, menu.id, "second")}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderCourse = (
    course: MenuItem,
    menuId: number,
    type: "first" | "second"
  ) => {
    const isEditing =
      editing.courseId === course.id &&
      editing.menuId === menuId &&
      editing.courseType === type;

    if (isEditing) {
      return (
        <div className="p-3 flex items-center gap-2">
          <Input
            value={editing.value}
            onChange={(e) =>
              setEditing((prev) => ({ ...prev, value: e.target.value }))
            }
            className="flex-1"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSave();
              } else if (e.key === "Escape") {
                setEditing({
                  menuId: null,
                  courseType: null,
                  courseId: null,
                  value: "",
                });
              }
            }}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="default" onClick={handleSave}>
                  <Save className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save changes (Enter)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setEditing({
                      menuId: null,
                      courseType: null,
                      courseId: null,
                      value: "",
                    })
                  }
                >
                  <X className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Cancel (Esc)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    }

    return (
      <div
        className="p-3 flex items-center justify-between group hover:bg-muted/50 rounded-md transition-colors cursor-pointer"
        onClick={() => handleEdit(menuId, type, course)}
      >
        <div className="flex items-center gap-2">
          <span>{course.name}</span>
          <span className="text-sm text-muted-foreground">
            (Order: {course.display_order})
          </span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading menus...</p>
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

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "active" | "inactive")}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="active" className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Active Menus ({activeMenus.length})
          </TabsTrigger>
          <TabsTrigger value="inactive" className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Inactive Menus ({inactiveMenus.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          {activeMenus.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-32">
                <p className="text-muted-foreground">No active menus found</p>
              </CardContent>
            </Card>
          ) : (
            activeMenus.map(renderMenuCard)
          )}
        </TabsContent>

        <TabsContent value="inactive" className="space-y-6">
          {inactiveMenus.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-32">
                <p className="text-muted-foreground">No inactive menus found</p>
              </CardContent>
            </Card>
          ) : (
            inactiveMenus.map(renderMenuCard)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
