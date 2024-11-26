"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Plus, ToggleLeft, Edit, Copy, Search } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { addDays, addWeeks, addMonths, startOfWeek, endOfWeek, startOfMonth, endOfMonth, format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { DateRange } from "react-day-picker";

// -----------------------------------
// Utility Functions
// -----------------------------------

// Calculate date ranges for quick selection
const getThisWeekRange = (): DateRange => ({
  from: startOfWeek(new Date(), { locale: es }),
  to: endOfWeek(new Date(), { locale: es }),
});

const getNextWeekRange = (): DateRange => ({
  from: startOfWeek(addWeeks(new Date(), 1), { locale: es }),
  to: endOfWeek(addWeeks(new Date(), 1), { locale: es }),
});

const getThisMonthRange = (): DateRange => ({
  from: startOfMonth(new Date()),
  to: endOfMonth(new Date()),
});

// -----------------------------------
// Utility Classes
// -----------------------------------
const cardClasses = "bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all p-6 rounded-sm relative group";
const headingClasses = "text-2xl font-medium mb-1";
const subheadingClasses = "text-sm uppercase text-muted-foreground tracking-wide";
const labelClasses = "text-xs uppercase text-muted-foreground font-medium tracking-wide";

// -----------------------------------
// TypeScript Interfaces
// -----------------------------------

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

interface FilterOptions {
  search: string;
  pattern: "all" | "none" | "weekly" | "monthly";
  status: "all" | "active" | "inactive";
}

// -----------------------------------
// Components
// -----------------------------------

// QuickSelect Component: Allows quick selection of date ranges
const QuickSelect = ({ onSelect }: { onSelect: (range: DateRange) => void }) => (
  <div className="flex gap-2 mb-6">
    {/* Improved button styling */}
    <Button 
      variant="outline" 
      size="sm"
      onClick={() => onSelect(getThisWeekRange())}
      className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-sm font-medium rounded-md transition-colors"
    >
      This Week
    </Button>
    <Button 
      variant="outline" 
      size="sm"
      onClick={() => onSelect(getNextWeekRange())}
      className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-sm font-medium rounded-md transition-colors"
    >
      Next Week
    </Button>
    <Button 
      variant="outline" 
      size="sm"
      onClick={() => onSelect(getThisMonthRange())}
      className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-sm font-medium rounded-md transition-colors"
    >
      This Month
    </Button>
  </div>
);

// MenuCardProps Type Definition
type MenuCardProps = {
  menu: DailyMenu;
  onStatusToggle: (id: string, status: boolean) => void;
  onEdit: (menu: DailyMenu) => void;
  onDuplicate: (menu: DailyMenu) => void;
};

