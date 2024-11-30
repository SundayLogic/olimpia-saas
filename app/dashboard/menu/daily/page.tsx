"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Plus, ToggleLeft, Edit, Copy, Search, Calendar } from "lucide-react"; // Added 'Calendar' icon
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch"; // Imported Switch component
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
import { Calendar as CalendarComponent } from "@/components/ui/calendar"; // Renamed to avoid conflict
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  addDays,
  addWeeks,
  addMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  format,
  isSameDay,
} from "date-fns";
import { es } from "date-fns/locale";
import { DateRange } from "react-day-picker";

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

interface AdvancedFilterOptions extends FilterOptions {
  dateRange: DateRange | undefined;
  courseSearch: string;
}

interface GroupedMenus {
  [key: string]: DailyMenu[];
}

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

// Group menus by the start of their week
function groupMenusByWeek(menus: DailyMenu[]): GroupedMenus {
  return menus.reduce((acc, menu) => {
    const weekStart = format(startOfWeek(new Date(menu.date), { locale: es }), 'yyyy-MM-dd');
    if (!acc[weekStart]) acc[weekStart] = [];
    acc[weekStart].push(menu);
    return acc;
  }, {} as GroupedMenus);
}

// -----------------------------------
// Utility Classes
// -----------------------------------
const cardClasses =
  "bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all p-6 rounded-sm relative group";
const headingClasses = "text-2xl font-medium mb-1";
const subheadingClasses =
  "text-sm uppercase text-muted-foreground tracking-wide";
const labelClasses =
  "text-xs uppercase text-muted-foreground font-medium tracking-wide";

// -----------------------------------
// Sub-Components
// -----------------------------------

// AdvancedFilters Component
const AdvancedFilters = ({
  filters,
  onFilterChange,
}: {
  filters: AdvancedFilterOptions;
  onFilterChange: (filters: AdvancedFilterOptions) => void;
}) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap">
        {/* Search input */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search menus..."
              value={filters.search}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  search: e.target.value,
                })
              }
              className="pl-9"
            />
          </div>
        </div>

        {/* Course Search input */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={filters.courseSearch}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  courseSearch: e.target.value,
                })
              }
              className="pl-9"
            />
          </div>
        </div>

        {/* Pattern filter */}
        <Select
          value={filters.pattern}
          onValueChange={(value: FilterOptions["pattern"]) =>
            onFilterChange({ ...filters, pattern: value })
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

        {/* Date range picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="min-w-[200px] justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              {filters.dateRange?.from ? (
                filters.dateRange.to ? (
                  <>
                    {format(filters.dateRange.from, "PPP", { locale: es })} -{" "}
                    {format(filters.dateRange.to, "PPP", { locale: es })}
                  </>
                ) : (
                  format(filters.dateRange.from, "PPP", { locale: es })
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <CalendarComponent
              mode="range"
              selected={filters.dateRange}
              onSelect={(range) =>
                onFilterChange({ ...filters, dateRange: range })
              }
            />
          </PopoverContent>
        </Popover>

        {/* Status filter */}
        <Select
          value={filters.status}
          onValueChange={(value: FilterOptions["status"]) =>
            onFilterChange({ ...filters, status: value })
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
    </div>
  );
};

// QuickActions Component
const QuickActions = ({
  onSelectDateRange,
  onCreateMenu,
}: {
  onSelectDateRange: (range: DateRange) => void;
  onCreateMenu: () => void;
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSelectDateRange(getThisWeekRange())}
        >
          This Week
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSelectDateRange(getNextWeekRange())}
        >
          Next Week
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSelectDateRange(getThisMonthRange())}
        >
          This Month
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            onSelectDateRange({
              from: new Date(),
              to: new Date(),
            })
          }
        >
          <Calendar className="mr-2 h-4 w-4" />
          Today
        </Button>
        <Button onClick={onCreateMenu}>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Menu
        </Button>
      </div>
    </div>
  );
};

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
  onDuplicate,
}: MenuCardProps) => (
  <div className={cardClasses}>
    <div className="flex justify-between items-start mb-6">
      <div>
        <div className={labelClasses}>DATE</div>
        <div className="text-lg mt-1">
          {format(new Date(menu.date), "PPP", { locale: es })}
        </div>
      </div>

      {/* Enhanced status toggle */}
      <Switch
        checked={menu.active}
        onCheckedChange={(checked) => onStatusToggle(menu.id, checked)}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black",
          menu.active ? "bg-black" : "bg-gray-200"
        )}
      >
        <span className="sr-only">Toggle menu status</span>
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
            menu.active ? "translate-x-6" : "translate-x-1"
          )}
        />
      </Switch>
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
          aria-label={`Edit menu scheduled on ${format(new Date(menu.date), "PPP", { locale: es })}`}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDuplicate(menu)}
          className="hover:bg-black hover:text-white"
          aria-label={`Duplicate menu scheduled on ${format(new Date(menu.date), "PPP", { locale: es })}`}
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onStatusToggle(menu.id, menu.active)}
          className="hover:bg-black hover:text-white"
          aria-label={`Toggle status for menu scheduled on ${format(new Date(menu.date), "PPP", { locale: es })}`}
        >
          <ToggleLeft className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
);

