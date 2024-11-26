"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Plus, ToggleLeft } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { addDays, format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { DateRange } from "react-day-picker";

// Utility classes adhering to Swiss Design principles
const cardClasses =
  "bg-white border-0 shadow-sm hover:shadow-md transition-shadow p-8 relative";
const headingClasses = "text-2xl font-light tracking-tight mb-6";
const subheadingClasses =
  "text-sm font-medium uppercase tracking-widest text-muted-foreground mb-4";
const labelClasses =
  "text-xs uppercase tracking-wider font-medium text-muted-foreground";

// Header Component
const Header = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-8 flex justify-between items-center">
    <div>
      <h1 className={headingClasses}>Daily Menus</h1>
      <p className={subheadingClasses}>Menu Schedule Management</p>
    </div>
    {children}
  </div>
);

// Menu Preview Component
const MenuPreview = ({ menu }: { menu: DailyMenu }) => (
  <div className="p-4 bg-white shadow-lg rounded-none border-t-2 border-black">
    <div className="space-y-4">
      <div>
        <span className={labelClasses}>Schedule Type</span>
        <p className="mt-1 font-light">{menu.repeat_pattern}</p>
      </div>
      <div>
        <span className={labelClasses}>Courses</span>
        <div className="mt-2 space-y-2">
          {menu.daily_menu_items
            ?.sort((a, b) => a.display_order - b.display_order)
            .map((item) => (
              <div key={item.id} className="flex items-start space-x-2">
                <span className="text-xs uppercase text-muted-foreground w-24">
                  {item.course_type === "first" ? "First" : "Second"}
                </span>
                <span className="font-light">{item.course_name}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  </div>
);

// TypeScript Interfaces
interface DailyMenuItem {
  id: string;
  course_name: string;
  course_type: "first" | "second";
  display_order: number;
}

interface DailyMenu {
  id: string;
  date: string;
  repeat_pattern: "none" | "weekly" | "monthly";
  active: boolean;
  scheduled_for: string;
  created_at: string;
  daily_menu_items: DailyMenuItem[];
}

interface NewMenu {
  dateRange: DateRange;
  repeat_pattern: "none" | "weekly" | "monthly";
  active: boolean;
  firstCourse: string;
  secondCourse: string;
}

export default function DailyMenuPage() {
  // State
  const [dailyMenus, setDailyMenus] = useState<DailyMenu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [newMenu, setNewMenu] = useState<NewMenu>({
    dateRange: {
      from: new Date(),
      to: new Date(),
    },
    repeat_pattern: "none",
    active: true,
    firstCourse: "",
    secondCourse: "",
  });

  const supabase = createClientComponentClient();
  const { toast } = useToast();

  // Fetch daily menus
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data: menusData, error: menusError } = await supabase
          .from("daily_menus")
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
          .order("date", { ascending: false });

        if (menusError) throw menusError;
        setDailyMenus(menusData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load daily menus");
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

  // Helper functions
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "PPP", { locale: es });
  };

  const getMenuForDate = (date: Date) => {
    return dailyMenus.find((menu) => isSameDay(new Date(menu.date), date));
  };

  // Handle menu creation for selected dates
  const handleCreateMenu = async () => {
    try {
      const { dateRange, firstCourse, secondCourse, repeat_pattern } = newMenu;
      if (!dateRange.from || !firstCourse || !secondCourse) {
        toast({
          title: "Error",
          description: "Please fill in all required fields and select dates",
          variant: "destructive",
        });
        return;
      }

      // Create array of dates to schedule based on repeat pattern
      const datesToSchedule: Date[] = [];
      let currentDate = new Date(dateRange.from);
      const endDate = dateRange.to ? new Date(dateRange.to) : new Date(dateRange.from);

      while (currentDate <= endDate) {
        datesToSchedule.push(new Date(currentDate));
        switch (repeat_pattern) {
          case "weekly":
            currentDate = addDays(currentDate, 7);
            break;
          case "monthly":
            currentDate.setMonth(currentDate.getMonth() + 1);
            break;
          default:
            currentDate = addDays(currentDate, 1);
            break;
        }
      }

      // Create menus for all selected dates
      for (const date of datesToSchedule) {
        // Check if a menu already exists for the date
        if (getMenuForDate(date)) {
          continue; // Skip if menu already exists
        }

        const menuData = {
          date: format(date, "yyyy-MM-dd"),
          repeat_pattern,
          active: true,
          scheduled_for: format(date, "yyyy-MM-dd'T'11:00:00.000'Z'"),
        };

        // Insert menu
        const { data: createdMenu, error: menuError } = await supabase
          .from("daily_menus")
          .insert(menuData)
          .select()
          .single();

        if (menuError) throw menuError;

        // Create menu items
        const menuItems = [
          {
            daily_menu_id: createdMenu.id,
            course_name: firstCourse,
            course_type: "first",
            display_order: 1,
          },
          {
            daily_menu_id: createdMenu.id,
            course_name: secondCourse,
            course_type: "second",
            display_order: 2,
          },
        ];

        const { error: itemsError } = await supabase
          .from("daily_menu_items")
          .insert(menuItems);

        if (itemsError) throw itemsError;
      }

      // Refresh menus
      const { data: updatedMenus, error: fetchError } = await supabase
        .from("daily_menus")
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
        .order("date", { ascending: false });

      if (fetchError) throw fetchError;
      setDailyMenus(updatedMenus || []);

      setIsDialogOpen(false);
      setNewMenu({
        dateRange: {
          from: new Date(),
          to: new Date(),
        },
        repeat_pattern: "none",
        active: true,
        firstCourse: "",
        secondCourse: "",
      });

      toast({
        title: "Success",
        description: "Daily menus created successfully",
      });
    } catch (error) {
      console.error("Error creating menus:", error);
      toast({
        title: "Error",
        description: "Failed to create daily menus",
        variant: "destructive",
      });
    }
  };

  // Toggle menu status
  const toggleMenuStatus = async (menuId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("daily_menus")
        .update({ active: !currentStatus })
        .eq("id", menuId);

      if (error) throw error;

      setDailyMenus((prev) =>
        prev.map((menu) =>
          menu.id === menuId ? { ...menu, active: !currentStatus } : menu
        )
      );

      toast({
        title: "Success",
        description: `Menu ${!currentStatus ? "activated" : "deactivated"} successfully`,
      });
    } catch (error) {
      console.error("Error toggling menu status:", error);
      toast({
        title: "Error",
        description: "Failed to update menu status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] p-8">
      {/* Header Component with New Menu Button */}
      <Header>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-black hover:bg-gray-800 text-white rounded-none"
        >
          <Plus className="mr-2 h-4 w-4" />
          Schedule Menu
        </Button>
      </Header>

      {/* Display error if any */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar Section */}
        <div className="bg-white p-8 shadow-sm">
          <div className="mb-6">
            <h2 className={headingClasses}>Calendar View</h2>
            <p className={subheadingClasses}>Select dates to view or schedule menus</p>
          </div>

          <Calendar
            mode="range"
            selected={newMenu.dateRange}
            onSelect={(range) =>
              setNewMenu({
                ...newMenu,
                dateRange: range || { from: undefined, to: undefined },
              })
            }
            numberOfMonths={1}
            locale={es}
            modifiers={{
              booked: (date) =>
                dailyMenus.some((menu) => isSameDay(new Date(menu.date), date)),
            }}
            modifiersStyles={{
              booked: {
                backgroundColor: "rgb(0, 0, 0)",
                color: "white",
              },
            }}
            onDayMouseEnter={(date) => setHoveredDate(date)}
            onDayMouseLeave={() => setHoveredDate(null)}
            components={{
              DayContent: (props) => {
                const menu = getMenuForDate(props.date);
                const isHovered = hoveredDate && isSameDay(hoveredDate, props.date);

                return (
                  <div className="relative w-full h-full">
                    <div
                      className={cn(
                        "w-full h-full flex items-center justify-center",
                        menu && "font-medium"
                      )}
                    >
                      {props.date.getDate()}
                    </div>
                    {isHovered && menu && (
                      <div className="absolute z-50 left-1/2 top-full mt-2 -translate-x-1/2">
                        <MenuPreview menu={menu} />
                      </div>
                    )}
                  </div>
                );
              },
            }}
          />
        </div>

        {/* Menu List Section */}
        <div className="space-y-6">
          <div className="mb-6">
            <h2 className={headingClasses}>Scheduled Menus</h2>
            <p className={subheadingClasses}>View and manage your daily menus</p>
          </div>

          {isLoading ? (
            <div className="flex h-[200px] items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
          ) : dailyMenus.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No daily menus found. Create one to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {dailyMenus.map((menu) => (
                <div key={menu.id} className={cardClasses}>
                  {/* Date display with strong typography */}
                  <div className="mb-6">
                    <div className={labelClasses}>Date</div>
                    <div className="text-xl font-light mt-1">{formatDate(menu.date)}</div>
                  </div>

                  {/* Status badge with high contrast */}
                  <Badge
                    className={cn(
                      "absolute top-8 right-8 rounded-none px-3 py-1",
                      menu.active ? "bg-black text-white" : "bg-gray-100 text-gray-600"
                    )}
                  >
                    {menu.active ? "Active" : "Inactive"}
                  </Badge>

                  {/* Menu details with clear hierarchy */}
                  <div className="space-y-6">
                    <div>
                      <div className={labelClasses}>Pattern</div>
                      <div className="mt-1">
                        {menu.repeat_pattern.charAt(0).toUpperCase() +
                          menu.repeat_pattern.slice(1)}
                      </div>
                    </div>

                    <div>
                      <div className={labelClasses}>Courses</div>
                      <div className="mt-2 space-y-2">
                        {menu.daily_menu_items
                          ?.sort((a, b) => a.display_order - b.display_order)
                          .map((item) => (
                            <div key={item.id} className="flex items-start space-x-2">
                              <span className="text-xs uppercase text-muted-foreground w-24">
                                {item.course_type === "first" ? "First" : "Second"}
                              </span>
                              <span className="font-light">{item.course_name}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions with minimal design */}
                  <div className="absolute bottom-8 right-8">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleMenuStatus(menu.id, menu.active)}
                      className="rounded-none border-black hover:bg-black hover:text-white"
                    >
                      <ToggleLeft className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Menu Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-none p-8 max-w-xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-light tracking-tight mb-6">
              Schedule Daily Menu
            </DialogTitle>
            <DialogDescription className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-4">
              Create a new daily menu for selected dates
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="date-range" className={labelClasses}>
                Selected Dates
              </Label>
              <div className="text-sm">
                {newMenu.dateRange.from &&
                  format(newMenu.dateRange.from, "PPP", { locale: es })}
                {newMenu.dateRange.to &&
                  ` - ${format(newMenu.dateRange.to, "PPP", { locale: es })}`}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="repeat_pattern" className={labelClasses}>
                Repeat Pattern
              </Label>
              <Select
                value={newMenu.repeat_pattern}
                onValueChange={(value: "none" | "weekly" | "monthly") =>
                  setNewMenu({
                    ...newMenu,
                    repeat_pattern: value,
                  })
                }
              >
                <SelectTrigger className="border border-gray-300 rounded-none p-2">
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
              <Label htmlFor="firstCourse" className={labelClasses}>
                First Course
              </Label>
              <Input
                id="firstCourse"
                value={newMenu.firstCourse}
                onChange={(e) =>
                  setNewMenu({ ...newMenu, firstCourse: e.target.value })
                }
                placeholder="Enter first course name"
                className="border border-gray-300 rounded-none p-2"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="secondCourse" className={labelClasses}>
                Second Course
              </Label>
              <Input
                id="secondCourse"
                value={newMenu.secondCourse}
                onChange={(e) =>
                  setNewMenu({ ...newMenu, secondCourse: e.target.value })
                }
                placeholder="Enter second course name"
                className="border border-gray-300 rounded-none p-2"
              />
            </div>
          </div>

          <DialogFooter className="mt-6 flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="bg-white border-gray-300 text-gray-700 hover:bg-gray-100 rounded-none"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateMenu}
              className="bg-black hover:bg-gray-800 text-white rounded-none"
            >
              Schedule Menu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
