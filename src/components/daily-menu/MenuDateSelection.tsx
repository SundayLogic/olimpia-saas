// components/daily-menu/DateSelection.tsx
'use client';

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
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
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Calendar Styles
const calendarStyles = {
  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
  month: "space-y-4",
  caption: "flex justify-center pt-1 relative items-center gap-2",
  caption_label: "text-sm font-medium",
  nav: "flex items-center gap-1",
  nav_button: cn(
    "inline-flex items-center justify-center rounded-md text-sm font-medium shadow-sm transition-colors",
    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-muted",
    "disabled:pointer-events-none disabled:opacity-30"
  ),
  nav_button_previous: "absolute left-1",
  nav_button_next: "absolute right-1",
  table: "w-full border-collapse space-y-1",
  head_row: "flex",
  head_cell: cn(
    "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] capitalize"
  ),
  row: "flex w-full mt-2",
  cell: cn(
    "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
    "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
    "[&:has([aria-selected].day-outside)]:bg-accent/50",
    "[&:has([aria-selected].day-range-end)]:rounded-r-md"
  ),
  day: cn(
    "inline-flex items-center justify-center rounded-md text-sm transition-colors",
    "h-9 w-9 p-0 font-normal hover:bg-accent hover:text-accent-foreground",
    "aria-selected:opacity-100 hover:bg-primary/10",
    "disabled:pointer-events-none disabled:opacity-30",
    "focus:bg-primary focus:text-primary-foreground focus:outline-none"
  ),
  day_range_start: "day-range-start",
  day_range_end: "day-range-end",
  day_selected: cn(
    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
    "focus:bg-primary focus:text-primary-foreground"
  ),
  day_today: "bg-accent/50 text-accent-foreground",
  day_outside: cn(
    "day-outside text-muted-foreground opacity-50",
    "aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30"
  ),
  day_disabled: "text-muted-foreground opacity-30",
  day_range_middle: cn(
    "aria-selected:bg-accent aria-selected:text-accent-foreground",
    "hover:bg-accent/50 hover:text-accent-foreground"
  ),
  day_hidden: "invisible",
};

interface DateSelectionProps {
  onDateSelect: (dates: { from: Date; to: Date } | null) => void;
  onNext: () => void;
  existingMenus?: { date: string; active: boolean }[];
  isLoading?: boolean;
}

type SelectionMode = 'single' | 'range';

