"use client";

import { useState, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2, CalendarDays, ListTodo } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { DateSelection } from "@/components/daily-menu/MenuDateSelection";
import { MenuTemplateSelection } from "@/components/daily-menu/MenuTemplateSelection";
import { Button } from "@/components/ui/button";
import { CurrentMenuList } from "@/components/daily-menu/CurrentMenuList";

interface BaseMenuItem {
  id: number;
  daily_menu_id: number;
  name: string;
  display_order: number;
}

interface DailyMenu {
  id: number;
  date: string;
  price: number;
  active: boolean;
  created_at: string;
  first_courses: BaseMenuItem[];
  second_courses: BaseMenuItem[];
}

interface TemplateMenuItem {
  id: number;
  name: string;
  display_order: number;
}

interface MenuTemplate {
  id: string;
  name: string;
  first_courses: TemplateMenuItem[];
  second_courses: TemplateMenuItem[];
  is_default?: boolean;
  created_at?: string;
}

type ScheduleStep = "select-date" | "select-menu" | "customize" | "confirm";

export default function DailyMenuPage() {
  const [activeTab, setActiveTab] = useState<"current" | "schedule">("current");
  const [currentStep, setCurrentStep] = useState<ScheduleStep>("select-date");
  const [selectedDates, setSelectedDates] = useState<{
    from: Date;
    to: Date;
  } | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<MenuTemplate | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [menus, setMenus] = useState<DailyMenu[]>([]);
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  const loadMenus = useCallback(async () => {
    try {
      setIsLoading(true);

      const { data: dailyMenus, error: menusError } = await supabase
        .from("daily_menus")
        .select("*")
        .order("date", { ascending: false });

      if (menusError) throw menusError;

      const fullMenus = await Promise.all(
        dailyMenus.map(async (menu) => {
          const [firstCoursesResponse, secondCoursesResponse] =
            await Promise.all([
              supabase
                .from("daily_menu_first_courses")
                .select("*")
                .eq("daily_menu_id", menu.id)
                .order("display_order"),
              supabase
                .from("daily_menu_second_courses")
                .select("*")
                .eq("daily_menu_id", menu.id)
                .order("display_order"),
            ]);

          if (firstCoursesResponse.error) throw firstCoursesResponse.error;
          if (secondCoursesResponse.error) throw secondCoursesResponse.error;

          return {
            ...menu,
            first_courses: firstCoursesResponse.data || [],
            second_courses: secondCoursesResponse.data || [],
          };
        })
      );

      setMenus(fullMenus);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to load menus",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [supabase, toast]);

  useEffect(() => {
    loadMenus();
  }, [loadMenus]);

  const handleDateSelect = (dates: { from: Date; to: Date } | null) => {
    setSelectedDates(dates);
  };

  const handleTemplateSelect = (template: MenuTemplate) => {
    setSelectedTemplate(template);
  };

  const validateTemplate = (template: MenuTemplate) => {
    if (!template.first_courses.length) {
      throw new Error("Template must have at least one first course");
    }
    if (!template.second_courses.length) {
      throw new Error("Template must have at least one second course");
    }
  };

  const handleNextStep = () => {
    try {
      switch (currentStep) {
        case "select-date":
          if (!selectedDates) {
            throw new Error("Please select dates first");
          }
          setCurrentStep("select-menu");
          break;
        case "select-menu":
          if (!selectedTemplate) {
            throw new Error("Please select a menu template");
          }
          validateTemplate(selectedTemplate);
          setCurrentStep("customize");
          break;
        case "customize":
          if (!selectedTemplate) {
            throw new Error("Please select a menu template");
          }
          validateTemplate(selectedTemplate);
          setCurrentStep("confirm");
          break;
        case "confirm":
          handleScheduleComplete();
          break;
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleScheduleComplete = async () => {
    if (!selectedDates || !selectedTemplate) {
      toast({
        title: "Error",
        description: "Missing dates or template",
        variant: "destructive",
      });
      return;
    }

    try {
      const start = selectedDates.from;
      const end = selectedDates.to;
      const currentDate = new Date(start);

      while (currentDate <= end) {
        console.log(
          "Creating menu for:",
          currentDate.toISOString().split("T")[0]
        );

        // Create the daily menu
        const { data: newMenu, error: menuError } = await supabase
          .from("daily_menus")
          .insert([
            {
              date: currentDate.toISOString().split("T")[0],
              price: 13.0,
              active: true,
            },
          ])
          .select()
          .single();

        if (menuError) {
          console.error("Error creating menu:", {
            code: menuError.code,
            message: menuError.message,
            details: menuError.details,
            hint: menuError.hint,
          });
          throw new Error(`Failed to create menu: ${menuError.message}`);
        }

        if (!newMenu?.id) {
          throw new Error("No menu ID returned from creation");
        }

        console.log("Menu created successfully:", newMenu);

        // Prepare courses data
        const firstCourses = selectedTemplate.first_courses.map((course) => ({
          daily_menu_id: newMenu.id,
          name: course.name,
          display_order: course.display_order,
        }));

        const secondCourses = selectedTemplate.second_courses.map((course) => ({
          daily_menu_id: newMenu.id,
          name: course.name,
          display_order: course.display_order,
        }));

        // Insert first courses
        const { error: firstCoursesError } = await supabase
          .from("daily_menu_first_courses")
          .insert(firstCourses);

        if (firstCoursesError) {
          console.error("Error inserting first courses:", {
            code: firstCoursesError.code,
            message: firstCoursesError.message,
            details: firstCoursesError.details,
            hint: firstCoursesError.hint,
          });
          throw new Error(
            `Failed to insert first courses: ${firstCoursesError.message}`
          );
        }

        // Insert second courses
        const { error: secondCoursesError } = await supabase
          .from("daily_menu_second_courses")
          .insert(secondCourses);

        if (secondCoursesError) {
          console.error("Error inserting second courses:", {
            code: secondCoursesError.code,
            message: secondCoursesError.message,
            details: secondCoursesError.details,
            hint: secondCoursesError.hint,
          });
          throw new Error(
            `Failed to insert second courses: ${secondCoursesError.message}`
          );
        }

        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }

      toast({
        title: "Success",
        description: "Menu scheduled successfully",
      });

      setSelectedDates(null);
      setSelectedTemplate(null);
      setCurrentStep("select-date");
      setActiveTab("current");
      await loadMenus();
    } catch (error) {
      console.error("Error scheduling menu:", {
        error,
        type: typeof error,
        isError: error instanceof Error,
        message: error instanceof Error ? error.message : "Unknown error",
      });

      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to schedule menu",
        variant: "destructive",
      });
    }
  };

  const renderScheduleContent = () => {
    switch (currentStep) {
      case "select-date":
        return (
          <DateSelection
            onDateSelect={handleDateSelect}
            onNext={handleNextStep}
            existingMenus={menus.map((menu) => ({
              date: menu.date,
              active: menu.active,
            }))}
          />
        );
      case "select-menu":
        return (
          <MenuTemplateSelection
            selectedDates={selectedDates}
            onNext={handleNextStep}
            onEdit={handleTemplateSelect}
          />
        );
      case "customize":
        return (
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Customize Menu</h2>
                  <p className="text-muted-foreground">
                    Selected dates: {selectedDates?.from.toLocaleDateString()} -{" "}
                    {selectedDates?.to.toLocaleDateString()}
                  </p>
                </div>
                <Button onClick={handleNextStep}>Continue</Button>
              </div>
              {selectedTemplate && (
                <div>
                  <p className="mb-4 font-medium">
                    Template: {selectedTemplate.name}
                  </p>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold mb-2">First Courses</h3>
                      <ul className="space-y-1">
                        {selectedTemplate.first_courses.map((course) => (
                          <li
                            key={course.id}
                            className="p-2 rounded-md hover:bg-muted"
                          >
                            {course.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Second Courses</h3>
                      <ul className="space-y-1">
                        {selectedTemplate.second_courses.map((course) => (
                          <li
                            key={course.id}
                            className="p-2 rounded-md hover:bg-muted"
                          >
                            {course.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      case "confirm":
        return (
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Confirm Schedule</h2>
                  <p className="text-muted-foreground">
                    Selected dates: {selectedDates?.from.toLocaleDateString()} -{" "}
                    {selectedDates?.to.toLocaleDateString()}
                  </p>
                </div>
                <Button onClick={handleScheduleComplete}>Schedule Menu</Button>
              </div>
              {selectedTemplate && (
                <div>
                  <p className="font-medium mb-4">
                    Selected Template: {selectedTemplate.name}
                  </p>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold mb-2">First Courses</h3>
                      <ul className="space-y-1 text-sm">
                        {selectedTemplate.first_courses.map((course) => (
                          <li
                            key={course.id}
                            className="p-2 rounded-md hover:bg-muted"
                          >
                            {course.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Second Courses</h3>
                      <ul className="space-y-1 text-sm">
                        {selectedTemplate.second_courses.map((course) => (
                          <li
                            key={course.id}
                            className="p-2 rounded-md hover:bg-muted"
                          >
                            {course.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
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
          Manage and schedule your restaurant&apos;s daily menus
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "current" | "schedule")}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="current" className="flex items-center gap-2">
            <ListTodo className="h-4 w-4" />
            Current Menus
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Schedule Menu
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          {menus.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-32">
                <p className="text-muted-foreground">No menus found</p>
              </CardContent>
            </Card>
          ) : (
            <CurrentMenuList menus={menus} onMenuUpdate={loadMenus} />
          )}
        </TabsContent>

        <TabsContent value="schedule">{renderScheduleContent()}</TabsContent>
      </Tabs>
    </div>
  );
}
