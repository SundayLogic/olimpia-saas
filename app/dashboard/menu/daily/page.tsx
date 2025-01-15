"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { addDays, addWeeks, addMonths, format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { DateRange } from "react-day-picker";

import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar"; // Ensure correct import path
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------------
   1) Database & Local Types
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
  id: string;
  daily_menu_id: string;
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
  daily_menu_items?: DailyMenuItem[];
}

/** For editing (existing items have id, new items have no id) */
interface EditableCourseItem {
  id?: string;
  name: string;
}

/* For the "create new menu" wizard. */
interface NewMenu {
  dateRange: DateRange;
  repeat_pattern: "none" | "weekly" | "monthly";
  active: boolean;
  firstCourses: string[];
  secondCourses: string[];
  previewDates?: string[];
}

const WIZARD_STEPS = [
  {
    key: "date",
    title: "Select Dates",
    description: "Choose the date range for your menus.",
  },
  {
    key: "pattern",
    title: "Set Repeat Pattern",
    description: "One-time, weekly, or monthly?",
  },
  {
    key: "courses",
    title: "Add Courses",
    description: "Enter multiple first and second courses.",
  },
  {
    key: "preview",
    title: "Preview & Confirm",
    description: "Review before creating menus.",
  },
] as const;

/* ------------------------------------------------------------------------
   2) Utility Functions
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
   3) The EditMenuDialog for editing existing menus
------------------------------------------------------------------------ */
function EditMenuDialog({
  isOpen,
  menu,
  onClose,
}: {
  isOpen: boolean;
  menu: DailyMenu;
  onClose: () => void;
}) {
  const supabase = createClientComponentClient<Database>();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Build local lists for first/second courses
  const [firstCourses, setFirstCourses] = useState<EditableCourseItem[]>(
    (menu.daily_menu_items ?? [])
      .filter((i) => i.course_type === "first")
      .sort((a, b) => a.display_order - b.display_order)
      .map((i) => ({ id: i.id, name: i.course_name }))
  );
  const [secondCourses, setSecondCourses] = useState<EditableCourseItem[]>(
    (menu.daily_menu_items ?? [])
      .filter((i) => i.course_type === "second")
      .sort((a, b) => a.display_order - b.display_order)
      .map((i) => ({ id: i.id, name: i.course_name }))
  );

  const updateMenuMutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      // Original item IDs
      const original = menu.daily_menu_items ?? [];
      const existingIds = original.map((it) => it.id); // all strings

      // Current IDs
      const firstIds = firstCourses
        .filter((c): c is EditableCourseItem & { id: string } => c.id !== undefined)
        .map((c) => c.id);
      const secondIds = secondCourses
        .filter((c): c is EditableCourseItem & { id: string } => c.id !== undefined)
        .map((c) => c.id);
      const currentIds = [...firstIds, ...secondIds];

      // toDelete
      const toDelete = existingIds.filter((id) => !currentIds.includes(id));

      // Items to update
      const toUpdateFirst = firstCourses
        .filter((c): c is EditableCourseItem & { id: string } => c.id !== undefined)
        .map((course, idx) => ({
          id: course.id,
          course_name: course.name,
          course_type: "first" as const,
          display_order: idx + 1,
          daily_menu_id: menu.id,
        }));
      const toUpdateSecond = secondCourses
        .filter((c): c is EditableCourseItem & { id: string } => c.id !== undefined)
        .map((course, idx) => ({
          id: course.id,
          course_name: course.name,
          course_type: "second" as const,
          display_order: idx + 1,
          daily_menu_id: menu.id,
        }));

      // Items to insert (no id => new)
      const toInsertFirst = firstCourses
        .filter((c) => !c.id)
        .map((course, idx) => ({
          course_name: course.name,
          course_type: "first" as const,
          display_order: firstCourses.filter((x) => x.id).length + idx + 1,
          daily_menu_id: menu.id,
        }));
      const toInsertSecond = secondCourses
        .filter((c) => !c.id)
        .map((course, idx) => ({
          course_name: course.name,
          course_type: "second" as const,
          display_order: secondCourses.filter((x) => x.id).length + idx + 1,
          daily_menu_id: menu.id,
        }));

      // 1) Delete
      if (toDelete.length > 0) {
        const delRes = await supabase
          .from("daily_menu_items")
          .delete()
          .in("id", toDelete);
        if (delRes.error) throw new Error(delRes.error.message);
      }

      // 2) Update
      for (const item of [...toUpdateFirst, ...toUpdateSecond]) {
        const upRes = await supabase
          .from("daily_menu_items")
          .update({
            course_name: item.course_name,
            display_order: item.display_order,
          })
          .eq("id", item.id);
        if (upRes.error) throw new Error(upRes.error.message);
      }

      // 3) Insert
      const toInsert = [...toInsertFirst, ...toInsertSecond];
      if (toInsert.length > 0) {
        const insRes = await supabase.from("daily_menu_items").insert(toInsert);
        if (insRes.error) throw new Error(insRes.error.message);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dailyMenus"] });
      toast({ title: "Success", description: "Menu updated successfully" });
      onClose();
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update menu",
        variant: "destructive",
      });
    },
  });

  function handleSave() {
    updateMenuMutation.mutate();
  }

  // Add new items
  const addFirstCourse = () => setFirstCourses((prev) => [...prev, { name: "" }]);
  const addSecondCourse = () => setSecondCourses((prev) => [...prev, { name: "" }]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Menu Items</DialogTitle>
          <DialogDescription>
            Edit or add new items for {menu.date}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* First */}
          <div>
            <Label className="text-lg font-semibold mb-2">First Courses</Label>
            {firstCourses.map((fc, idx) => (
              <div key={fc.id ?? `fc-${idx}`} className="mt-2 flex gap-2">
                <Input
                  value={fc.name}
                  onChange={(e) => {
                    const updated = [...firstCourses];
                    updated[idx] = { ...updated[idx], name: e.target.value };
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
            <Button variant="outline" size="sm" className="mt-2" onClick={addFirstCourse}>
              + Add Another First
            </Button>
          </div>

          {/* Second */}
          <div>
            <Label className="text-lg font-semibold mb-2">Second Courses</Label>
            {secondCourses.map((sc, idx) => (
              <div key={sc.id ?? `sc-${idx}`} className="mt-2 flex gap-2">
                <Input
                  value={sc.name}
                  onChange={(e) => {
                    const updated = [...secondCourses];
                    updated[idx] = { ...updated[idx], name: e.target.value };
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
            <Button variant="outline" size="sm" className="mt-2" onClick={addSecondCourse}>
              + Add Another Second
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {updateMenuMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------------
   4) Main daily menu wizard logic for creating new menus
------------------------------------------------------------------------ */

async function fetchDailyMenus(
  supabase: ReturnType<typeof createClientComponentClient<Database>>
): Promise<DailyMenu[]> {
  const { data, error } = await supabase
    .from("daily_menus")
    .select(`
      id,
      date,
      repeat_pattern,
      active,
      scheduled_for,
      created_at,
      daily_menu_items(
        id,
        daily_menu_id,
        course_name,
        course_type,
        display_order
      )
    `);

  if (error) throw error;
  return (data ?? []) as DailyMenu[];
}

export default function DailyMenuPage() {
  const supabase = createClientComponentClient<Database>();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // For creating new menus
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
    previewDates: [],
  });

  // For the edit dialog
  const [editingMenu, setEditingMenu] = useState<DailyMenu | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // -------------- Queries --------------
  const {
    data: dailyMenus = [],
    isLoading,
    error,
  } = useQuery<DailyMenu[], Error>({
    queryKey: ["dailyMenus"],
    queryFn: () => fetchDailyMenus(supabase),
  });

  // -------------- Mutations --------------
  const toggleMenuStatus = useMutation<void, Error, { id: string; newStatus: boolean }>({
    mutationFn: async ({ id, newStatus }) => {
      const { error: toggleErr } = await supabase
        .from("daily_menus")
        .update({ active: newStatus })
        .eq("id", id);
      if (toggleErr) throw new Error(toggleErr.message);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dailyMenus"] });
      toast({ title: "Success", description: "Menu status updated." });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update status",
        variant: "destructive",
      });
    },
  });

  // The mutation for creating brand-new daily menus
  const createMenuMutation = useMutation<void, Error, void>({
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
        // Filter out conflicting
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
      if (insertErr) throw new Error(insertErr.message);

      // Insert items for each new daily menu
      if (inserted && inserted.length > 0) {
        const allInserts = inserted.flatMap((menu) => [
          // first
          ...newMenu.firstCourses.map((course, idx) => ({
            daily_menu_id: menu.id,
            course_name: course,
            course_type: "first" as const,
            display_order: idx + 1,
          })),
          // second
          ...newMenu.secondCourses.map((course, idx) => ({
            daily_menu_id: menu.id,
            course_name: course,
            course_type: "second" as const,
            display_order: idx + 1,
          })),
        ]);

        const { error: itemsErr } = await supabase
          .from("daily_menu_items")
          .insert(allInserts);
        if (itemsErr) throw new Error(itemsErr.message);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dailyMenus"] });
      toast({ title: "Success", description: "Daily menus created." });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to create new menus",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  // -------------- Wizard logic --------------
  useEffect(() => {
    // If step=preview, build the preview array
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
      // Final step => create
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
      previewDates: [],
    });
  }
  function updateMenu(vals: Partial<NewMenu>) {
    setNewMenu((prev) => ({ ...prev, ...vals }));
  }

  // -------------- Step content for wizard --------------
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
                isActive
                  ? "bg-primary text-white border-primary"
                  : "text-muted-foreground"
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

        <div className="mt-4">
          <Calendar
            mode="range"
            selected={newMenu.dateRange}
            onSelect={(range) => {
              if (range?.from) {
                updateMenu({ dateRange: { from: range.from, to: range.to || range.from } });
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
                ? "Weekly: Creates menus every week automatically."
                : "Monthly: Creates menus on that day each month."}
            </p>
          </div>
        ))}
      </div>
    );
  }

  function renderCoursesStep() {
    return (
      <div className="space-y-6">
        {/* First */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-lg font-semibold">First Courses</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                updateMenu({ firstCourses: [...newMenu.firstCourses, ""] });
              }}
            >
              + Add Another First
            </Button>
          </div>
          {newMenu.firstCourses.map((course, idx) => (
            <div key={`fc-${idx}`} className="flex gap-2">
              <Input
                value={course}
                onChange={(e) => {
                  const updated = [...newMenu.firstCourses];
                  updated[idx] = e.target.value;
                  updateMenu({ firstCourses: updated });
                }}
                placeholder={`First Course #${idx + 1}`}
              />
              {newMenu.firstCourses.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const updated = newMenu.firstCourses.filter((_, i) => i !== idx);
                    updateMenu({ firstCourses: updated });
                  }}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Second */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-lg font-semibold">Second Courses</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                updateMenu({ secondCourses: [...newMenu.secondCourses, ""] });
              }}
            >
              + Add Another Second
            </Button>
          </div>
          {newMenu.secondCourses.map((course, idx) => (
            <div key={`sc-${idx}`} className="flex gap-2">
              <Input
                value={course}
                onChange={(e) => {
                  const updated = [...newMenu.secondCourses];
                  updated[idx] = e.target.value;
                  updateMenu({ secondCourses: updated });
                }}
                placeholder={`Second Course #${idx + 1}`}
              />
              {newMenu.secondCourses.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const updated = newMenu.secondCourses.filter((_, i) => i !== idx);
                    updateMenu({ secondCourses: updated });
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
            {newMenu.firstCourses.map((course, i) => (
              <li key={`fc-prev-${i}`}>{course || "Empty"}</li>
            ))}
          </ul>
        </div>
        <div>
          <strong>Second Courses:</strong>
          <ul className="list-disc list-inside ml-4 mt-1">
            {newMenu.secondCourses.map((course, i) => (
              <li key={`sc-prev-${i}`}>{course || "Empty"}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  function renderStepContent() {
    const stepKey = WIZARD_STEPS[currentStep].key;
    switch (stepKey) {
      case "date":
        return renderDateStep();
      case "pattern":
        return renderPatternStep();
      case "courses":
        return renderCoursesStep();
      case "preview":
        return renderPreviewStep();
    }
  }

  // -------------- Editing an existing menu --------------
  function handleEditMenu(m: DailyMenu) {
    setEditingMenu(m);
    setIsEditDialogOpen(true);
  }
  function handleCloseEditDialog() {
    setEditingMenu(null);
    setIsEditDialogOpen(false);
  }

  // -------------- Return the final UI --------------
  // We show the calendar on the left, plus the wizard button, plus active menus on the right
  return (
    <main className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Daily Menus (Multi-item) with Calendar</h1>

      {error && <p className="text-red-500">Error: {error.message}</p>}
      {isLoading && <p>Loading menus ...</p>}

      {/* The layout: left => Calendar & "Create New Menu" button, right => Active Menus */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side: Calendar and wizard trigger */}
        <div className="bg-white rounded-lg border p-6 space-y-4">
          <h2 className="text-xl font-semibold">Calendar View</h2>

          {/* Color-coded calendar */}
          {/* Build day modifiers to highlight active / monthly / etc. */}
          {(() => {
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
              hasActiveOneTime: { backgroundColor: "var(--primary)", opacity: 0.3 },
              hasActiveWeekly: { backgroundColor: "#3B82F6", opacity: 0.3 },
              hasActiveMonthly: { backgroundColor: "#8B5CF6", opacity: 0.3 },
              hasInactiveMenu: { backgroundColor: "var(--muted)", opacity: 0.3 },
            };

            return (
              <Calendar
                mode="single"
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                locale={es}
                showOutsideDays
                className="w-full"
              />
            );
          })()}

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

          {/* Button to open the wizard to create a brand-new daily menu */}
          <div className="mt-6">
            <Button onClick={() => setIsDialogOpen(true)}>Create New Menu</Button>
          </div>
        </div>

        {/* Right side: Active Menus listing */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Active Menus</h2>
          {dailyMenus
            .filter((m) => m.active)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((menu) => (
              <div key={menu.id} className="border rounded-lg p-4 mb-4 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium">{menu.date}</div>
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
                  <Button size="sm" variant="outline" onClick={() => handleEditMenu(menu)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      toggleMenuStatus.mutate({
                        id: menu.id,
                        newStatus: false,
                      })
                    }
                  >
                    Deactivate
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Wizard Dialog for creating new daily menus */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{WIZARD_STEPS[currentStep].title}</DialogTitle>
            <DialogDescription>
              {WIZARD_STEPS[currentStep].description}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {renderStepsIndicator()}
            {renderStepContent()}
          </div>

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

      {/* Edit Dialog */}
      {editingMenu && (
        <EditMenuDialog
          isOpen={isEditDialogOpen}
          menu={editingMenu}
          onClose={handleCloseEditDialog}
        />
      )}
    </main>
  );
}
