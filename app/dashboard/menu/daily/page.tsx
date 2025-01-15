"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  addDays,
  addWeeks,
  addMonths,
  format,
  isSameDay
} from "date-fns";
import { es } from "date-fns/locale";
import { DateRange } from "react-day-picker"; // For the date-range wizard

// Replace these imports with your actual UI components:
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// If you have a custom Calendar or you use react-day-picker directly:
import { Calendar } from "@/components/ui/calendar";

// --------------------------------------------------------------------
// 1) Minimal 'Database' type (Replace with your real schema).
// --------------------------------------------------------------------
interface Database {
  public: {
    Tables: {
      daily_menus: {
        Row: {
          id: string;
          date: string;
          repeat_pattern: "none" | "weekly" | "monthly";
          active: boolean;
          scheduled_for: string;
          created_at: string;
        };
      };
      daily_menu_items: {
        Row: {
          id: string;
          course_name: string;
          course_type: "first" | "second";
          display_order: number;
          daily_menu_id: string;
        };
      };
    };
  };
}

// --------------------------------------------------------------------
// 2) Local Types
// --------------------------------------------------------------------
interface DailyMenuItem {
  id: string;
  course_name: string;
  course_type: "first" | "second";
  display_order: number;
  daily_menu_id: string;
}

interface DailyMenu {
  id: string;
  date: string;
  repeat_pattern: "none" | "weekly" | "monthly";
  active: boolean;
  scheduled_for: string;
  created_at: string;
  daily_menu_items?: DailyMenuItem[];
}

interface NewMenu {
  dateRange: DateRange;
  repeat_pattern: "none" | "weekly" | "monthly";
  active: boolean;
  firstCourse: string;
  secondCourse: string;
  previewDates?: string[];
}

// Steps for our wizard
interface WizardStep {
  key: "date" | "pattern" | "courses" | "preview";
  title: string;
  description: string;
}

const WIZARD_STEPS: WizardStep[] = [
  { key: "date", title: "Select Dates", description: "Choose the date range for your menus." },
  { key: "pattern", title: "Set Repeat Pattern", description: "One-time, weekly, or monthly?" },
  { key: "courses", title: "Courses", description: "Enter the first and second course." },
  { key: "preview", title: "Preview & Confirm", description: "Review before creating menus." }
];

const PATTERN_DESCRIPTIONS = {
  none: "Creates a menu only on the selected date(s)",
  weekly: "Automatically creates menus every week from start to end date",
  monthly: "Automatically creates menus on the same date each month"
};

// --------------------------------------------------------------------
// 3) Utility Functions
// --------------------------------------------------------------------
function generatePreviewDates(
  startDate: Date,
  endDate: Date | null,
  pattern: "none" | "weekly" | "monthly"
): Date[] {
  const dates: Date[] = [];
  let current = startDate;
  const finalDate = endDate || startDate;

  while (current <= finalDate) {
    dates.push(current);
    if (pattern === "weekly") current = addWeeks(current, 1);
    else if (pattern === "monthly") current = addMonths(current, 1);
    else current = addDays(current, 1);
  }
  return dates;
}

function checkDateConflicts(dates: Date[], existingMenus: DailyMenu[]): string[] {
  const conflicts = dates.filter((date) =>
    existingMenus.some((m) => isSameDay(new Date(m.date), date))
  );
  return conflicts.map((date) => format(date, "PPP", { locale: es }));
}


// --------------------------------------------------------------------
// 4) Data Fetcher
// --------------------------------------------------------------------
async function fetchDailyMenus(
  supabase: ReturnType<typeof createClientComponentClient<Database>>
): Promise<DailyMenu[]> {
  const { data, error } = await supabase
    .from("daily_menus")
    .select(
      `id, date, repeat_pattern, active, scheduled_for, created_at,
       daily_menu_items (id, course_name, course_type, display_order, daily_menu_id)`
    );
  if (error) throw error;
  return (data ?? []) as DailyMenu[];
}

