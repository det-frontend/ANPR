"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerWithRangeProps {
  date: DateRange;
  setDate: React.Dispatch<React.SetStateAction<DateRange>>;
  className?: string;
}

// Memoized date display component
const DateDisplay = React.memo<{ date: DateRange }>(({ date }) => {
  if (!date?.from) {
    return <span>Pick a date range</span>;
  }

  if (date.to) {
    return (
      <>
        {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
      </>
    );
  }

  return <>{format(date.from, "LLL dd, y")}</>;
});

DateDisplay.displayName = "DateDisplay";

// Memoized trigger button component
const DatePickerTrigger = React.memo<{
  date: DateRange;
  className?: string;
}>(({ date, className }) => (
  <Button
    id="date"
    variant={"outline"}
    className={cn(
      "w-full justify-start text-left font-normal bg-gray-700 border-gray-600 text-white hover:bg-gray-600 transition-colors",
      !date && "text-muted-foreground",
      className
    )}
  >
    <CalendarIcon className="mr-2 h-4 w-4" />
    <DateDisplay date={date} />
  </Button>
));

DatePickerTrigger.displayName = "DatePickerTrigger";

export const DatePickerWithRange = React.memo<DatePickerWithRangeProps>(
  ({ date, setDate, className }) => {
    // Memoized date change handler
    const handleDateSelect = React.useCallback(
      (range: DateRange | undefined) => {
        setDate(range || { from: undefined, to: undefined });
      },
      [setDate]
    );

    return (
      <div className={cn("grid gap-2", className)}>
        <Popover>
          <PopoverTrigger asChild>
            <DatePickerTrigger date={date} />
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 bg-gray-800 border-gray-600"
            align="start"
          >
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDateSelect}
              numberOfMonths={2}
              className="bg-gray-800 text-white"
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

DatePickerWithRange.displayName = "DatePickerWithRange";
