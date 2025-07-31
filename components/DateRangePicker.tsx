"use client";

import * as React from "react";
import { CalendarIcon, Clock } from "lucide-react";
import { addDays, format, setHours, setMinutes, setSeconds } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DatePickerWithRangeProps {
  date: DateRange;
  setDate: React.Dispatch<React.SetStateAction<DateRange>>;
  className?: string;
  includeTime?: boolean;
  onDateChange?: (range: DateRange) => void;
}

// Memoized date display component
const DateDisplay = React.memo<{
  date: DateRange;
  includeTime?: boolean;
}>(({ date, includeTime = false }) => {
  if (!date?.from) {
    return <span>Pick a date range</span>;
  }

  const formatDate = (date: Date) => {
    if (includeTime) {
      return format(date, "LLL dd, y HH:mm");
    }
    return format(date, "LLL dd, y");
  };

  if (date.to) {
    return (
      <>
        {formatDate(date.from)} - {formatDate(date.to)}
      </>
    );
  }

  return <>{formatDate(date.from)}</>;
});

DateDisplay.displayName = "DateDisplay";

// Memoized trigger button component
const DatePickerTrigger = React.memo<{
  date: DateRange;
  className?: string;
  includeTime?: boolean;
}>(({ date, className, includeTime }) => (
  <Button
    id="date"
    variant={"outline"}
    type="button"
    className={cn(
      "w-full justify-start text-left font-normal bg-gray-700 border-gray-600 text-white hover:bg-gray-600 transition-colors",
      !date && "text-muted-foreground",
      className
    )}
  >
    <CalendarIcon className="mr-2 h-4 w-4" />
    <DateDisplay date={date} includeTime={includeTime} />
  </Button>
));

DatePickerTrigger.displayName = "DatePickerTrigger";

// Time picker component
const TimePicker = React.memo<{
  date: Date;
  onTimeChange: (date: Date) => void;
  label: string;
}>(({ date, onTimeChange, label }) => {
  const [hours, setHours] = React.useState(date.getHours());
  const [minutes, setMinutes] = React.useState(date.getMinutes());

  React.useEffect(() => {
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    onTimeChange(newDate);
  }, [hours, minutes, date, onTimeChange]);

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-300">{label}</Label>
      <div className="flex gap-2">
        <Select
          value={hours.toString()}
          onValueChange={(value) => setHours(parseInt(value))}
        >
          <SelectTrigger className="w-20 bg-gray-700 border-gray-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            {Array.from({ length: 24 }, (_, i) => (
              <SelectItem key={i} value={i.toString()}>
                {i.toString().padStart(2, "0")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-white">:</span>
        <Select
          value={minutes.toString()}
          onValueChange={(value) => setMinutes(parseInt(value))}
        >
          <SelectTrigger className="w-20 bg-gray-700 border-gray-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            {Array.from({ length: 60 }, (_, i) => (
              <SelectItem key={i} value={i.toString()}>
                {i.toString().padStart(2, "0")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
});

TimePicker.displayName = "TimePicker";

export const DatePickerWithRange = React.memo<DatePickerWithRangeProps>(
  ({ date, setDate, className, includeTime = false, onDateChange }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    // Debug logging
    React.useEffect(() => {
      console.log("DateRangePicker - isOpen changed:", isOpen);
    }, [isOpen]);

    // Simple date change handler
    const handleDateSelect = React.useCallback(
      (range: DateRange | undefined) => {
        console.log("Date selected:", range);
        if (range) {
          setDate(range);
          if (onDateChange) {
            onDateChange(range);
          }
        }
      },
      [setDate, onDateChange]
    );

    return (
      <div className={cn("grid gap-2", className)}>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              type="button"
              className={cn(
                "w-full justify-start text-left font-normal bg-gray-700 border-gray-600 text-white hover:bg-gray-600 transition-colors",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <DateDisplay date={date} includeTime={includeTime} />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-4 bg-gray-800 border-gray-600 z-[9999]"
            align="start"
            side="bottom"
            sideOffset={4}
            style={{ position: "relative", zIndex: 9999 }}
          >
            <div className="space-y-4">
              {/* <div className="text-white text-sm bg-red-900 p-2 rounded">
                <p>DEBUG: Popover is open: {isOpen ? "YES" : "NO"}</p>
                <p>DEBUG: Z-index should be 9999</p>
              </div> */}

              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={handleDateSelect}
                numberOfMonths={2}
                className="bg-gray-800 text-white"
              />

              {/* <div className="text-white text-sm">
                <p>
                  Selected:{" "}
                  {date?.from ? "From: " + date.from.toDateString() : "None"}
                </p>
                <p>To: {date?.to ? date.to.toDateString() : "None"}</p>
              </div> */}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

DatePickerWithRange.displayName = "DatePickerWithRange";
