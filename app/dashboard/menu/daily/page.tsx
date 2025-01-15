"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { addWeeks, addMonths, addDays, format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { DateRange } from "react-day-picker";

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
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// --------------------------------------------------------------------
// 1) Minimal 'Database' type to fix unknown fields
//    (Replace with your real schema definition.)
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
// 2) Local types for your code
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

// For wizard steps
interface WizardStep {
  key: "date" | "pattern" | "courses" | "preview";
  title: string;
  description: string;
}

// A bit more descriptive pattern help text:
const PATTERN_DESCRIPTIONS = {
  none: "Creates a menu only on the selected date(s)",
  weekly: "Automatically creates menus every week from start to end date",
  monthly: "Automatically creates menus on the same date each month",
};

const WIZARD_STEPS: WizardStep[] = [
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
    title: "Courses",
    description: "Enter the first and second course for the menu.",
  },
  {
    key: "preview",
    title: "Preview & Confirm",
    description: "Review final details before creating your menus.",
  },
];

// --------------------------------------------------------------------
// 3) Utility functions
// --------------------------------------------------------------------
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
// 4) Data fetcher
// --------------------------------------------------------------------
async function fetchDailyMenus(
  supabase: ReturnType<typeof createClientComponentClient<Database>>
): Promise<DailyMenu[]> {
  const { data, error } = await supabase
    .from("daily_menus")
    .select(
      `id, date, repeat_pattern, active, scheduled_for, created_at,
       daily_menu_items (
         id, course_name, course_type, display_order, daily_menu_id
       )`
    );
  if (error) throw error;
  return (data ?? []) as DailyMenu[];
}

// --------------------------------------------------------------------
// 5) Component
// --------------------------------------------------------------------
export default function DailyMenuPage() {
  const supabase = createClientComponentClient<Database>(); 
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Wizard states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [previewDates, setPreviewDates] = useState<string[]>([]);
  const [conflicts, setConflicts] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false); // For loading transitions

  // Data
  const [newMenu, setNewMenu] = useState<NewMenu>({
    dateRange: { from: new Date(), to: new Date() },
    repeat_pattern: "none",
    active: true,
    firstCourse: "",
    secondCourse: "",
    previewDates: [],
  });

  // Query
  const {
    data: dailyMenus = [],
    isLoading,
    error,
  } = useQuery<DailyMenu[], Error>({
    queryKey: ["dailyMenus"],
    queryFn: () => fetchDailyMenus(supabase),
  });

  // Mutations
  const createMenuMutation = useMutation({
    mutationFn: async () => {
      setIsSubmitting(true); // show loading
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

      // Insert into daily_menus
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
      setIsSubmitting(false); // hide loading
    },
  });

  // Step-based side effects (Preview)
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

  // Step navigation
  const handleNext = () => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep((p) => p + 1);
    } else {
      // finalize creation
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
  // Reset Wizard
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

  // Visual Steps indicator
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

  // Render step content
  function renderStepContent() {
    const stepKey = WIZARD_STEPS[currentStep]?.key;
    if (stepKey === "date") return renderDateStep();
    if (stepKey === "pattern") return renderPatternStep();
    if (stepKey === "courses") return renderCoursesStep();
    if (stepKey === "preview") return renderPreviewStep();
    return null;
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
            <em>First:</em> {newMenu.firstCourse || <span className="text-muted-foreground">N/A</span>}
            <br />
            <em>Second:</em> {newMenu.secondCourse || <span className="text-muted-foreground">N/A</span>}
          </p>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // 5-H) RENDER
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
      ) : dailyMenus.length === 0 ? (
        <p className="text-sm text-muted-foreground">No daily menus found.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dailyMenus.map((m) => (
            <li key={m.id} className="p-4 border rounded-md">
              <p className="text-sm text-muted-foreground mb-2">
                {format(new Date(m.date), "PPP", { locale: es })}
              </p>
              <p className="text-xs font-medium">
                Pattern: {m.repeat_pattern}, Active: {m.active ? "Yes" : "No"}
              </p>
              <div className="mt-2 space-y-1 text-sm">
                {(m.daily_menu_items || []).map((item) => (
                  <div key={item.id}>
                    <strong className="capitalize">{item.course_type}:</strong>{" "}
                    {item.course_name}
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{WIZARD_STEPS[currentStep]?.title}</DialogTitle>
            <DialogDescription>
              {WIZARD_STEPS[currentStep]?.description}
            </DialogDescription>
          </DialogHeader>

          {/* Steps Indicator */}
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
