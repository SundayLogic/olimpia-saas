"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Plus, Calendar, ToggleLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PageHeader } from "@/components/core/layout";
import { Badge } from "@/components/ui/badge";

interface DailyMenuItem {
  id: string;
  course_name: string;
  course_type: 'first' | 'second';
  display_order: number;
}

interface DailyMenu {
  id: string;  // Changed from number to string (UUID)
  date: string;
  repeat_pattern: 'none' | 'weekly' | 'monthly';
  active: boolean;
  scheduled_for: string;
  created_at: string;
  daily_menu_items: DailyMenuItem[];
}

interface NewMenu {
  date: string;
  repeat_pattern: 'none' | 'weekly' | 'monthly';
  active: boolean;
  firstCourse: string;
  secondCourse: string;
}

export default function DailyMenuPage() {
  const [dailyMenus, setDailyMenus] = useState<DailyMenu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMenu, setNewMenu] = useState<NewMenu>({
    date: new Date().toISOString().split('T')[0],
    repeat_pattern: 'none',
    active: true,
    firstCourse: '',
    secondCourse: ''
  });

  const supabase = createClientComponentClient();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch daily menus with the updated schema
        const { data: menusData, error: menusError } = await supabase
          .from('daily_menus')
          .select(`
            id,
            date,
            repeat_pattern,
            active,
            scheduled_for,
            created_at,
            daily_menu_items (
              id,
              course_name,
              course_type,
              display_order
            )
          `)
          .order('date', { ascending: false });

        if (menusError) throw menusError;

        setDailyMenus(menusData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load daily menus');
        toast({
          title: "Error",
          description: "Failed to load daily menus",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [supabase, toast]);

  const handleCreateMenu = async () => {
    try {
      if (!newMenu.date || !newMenu.firstCourse || !newMenu.secondCourse) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      // Create the daily menu
      const { data: menuData, error: menuError } = await supabase
        .from('daily_menus')
        .insert({
          date: newMenu.date,
          repeat_pattern: newMenu.repeat_pattern,
          active: newMenu.active,
          scheduled_for: new Date(newMenu.date + 'T11:00:00.000+01:00').toISOString() // Madrid time
        })
        .select()
        .single();

      if (menuError) throw menuError;

      // Create menu items (first and second courses)
      const menuItems = [
        {
          daily_menu_id: menuData.id,
          course_name: newMenu.firstCourse,
          course_type: 'first',
          display_order: 1
        },
        {
          daily_menu_id: menuData.id,
          course_name: newMenu.secondCourse,
          course_type: 'second',
          display_order: 2
        }
      ];

      const { error: itemsError } = await supabase
        .from('daily_menu_items')
        .insert(menuItems);

      if (itemsError) throw itemsError;

      // Fetch the updated menu to include the newly added items
      const { data: updatedMenu, error: fetchError } = await supabase
        .from('daily_menus')
        .select(`
          id,
          date,
          repeat_pattern,
          active,
          scheduled_for,
          created_at,
          daily_menu_items (
            id,
            course_name,
            course_type,
            display_order
          )
        `)
        .eq('id', menuData.id)
        .single();

      if (fetchError) throw fetchError;

      // Update the state with the new menu
      setDailyMenus(prev => [updatedMenu, ...prev]);
      setIsDialogOpen(false);
      setNewMenu({
        date: new Date().toISOString().split('T')[0],
        repeat_pattern: 'none',
        active: true,
        firstCourse: '',
        secondCourse: ''
      });

      toast({
        title: "Success",
        description: "Daily menu created successfully",
      });
    } catch (error) {
      console.error('Error creating daily menu:', error);
      toast({
        title: "Error",
        description: "Failed to create daily menu",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const toggleMenuStatus = async (menuId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('daily_menus')
        .update({ active: !currentStatus })
        .eq('id', menuId);

      if (error) throw error;

      setDailyMenus(prev =>
        prev.map(menu =>
          menu.id === menuId ? { ...menu, active: !currentStatus } : menu
        )
      );

      toast({
        title: "Success",
        description: `Menu ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      console.error('Error toggling menu status:', error);
      toast({
        title: "Error",
        description: "Failed to update menu status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container p-6">
      <PageHeader
        heading="Daily Menus"
        text="Manage your restaurant's daily menus"
      >
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Daily Menu
        </Button>
      </PageHeader>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="flex h-[200px] items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : dailyMenus.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No daily menus found. Create one to get started.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {dailyMenus.map((menu) => (
            <div
              key={menu.id}
              className="rounded-lg border bg-card text-card-foreground shadow-sm"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      {formatDate(menu.date)}
                    </h3>
                    <Badge className="mt-2" variant={menu.active ? "success" : "secondary"}>
                      {menu.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleMenuStatus(menu.id, menu.active)}
                    >
                      <ToggleLeft className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-lg font-bold mb-2">
                    Scheduled For: {new Date(menu.scheduled_for).toLocaleString('en-US', {
                      timeZone: 'Europe/Madrid',
                      dateStyle: 'full',
                      timeStyle: 'short',
                    })}
                  </div>
                  <div className="text-lg font-bold mb-2">
                    Repeat Pattern: {menu.repeat_pattern.charAt(0).toUpperCase() + menu.repeat_pattern.slice(1)}
                  </div>
                  <div className="space-y-2">
                    {menu.daily_menu_items
                      ?.sort((a, b) => a.display_order - b.display_order)
                      .map((item) => (
                        <div key={item.id} className="text-sm flex items-center">
                          {item.course_type === 'first' ? '• First Course:' : '• Second Course:'} {item.course_name}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Daily Menu</DialogTitle>
            <DialogDescription>
              Create a new daily menu by selecting the date, repeat pattern, and entering the course names.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newMenu.date}
                onChange={(e) => setNewMenu({ ...newMenu, date: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="repeat_pattern">Repeat Pattern</Label>
              <Select
                value={newMenu.repeat_pattern}
                onValueChange={(value: 'none' | 'weekly' | 'monthly') => 
                  setNewMenu({ 
                    ...newMenu, 
                    repeat_pattern: value 
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select repeat pattern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="firstCourse">First Course</Label>
              <Input
                id="firstCourse"
                type="text"
                value={newMenu.firstCourse}
                onChange={(e) => setNewMenu({ ...newMenu, firstCourse: e.target.value })}
                placeholder="Enter first course name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="secondCourse">Second Course</Label>
              <Input
                id="secondCourse"
                type="text"
                value={newMenu.secondCourse}
                onChange={(e) => setNewMenu({ ...newMenu, secondCourse: e.target.value })}
                placeholder="Enter second course name"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateMenu}>
              Create Menu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
