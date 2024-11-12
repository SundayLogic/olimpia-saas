"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DateRange } from "react-day-picker";
import { format, isAfter, isBefore, addDays } from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  ArrowRight,
  X,
  AlertCircle,
  Info,
  Loader2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DateSelectionProps {
  onDateSelect: (dates: { from: Date; to: Date } | null) => void;
  onNext: () => void;
  existingMenus?: { date: string; active: boolean }[];
  isLoading?: boolean;
}

type SelectionMode = "single" | "range";

export function DateSelection({
  onDateSelect,
  onNext,
  existingMenus = [],
  isLoading = false,
}: DateSelectionProps) {
  const [mode, setMode] = useState<SelectionMode>("single");
  const [selected, setSelected] = useState<DateRange | undefined>();
  const [error, setError] = useState<string | null>(null);

  // Convert existingMenus dates to Date objects for calendar
  const existingMenuDates = existingMenus.map((menu) => ({
    date: new Date(menu.date),
    active: menu.active,
  }));

  const handleSelect = (range: DateRange | undefined) => {
    setSelected(range);
    setError(null);

    if (!range?.from) {
      onDateSelect(null);
      return;
    }

    // For single day selection, set the 'to' date same as 'from'
    const effectiveRange = {
      from: range.from,
      to: mode === "single" ? range.from : range.to || range.from,
    };

    // Validate if selected dates already have menus
    const conflictingDates = existingMenuDates.filter(
      (menuDate) =>
        menuDate.date.toDateString() === effectiveRange.from.toDateString() ||
        (effectiveRange.to &&
          menuDate.date.toDateString() === effectiveRange.to.toDateString())
    );

    if (conflictingDates.length > 0) {
      setError("Selected dates already have menus scheduled");
      return;
    }

    onDateSelect(effectiveRange);
  };

  const handleQuickSelect = (date: Date, days: number = 0) => {
    const from = date;
    const to = days > 0 ? addDays(date, days) : date;

    const conflictingDates = existingMenuDates.filter(
      (menuDate) => isAfter(menuDate.date, from) && isBefore(menuDate.date, to)
    );

    if (conflictingDates.length > 0) {
      setError("Some selected dates already have menus scheduled");
      return;
    }

    const newRange = { from, to };
    setSelected(newRange);
    onDateSelect(newRange);
  };

  const handleClearSelection = () => {
    setSelected(undefined);
    setError(null);
    onDateSelect(null);
  };

  const handleNext = () => {
    if (!selected?.from) {
      setError("Please select a date");
      return;
    }
    onNext();
  };
  return (
    <div className="space-y-6">
      <Card className="border-2">
        <CardHeader className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl">Select Date(s)</CardTitle>
              <CardDescription className="text-base">
                Choose when you want to schedule the menu
              </CardDescription>
            </div>
            <Badge
              variant={mode === "single" ? "default" : "secondary"}
              className="px-4 py-1 text-sm cursor-pointer hover:bg-primary/90"
              onClick={() => {
                setMode(mode === "single" ? "range" : "single");
                handleClearSelection();
              }}
            >
              {mode === "single" ? "Single Day" : "Date Range"}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickSelect(new Date())}
              disabled={isLoading}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickSelect(addDays(new Date(), 1))}
              disabled={isLoading}
            >
              Tomorrow
            </Button>
            {mode === "range" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickSelect(new Date(), 6)}
                disabled={isLoading}
              >
                Next 7 Days
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            {selected?.from && (
              <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {format(selected.from, "PPP", { locale: es })}
                    {selected.to && mode === "range" && (
                      <>
                        <ArrowRight className="inline mx-2 h-4 w-4" />
                        {format(selected.to, "PPP", { locale: es })}
                      </>
                    )}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSelection}
                  className="h-8 w-8 p-0"
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="border rounded-lg p-6 bg-card">
              <div className="flex items-start gap-4 mb-6">
                <Info className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Select {mode === "single" ? "a date" : "a date range"} to
                  schedule the menu. Green dates indicate active menus, and gray
                  dates indicate inactive menus.
                </p>
              </div>

              <div className="relative">
                {isLoading && (
                  <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-50 rounded-lg">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                )}

                {mode === "single" ? (
                  <Calendar
                    mode="single"
                    selected={selected?.from}
                    onSelect={(date) =>
                      handleSelect(date ? { from: date } : undefined)
                    }
                    numberOfMonths={2}
                    disabled={{ before: new Date() }}
                    modifiers={{
                      booked: existingMenuDates.map((m) => m.date),
                      active: existingMenuDates
                        .filter((m) => m.active)
                        .map((m) => m.date),
                    }}
                    modifiersStyles={{
                      booked: { backgroundColor: "#cbd5e1" },
                      active: { backgroundColor: "#86efac" },
                    }}
                    locale={es}
                    showOutsideDays={false}
                    className="rounded-md"
                  />
                ) : (
                  <Calendar
                    mode="range"
                    selected={selected}
                    onSelect={handleSelect}
                    numberOfMonths={2}
                    disabled={{ before: new Date() }}
                    modifiers={{
                      booked: existingMenuDates.map((m) => m.date),
                      active: existingMenuDates
                        .filter((m) => m.active)
                        .map((m) => m.date),
                    }}
                    modifiersStyles={{
                      booked: { backgroundColor: "#cbd5e1" },
                      active: { backgroundColor: "#86efac" },
                    }}
                    locale={es}
                    showOutsideDays={false}
                    className="rounded-md"
                  />
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm mt-6 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#86efac]" />
                    <span className="text-muted-foreground">Active Menu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#cbd5e1]" />
                    <span className="text-muted-foreground">Inactive Menu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary/20" />
                    <span className="text-muted-foreground">Selected</span>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="flex justify-end gap-4 pt-2">
              {selected?.from && (
                <Button
                  variant="outline"
                  onClick={handleClearSelection}
                  disabled={isLoading}
                >
                  Clear Selection
                </Button>
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        onClick={handleNext}
                        disabled={!selected?.from || isLoading}
                        className="min-w-[120px]"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : !selected?.from ? (
                          "Select Date"
                        ) : (
                          <>
                            Next Step
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {!selected?.from
                      ? "Please select a date first"
                      : "Proceed to menu selection"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
