"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";

export const DateRangePickerTest = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-4">
      <h2 className="text-white mb-4">DateRangePicker Test</h2>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            onClick={() => {
              console.log("Test button clicked, current isOpen:", isOpen);
              setIsOpen(!isOpen);
            }}
          >
            Test Popover
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-4 bg-gray-800 border-gray-600 z-50"
          align="start"
          side="bottom"
          sideOffset={4}
        >
          <div className="text-white">
            <p>Popover is working!</p>
            <p>Current state: {isOpen ? "Open" : "Closed"}</p>
            <Calendar mode="single" className="bg-gray-800 text-white" />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
