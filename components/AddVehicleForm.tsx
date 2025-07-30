"use client";

import { useState, useEffect, useRef } from "react";
import { PlusCircle, Save, Truck, Printer, X, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { VehicleResponse } from "@/lib/types";
import { EventBus, EVENTS } from "@/lib/events";

interface AddVehicleFormProps {
  plateNumber: string;
  queueNumber: string;
  onVehicleAdded: (vehicle: VehicleResponse) => void;
  onCancel?: () => void;
}
export default function AddVehicleForm({
  plateNumber,
  queueNumber,
  onVehicleAdded,
  onCancel,
}: AddVehicleFormProps) {
  const [formData, setFormData] = useState({
    orderNumber: "",
    companyName: "",
    customerName: "",
    orderDate: new Date().toISOString().slice(0, 16),
    truckNumber: plateNumber,
    trailerNumber: "",
    driverName: "",
    driverPhoneNumber: "",
    numberOfDrums: "",
    amountInLiters: "",
    tankNumber: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Autocomplete state
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/add-vehicle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          queueNumber,
          numberOfDrums: Number(formData.numberOfDrums),
          amountInLiters: Number(formData.amountInLiters),
          tankNumber: Number(formData.tankNumber),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onVehicleAdded(data.vehicle);
        // Clear form after successful submission
        handleClearForm();
        // Publish event to notify other components
        EventBus.publish(EVENTS.VEHICLE_ADDED, data.vehicle);
      } else {
        setError(data.error || "Failed to add vehicle");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    // Print functionality - you can implement this based on your needs
    // window.print();
    console.log("print");
  };

  const handleSaveAndPrint = async () => {
    // First save the vehicle, then print
    await handleSubmit(new Event("submit") as any);
    // if (!error) {
    //   handlePrint();
    // }
  };

  const handleCopyQueueNumber = async () => {
    try {
      await navigator.clipboard.writeText(queueNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error("Failed to copy queue number:", error);
    }
  };

  const handleClearForm = () => {
    // Clear search timeout
    if ((window as any).searchTimeout) {
      clearTimeout((window as any).searchTimeout);
    }

    setFormData({
      orderNumber: "",
      companyName: "",
      customerName: "",
      orderDate: new Date().toISOString().slice(0, 16),
      truckNumber: plateNumber,
      trailerNumber: "",
      driverName: "",
      driverPhoneNumber: "",
      numberOfDrums: "",
      amountInLiters: "",
      tankNumber: "",
    });
    setError("");
    setCopied(false);
    setSuggestions([]);
    setShowSuggestions(false);
    setIsSearching(false);
  };

  // Search vehicles for autocomplete with debounce
  const searchVehicles = async (query: string) => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Clear previous timeout
    if ((window as any).searchTimeout) {
      clearTimeout((window as any).searchTimeout);
    }

    // Set loading state immediately
    setIsSearching(true);

    // Debounce the search
    (window as any).searchTimeout = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/search-vehicles?q=${encodeURIComponent(query)}`
        );
        const data = await response.json();

        if (response.ok && data.vehicles) {
          setSuggestions(data.vehicles);
          setShowSuggestions(data.vehicles.length > 0);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error("Error searching vehicles:", error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms delay
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (vehicle: any) => {
    setFormData({
      ...formData,
      truckNumber: vehicle.truckNumber,
      trailerNumber: vehicle.trailerNumber || "",
      driverName: vehicle.driverName,
      driverPhoneNumber: vehicle.driverPhoneNumber || "",
      companyName: vehicle.companyName,
      customerName: vehicle.customerName,
    });
    setShowSuggestions(false);
    setSuggestions([]);
  };

  // Handle clicks outside suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Cleanup search timeout on unmount
  useEffect(() => {
    return () => {
      if ((window as any).searchTimeout) {
        clearTimeout((window as any).searchTimeout);
      }
    };
  }, []);

  return (
    <Card className="bg-gray-800 border-gray-700">
      {/* <CardHeader>
        <CardTitle className="text-yellow-400 flex items-center gap-2">
          <PlusCircle className="h-5 w-5" />
          New Vehicle Registration
        </CardTitle>
        <p className="text-gray-400 text-sm">
          Vehicle not found in database. Please add vehicle information.
        </p>
      </CardHeader> */}

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="queueNumber" className="text-gray-300">
                Queue Number
              </Label>
              <div className="relative">
                <Input
                  id="queueNumber"
                  value={queueNumber}
                  disabled
                  className="bg-gray-600 border-gray-500 text-gray-300 cursor-text select-all pr-10"
                  placeholder="Auto-generated queue number"
                  readOnly
                />
                <Button
                  type="button"
                  onClick={handleCopyQueueNumber}
                  size="sm"
                  variant="ghost"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-500"
                  title="Copy queue number"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="orderNumber" className="text-gray-300">
                Order Number *
              </Label>
              <Input
                id="orderNumber"
                value={formData.orderNumber}
                onChange={(e) =>
                  setFormData({ ...formData, orderNumber: e.target.value })
                }
                placeholder="Enter order number"
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="companyName" className="text-gray-300">
                Company Name *
              </Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                placeholder="Enter company name"
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="customerName" className="text-gray-300">
                Customer Name *
              </Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
                placeholder="Enter customer name"
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            <div className="relative">
              <Label htmlFor="truckNumber" className="text-gray-300">
                Truck Number *
              </Label>
              <div className="relative">
                <Input
                  id="truckNumber"
                  value={formData.truckNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({ ...formData, truckNumber: value });
                    searchVehicles(value);
                  }}
                  onFocus={() => {
                    if (formData.truckNumber && suggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  placeholder="Enter truck number"
                  className="bg-gray-700 border-gray-600 text-white pr-10"
                  required
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                  </div>
                )}
              </div>

              {/* Autocomplete Suggestions */}
              {showSuggestions && (
                <div
                  ref={suggestionsRef}
                  className="absolute z-50 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto"
                >
                  {isSearching ? (
                    <div className="p-3 text-center text-gray-400">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mx-auto"></div>
                      <span className="ml-2">Searching...</span>
                    </div>
                  ) : suggestions.length > 0 ? (
                    suggestions.map((vehicle, index) => (
                      <div
                        key={vehicle._id || index}
                        onClick={() => handleSuggestionSelect(vehicle)}
                        className="p-3 hover:bg-gray-600 cursor-pointer border-b border-gray-600 last:border-b-0"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-white font-medium">
                              {vehicle.truckNumber}
                            </div>
                            <div className="text-gray-400 text-sm">
                              Driver: {vehicle.driverName}
                            </div>
                            <div className="text-gray-400 text-sm">
                              Company: {vehicle.companyName}
                            </div>
                          </div>
                          <div className="text-gray-500 text-xs">
                            {vehicle.trailerNumber &&
                              `Trailer: ${vehicle.trailerNumber}`}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-gray-400">
                      No matching vehicles found
                    </div>
                  )}
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="trailerNumber" className="text-gray-300">
                Trailer Number
              </Label>
              <Input
                id="trailerNumber"
                value={formData.trailerNumber}
                onChange={(e) =>
                  setFormData({ ...formData, trailerNumber: e.target.value })
                }
                placeholder="Enter trailer number (optional)"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="driverName" className="text-gray-300">
                Driver Name *
              </Label>
              <Input
                id="driverName"
                value={formData.driverName}
                onChange={(e) =>
                  setFormData({ ...formData, driverName: e.target.value })
                }
                placeholder="Enter driver name"
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="driverPhoneNumber" className="text-gray-300">
                Driver Phone Number
              </Label>
              <Input
                id="driverPhoneNumber"
                value={formData.driverPhoneNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    driverPhoneNumber: e.target.value,
                  })
                }
                placeholder="Enter driver phone number (optional)"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="numberOfDrums" className="text-gray-300">
                No. Drum *
              </Label>
              <Input
                id="numberOfDrums"
                type="number"
                value={formData.numberOfDrums}
                onChange={(e) =>
                  setFormData({ ...formData, numberOfDrums: e.target.value })
                }
                placeholder="Enter number of drums"
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="orderDate" className="text-gray-300">
                Order Date *
              </Label>
              <Input
                id="orderDate"
                type="datetime-local"
                value={formData.orderDate}
                onChange={(e) =>
                  setFormData({ ...formData, orderDate: e.target.value })
                }
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="amountInLiters" className="text-gray-300">
                Amount in (liter) *
              </Label>
              <Input
                id="amountInLiters"
                type="number"
                value={formData.amountInLiters}
                onChange={(e) =>
                  setFormData({ ...formData, amountInLiters: e.target.value })
                }
                placeholder="Enter amount in liters"
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="tankNumber" className="text-gray-300">
                Tank No *
              </Label>
              <Select
                value={formData.tankNumber}
                onValueChange={(value) =>
                  setFormData({ ...formData, tankNumber: value })
                }
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select tank number" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {[1, 2, 3, 4, 5, 6].map((tank) => (
                    <SelectItem
                      key={tank}
                      value={tank.toString()}
                      className="text-white"
                    >
                      Tank {tank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded border border-red-800">
              {error}
            </div>
          )}

          {/* First row of buttons */}
          {/* <div className="flex gap-4">
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !formData.orderNumber ||
                !formData.companyName ||
                !formData.customerName ||
                !formData.orderDate ||
                !formData.truckNumber ||
                !formData.driverName ||
                !formData.numberOfDrums ||
                !formData.amountInLiters ||
                !formData.tankNumber
              }
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Truck className="h-4 w-4 mr-2" />
              {isSubmitting ? "Adding Vehicle..." : "Add Vehicle"}
            </Button>
            <Button
              type="button"
              onClick={handlePrint}
              className="flex-1 bg-blue-700 hover:bg-blue-800"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div> */}

          {/* Buttons */}
          <div className="flex gap-4 pt-2">
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !formData.orderNumber ||
                !formData.companyName ||
                !formData.customerName ||
                !formData.orderDate ||
                !formData.truckNumber ||
                !formData.driverName ||
                !formData.numberOfDrums ||
                !formData.amountInLiters ||
                !formData.tankNumber
              }
              className="flex-1 bg-blue-500 hover:bg-blue-600"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Adding Vehicle..." : "Add Vehicle"}
            </Button>
            <Button
              type="button"
              onClick={handleClearForm}
              variant="outline"
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white border-gray-500"
            >
              <X className="h-4 w-4 mr-2" />
              Clear Form
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
