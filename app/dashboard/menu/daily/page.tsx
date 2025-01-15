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
import { DateRange } from "react-day-picker";

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
import { Calendar } from "@/components/ui/calendar";

/* ------------------------------------------------------------------------
   1) Database / local interfaces 
------------------------------------------------------------------------ */
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

interface DailyMenuItem {
  id?: string;
  course_name: string;
  course_type: "first" | "second";
  display_order: number;
  daily_menu_id?: string;
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

// The new wizard structure to support multiple items per course.
interface NewMenu {
  dateRange: DateRange;
  repeat_pattern: "none" | "weekly" | "monthly";
  active: boolean;
  firstCourses: string[];   // multiple "first" items
  secondCourses: string[];  // multiple "second" items
  previewDates?: string[];
}

// For wizard steps
interface WizardStep {
  key: "date" | "pattern" | "courses" | "preview";
  title: string;
  description: string;
}

const WIZARD_STEPS: WizardStep[] = [
  {
    key: "date",
    title: "Select Dates",
    description: "Choose the date range for your menus."
  },
  {
    key: "pattern",
    title: "Set Repeat Pattern",
    description: "One-time, weekly, or monthly?"
  },
  {
    key: "courses",
    title: "Add Courses",
    description: "Enter multiple first and second courses."
  },
  {
    key: "preview",
    title: "Preview & Confirm",
    description: "Review before creating menus."
  }
];

/* ------------------------------------------------------------------------
   2) Utility functions: scheduling, date conflicts
------------------------------------------------------------------------ */
function generatePreviewDates(
  startDate: Date,
  endDate: Date | null,
  pattern: "none" | "weekly" | "monthly"
): Date[] {
  const dates: Date[] = [];
  let current = startDate;
  const final = endDate || startDate;
  while (current <= final) {
    dates.push(current);
    if (pattern === "weekly") {
      current = addWeeks(current, 1);
    } else if (pattern === "monthly") {
      current = addMonths(current, 1);
    } else {
      current = addDays(current, 1);
    }
  }
  return dates;
}

function checkDateConflicts(dates: Date[], existingMenus: DailyMenu[]): string[] {
  const conflicts = dates.filter((date) =>
    existingMenus.some((m) => isSameDay(new Date(m.date), date))
  );
  return conflicts.map((date) => format(date, "PPP", { locale: es }));
}

/* ------------------------------------------------------------------------
   3) Data fetch
------------------------------------------------------------------------ */
async function fetchDailyMenus(
  supabase: ReturnType<typeof createClientComponentClient<Database>>
): Promise<DailyMenu[]> {
  const { data, error } = await supabase
    .from("daily_menus")
    .select(
      `id, date, repeat_pattern, active, scheduled_for, created_at,
       daily_menu_items(
         id, course_name, course_type, display_order, daily_menu_id
       )`
    );

  if (error) throw error;
  return (data ?? []) as DailyMenu[];
}

/* ------------------------------------------------------------------------
   Main component
------------------------------------------------------------------------ */
export default function DailyMenuPage() {
  const supabase = createClientComponentClient<Database>();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  /* -----------------
     Wizard & state 
  ----------------- */
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [previewDates, setPreviewDates] = useState<string[]>([]);
  const [conflicts, setConflicts] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newMenu, setNewMenu] = useState<NewMenu>({
    dateRange: { from: new Date(), to: new Date() },
    repeat_pattern: "none",
    active: true,
    firstCourses: [""],
    secondCourses: [""],
    previewDates: []
  });

  /* -----------------
     Load daily menus
  ----------------- */
  const {
    data: dailyMenus = [],
    isLoading,
    error
  } = useQuery<DailyMenu[], Error>({
    queryKey: ["dailyMenus"],
    queryFn: () => fetchDailyMenus(supabase)
  });