// MenuCard Component: Displays individual menu details with interactive buttons
const MenuCard = ({ 
  menu, 
  onStatusToggle,
  onEdit,
  onDuplicate 
}: MenuCardProps) => (
  <div className={cardClasses}>
    <div className="flex justify-between items-start mb-6">
      <div>
        <div className={labelClasses}>DATE</div>
        <div className="text-lg mt-1">{format(new Date(menu.date), "PPP", { locale: es })}</div>
      </div>
      <Badge 
        className={cn(
          "rounded-none px-3 py-1",
          menu.active ? "bg-black text-white" : "bg-gray-100 text-gray-600"
        )}
      >
        {menu.active ? 'Active' : 'Inactive'}
      </Badge>
    </div>

    <div className="space-y-4">
      <div>
        <div className={labelClasses}>PATTERN</div>
        <div className="mt-1 capitalize">{menu.repeat_pattern}</div>
      </div>

      <div>
        <div className={labelClasses}>COURSES</div>
        <div className="grid gap-2 mt-2">
          {menu.daily_menu_items
            ?.sort((a, b) => a.display_order - b.display_order)
            .map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <div className={labelClasses}>{item.course_type.toUpperCase()}</div>
                  <div className="text-sm mt-1">{item.course_name}</div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>

    {/* Hover Actions */}
    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="absolute bottom-4 right-4 flex gap-2">
        <Button 
          size="sm" 
          variant="ghost"
          onClick={() => onEdit(menu)}
          className="hover:bg-black hover:text-white"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          size="sm" 
          variant="ghost"
          onClick={() => onDuplicate(menu)}
          className="hover:bg-black hover:text-white"
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button
          size="sm" 
          variant="ghost"
          onClick={() => onStatusToggle(menu.id, menu.active)}
          className="hover:bg-black hover:text-white"
        >
          <ToggleLeft className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
);

// FilterBar Component: Provides filtering and search functionalities
const FilterBar = ({ 
  filter, 
  onFilterChange 
}: { 
  filter: FilterOptions;
  onFilterChange: (filter: FilterOptions) => void;
}) => (
  <div className="flex gap-4 items-center mb-6">
    <div className="relative flex-1 max-w-xs">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input 
        placeholder="Search menus..."
        value={filter.search}
        onChange={(e) => onFilterChange({ ...filter, search: e.target.value })}
        className="pl-9"
      />
    </div>
    <Select
      value={filter.pattern}
      onValueChange={(value: FilterOptions['pattern']) => 
        onFilterChange({ ...filter, pattern: value })
      }
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by pattern" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Patterns</SelectItem>
        <SelectItem value="none">Single</SelectItem>
        <SelectItem value="weekly">Weekly</SelectItem>
        <SelectItem value="monthly">Monthly</SelectItem>
      </SelectContent>
    </Select>
    <Select
      value={filter.status}
      onValueChange={(value: FilterOptions['status']) => 
        onFilterChange({ ...filter, status: value })
      }
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Status</SelectItem>
        <SelectItem value="active">Active</SelectItem>
        <SelectItem value="inactive">Inactive</SelectItem>
      </SelectContent>
    </Select>
  </div>
);

// -----------------------------------
// Main Component: DailyMenuPage
// -----------------------------------

export default function DailyMenuPage() {
  // -----------------------------------
  // State Management
  // -----------------------------------
  const [dailyMenus, setDailyMenus] = useState<DailyMenu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [editingMenu, setEditingMenu] = useState<DailyMenu | null>(null);
  const [filter, setFilter] = useState<FilterOptions>({
    search: "",
    pattern: "all",
    status: "all",
  });
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

  // -----------------------------------
  // Data Fetching
  // -----------------------------------
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

  // -----------------------------------
  // Event Handlers
  // -----------------------------------

  // Toggle the active status of a menu
  const toggleMenuStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("daily_menus")
        .update({ active: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      setDailyMenus((prevMenus) =>
        prevMenus.map((menu) =>
          menu.id === id ? { ...menu, active: !currentStatus } : menu
        )
      );

      toast({
        title: "Success",
        description: "Menu status updated successfully",
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

  // Handle creating or updating a menu
  const handleCreateMenu = async () => {
    try {
      const { dateRange, firstCourse, secondCourse, repeat_pattern, active } = newMenu;
      if (!dateRange.from || !firstCourse || !secondCourse) {
        toast({
          title: "Error",
          description: "Please fill in all required fields and select dates",
          variant: "destructive",
        });
        return;
      }

      // Generate dates based on repeat pattern
      const datesToSchedule: Date[] = [];
      let currentDate = new Date(dateRange.from);
      const endDate = dateRange.to ? new Date(dateRange.to) : new Date(dateRange.from);

      while (currentDate <= endDate) {
        datesToSchedule.push(new Date(currentDate));
        switch (repeat_pattern) {
          case "weekly":
            currentDate = addWeeks(currentDate, 1);
            break;
          case "monthly":
            currentDate = addMonths(currentDate, 1);
            break;
          default:
            currentDate = addDays(currentDate, 1);
        }
      }

      // Create menus for all dates
      for (const date of datesToSchedule) {
        // Skip if menu exists
        if (dailyMenus.some((menu) => isSameDay(new Date(menu.date), date))) {
          continue;
        }

        const menuData = {
          date: format(date, "yyyy-MM-dd"),
          repeat_pattern,
          active,
          scheduled_for: format(date, "yyyy-MM-dd'T'11:00:00.000'Z'"),
        };

        const { data: menu, error: menuError } = await supabase
          .from("daily_menus")
          .insert(menuData)
          .select()
          .single();

        if (menuError) throw menuError;

        const menuItems = [
          {
            daily_menu_id: menu.id,
            course_name: firstCourse,
            course_type: "first",
            display_order: 1,
          },
          {
            daily_menu_id: menu.id,
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
      resetNewMenu();

      toast({
        title: "Success",
        description: "Menus scheduled successfully",
      });
    } catch (error) {
      console.error("Error creating menus:", error);
      toast({
        title: "Error",
        description: "Failed to schedule menus",
        variant: "destructive",
      });
    }
  };

  // Handle duplicating a menu
  const handleDuplicateMenu = (menu: DailyMenu) => {
    setNewMenu({
      dateRange: {
        from: new Date(),
        to: new Date(),
      },
      repeat_pattern: "none",
      active: true,
      firstCourse: menu.daily_menu_items.find((item) => item.course_type === "first")?.course_name || "",
      secondCourse: menu.daily_menu_items.find((item) => item.course_type === "second")?.course_name || "",
    });
    setIsDialogOpen(true);
  };

  // Handle editing a menu
  const handleEditMenu = (menu: DailyMenu) => {
    setEditingMenu(menu);
    setNewMenu({
      dateRange: {
        from: new Date(menu.date),
        to: new Date(menu.date),
      },
      repeat_pattern: menu.repeat_pattern,
      active: menu.active,
      firstCourse: menu.daily_menu_items.find((item) => item.course_type === "first")?.course_name || "",
      secondCourse: menu.daily_menu_items.find((item) => item.course_type === "second")?.course_name || "",
    });
    setIsDialogOpen(true);
  };

  // Reset newMenu state
  const resetNewMenu = () => {
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
    setEditingMenu(null);
  };

  // -----------------------------------
  // Helper Functions
  // -----------------------------------

  // Get menu for a specific date
  const getMenuForDate = (date: Date): DailyMenu | undefined => {
    return dailyMenus.find(menu => isSameDay(new Date(menu.date), date));
  };

  // -----------------------------------
  // Filtered Menus Calculation
  // -----------------------------------
  const filteredMenus = dailyMenus
    .filter((menu: DailyMenu) => {
      if (filter.pattern !== "all" && menu.repeat_pattern !== filter.pattern) return false;
      if (filter.status !== "all" && menu.active !== (filter.status === "active")) return false;
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        return (
          menu.daily_menu_items.some((item) =>
            item.course_name.toLowerCase().includes(searchLower)
          )
        );
      }
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // -----------------------------------
  // Rendering
  // -----------------------------------
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className={headingClasses}>Daily Menus</h1>
            <p className={subheadingClasses}>Menu Schedule Management</p>
          </div>
          <Button
            onClick={() => {
              resetNewMenu();
              setIsDialogOpen(true);
            }}
            className="bg-black hover:bg-gray-800 text-white rounded-none"
          >
            <Plus className="mr-2 h-4 w-4" />
            Schedule Menu
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendar Section */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">Calendar View</h2>
              <p className="text-sm text-gray-500 mt-1">SELECT DATES TO VIEW OR SCHEDULE MENUS</p>
            </div>

            {/* Quick Select Buttons */}
            <QuickSelect onSelect={(range) => setNewMenu({ ...newMenu, dateRange: range })} />

            {/* Calendar Component with Visual Feedback */}
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
              classNames={{
                months: "space-y-4",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium",
                nav: "space-x-1 flex items-center",
                nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-gray-500 rounded-md w-9 font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "text-center text-sm relative p-0 rounded-md hover:bg-gray-100 focus-within:relative focus-within:z-20",
                day: "h-9 w-9 p-0 font-normal",
                day_range_middle: "rounded-none",
                day_selected: "bg-black text-white hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white",
                day_today: "bg-gray-50",
                day_outside: "opacity-50",
                day_disabled: "opacity-50",
                day_hidden: "invisible",
              }}
              modifiers={{
                booked: (date) =>
                  dailyMenus.some((menu) => isSameDay(new Date(menu.date), date)),
                weekly: (date) =>
                  dailyMenus.some(
                    (menu) =>
                      isSameDay(new Date(menu.date), date) &&
                      menu.repeat_pattern === "weekly"
                  ),
                monthly: (date) =>
                  dailyMenus.some(
                    (menu) =>
                      isSameDay(new Date(menu.date), date) &&
                      menu.repeat_pattern === "monthly"
                  ),
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
                        <Popover>
                          <PopoverContent className="w-80 p-0" align="center">
                            <div className="p-4">
                              <div className="mb-2 font-medium">
                                {format(props.date, "PPP", { locale: es })}
                              </div>
                              <div className="space-y-2">
                                {menu.daily_menu_items.map((item) => (
                                  <div key={item.id} className="text-sm">
                                    <span className="font-medium">
                                      {item.course_type === "first" ? "First" : "Second"}:
                                    </span>{" "}
                                    {item.course_name}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  );
                },
              }}
            />

            {/* Improved legend */}
            <div className="mt-6 flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-black rounded-sm" />
                <span className="text-sm text-gray-600">Single</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#2563eb] rounded-sm" />
                <span className="text-sm text-gray-600">Weekly</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#7c3aed] rounded-sm" />
                <span className="text-sm text-gray-600">Monthly</span>
              </div>
            </div>
          </div>

          {/* Menu List Section */}
          <div className="space-y-6">
            <div>
              <h2 className={headingClasses}>Scheduled Menus</h2>
              <p className={subheadingClasses}>View and manage your daily menus</p>
            </div>

            {/* Filter and Search Bar */}
            <FilterBar filter={filter} onFilterChange={setFilter} />

            {/* Loading State */}
            {isLoading ? (
              <div className="flex h-[200px] items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
              </div>
            ) : filteredMenus.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No menus found. {filter.search || filter.pattern !== "all" || filter.status !== "all"
                    ? "Try adjusting your filters."
                    : "Create one to get started."}
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
                {filteredMenus.map((menu) => (
                  <MenuCard
                    key={menu.id}
                    menu={menu}
                    onStatusToggle={toggleMenuStatus}
                    onEdit={handleEditMenu}
                    onDuplicate={handleDuplicateMenu}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Create/Edit Menu Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) resetNewMenu();
          setIsDialogOpen(open);
        }}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>{editingMenu ? "Edit Menu" : "Schedule Menu"}</DialogTitle>
              <DialogDescription>
                {editingMenu
                  ? "Modify the menu details"
                  : "Create a new menu by selecting dates and entering courses"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={(e) => {
              e.preventDefault();
              handleCreateMenu();
            }} className="grid gap-6 py-4">
              {/* Selected Dates Display */}
              <div className="grid gap-2">
                <Label htmlFor="date-range" className={labelClasses}>
                  Selected Dates
                </Label>
                <div className="text-sm">
                  {newMenu.dateRange.from &&
                    format(newMenu.dateRange.from, "PPP", { locale: es })}
                  {newMenu.dateRange.to &&
                    newMenu.dateRange.from !== newMenu.dateRange.to &&
                    ` - ${format(newMenu.dateRange.to, "PPP", { locale: es })}`}
                </div>
              </div>

              {/* Repeat Pattern Selection */}
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

              {/* First Course Input */}
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
                  placeholder="Enter first course"
                  required
                />
              </div>

              {/* Second Course Input */}
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
                  placeholder="Enter second course"
                  required
                />
              </div>
            </form>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  resetNewMenu();
                  setIsDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" onClick={handleCreateMenu}>
                {editingMenu ? "Update Menu" : "Schedule Menu"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
