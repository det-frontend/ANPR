"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export const SimpleDatePickerTest = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      <h2 className="text-white mb-4 text-xl">Simple Popover Test</h2>

      <div className="space-y-4">
        <div>
          <p className="text-white mb-2">
            Current state: {isOpen ? "OPEN" : "CLOSED"}
          </p>
          <Button
            onClick={() => {
              console.log("Button clicked, current state:", isOpen);
              setIsOpen(!isOpen);
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Toggle Popover (Manual)
          </Button>
        </div>

        <div>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              >
                Click to Open Popover
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 p-4 bg-gray-800 border-gray-600 z-50"
              align="start"
              side="bottom"
              sideOffset={4}
            >
              <div className="text-white">
                <h3 className="font-bold mb-2">Popover Content</h3>
                <p>This popover should be visible!</p>
                <p className="text-sm text-gray-300 mt-2">
                  If you can see this, the popover is working correctly.
                </p>
                <Button
                  onClick={() => setIsOpen(false)}
                  className="mt-3 bg-red-600 hover:bg-red-700"
                >
                  Close Popover
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};
