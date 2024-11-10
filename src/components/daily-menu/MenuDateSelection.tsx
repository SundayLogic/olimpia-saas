'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { format, isAfter, isBefore } from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  ArrowRight,
  X,
  AlertCircle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateSelectionProps {
  onDateSelect: (dates: { from: Date; to: Date } | null) => void;
  onNext: () => void;
  existingMenus?: { date: string; active: boolean }[];
}

type SelectionMode = 'single' | 'range';

export function DateSelection({ onDateSelect, onNext, existingMenus = [] }: DateSelectionProps) {
  const [mode, setMode] = useState<SelectionMode>('single');
  const [selected, setSelected] = useState<DateRange | undefined>();
  const [error, setError] = useState<string | null>(null);

  // Convert existingMenus dates to Date objects for calendar
  const existingMenuDates = existingMenus.map(menu => ({
    date: new Date(menu.date),
    active: menu.active
  }));

  const handleSelect = (range: DateRange | undefined) => {
    setSelected(range);
    setError(null);

    if (range?.from) {
      // For single day selection, set the 'to' date same as 'from'
      const effectiveRange = {
        from: range.from,
        to: mode === 'single' ? range.from : range.to || range.from
      };
      
      // Validate if selected dates already have menus
      const conflictingDates = existingMenuDates.filter(menuDate => 
        isAfter(menuDate.date, effectiveRange.from) && 
        isBefore(menuDate.date, effectiveRange.to)
      );

      if (conflictingDates.length > 0) {
        setError('Some selected dates already have menus scheduled');
      }

      onDateSelect(effectiveRange);
    } else {
      onDateSelect(null);
    }
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

  const footer = (
    <div className="flex items-center gap-4 text-sm pt-4">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#86efac]" />
        <span>Active Menu</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#cbd5e1]" />
        <span>Inactive Menu</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-primary/20" />
        <span>Selected</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Select Date(s)</CardTitle>
              <CardDescription>
                Choose when you want to schedule the menu
              </CardDescription>
            </div>
            <Select
              value={mode}
              onValueChange={(value: SelectionMode) => {
                setMode(value);
                handleClearSelection();
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selection mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single Day</SelectItem>
                <SelectItem value="range">Date Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Selected dates display */}
            {selected?.from && (
              <div className="flex items-center gap-2 text-sm">
                <CalendarIcon className="h-4 w-4" />
                <span>
                  {format(selected.from, 'PPP', { locale: es })}
                  {selected.to && mode === 'range' && (
                    <>
                      <ArrowRight className="inline mx-2 h-4 w-4" />
                      {format(selected.to, 'PPP', { locale: es })}
                    </>
                  )}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSelection}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Calendar */}
            <div className="border rounded-lg p-4">
              {mode === 'single' ? (
                <Calendar
                  mode="single"
                  selected={selected?.from}
                  onSelect={date => handleSelect(date ? { from: date } : undefined)}
                  numberOfMonths={2}
                  disabled={{ before: new Date() }}
                  modifiers={{
                    booked: existingMenuDates.map(m => m.date),
                    active: existingMenuDates.filter(m => m.active).map(m => m.date),
                  }}
                  modifiersStyles={{
                    booked: { backgroundColor: '#cbd5e1' },
                    active: { backgroundColor: '#86efac' },
                  }}
                  locale={es}
                  showOutsideDays={false}
                  className="rounded-md border"
                  footer={footer}
                />
              ) : (
                <Calendar
                  mode="range"
                  selected={selected}
                  onSelect={handleSelect}
                  numberOfMonths={2}
                  disabled={{ before: new Date() }}
                  modifiers={{
                    booked: existingMenuDates.map(m => m.date),
                    active: existingMenuDates.filter(m => m.active).map(m => m.date),
                  }}
                  modifiersStyles={{
                    booked: { backgroundColor: '#cbd5e1' },
                    active: { backgroundColor: '#86efac' },
                  }}
                  locale={es}
                  showOutsideDays={false}
                  className="rounded-md border"
                  footer={footer}
                />
              )}
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={handleClearSelection}
                disabled={!selected?.from}
              >
                Clear
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        onClick={handleNext}
                        disabled={!selected?.from}
                      >
                        Next Step
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {!selected?.from ? 'Please select a date first' : 'Proceed to menu selection'}
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