  /* -----------------
     Toggle Status 
  ----------------- */
  const toggleMenuStatus = useMutation({
    // toggles an existing daily_menus row's active field
    mutationFn: async (vars: { id: string; newStatus: boolean }) => {
      const { error: toggleErr } = await supabase
        .from("daily_menus")
        .update({ active: vars.newStatus })
        .eq("id", vars.id);
      if (toggleErr) throw toggleErr;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dailyMenus"] });
      toast({ title: "Success", description: "Menu status updated." });
    },
    onError: (err) => {
      if (err instanceof Error) {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    }
  });

  /* -----------------
     Create new menus 
  ----------------- */
  const createMenuMutation = useMutation({
    mutationFn: async () => {
      setIsSubmitting(true);
      const { from, to } = newMenu.dateRange;
      if (!from) throw new Error("Please select a start date first!");

      const finalEnd = to || from;
      let dateList = generatePreviewDates(from, finalEnd, newMenu.repeat_pattern);

      // Check conflicts
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

      // Insert daily_menus rows
      const rows = dateList.map((d) => ({
        date: format(d, "yyyy-MM-dd"),
        repeat_pattern: newMenu.repeat_pattern,
        active: newMenu.active,
        scheduled_for: format(d, "yyyy-MM-dd'T'11:00:00.000'Z'")
      }));
      const { data: inserted, error: insertErr } = await supabase
        .from("daily_menus")
        .insert(rows)
        .select();
      if (insertErr) throw insertErr;

      // Insert daily_menu_items for each new menu
      const allInserts = (inserted || []).flatMap((menu) => [
        // each first course
        ...newMenu.firstCourses.map((course, index) => ({
          daily_menu_id: menu.id,
          course_name: course,
          course_type: "first" as const,
          display_order: index + 1
        })),
        // each second course
        ...newMenu.secondCourses.map((course, index) => ({
          daily_menu_id: menu.id,
          course_name: course,
          course_type: "second" as const,
          display_order: index + 1
        }))
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
      toast({
        title: "Success",
        description: "Daily menus created with multiple items per course."
      });
    },
    onError: (err) => {
      if (err instanceof Error) {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  /* -----------------
     Wizard logic 
  ----------------- */
  useEffect(() => {
    // If step = preview, build previewDates & conflicts
    if (currentStep === 3) {
      const { from, to } = newMenu.dateRange;
      if (!from) return;
      const finalEnd = to || from;
      const dateList = generatePreviewDates(from, finalEnd, newMenu.repeat_pattern);
      const conflictDates = checkDateConflicts(dateList, dailyMenus);

      setPreviewDates(dateList.map((d) => format(d, "PPP", { locale: es })));
      setConflicts(conflictDates);
    }
  }, [currentStep, newMenu, dailyMenus]);

  function handleNext() {
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep((p) => p + 1);
    } else {
      createMenuMutation.mutate();
      resetWizard();
    }
  }
  function handleBack() {
    if (currentStep > 0) {
      setCurrentStep((p) => p - 1);
    } else {
      resetWizard();
    }
  }
  function resetWizard() {
    setIsDialogOpen(false);
    setCurrentStep(0);
    setPreviewDates([]);
    setConflicts([]);
    setNewMenu({
      dateRange: { from: new Date(), to: new Date() },
      repeat_pattern: "none",
      active: true,
      firstCourses: [""],
      secondCourses: [""],
      previewDates: []
    });
  }

  function updateMenu(vals: Partial<NewMenu>) {
    setNewMenu((prev) => ({ ...prev, ...vals }));
  }

  /* ------------------------------------------------------------------------
     4.1) Step content 
  ------------------------------------------------------------------------*/
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

        {/* Optional: a DayPicker calendar to select a range */}
        <div className="mt-4">
          <Calendar
            mode="range"
            selected={newMenu.dateRange}
            onSelect={(range) => {
              if (range?.from) {
                updateMenu({
                  dateRange: { from: range.from, to: range.to || range.from }
                });
              }
            }}
            locale={es}
          />
        </div>
      </div>
    );
  }

  function renderPatternStep() {
    return (
      <div className="space-y-4">
        {(["none", "weekly", "monthly"] as const).map((val) => (
          <div
            key={val}
            onClick={() => updateMenu({ repeat_pattern: val })}
            className={cn(
              "border p-3 rounded cursor-pointer hover:border-primary transition-colors",
              newMenu.repeat_pattern === val && "border-primary bg-primary/5"
            )}
          >
            <p className="font-medium capitalize mb-1">{val}</p>
            <p className="text-sm text-muted-foreground">
              {val === "none"
                ? "One-time: Creates a menu only for the selected date(s)."
                : val === "weekly"
                ? "Weekly: Automatically create menus every week."
                : "Monthly: Automatically create menus on the same date each month."}
            </p>
          </div>
        ))}
      </div>
    );
  }

  // For multi-items in "firstCourses" and "secondCourses"
  function renderCoursesStep() {
    return (
      <div className="space-y-6">
        {/* First Courses */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-lg font-semibold">First Courses</Label>
            <Button variant="outline" size="sm" onClick={() => {
              updateMenu({ firstCourses: [...newMenu.firstCourses, ""] });
            }}>
              + Add Another First
            </Button>
          </div>
          {newMenu.firstCourses.map((course, index) => (
            <div key={`first-${index}`} className="flex gap-2">
              <Input
                value={course}
                onChange={(e) => {
                  const updated = [...newMenu.firstCourses];
                  updated[index] = e.target.value;
                  updateMenu({ firstCourses: updated });
                }}
                placeholder={`First Course ${index + 1}`}
              />
              {newMenu.firstCourses.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const updated = newMenu.firstCourses.filter((_, i) => i !== index);
                    updateMenu({ firstCourses: updated.length ? updated : [""] });
                  }}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Second Courses */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-lg font-semibold">Second Courses</Label>
            <Button variant="outline" size="sm" onClick={() => {
              updateMenu({ secondCourses: [...newMenu.secondCourses, ""] });
            }}>
              + Add Another Second
            </Button>
          </div>
          {newMenu.secondCourses.map((course, index) => (
            <div key={`second-${index}`} className="flex gap-2">
              <Input
                value={course}
                onChange={(e) => {
                  const updated = [...newMenu.secondCourses];
                  updated[index] = e.target.value;
                  updateMenu({ secondCourses: updated });
                }}
                placeholder={`Second Course ${index + 1}`}
              />
              {newMenu.secondCourses.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const updated = newMenu.secondCourses.filter((_, i) => i !== index);
                    updateMenu({ secondCourses: updated.length ? updated : [""] });
                  }}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
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
          <strong>First Courses:</strong>
          <ul className="list-disc list-inside ml-4 mt-1">
            {newMenu.firstCourses.map((course, index) => (
              <li key={`preview-first-${index}`}>
                {course || <span className="text-muted-foreground">Empty</span>}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <strong>Second Courses:</strong>
          <ul className="list-disc list-inside ml-4 mt-1">
            {newMenu.secondCourses.map((course, index) => (
              <li key={`preview-second-${index}`}>
                {course || <span className="text-muted-foreground">Empty</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  function renderStepContent() {
    switch (WIZARD_STEPS[currentStep]?.key) {
      case "date":
        return renderDateStep();
      case "pattern":
        return renderPatternStep();
      case "courses":
        return renderCoursesStep();
      case "preview":
        return renderPreviewStep();
      default:
        return null;
    }
  }

  /* ------------------------------------------------------------------------
     5) Calendar color-coding
  ------------------------------------------------------------------------*/
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
      .map((m) => new Date(m.date))
  };
  const modifiersStyles = {
    hasActiveOneTime: { backgroundColor: "var(--primary)", opacity: 0.3 },
    hasActiveWeekly: { backgroundColor: "#3B82F6", opacity: 0.3 },  // Blue
    hasActiveMonthly: { backgroundColor: "#8B5CF6", opacity: 0.3 }, // Purple
    hasInactiveMenu: { backgroundColor: "var(--muted)", opacity: 0.3 }
  };

  /* -----------------------------
     Editing Menu states & handlers
  ------------------------------*/
  const [editingMenu, setEditingMenu] = useState<DailyMenu | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditMenu = (menu: DailyMenu) => {
    setEditingMenu(menu);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditingMenu(null);
    setIsEditDialogOpen(false);
  };

  /* ------------------------------------------------------------------------
     6) Render
  ------------------------------------------------------------------------*/
  return (
    <main className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Daily Menus (Multi-item) with Calendar</h1>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      {/* Grid layout: left side calendar, right side Active Menus list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Calendar */}
        <div className="bg-white rounded-lg border p-6 space-y-4">
          <h2 className="text-xl font-semibold">Calendar View</h2>
          <Calendar
            mode="single"
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            locale={es}
            showOutsideDays
            className="w-full"
          />
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-sm mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary opacity-30" />
              <span>One-time</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 opacity-30" />
              <span>Weekly</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500 opacity-30" />
              <span>Monthly</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted opacity-30" />
              <span>Inactive</span>
            </div>
          </div>

          {/* Button to open wizard to create a new menu */}
          <div className="mt-6">
            <Button onClick={() => {
              resetWizard();
              setIsDialogOpen(true);
            }}>
              Create New Menu
            </Button>
          </div>
        </div>

        {/* Right: Active Menus */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Active Menus</h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-10">
              <div className="animate-spin h-6 w-6 border-b-2 border-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              {dailyMenus
                .filter((m) => m.active)
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

                    {/* Show items grouped by type */}
                    <div className="space-y-1 text-sm">
                      <strong>First:</strong>
                      <ul className="list-disc ml-4">
                        {menu.daily_menu_items
                          ?.filter((it) => it.course_type === "first")
                          .sort((a, b) => a.display_order - b.display_order)
                          .map((item) => (
                            <li key={item.id}>{item.course_name}</li>
                          ))}
                      </ul>
                      <strong>Second:</strong>
                      <ul className="list-disc ml-4">
                        {menu.daily_menu_items
                          ?.filter((it) => it.course_type === "second")
                          .sort((a, b) => a.display_order - b.display_order)
                          .map((item) => (
                            <li key={item.id}>{item.course_name}</li>
                          ))}
                      </ul>
                    </div>

                    {/* Action buttons */}
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
                        onClick={() =>
                          toggleMenuStatus.mutate({
                            id: menu.id,
                            newStatus: false
                          })
                        }
                      >
                        Deactivate
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Wizard Dialog */}
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

      {/* Edit Menu Dialog - inline subcomponent */}
      {editingMenu && (
        <EditMenuDialog
          menu={editingMenu}
          isOpen={isEditDialogOpen}
          onClose={handleCloseEditDialog}
        />
      )}
    </main>
  );
}

/* ------------------------------------------------------------------------
   Inline EditMenuDialog Subcomponent
------------------------------------------------------------------------ */
function EditMenuDialog({
  isOpen,
  menu,
  onClose
}: {
  isOpen: boolean;
  menu: DailyMenu;
  onClose: () => void;
}) {
  const supabase = createClientComponentClient<Database>();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Separate the existing items into firstCourses and secondCourses
  const [firstCourses, setFirstCourses] = useState<string[]>(
    menu.daily_menu_items
      ? menu.daily_menu_items
          .filter((i) => i.course_type === "first")
          .sort((a, b) => a.display_order - b.display_order)
          .map((i) => i.course_name)
      : []
  );
  const [secondCourses, setSecondCourses] = useState<string[]>(
    menu.daily_menu_items
      ? menu.daily_menu_items
          .filter((i) => i.course_type === "second")
          .sort((a, b) => a.display_order - b.display_order)
          .map((i) => i.course_name)
      : []
  );

  // A simple approach: remove all items for this menu & re-insert them
  const updateMenuMutation = useMutation({
    mutationFn: async () => {
      // 1) Delete old items
      const { error: delErr } = await supabase
        .from("daily_menu_items")
        .delete()
        .eq("daily_menu_id", menu.id);
      if (delErr) throw delErr;

      // 2) Insert new items
      const allInserts: Omit<DailyMenuItem, "id">[] = [
        // first courses
        ...firstCourses.map((course, idx) => ({
          daily_menu_id: menu.id,
          course_name: course,
          course_type: "first",
          display_order: idx + 1
        })),
        // second courses
        ...secondCourses.map((course, idx) => ({
          daily_menu_id: menu.id,
          course_name: course,
          course_type: "second",
          display_order: idx + 1
        }))
      ];

      if (allInserts.length) {
        const { error: insertErr } = await supabase
          .from("daily_menu_items")
          .insert(allInserts);
        if (insertErr) throw insertErr;
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dailyMenus"] });
      toast({ title: "Success", description: "Menu updated successfully" });
      onClose();
    },
    onError: (err) => {
      if (err instanceof Error) {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    }
  });

  function handleSave() {
    updateMenuMutation.mutate();
  }

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Menu Items</DialogTitle>
          <DialogDescription>Edit the first/second courses for {menu.date}.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* First Courses */}
          <div>
            <Label className="text-lg font-semibold mb-2">First Courses</Label>
            {firstCourses.map((fc, idx) => (
              <div key={`fc-${idx}`} className="mt-2 flex gap-2">
                <Input
                  value={fc}
                  onChange={(e) => {
                    const updated = [...firstCourses];
                    updated[idx] = e.target.value;
                    setFirstCourses(updated);
                  }}
                />
                {firstCourses.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const updated = firstCourses.filter((_, i) => i !== idx);
                      setFirstCourses(updated);
                    }}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setFirstCourses((prev) => [...prev, ""])}
            >
              + Add Another First
            </Button>
          </div>

          {/* Second Courses */}
          <div>
            <Label className="text-lg font-semibold mb-2">Second Courses</Label>
            {secondCourses.map((sc, idx) => (
              <div key={`sc-${idx}`} className="mt-2 flex gap-2">
                <Input
                  value={sc}
                  onChange={(e) => {
                    const updated = [...secondCourses];
                    updated[idx] = e.target.value;
                    setSecondCourses(updated);
                  }}
                />
                {secondCourses.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const updated = secondCourses.filter((_, i) => i !== idx);
                      setSecondCourses(updated);
                    }}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setSecondCourses((prev) => [...prev, ""])}
            >
              + Add Another Second
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={updateMenuMutation.isLoading}>
            {updateMenuMutation.isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
