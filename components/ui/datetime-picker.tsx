"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Pick date and time",
  disabled = false,
  className,
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<string>(
    value
      ? value.toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [selectedTime, setSelectedTime] = React.useState<string>(
    value
      ? `${String(value.getHours()).padStart(2, "0")}:${String(value.getMinutes()).padStart(2, "0")}`
      : `${String(new Date().getHours()).padStart(2, "0")}:${String(new Date().getMinutes()).padStart(2, "0")}`
  );

  // Update internal state when external value changes
  React.useEffect(() => {
    if (value) {
      setSelectedDate(value.toISOString().split("T")[0]);
      setSelectedTime(
        `${String(value.getHours()).padStart(2, "0")}:${String(value.getMinutes()).padStart(2, "0")}`
      );
    } else {
      // Set to current date and time if no value provided
      const now = new Date();
      setSelectedDate(now.toISOString().split("T")[0]);
      setSelectedTime(
        `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
      );
    }
  }, [value]);

  // Format display value
  const formatDisplayValue = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const handleDateChange = (dateStr: string) => {
    setSelectedDate(dateStr);
    if (dateStr && selectedTime && onChange) {
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const [year, month, day] = dateStr.split("-").map(Number);
      const newDate = new Date(year, month - 1, day, hours, minutes);
      onChange(newDate);
    }
  };

  const handleTimeChange = (timeStr: string) => {
    setSelectedTime(timeStr);
    if (selectedDate && timeStr && onChange) {
      const [hours, minutes] = timeStr.split(":").map(Number);
      const [year, month, day] = selectedDate.split("-").map(Number);
      const newDate = new Date(year, month - 1, day, hours, minutes);
      onChange(newDate);
    }
  };

  const handleSetNow = () => {
    const now = new Date();
    setSelectedDate(now.toISOString().split("T")[0]);
    setSelectedTime(
      `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
    );
    onChange?.(now);
  };

  // Get current display value
  const getDisplayValue = () => {
    if (value) {
      return formatDisplayValue(value);
    }
    if (selectedDate && selectedTime) {
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const [year, month, day] = selectedDate.split("-").map(Number);
      const displayDate = new Date(year, month - 1, day, hours, minutes);
      return formatDisplayValue(displayDate);
    }
    return placeholder;
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <Button
        variant="outline"
        className={cn(
          "w-full justify-start text-left font-normal bg-gray-700 border-gray-600 text-white hover:bg-gray-600 hover:border-gray-500 focus:border-blue-500 transition-colors",
          !value && "text-gray-400",
          className
        )}
        disabled={disabled}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        <span>{getDisplayValue()}</span>
      </Button>

      {/* Direct Calendar and Time Picker */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 p-4">
          <div className="flex gap-4">
            {/* Date Picker - Left */}
            <div className="flex-1">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500/20 h-10"
              />
            </div>

            {/* Time Picker - Right */}
            <div className="flex-1">
              <Input
                type="time"
                value={selectedTime}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500/20 h-10"
              />
            </div>
          </div>

          {/* Quick Action */}
          <div className="mt-3">
            <Button
              onClick={handleSetNow}
              variant="outline"
              size="sm"
              className="w-full bg-gray-600 hover:bg-gray-700 text-white border-gray-500"
            >
              Set to Current Time
            </Button>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
