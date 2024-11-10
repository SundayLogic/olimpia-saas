'use client';

import { useState, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Loader2, CalendarDays, ListTodo } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { DateSelection } from "@/components/daily-menu/MenuDateSelection";

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

type ScheduleStep = 'select-date' | 'select-menu' | 'customize' | 'confirm';

export default function DailyMenuPage() {
  const [activeTab, setActiveTab] = useState<'current' | 'schedule'>('current');
  const [currentStep, setCurrentStep] = useState<ScheduleStep>('select-date');
  const [selectedDates, setSelectedDates] = useState<{ from: Date; to: Date } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [menus, setMenus] = useState<FullDailyMenu[]>([]);
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  const loadMenus = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Loading menus...');
      
      const { data: dailyMenus, error: menusError } = await supabase
        .from('daily_menus')
        .select('*')
        .order('date', { ascending: false });

      if (menusError) throw menusError;

      const fullMenus = await Promise.all(dailyMenus.map(async (menu) => {
        const { data: firstCourses, error: firstCoursesError } = await supabase
          .from('daily_menu_first_courses')
          .select('*')
          .eq('daily_menu_id', menu.id)
          .order('display_order');

        if (firstCoursesError) throw firstCoursesError;

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

      console.log('Menus loaded:', fullMenus);
      setMenus(fullMenus);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load menus",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [supabase, toast]);

  // Load menus when component mounts
  useEffect(() => {
    loadMenus();
  }, [loadMenus]);

  const handleDateSelect = (dates: { from: Date; to: Date } | null) => {
    setSelectedDates(dates);
    console.log('Selected dates:', dates);
  };

  const handleNextStep = () => {
    if (!selectedDates && currentStep === 'select-date') {
      toast({
        title: "Error",
        description: "Please select dates first",
        variant: "destructive",
      });
      return;
    }

    switch (currentStep) {
      case 'select-date':
        setCurrentStep('select-menu');
        break;
      case 'select-menu':
        setCurrentStep('customize');
        break;
      case 'customize':
        setCurrentStep('confirm');
        break;
      case 'confirm':
        handleScheduleComplete();
        break;
    }
  };

  const handleScheduleComplete = async () => {
    if (!selectedDates) return;

    try {
      // Here you would implement the logic to save the scheduled menu
      console.log('Scheduling menu for dates:', selectedDates);
      
      toast({
        title: "Success",
        description: "Menu scheduled successfully",
      });

      // Reset form and reload data
      setSelectedDates(null);
      setCurrentStep('select-date');
      setActiveTab('current');
      await loadMenus();
    } catch (error) {
      console.error('Error scheduling menu:', error);
      toast({
        title: "Error",
        description: "Failed to schedule menu",
        variant: "destructive",
      });
    }
  };

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
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Select Menu Template</h2>
              <p className="text-muted-foreground mb-4">
                Selected dates: {selectedDates?.from.toLocaleDateString()} - {selectedDates?.to.toLocaleDateString()}
              </p>
              {/* Menu template selection will be implemented here */}
              <p>Menu Selection (coming soon)</p>
            </CardContent>
          </Card>
        );
      case 'customize':
        return (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Customize Menu</h2>
              <p className="text-muted-foreground mb-4">
                Selected dates: {selectedDates?.from.toLocaleDateString()} - {selectedDates?.to.toLocaleDateString()}
              </p>
              {/* Menu customization will be implemented here */}
              <p>Customize Menu (coming soon)</p>
            </CardContent>
          </Card>
        );
      case 'confirm':
        return (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Confirm Schedule</h2>
              <p className="text-muted-foreground mb-4">
                Selected dates: {selectedDates?.from.toLocaleDateString()} - {selectedDates?.to.toLocaleDateString()}
              </p>
              {/* Confirmation UI will be implemented here */}
              <p>Confirm Schedule (coming soon)</p>
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
            // Your existing menu list rendering
            <div>Your existing menu list component here</div>
          )}
        </TabsContent>

        <TabsContent value="schedule">
          {renderScheduleContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
}