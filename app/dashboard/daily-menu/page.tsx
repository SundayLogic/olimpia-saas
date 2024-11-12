'use client';

import { useState, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Loader2, CalendarDays, ListTodo } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { DateSelection } from "@/components/daily-menu/MenuDateSelection";
import { MenuTemplateSelection } from "@/components/daily-menu/MenuTemplateSelection";
import { Button } from "@/components/ui/button";
import { CurrentMenuList } from "@/components/daily-menu/CurrentMenuList";

/**
 * Interface representing a base menu item.
 */
interface BaseMenuItem {
  id: number;
  daily_menu_id: number;
  name: string;
  display_order: number;
}

/**
 * Interface representing a daily menu.
 */
interface DailyMenu {
  id: number;
  date: string;
  price: number;
  active: boolean;
  created_at: string;
  first_courses: BaseMenuItem[];
  second_courses: BaseMenuItem[];
}

/**
 * Interface representing a template menu item.
 */
interface TemplateMenuItem {
  id: number;
  name: string;
  display_order: number;
}

/**
 * Interface representing a menu template.
 */
interface MenuTemplate {
  id: string;
  name: string;
  first_courses: TemplateMenuItem[];
  second_courses: TemplateMenuItem[];
  is_default?: boolean;
  created_at?: string;
}

/**
 * Type representing the current step in the scheduling process.
 */
type ScheduleStep = 'select-date' | 'select-menu' | 'customize' | 'confirm';

/**
 * The main component for managing daily menus.
 */