// MenuListSection Component
const MenuListSection = ({
  filteredMenus,
  toggleMenuStatus,
  handleEditMenu,
  handleDuplicateMenu,
}: {
  filteredMenus: DailyMenu[];
  toggleMenuStatus: (id: string, status: boolean) => void;
  handleEditMenu: (menu: DailyMenu) => void;
  handleDuplicateMenu: (menu: DailyMenu) => void;
}) => {
  const groupedMenus = useMemo(() => groupMenusByWeek(filteredMenus), [filteredMenus]);

  return (
    <div className="space-y-8">
      {Object.entries(groupedMenus).map(([week, menus]) => (
        <div key={week} className="space-y-4">
          <h3 className="text-sm font-medium text-gray-500 sticky top-0 bg-white z-10 py-2">
            Week of {format(new Date(week), "PPP", { locale: es })}
          </h3>
          <div className="space-y-4">
            {menus.map((menu) => (
              <MenuCard
                key={menu.id}
                menu={menu}
                onStatusToggle={toggleMenuStatus}
                onEdit={handleEditMenu}
                onDuplicate={handleDuplicateMenu}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

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
  const [advancedFilter, setAdvancedFilter] = useState<AdvancedFilterOptions>({
    search: "",
    pattern: "all",
    status: "all",
    dateRange: undefined,
    courseSearch: "",
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

      // Batch insert menus
      const menusToInsert = datesToSchedule
        .filter((date) => !dailyMenus.some((menu) => isSameDay(new Date(menu.date), date)))
        .map((date) => ({
          date: format(date, "yyyy-MM-dd"),
          repeat_pattern,
          active,
          scheduled_for: format(date, "yyyy-MM-dd'T'11:00:00.000'Z'"),
        }));

      if (menusToInsert.length === 0) {
        toast({
          title: "Info",
          description: "No new menus to schedule.",
        });
        return;
      }

      const { data: insertedMenus, error: insertError } = await supabase
        .from("daily_menus")
        .insert(menusToInsert)
        .select();

      if (insertError) throw insertError;

      // Prepare daily_menu_items for all inserted menus
      const allMenuItems = insertedMenus.flatMap((menu) => [
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
      ]);

      // Batch insert daily_menu_items
      const { error: itemsError } = await supabase
        .from("daily_menu_items")
        .insert(allMenuItems);

      if (itemsError) throw itemsError;

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
      firstCourse:
        menu.daily_menu_items.find((item) => item.course_type === "first")
          ?.course_name || "",
      secondCourse:
        menu.daily_menu_items.find((item) => item.course_type === "second")
          ?.course_name || "",
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
      firstCourse:
        menu.daily_menu_items.find((item) => item.course_type === "first")
          ?.course_name || "",
      secondCourse:
        menu.daily_menu_items.find((item) => item.course_type === "second")
          ?.course_name || "",
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
  const getMenuForDate = useCallback(
    (date: Date): DailyMenu | undefined => {
      return dailyMenus.find((menu) => isSameDay(new Date(menu.date), date));
    },
    [dailyMenus]
  );

  // -----------------------------------
  // Filtered Menus Calculation
  // -----------------------------------
  const filteredMenus = useMemo(() => {
    let menus = [...dailyMenus];

    // Apply search filter
    if (advancedFilter.search.trim()) {
      const searchLower = advancedFilter.search.toLowerCase();
      menus = menus.filter((menu) =>
        menu.daily_menu_items.some((item) =>
          item.course_name.toLowerCase().includes(searchLower)
        )
      );
    }

    // Apply course search filter
    if (advancedFilter.courseSearch.trim()) {
      const courseSearchLower = advancedFilter.courseSearch.toLowerCase();
      menus = menus.filter((menu) =>
        menu.daily_menu_items.some((item) =>
          item.course_name.toLowerCase().includes(courseSearchLower)
        )
      );
    }

    // Apply pattern filter
    if (advancedFilter.pattern !== "all") {
      menus = menus.filter((menu) => menu.repeat_pattern === advancedFilter.pattern);
    }

    // Apply status filter
    if (advancedFilter.status !== "all") {
      const isActive = advancedFilter.status === "active";
      menus = menus.filter((menu) => menu.active === isActive);
    }

    // Apply date range filter
    if (advancedFilter.dateRange?.from && advancedFilter.dateRange?.to) {
      const from = advancedFilter.dateRange.from;
      const to = advancedFilter.dateRange.to;
      menus = menus.filter((menu) => {
        const menuDate = new Date(menu.date);
        return menuDate >= from && menuDate <= to;
      });
    }

    return menus.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [dailyMenus, advancedFilter]);

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
              <p className="text-sm text-gray-500 mt-1">
                SELECT DATES TO VIEW OR SCHEDULE MENUS
              </p>
            </div>

            {/* Quick Actions Bar */}
            <QuickActions
              onSelectDateRange={(range) =>
                setNewMenu({ ...newMenu, dateRange: range })
              }
              onCreateMenu={() => {
                resetNewMenu();
                setIsDialogOpen(true);
              }}
            />

            {/* Calendar Component with Visual Feedback */}
            <CalendarComponent
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
                day_selected:
                  "bg-black text-white hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white",
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
                DayContent: ({ date }: { date: Date }) => {
                  const menu = getMenuForDate(date);
                  const isHovered = hoveredDate && isSameDay(hoveredDate, date);

                  return (
                    <div className="relative w-full h-full">
                      {/* Date number and indicators */}
                      <div
                        className={cn(
                          "w-full h-full flex items-center justify-center",
                          menu && "font-medium"
                        )}
                      >
                        {date.getDate()}

                        {/* Menu indicators */}
                        {menu && (
                          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                            {menu.daily_menu_items.map((_, i) => (
                              <div
                                key={i}
                                className={cn(
                                  "w-1 h-1 rounded-full",
                                  menu.repeat_pattern === "none" && "bg-black",
                                  menu.repeat_pattern === "weekly" &&
                                    "bg-[#2563eb]",
                                  menu.repeat_pattern === "monthly" &&
                                    "bg-[#7c3aed]"
                                )}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Enhanced hover popup */}
                      {isHovered && menu && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <span />
                          </PopoverTrigger>
                          <PopoverContent className="w-80 p-0" align="center">
                            <div className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">
                                  {format(date, "PPP", { locale: es })}
                                </span>
                                <Badge
                                  variant={menu.active ? "default" : "secondary"}
                                >
                                  {menu.active ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                              <div className="space-y-2">
                                {menu.daily_menu_items.map((item) => (
                                  <div key={item.id} className="text-sm">
                                    <span className="font-medium capitalize">
                                      {item.course_type}:
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

            {/* Legend */}
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
              <p className={subheadingClasses}>
                View and manage your daily menus
              </p>
            </div>

            {/* Advanced Filters */}
            <AdvancedFilters
              filters={advancedFilter}
              onFilterChange={setAdvancedFilter}
            />

            {/* Loading State */}
            {isLoading ? (
              <div className="flex h-[200px] items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
              </div>
            ) : filteredMenus.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No menus found.{" "}
                  {advancedFilter.search ||
                  advancedFilter.pattern !== "all" ||
                  advancedFilter.status !== "all" ||
                  advancedFilter.courseSearch
                    ? "Try adjusting your filters."
                    : "Create one to get started."}
                </p>
              </div>
            ) : (
              <MenuListSection
                filteredMenus={filteredMenus}
                toggleMenuStatus={toggleMenuStatus}
                handleEditMenu={handleEditMenu}
                handleDuplicateMenu={handleDuplicateMenu}
              />
            )}
          </div>
        </div>

        {/* Create/Edit Menu Dialog */}
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            if (!open) resetNewMenu();
            setIsDialogOpen(open);
          }}
        >
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>
                {editingMenu ? "Edit Menu" : "Schedule Menu"}
              </DialogTitle>
              <DialogDescription>
                {editingMenu
                  ? "Modify the menu details"
                  : "Create a new menu by selecting dates and entering courses"}
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateMenu();
              }}
              className="grid gap-6 py-4"
            >
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
                  onValueChange={(
                    value: "none" | "weekly" | "monthly"
                  ) =>
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