type CalendarComponentProps = {
  mode: "single" | "range";
};
export function DateSelection({ 
  onDateSelect, 
  onNext, 
  existingMenus = [],
  isLoading = false 
}: DateSelectionProps) {
  const [mode, setMode] = useState<SelectionMode>('single');
  const [selected, setSelected] = useState<DateRange | undefined>();
  const [error, setError] = useState<string | null>(null);

  const existingMenuDates = existingMenus.map(menu => ({
    date: new Date(menu.date),
    active: menu.active
  }));

  const handleSelect = (range: DateRange | undefined) => {
    setSelected(range);
    setError(null);

    if (!range?.from) {
      onDateSelect(null);
      return;
    }

    const effectiveRange = {
      from: range.from,
      to: mode === 'single' ? range.from : range.to || range.from
    };
    
    const conflictingDates = existingMenuDates.filter(menuDate => 
      menuDate.date.toDateString() === effectiveRange.from.toDateString() ||
      (effectiveRange.to && 
       menuDate.date.toDateString() === effectiveRange.to.toDateString())
    );

    if (conflictingDates.length > 0) {
      setError('Selected dates already have menus scheduled');
      return;
    }

    onDateSelect(effectiveRange);
  };

  const handleQuickSelect = (date: Date, days: number = 0) => {
    const from = date;
    const to = days > 0 ? addDays(date, days) : date;

    const conflictingDates = existingMenuDates.filter(menuDate => 
      isAfter(menuDate.date, from) && isBefore(menuDate.date, to)
    );

    if (conflictingDates.length > 0) {
      setError('Some selected dates already have menus scheduled');
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
      setError('Please select a date');
      return;
    }
    onNext();
  };

  const CalendarComponent = ({ mode }: CalendarComponentProps) => {
    if (mode === "single") {
      return (
        <Calendar
          mode="single"
          selected={selected?.from}
          onSelect={(date: Date | undefined) => 
            handleSelect(date ? { from: date } : undefined)
          }
          numberOfMonths={2}
          disabled={{ before: new Date() }}
          modifiers={{
            booked: existingMenuDates.map(m => m.date),
            active: existingMenuDates.filter(m => m.active).map(m => m.date),
            today: new Date(),
          }}
          modifiersStyles={{
            booked: { 
              backgroundColor: '#cbd5e1',
              color: '#1e293b',
              transform: 'scale(0.95)',
              transition: 'all 0.2s ease'
            },
            active: { 
              backgroundColor: '#86efac',
              color: '#065f46',
              transform: 'scale(0.95)',
              transition: 'all 0.2s ease'
            },
            today: {
              fontWeight: 'bold',
              border: '2px solid currentColor'
            }
          }}
          locale={es}
          showOutsideDays={false}
          className="rounded-md border-none"
          classNames={{
            ...calendarStyles,
            day_today: cn(
              calendarStyles.day_today,
              "font-semibold border-2 border-primary"
            ),
            day_selected: cn(
              calendarStyles.day_selected,
              "hover:bg-primary/90 transition-all duration-200"
            )
          }}
          components={{
            IconLeft: ({ ...props }) => (
              <ChevronLeft className="h-4 w-4 stroke-2" {...props} />
            ),
            IconRight: ({ ...props }) => (
              <ChevronRight className="h-4 w-4 stroke-2" {...props} />
            ),
            DayContent: ({ date }: { date: Date }) => (
              <div
                className={cn(
                  "relative h-9 w-9 flex items-center justify-center",
                  "hover:bg-accent/20 rounded-md transition-colors",
                  existingMenuDates.some(m => 
                    m.date.toDateString() === date.toDateString()
                  ) && "cursor-not-allowed"
                )}
              >
                {date.getDate()}
                {existingMenuDates.some(m => 
                  m.date.toDateString() === date.toDateString() && m.active
                ) && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-500" />
                )}
              </div>
            ),
          }}
        />
      );
    }

    return (
      <Calendar
        mode="range"
        selected={selected}
        onSelect={handleSelect}
        numberOfMonths={2}
        disabled={{ before: new Date() }}
        modifiers={{
          booked: existingMenuDates.map(m => m.date),
          active: existingMenuDates.filter(m => m.active).map(m => m.date),
          today: new Date(),
        }}
        modifiersStyles={{
          booked: { 
            backgroundColor: '#cbd5e1',
            color: '#1e293b',
            transform: 'scale(0.95)',
            transition: 'all 0.2s ease'
          },
          active: { 
            backgroundColor: '#86efac',
            color: '#065f46',
            transform: 'scale(0.95)',
            transition: 'all 0.2s ease'
          },
          today: {
            fontWeight: 'bold',
            border: '2px solid currentColor'
          }
        }}
        locale={es}
        showOutsideDays={false}
        className="rounded-md border-none"
        classNames={{
          ...calendarStyles,
          day_today: cn(
            calendarStyles.day_today,
            "font-semibold border-2 border-primary"
          ),
          day_selected: cn(
            calendarStyles.day_selected,
            "hover:bg-primary/90 transition-all duration-200"
          )
        }}
        components={{
          IconLeft: ({ ...props }) => (
            <ChevronLeft className="h-4 w-4 stroke-2" {...props} />
          ),
          IconRight: ({ ...props }) => (
            <ChevronRight className="h-4 w-4 stroke-2" {...props} />
          ),
          DayContent: ({ date }: { date: Date }) => (
            <div
              className={cn(
                "relative h-9 w-9 flex items-center justify-center",
                "hover:bg-accent/20 rounded-md transition-colors",
                existingMenuDates.some(m => 
                  m.date.toDateString() === date.toDateString()
                ) && "cursor-not-allowed"
              )}
            >
              {date.getDate()}
              {existingMenuDates.some(m => 
                m.date.toDateString() === date.toDateString() && m.active
              ) && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-500" />
              )}
            </div>
          ),
        }}
      />
    );
  };

  return (
    <div className="space-y-6">
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Select Date(s)</CardTitle>
              <CardDescription>
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

          <div className="flex flex-wrap gap-2 mt-4">
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

                <CalendarComponent mode={mode} />

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