export default function DailyMenuPage() {
  const [activeTab, setActiveTab] = useState<'current' | 'schedule'>('current');
  const [currentStep, setCurrentStep] = useState<ScheduleStep>('select-date');
  const [selectedDates, setSelectedDates] = useState<{ from: Date; to: Date } | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<MenuTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [menus, setMenus] = useState<DailyMenu[]>([]);
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  /**
   * Function to verify the integrity and completeness of the menu template data.
   * @param template - The menu template to validate.
   * @returns An array of error messages. If empty, the template is valid.
   */

  /**
   * Function to load existing menus from Supabase.
   */
  const loadMenus = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const { data: dailyMenus, error: menusError } = await supabase
        .from('daily_menus')
        .select('*')
        .order('date', { ascending: false });

      if (menusError) throw menusError;

      const fullMenus = await Promise.all(dailyMenus.map(async (menu) => {
        const [firstCoursesResponse, secondCoursesResponse] = await Promise.all([
          supabase
            .from('daily_menu_first_courses')
            .select('*')
            .eq('daily_menu_id', menu.id)
            .order('display_order'),
          supabase
            .from('daily_menu_second_courses')
            .select('*')
            .eq('daily_menu_id', menu.id)
            .order('display_order')
        ]);

        if (firstCoursesResponse.error) throw firstCoursesResponse.error;
        if (secondCoursesResponse.error) throw secondCoursesResponse.error;

        return {
          ...menu,
          first_courses: firstCoursesResponse.data || [],
          second_courses: secondCoursesResponse.data || [],
        };
      }));

      setMenus(fullMenus);
    } catch (error) {
      console.error('Error loading menus:', error);
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

  /**
   * Handler for date selection.
   * @param dates - The selected date range.
   */
  const handleDateSelect = (dates: { from: Date; to: Date } | null) => {
    if (dates) {
      // Ensure the dates are set to midnight for consistent comparison
      const from = new Date(dates.from);
      const to = new Date(dates.to || dates.from); // If no 'to' date, use 'from' date
      from.setHours(0, 0, 0, 0);
      to.setHours(0, 0, 0, 0);
      
      setSelectedDates({ from, to });
    } else {
      setSelectedDates(null);
    }
  };

  /**
   * Handler for template selection.
   * @param template - The selected menu template.
   */
  const handleTemplateSelect = (template: MenuTemplate) => {
    setSelectedTemplate(template);
  };

  /**
   * Validates the selected menu template to ensure it meets required criteria.
   * @param template - The menu template to validate.
   */
  const validateTemplate = (template: MenuTemplate) => {
    if (!template.first_courses.length) {
      throw new Error('Template must have at least one first course');
    }
    if (!template.second_courses.length) {
      throw new Error('Template must have at least one second course');
    }
  };

  /**
   * Handler to navigate to the next step in the scheduling process.
   */
  const handleNextStep = () => {
    try {
      switch (currentStep) {
        case 'select-date':
          if (!selectedDates) {
            throw new Error('Please select dates first');
          }
          setCurrentStep('select-menu');
          break;
        case 'select-menu':
          if (!selectedTemplate) {
            throw new Error('Please select a menu template');
          }
          validateTemplate(selectedTemplate);
          setCurrentStep('customize');
          break;
        case 'customize':
          if (!selectedTemplate) {
            throw new Error('Please select a menu template');
          }
          validateTemplate(selectedTemplate);
          setCurrentStep('confirm');
          break;
        case 'confirm':
          handleScheduleComplete();
          break;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: "destructive",
      });
    }
  };

  /**
   * Function to handle the completion of the scheduling process.
   * Validates the template, checks date ranges in Spain's timezone, creates menus and their courses with error handling.
   */
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
      setIsLoading(true);

      // Create dates in Spanish timezone
      const spainTimeFormatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Europe/Madrid',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });

      // Get current date in Spain
      const serverDate = new Date();
      const spainCurrentDate = new Date(spainTimeFormatter.format(serverDate));
      spainCurrentDate.setHours(0, 0, 0, 0);

      const start = new Date(spainTimeFormatter.format(selectedDates.from));
      const end = new Date(spainTimeFormatter.format(selectedDates.to));

      // Set time to midnight
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      // Calculate max date (7 days from now) in Spain's timezone
      const maxDate = new Date(spainCurrentDate);
      maxDate.setDate(maxDate.getDate() + 7);

      console.log("Date validation:", {
        spainCurrentDate: spainCurrentDate.toISOString(),
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        maxAllowedDate: maxDate.toISOString(),
      });

      // Validate date range
      if (start < spainCurrentDate || end > maxDate) {
        toast({
          title: "Error",
          description: "Menus can only be created for dates between today and 7 days from now (Spain time)",
          variant: "destructive",
        });
        return;
      }

      let processDate = new Date(start);
      let successCount = 0;

      while (processDate <= end) {
        // Format date in Spanish timezone
        const dateStr = spainTimeFormatter.format(processDate);
        console.log("Processing date:", dateStr);

        try {
          // First check if menu exists
          const { data: existingMenu, error: checkError } = await supabase
            .from("daily_menus")
            .select("id")
            .eq("date", dateStr)
            .single();

          if (checkError && checkError.code !== "PGRST116") { // Not found error code
            console.error("Menu check error:", checkError);
            throw new Error(checkError.message);
          }

          if (existingMenu) {
            console.log(`Menu already exists for ${dateStr}, skipping...`);
            processDate.setDate(processDate.getDate() + 1);
            continue;
          }

          // Create menu with explicit data in Spain's timezone
          const menuData = {
            date: dateStr,
            price: 13.0,
            active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          console.log("Creating menu with data:", menuData);

          const { data: newMenu, error: menuError } = await supabase
            .from("daily_menus")
            .insert([menuData])
            .select()
            .single();

          if (menuError) {
            console.error("Menu creation error:", menuError);
            throw new Error(menuError.message);
          }

          if (!newMenu) {
            throw new Error("Menu created but no data returned");
          }

          console.log("Menu created:", newMenu);

          // Create first courses
          const firstCoursesData = selectedTemplate.first_courses.map((course, index) => ({
            daily_menu_id: newMenu.id,
            name: course.name.trim(),
            display_order: course.display_order || index + 1,
            created_at: new Date().toISOString()
          }));

          // Create second courses
          const secondCoursesData = selectedTemplate.second_courses.map((course, index) => ({
            daily_menu_id: newMenu.id,
            name: course.name.trim(),
            display_order: course.display_order || index + 1,
            created_at: new Date().toISOString()
          }));

          // Insert courses in parallel
          const [firstCoursesResult, secondCoursesResult] = await Promise.all([
            supabase.from("daily_menu_first_courses").insert(firstCoursesData),
            supabase.from("daily_menu_second_courses").insert(secondCoursesData)
          ]);

          if (firstCoursesResult.error || secondCoursesResult.error) {
            // If either fails, delete the menu and throw error
            await supabase.from("daily_menus").delete().eq("id", newMenu.id);
            console.error("Courses insertion error:", {
              firstCoursesError: firstCoursesResult.error,
              secondCoursesError: secondCoursesResult.error
            });
            throw new Error("Failed to create courses");
          }

          console.log(`Successfully created menu for ${dateStr}`);
          successCount++;

        } catch (error) {
          console.error(`Error processing date ${dateStr}:`, error);
          throw new Error(
            `Failed to create menu for ${dateStr}: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        }

        // Increment the date
        processDate.setDate(processDate.getDate() + 1);
      }

      toast({
        title: "Success",
        description: `Successfully created ${successCount} menu(s)`,
      });

      // Reset state and refresh
      setSelectedDates(null);
      setSelectedTemplate(null);
      setCurrentStep("select-date");
      setActiveTab("current");
      await loadMenus(); // Refresh the menu list

    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to schedule menu";
      console.error("Schedule error:", error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Function to render the content of the scheduling tab based on the current step.
   * @returns JSX element representing the current step's UI.
   */
  const renderScheduleContent = () => {
    switch (currentStep) {
      case 'select-date':
        return (
          <DateSelection
            onDateSelect={handleDateSelect}
            onNext={handleNextStep}
            existingMenus={menus.map(menu => ({
              date: menu.date,
              active: menu.active,
            }))}
          />
        );
      case 'select-menu':
        return (
          <MenuTemplateSelection
            selectedDates={selectedDates}
            onNext={handleNextStep}
            onEdit={handleTemplateSelect}
          />
        );
      case 'customize':
        return (
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Customize Menu</h2>
                  <p className="text-muted-foreground">
                    Selected dates: {selectedDates?.from.toLocaleDateString()} - {selectedDates?.to.toLocaleDateString()}
                  </p>
                </div>
                <Button onClick={handleNextStep}>Continue</Button>
              </div>
              {selectedTemplate && (
                <div>
                  <p className="mb-4 font-medium">Template: {selectedTemplate.name}</p>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold mb-2">First Courses</h3>
                      <ul className="space-y-1">
                        {selectedTemplate.first_courses.map(course => (
                          <li key={course.id} className="p-2 rounded-md hover:bg-muted">
                            {course.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Second Courses</h3>
                      <ul className="space-y-1">
                        {selectedTemplate.second_courses.map(course => (
                          <li key={course.id} className="p-2 rounded-md hover:bg-muted">
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
      case 'confirm':
        return (
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Confirm Schedule</h2>
                  <p className="text-muted-foreground">
                    Selected dates: {selectedDates?.from.toLocaleDateString()} - {selectedDates?.to.toLocaleDateString()}
                  </p>
                </div>
                <Button 
                  onClick={handleScheduleComplete}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    "Schedule Menu"
                  )}
                </Button>
              </div>
              {selectedTemplate && (
                <div>
                  <p className="font-medium mb-4">Selected Template: {selectedTemplate.name}</p>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold mb-2">First Courses</h3>
                      <ul className="space-y-1 text-sm">
                        {selectedTemplate.first_courses.map(course => (
                          <li key={course.id} className="p-2 rounded-md hover:bg-muted">
                            {course.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Second Courses</h3>
                      <ul className="space-y-1 text-sm">
                        {selectedTemplate.second_courses.map(course => (
                          <li key={course.id} className="p-2 rounded-md hover:bg-muted">
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

  /**
   * Renders a loading spinner while data is being fetched or operations are in progress.
   */
  if (isLoading && currentStep !== 'confirm') { // Avoid hiding loader during scheduling
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  /**
   * Main render of the component, displaying navigation tabs and corresponding content.
   */
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Daily Menu Management</h1>
        <p className="text-muted-foreground">
          Manage and schedule your restaurant&apos;s daily menus
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'current' | 'schedule')}>
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

        <TabsContent value="schedule">
          {renderScheduleContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
