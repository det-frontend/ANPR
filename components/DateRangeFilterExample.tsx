"use client";

import React, { useState, useCallback } from "react";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "./DateRangePicker";
import { DateRangePickerTest } from "./DateRangePickerTest";
import { SimpleDatePickerTest } from "./SimpleDatePickerTest";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useDateRangeFilter } from "../hooks/useDateRangeFilter";

interface EventItem {
  id: number;
  title: string;
  timestamp: Date;
  description: string;
}

export const DateRangeFilterExample = () => {
  const [includeTime, setIncludeTime] = useState(false);

  // Mock data for demonstration
  const mockData: EventItem[] = [
    {
      id: 1,
      title: "Event 1",
      timestamp: new Date("2024-01-15T10:30:00"),
      description: "First event",
    },
    {
      id: 2,
      title: "Event 2",
      timestamp: new Date("2024-01-20T14:15:00"),
      description: "Second event",
    },
    {
      id: 3,
      title: "Event 3",
      timestamp: new Date("2024-01-25T09:45:00"),
      description: "Third event",
    },
    {
      id: 4,
      title: "Event 4",
      timestamp: new Date("2024-02-01T16:20:00"),
      description: "Fourth event",
    },
  ];

  const {
    dateRange,
    setDateRange,
    filteredData,
    handleDateChange,
    clearFilter,
    isFilterActive,
  } = useDateRangeFilter<EventItem>({
    data: mockData,
    dateField: "timestamp",
    onFilterChange: (filtered) => {
      console.log("Filtered data:", filtered);
    },
  });

  const handleApplyFilter = useCallback(() => {
    handleDateChange(dateRange);
  }, [dateRange, handleDateChange]);

  return (
    <div className="space-y-6 p-6">
      {/* Simple Test Component */}
      <SimpleDatePickerTest />

      {/* Test Component */}
      <DateRangePickerTest />

      <Card className="bg-gray-800 border-gray-600">
        <CardHeader>
          <CardTitle className="text-white">
            Date Range Filter with Time
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 text-white">
              <input
                type="checkbox"
                checked={includeTime}
                onChange={(e) => setIncludeTime(e.target.checked)}
                className="rounded border-gray-600 bg-gray-700"
              />
              <span>Include Time Selection</span>
            </label>
          </div>

          <div className="grid gap-4">
            <DatePickerWithRange
              date={dateRange}
              setDate={setDateRange}
              includeTime={includeTime}
              onDateChange={handleDateChange}
              className="w-full"
            />

            <div className="flex gap-2">
              <Button
                onClick={handleApplyFilter}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!dateRange.from}
              >
                Apply Filter
              </Button>
              <Button
                onClick={clearFilter}
                variant="outline"
                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              >
                Clear Filter
              </Button>
            </div>

            {isFilterActive && (
              <div className="p-3 bg-blue-900/20 border border-blue-600 rounded-lg">
                <p className="text-blue-300 text-sm">
                  Filter is active: {filteredData.length} of {mockData.length}{" "}
                  items shown
                </p>
              </div>
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Filtered Results ({filteredData.length} items)
            </h3>
            <div className="space-y-2">
              {filteredData.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-gray-700 rounded-lg border border-gray-600"
                >
                  <div className="text-white font-medium">{item.title}</div>
                  <div className="text-gray-300 text-sm">
                    {item.timestamp.toLocaleString()}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {item.description}
                  </div>
                </div>
              ))}
              {filteredData.length === 0 && (
                <div className="text-gray-400 text-center py-4">
                  No items match the selected date range
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <h4 className="text-white font-medium mb-2">Current Date Range:</h4>
            <pre className="text-gray-300 text-sm overflow-auto">
              {JSON.stringify(
                {
                  from: dateRange.from?.toISOString(),
                  to: dateRange.to?.toISOString(),
                  isFilterActive,
                  totalItems: mockData.length,
                  filteredItems: filteredData.length,
                },
                null,
                2
              )}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