// --------------------------------------------------------------------
// 5) Main Component
// --------------------------------------------------------------------
export default function DailyMenuPage() {
  const supabase = createClientComponentClient<Database>();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Wizard state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [previewDates, setPreviewDates] = useState<string[]>([]);
  const [conflicts, setConflicts] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data for new menu creation
  const [newMenu, setNewMenu] = useState<NewMenu>({
    dateRange: { from: new Date(), to: new Date() },
    repeat_pattern: "none",
    active: true,
    firstCourse: "",
    secondCourse: "",
    previewDates: [],
  });

  // For the calendar
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Query daily menus
  const {
    data: dailyMenus = [],
    isLoading,
    error,
  } = useQuery<DailyMenu[], Error>({
    queryKey: ["dailyMenus"],
    queryFn: () => fetchDailyMenus(supabase),
  });

  // ----------------------------------------------------------------
  // Mutations
  // ----------------------------------------------------------------
  // (1) Create menus wizard
  const createMenuMutation = useMutation({
    mutationFn: async () => {
      setIsSubmitting(true);
      const { from, to } = newMenu.dateRange;
      if (!from) throw new Error("Please select a start date first!");

      const finalEnd = to || from;
      let dateList = generatePreviewDates(from, finalEnd, newMenu.repeat_pattern);

      // check conflicts
      const conflictFound = checkDateConflicts(dateList, dailyMenus);
      if (conflictFound.length > 0) {
        const confirmSkip = window.confirm(
          `These dates already have menus: ${conflictFound.join(", ")}.\nSkip them and continue?`
        );
        if (!confirmSkip) {
          throw new Error("Operation cancelled due to conflicts.");
        }
        dateList = dateList.filter(
          (d) => !conflictFound.includes(format(d, "PPP", { locale: es }))
        );
      }
      if (!dateList.length) throw new Error("No valid dates remain to schedule!");

      // Insert daily_menus
      const rows = dateList.map((d) => ({
        date: format(d, "yyyy-MM-dd"),
        repeat_pattern: newMenu.repeat_pattern,
        active: newMenu.active,
        scheduled_for: format(d, "yyyy-MM-dd'T'11:00:00.000'Z'"),
      }));
      const { data: inserted, error: insertErr } = await supabase
        .from("daily_menus")
        .insert(rows)
        .select();
      if (insertErr) throw insertErr;

      // Insert daily_menu_items
      const allInserts = (inserted || []).flatMap((row) => [
        {
          daily_menu_id: row.id,
          course_name: newMenu.firstCourse,
          course_type: "first" as const,
          display_order: 1,
        },
        {
          daily_menu_id: row.id,
          course_name: newMenu.secondCourse,
          course_type: "second" as const,
          display_order: 2,
        },
      ]);
      if (allInserts.length) {
        const { error: itemsErr } = await supabase
          .from("daily_menu_items")
          .insert(allInserts);
        if (itemsErr) throw itemsErr;
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dailyMenus"] });
      toast({ title: "Success", description: "Daily menus created." });
    },
    onError: (err) => {
      if (err instanceof Error) {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  // (2) Toggle menu status
  const toggleMenuStatusMutation = useMutation<
    void, // return type
    Error, // error type
    { id: string; newStatus: boolean } // variables
  >({
    mutationFn: async ({ id, newStatus }) => {
      const { error } = await supabase
        .from("daily_menus")
        .update({ active: newStatus })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dailyMenus"] });
      toast({ title: "Success", description: "Menu status updated successfully" });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update status",
        variant: "destructive",
      });
    },
  });

  // Step-based wizard side effect
  useEffect(() => {
    if (currentStep === 3) {
      const { from, to } = newMenu.dateRange;
      if (!from) return;
      const final = to || from;
      const dateList = generatePreviewDates(from, final, newMenu.repeat_pattern);
      const conflictDates = checkDateConflicts(dateList, dailyMenus);
      setPreviewDates(dateList.map((d) => format(d, "PPP", { locale: es })));
      setConflicts(conflictDates);
    }
  }, [currentStep, newMenu, dailyMenus]);

  // Step nav
  const handleNext = () => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep((p) => p + 1);
    } else {
      createMenuMutation.mutate();
      resetWizard();
    }
  };
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((p) => p - 1);
    } else {
      resetWizard();
    }
  };

  function resetWizard() {
    setIsDialogOpen(false);
    setCurrentStep(0);
    setConflicts([]);
    setPreviewDates([]);
    setNewMenu({
      dateRange: { from: new Date(), to: new Date() },
      repeat_pattern: "none",
      active: true,
      firstCourse: "",
      secondCourse: "",
      previewDates: [],
    });
  }

  function updateMenu(vals: Partial<NewMenu>) {
    setNewMenu((cur) => ({ ...cur, ...vals }));
  }

  // Edit existing menu via wizard
  function handleEditMenu(menu: DailyMenu) {
    // Example approach: fill wizard with existing data
    setNewMenu({
      dateRange: {
        from: new Date(menu.date),
        to: new Date(menu.date),
      },
      repeat_pattern: menu.repeat_pattern,
      active: menu.active,
      firstCourse:
        menu.daily_menu_items?.find((i) => i.course_type === "first")?.course_name || "",
      secondCourse:
        menu.daily_menu_items?.find((i) => i.course_type === "second")?.course_name || "",
      previewDates: [],
    });
    setIsDialogOpen(true);
  }

  // Toggling status from the UI
  function handleToggleMenuStatus(id: string, newStatus: boolean) {
    toggleMenuStatusMutation.mutate({ id, newStatus });
  }

  // Wizard steps UI
  function renderStepsIndicator() {
    return (
      <div className="flex justify-between mb-4">
        {WIZARD_STEPS.map((step, idx) => {
          const isActive = currentStep >= idx;
          return (
            <div
              key={step.key}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center border border-muted-foreground text-sm font-semibold",
                isActive ? "bg-primary text-white border-primary" : "text-muted-foreground"
              )}
            >
              {idx + 1}
            </div>
          );
        })}
      </div>
    );
  }

  function renderDateStep() {
    const { from, to } = newMenu.dateRange;
    return (
      <div className="space-y-4">
        <Label>Start Date</Label>
        <Input
          type="date"
          value={from ? format(from, "yyyy-MM-dd") : ""}
          onChange={(e) => {
            const dt = e.target.value ? new Date(e.target.value) : new Date();
            updateMenu({ dateRange: { from: dt, to } });
          }}
        />

        <Label>End Date</Label>
        <Input
          type="date"
          value={to ? format(to, "yyyy-MM-dd") : ""}
          onChange={(e) => {
            const dt = e.target.value ? new Date(e.target.value) : null;
            updateMenu({ dateRange: { from, to: dt || from } });
          }}
        />
      </div>
    );
  }

  function renderPatternStep() {
    const { repeat_pattern } = newMenu;
    return (
      <div className="space-y-4">
        {(["none", "weekly", "monthly"] as const).map((val) => (
          <div
            key={val}
            onClick={() => updateMenu({ repeat_pattern: val })}
            className={cn(
              "border p-3 rounded cursor-pointer hover:border-primary transition-colors",
              repeat_pattern === val && "border-primary bg-primary/5"
            )}
          >
            <p className="font-medium capitalize mb-1">{val}</p>
            <p className="text-sm text-muted-foreground">
              {PATTERN_DESCRIPTIONS[val]}
            </p>
          </div>
        ))}
      </div>
    );
  }

  function renderCoursesStep() {
    return (
      <div className="space-y-4">
        <div>
          <Label>First Course</Label>
          <Input
            value={newMenu.firstCourse}
            onChange={(e) => updateMenu({ firstCourse: e.target.value })}
          />
        </div>
        <div>
          <Label>Second Course</Label>
          <Input
            value={newMenu.secondCourse}
            onChange={(e) => updateMenu({ secondCourse: e.target.value })}
          />
        </div>
      </div>
    );
  }

  function renderPreviewStep() {
    return (
      <div className="space-y-4 text-sm">
        <div>
          <strong>Will create menus on:</strong>
          {previewDates.length ? (
            <ul className="list-disc list-inside mt-1">
              {previewDates.map((pd) => (
                <li key={pd}>{pd}</li>
              ))}
            </ul>
          ) : (
            <p className="text-red-500">No valid dates selected.</p>
          )}
        </div>
        <div>
          <strong>Conflicts found:</strong>{" "}
          {conflicts.length ? (
            <ul className="list-disc list-inside text-red-600 mt-1">
              {conflicts.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          ) : (
            <span className="text-muted-foreground">None</span>
          )}
        </div>
        <div>
          <strong>Courses:</strong>
          <p className="ml-4">
            <em>First:</em>{" "}
            {newMenu.firstCourse || <span className="text-muted-foreground">N/A</span>}
            <br />
            <em>Second:</em>{" "}
            {newMenu.secondCourse || <span className="text-muted-foreground">N/A</span>}
          </p>
        </div>
      </div>
    );
  }

  function renderStepContent() {
    const stepKey = WIZARD_STEPS[currentStep]?.key;
    if (stepKey === "date") return renderDateStep();
    if (stepKey === "pattern") return renderPatternStep();
    if (stepKey === "courses") return renderCoursesStep();
    if (stepKey === "preview") return renderPreviewStep();
    return null;
  }

  // ----------------------------------------------------------------
  // Calendar Modifiers
  // Color code each type
  // ----------------------------------------------------------------
  const modifiers = {
    hasActiveOneTime: dailyMenus
      .filter((m) => m.active && m.repeat_pattern === "none")
      .map((m) => new Date(m.date)),
    hasActiveWeekly: dailyMenus
      .filter((m) => m.active && m.repeat_pattern === "weekly")
      .map((m) => new Date(m.date)),
    hasActiveMonthly: dailyMenus
      .filter((m) => m.active && m.repeat_pattern === "monthly")
      .map((m) => new Date(m.date)),
    hasInactiveMenu: dailyMenus
      .filter((m) => !m.active)
      .map((m) => new Date(m.date)),
  };
  const modifiersStyles = {
    hasActiveOneTime: { backgroundColor: "var(--primary)", opacity: 0.4 },
    hasActiveWeekly: { backgroundColor: "#3B82F6", opacity: 0.4 },   // blue
    hasActiveMonthly: { backgroundColor: "#8B5CF6", opacity: 0.4 }, // purple
    hasInactiveMenu: { backgroundColor: "var(--muted)", opacity: 0.4 },
  };

  // ----------------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------------
  return (
    <main className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Daily Menus</h1>
        <Button
          onClick={() => {
            resetWizard();
            setIsDialogOpen(true);
          }}
        >
          Create
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-20">
          <div className="animate-spin h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: Calendar */}
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <h2 className="text-xl font-semibold">Calendar View</h2>
            <Calendar
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              mode="single"
              selected={selectedDate || undefined}
              onSelect={(date) => date && setSelectedDate(date)}
              month={selectedMonth}
              onMonthChange={setSelectedMonth}
              showOutsideDays
              className="w-full"
            />
            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary opacity-40" />
                <span>One-time Menu</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500 opacity-40" />
                <span>Weekly Menu</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500 opacity-40" />
                <span>Monthly Menu</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-muted opacity-40" />
                <span>Inactive Menu</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Active Menus */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Active Menus</h2>
            <div className="space-y-4">
              {dailyMenus
                .filter((menu) => menu.active)
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((menu) => (
                  <div
                    key={menu.id}
                    className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium">
                        {format(new Date(menu.date), "PPP", { locale: es })}
                      </div>
                      <span
                        className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          menu.repeat_pattern === "weekly"
                            ? "bg-blue-100 text-blue-700"
                            : menu.repeat_pattern === "monthly"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-700"
                        )}
                      >
                        {menu.repeat_pattern === "none"
                          ? "One-time"
                          : menu.repeat_pattern === "weekly"
                          ? "Weekly"
                          : "Monthly"}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm">
                      {(menu.daily_menu_items || [])
                        .sort((a, b) => a.display_order - b.display_order)
                        .map((item) => (
                          <div key={item.id}>
                            <span className="font-medium capitalize">
                              {item.course_type}:
                            </span>{" "}
                            {item.course_name}
                          </div>
                        ))}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditMenu(menu)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleMenuStatus(menu.id, false)}
                      >
                        Deactivate
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Wizard for Creating/Editing */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{WIZARD_STEPS[currentStep]?.title}</DialogTitle>
            <DialogDescription>
              {WIZARD_STEPS[currentStep]?.description}
            </DialogDescription>
          </DialogHeader>

          {renderStepsIndicator()}
          <div className="py-4">{renderStepContent()}</div>

          <DialogFooter>
            {currentStep > 0 && (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
            <Button onClick={handleNext} disabled={isSubmitting}>
              {isSubmitting
                ? "Submitting..."
                : currentStep === WIZARD_STEPS.length - 1
                ? "Create"
                : "Next"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
