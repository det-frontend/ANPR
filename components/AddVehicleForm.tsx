"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  PlusCircle,
  Save,
  Truck,
  Printer,
  X,
  Copy,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { DateTimePicker } from "@/components/ui/datetime-picker";

import { VehicleResponse, VehicleFormData } from "@/lib/types";
import { EventBus, EVENTS } from "@/lib/events";

interface AddVehicleFormProps {
  plateNumber: string;
  queueNumber: string;
  onVehicleAdded: (vehicle: VehicleResponse) => void;
  onCancel?: () => void;
  isLoadingQueue?: boolean;
}

// Initial form state
const getInitialFormState = (plateNumber: string) => ({
  orderNumber: "",
  companyName: "",
  customerName: "",
  orderDate: new Date(), // Set to current date and time
  truckNumber: plateNumber,
  trailerNumber: "",
  driverName: "",
  driverPhoneNumber: "",
  numberOfDrums: "",
  amountInLiters: "",
  tankNumber: "",
});

export default function AddVehicleForm({
  plateNumber,
  queueNumber,
  onVehicleAdded,
  onCancel,
  isLoadingQueue = false,
}: AddVehicleFormProps) {
  const [formData, setFormData] = useState<VehicleFormData>(() =>
    getInitialFormState(plateNumber)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Autocomplete state
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Memoized form validation
  const isFormValid = useMemo(() => {
    return (
      formData.orderNumber.trim() &&
      formData.companyName.trim() &&
      formData.customerName.trim() &&
      formData.orderDate instanceof Date &&
      formData.truckNumber.trim() &&
      formData.driverName.trim() &&
      formData.numberOfDrums &&
      formData.amountInLiters &&
      formData.tankNumber
    );
  }, [formData]);

  // Memoized form progress
  const formProgress = useMemo(() => {
    const requiredFields = [
      formData.orderNumber,
      formData.companyName,
      formData.customerName,
      formData.orderDate instanceof Date
        ? formData.orderDate.toISOString()
        : formData.orderDate,
      formData.truckNumber,
      formData.driverName,
      formData.numberOfDrums,
      formData.amountInLiters,
      formData.tankNumber,
    ];
    const filledFields = requiredFields.filter(
      (field) => field && field.toString().trim()
    ).length;
    return Math.round((filledFields / requiredFields.length) * 100);
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isFormValid || isSubmitting) return;

      setError("");
      setSuccessMessage("");
      setIsSubmitting(true);

      try {
        const response = await fetch("/api/add-vehicle", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            orderDate:
              formData.orderDate instanceof Date
                ? formData.orderDate.toISOString()
                : formData.orderDate,
            queueNumber,
            numberOfDrums: Number(formData.numberOfDrums),
            amountInLiters: Number(formData.amountInLiters),
            tankNumber: Number(formData.tankNumber),
          }),
        });

        const data = await response.json();

        if (response.ok) {
          onVehicleAdded(data.vehicle);
          setSuccessMessage("Vehicle added successfully!");
          handleClearForm();
          EventBus.publish(EVENTS.VEHICLE_ADDED, data.vehicle);

          // Clear success message after 3 seconds
          setTimeout(() => setSuccessMessage(""), 3000);
        } else {
          setError(data.error || "Failed to add vehicle");
        }
      } catch (error) {
        setError("Network error. Please check your connection and try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, queueNumber, isFormValid, isSubmitting, onVehicleAdded]
  );

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

  const handleCopyQueueNumber = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(queueNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy queue number:", error);
      setError("Failed to copy queue number to clipboard");
    }
  }, [queueNumber]);

  const handleClearForm = useCallback(() => {
    // Clear search timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }

    setFormData(getInitialFormState(plateNumber));
    setError("");
    setSuccessMessage("");
    setCopied(false);
    setSuggestions([]);
    setShowSuggestions(false);
    setIsSearching(false);
  }, [plateNumber]);

  // Optimized search with proper cleanup
  const searchVehicles = useCallback(async (query: string) => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setIsSearching(true);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/vehicle-info/search?q=${encodeURIComponent(query.trim())}`
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
        console.error("Error searching vehicle info:", error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  }, []);

  const handleSuggestionSelect = useCallback((vehicle: any) => {
    setFormData((prev) => ({
      ...prev,
      truckNumber: vehicle.vehicleNumber, // vehicle-info uses vehicleNumber
      trailerNumber: vehicle.trailerNumber || "",
      driverName: vehicle.driverName,
      driverPhoneNumber: vehicle.driverPhone || "", // vehicle-info uses driverPhone
      companyName: vehicle.companyName,
      customerName: vehicle.customerName,
    }));
    setShowSuggestions(false);
    setSuggestions([]);
  }, []);

  const handleInputChange = useCallback(
    (field: string, value: string | Date) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Trigger search for truck number field
      if (field === "truckNumber" && typeof value === "string") {
        searchVehicles(value);
      }
    },
    [searchVehicles]
  );

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
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Reset form when plateNumber prop changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, truckNumber: plateNumber }));
  }, [plateNumber]);

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent>
        {/* Progress Indicator */}
        {/* <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-gray-300 text-sm">Form Progress</Label>
            <Badge variant="secondary" className="text-xs">
              {formProgress}% Complete
            </Badge>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${formProgress}%` }}
            />
          </div>
        </div> */}

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Queue Number */}
            <div>
              <Label htmlFor="queueNumber" className="text-gray-300">
                Queue Number
              </Label>
              <div className="relative">
                <Input
                  id="queueNumber"
                  value={isLoadingQueue ? "" : queueNumber}
                  disabled={true}
                  className="bg-gray-600 border-gray-500 text-gray-300 cursor-not-allowed select-all pr-10 opacity-75"
                  placeholder={
                    isLoadingQueue
                      ? "Generating queue number..."
                      : "Auto-generated queue number"
                  }
                  readOnly
                />
                {isLoadingQueue ? (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                  </div>
                ) : (
                  <Button
                    type="button"
                    onClick={handleCopyQueueNumber}
                    size="sm"
                    variant="ghost"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-500 transition-colors"
                    title="Copy queue number"
                    disabled={copied}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Order Number */}
            <div>
              <Label htmlFor="orderNumber" className="text-gray-300">
                Order Number *
              </Label>
              <Input
                id="orderNumber"
                value={formData.orderNumber}
                onChange={(e) =>
                  handleInputChange("orderNumber", e.target.value)
                }
                placeholder="Enter order number"
                className="bg-gray-700 border-gray-600 text-white focus:border-blue-500 transition-colors"
                required
                autoComplete="off"
              />
            </div>

            {/* Company Name */}
            <div>
              <Label htmlFor="companyName" className="text-gray-300">
                Company Name *
              </Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) =>
                  handleInputChange("companyName", e.target.value)
                }
                placeholder="Enter company name"
                className="bg-gray-700 border-gray-600 text-white focus:border-blue-500 transition-colors"
                required
                autoComplete="organization"
              />
            </div>

            {/* Customer Name */}
            <div>
              <Label htmlFor="customerName" className="text-gray-300">
                Customer Name *
              </Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) =>
                  handleInputChange("customerName", e.target.value)
                }
                placeholder="Enter customer name"
                className="bg-gray-700 border-gray-600 text-white focus:border-blue-500 transition-colors"
                required
                autoComplete="name"
              />
            </div>

            {/* Truck Number with Autocomplete */}
            <div className="relative">
              <Label htmlFor="truckNumber" className="text-gray-300">
                Truck Number *
              </Label>
              <div className="relative">
                <Input
                  id="truckNumber"
                  value={formData.truckNumber}
                  onChange={(e) =>
                    handleInputChange("truckNumber", e.target.value)
                  }
                  onFocus={() => {
                    if (formData.truckNumber && suggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  placeholder="Enter truck number"
                  className="bg-gray-700 border-gray-600 text-white pr-10 focus:border-blue-500 transition-colors"
                  required
                  autoComplete="off"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                  </div>
                )}
              </div>

              {/* Enhanced Autocomplete Suggestions */}
              {showSuggestions && (
                <div
                  ref={suggestionsRef}
                  className="absolute z-50 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto"
                >
                  {isSearching ? (
                    <div className="p-3 text-center text-gray-400">
                      <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                      <span>Searching vehicle info...</span>
                    </div>
                  ) : suggestions.length > 0 ? (
                    suggestions.map((vehicle, index) => (
                      <div
                        key={vehicle._id || index}
                        onClick={() => handleSuggestionSelect(vehicle)}
                        className="p-3 hover:bg-gray-600 cursor-pointer border-b border-gray-600 last:border-b-0 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="text-white font-medium">
                              {vehicle.vehicleNumber}
                            </div>
                            <div className="text-gray-400 text-sm">
                              Driver: {vehicle.driverName}
                            </div>
                            <div className="text-gray-400 text-sm">
                              Company: {vehicle.companyName}
                            </div>
                          </div>
                          <div className="text-gray-500 text-xs ml-2">
                            {vehicle.trailerNumber &&
                              `Trailer: ${vehicle.trailerNumber}`}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-gray-400">
                      <AlertCircle className="h-4 w-4 mx-auto mb-2" />
                      No matching vehicle info found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Trailer Number */}
            <div>
              <Label htmlFor="trailerNumber" className="text-gray-300">
                Trailer Number
              </Label>
              <Input
                id="trailerNumber"
                value={formData.trailerNumber}
                onChange={(e) =>
                  handleInputChange("trailerNumber", e.target.value)
                }
                placeholder="Enter trailer number (optional)"
                className="bg-gray-700 border-gray-600 text-white focus:border-blue-500 transition-colors"
                autoComplete="off"
              />
            </div>

            {/* Driver Name */}
            <div>
              <Label htmlFor="driverName" className="text-gray-300">
                Driver Name *
              </Label>
              <Input
                id="driverName"
                value={formData.driverName}
                onChange={(e) =>
                  handleInputChange("driverName", e.target.value)
                }
                placeholder="Enter driver name"
                className="bg-gray-700 border-gray-600 text-white focus:border-blue-500 transition-colors"
                required
                autoComplete="name"
              />
            </div>

            {/* Driver Phone Number */}
            <div>
              <Label htmlFor="driverPhoneNumber" className="text-gray-300">
                Driver Phone Number
              </Label>
              <Input
                id="driverPhoneNumber"
                type="tel"
                value={formData.driverPhoneNumber}
                onChange={(e) =>
                  handleInputChange("driverPhoneNumber", e.target.value)
                }
                placeholder="Enter driver phone number (optional)"
                className="bg-gray-700 border-gray-600 text-white focus:border-blue-500 transition-colors"
                autoComplete="tel"
              />
            </div>

            {/* Number of Drums */}
            <div>
              <Label htmlFor="numberOfDrums" className="text-gray-300">
                No. Drum *
              </Label>
              <Input
                id="numberOfDrums"
                type="number"
                min="1"
                value={formData.numberOfDrums}
                onChange={(e) =>
                  handleInputChange("numberOfDrums", e.target.value)
                }
                placeholder="Enter number of drums"
                className="bg-gray-700 border-gray-600 text-white focus:border-blue-500 transition-colors"
                required
              />
            </div>

            {/* Order Date */}
            <div>
              <Label htmlFor="orderDate" className="text-gray-300">
                Order Date *
              </Label>
              <DateTimePicker
                value={
                  formData.orderDate instanceof Date
                    ? formData.orderDate
                    : undefined
                }
                onChange={(date) =>
                  handleInputChange("orderDate", date || new Date())
                }
                placeholder="Select order date and time"
                className="w-full"
              />
            </div>

            {/* Amount in Liters */}
            <div>
              <Label htmlFor="amountInLiters" className="text-gray-300">
                Amount in (liter) *
              </Label>
              <Input
                id="amountInLiters"
                type="number"
                min="1"
                step="0.01"
                value={formData.amountInLiters}
                onChange={(e) =>
                  handleInputChange("amountInLiters", e.target.value)
                }
                placeholder="Enter amount in liters"
                className="bg-gray-700 border-gray-600 text-white focus:border-blue-500 transition-colors"
                required
              />
            </div>

            {/* Tank Number */}
            <div>
              <Label htmlFor="tankNumber" className="text-gray-300">
                Tank No *
              </Label>
              <Select
                value={formData.tankNumber}
                onValueChange={(value) =>
                  handleInputChange("tankNumber", value)
                }
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-blue-500 transition-colors">
                  <SelectValue placeholder="Select tank number" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {[1, 2, 3, 4, 5, 6].map((tank) => (
                    <SelectItem
                      key={tank}
                      value={tank.toString()}
                      className="text-white hover:bg-gray-600"
                    >
                      Tank {tank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <Alert className="border-red-800 bg-red-900/20">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-400">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Success Message */}
          {successMessage && (
            <Alert className="border-green-800 bg-green-900/20">
              <Check className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-400">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-2">
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Submit
                </>
              )}
            </Button>
            <Button
              type="button"
              onClick={handleClearForm}
              variant="outline"
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white border-gray-500 transition-colors"
              disabled={isSubmitting}
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
