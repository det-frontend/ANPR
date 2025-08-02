"use client";

import React, { useEffect, useRef } from "react";
import { Save, X, Copy, Check, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useVehicleForm } from "@/hooks/useVehicleForm";
import { VehicleResponse } from "@/lib/types";

interface AddVehicleFormProps {
  plateNumber: string;
  queueNumber: string;
  onVehicleAdded: (vehicle: VehicleResponse) => void;
  onCancel?: () => void;
  isLoadingQueue?: boolean;
}

// Memoized form field component for better performance
const FormField = React.memo<{
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  type?: string;
  min?: string;
  step?: string;
  autoComplete?: string;
  className?: string;
}>(
  ({
    label,
    id,
    value,
    onChange,
    placeholder,
    required,
    type = "text",
    min,
    step,
    autoComplete,
    className = "",
  }) => (
    <div>
      <Label htmlFor={id} className="text-gray-300">
        {label} {required && "*"}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`bg-gray-700 border-gray-600 text-white focus:border-blue-500 transition-colors ${className}`}
        required={required}
        min={min}
        step={step}
        autoComplete={autoComplete}
      />
    </div>
  )
);

FormField.displayName = "FormField";

// Memoized autocomplete suggestions component
const AutocompleteSuggestions = React.memo<{
  suggestions: any[];
  isSearching: boolean;
  onSelect: (vehicle: any) => void;
}>(({ suggestions, isSearching, onSelect }) => {
  if (!suggestions.length && !isSearching) return null;

  return (
    <div className="absolute z-50 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
      {isSearching ? (
        <div className="p-3 text-center text-gray-400">
          <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
          <span>Searching...</span>
        </div>
      ) : suggestions.length > 0 ? (
        suggestions.map((vehicle, index) => (
          <div
            key={vehicle._id || index}
            onClick={() => onSelect(vehicle)}
            className="p-3 hover:bg-gray-600 cursor-pointer border-b border-gray-600 last:border-b-0 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
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
              <div className="text-gray-500 text-xs ml-2">
                {vehicle.trailerNumber && `Trailer: ${vehicle.trailerNumber}`}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="p-3 text-center text-gray-400">
          <AlertCircle className="h-4 w-4 mx-auto mb-2" />
          No matching vehicles found
        </div>
      )}
    </div>
  );
});

AutocompleteSuggestions.displayName = "AutocompleteSuggestions";

// Memoized progress indicator component
const ProgressIndicator = React.memo<{ progress: number }>(({ progress }) => (
  <div className="mb-6">
    <div className="flex items-center justify-between mb-2">
      <Label className="text-gray-300 text-sm">Form Progress</Label>
      <Badge variant="secondary" className="text-xs">
        {progress}% Complete
      </Badge>
    </div>
    <div className="w-full bg-gray-700 rounded-full h-2">
      <div
        className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
));

ProgressIndicator.displayName = "ProgressIndicator";

// Memoized queue number field component
const QueueNumberField = React.memo<{
  queueNumber: string;
  copied: boolean;
  onCopy: () => void;
  isLoadingQueue?: boolean;
}>(({ queueNumber, copied, onCopy, isLoadingQueue = false }) => (
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
          onClick={onCopy}
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
));

QueueNumberField.displayName = "QueueNumberField";

// Main component
const AddVehicleFormOptimized = React.memo<AddVehicleFormProps>(
  ({
    plateNumber,
    queueNumber,
    onVehicleAdded,
    onCancel,
    isLoadingQueue = false,
  }) => {
    const suggestionsRef = useRef<HTMLDivElement>(null);

    const {
      formData,
      isSubmitting,
      error,
      successMessage,
      copied,
      suggestions,
      showSuggestions,
      isSearching,
      isFormValid,
      formProgress,
      handleSubmit,
      handleCopyQueueNumber,
      handleClearForm,
      handleSuggestionSelect,
      handleInputChange,
      setShowSuggestions,
    } = useVehicleForm({ plateNumber, queueNumber, onVehicleAdded });

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
    }, [setShowSuggestions]);

    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent>
          <ProgressIndicator progress={formProgress} />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <QueueNumberField
                queueNumber={queueNumber}
                copied={copied}
                onCopy={handleCopyQueueNumber}
                isLoadingQueue={isLoadingQueue}
              />

              <FormField
                label="Order Number"
                id="orderNumber"
                value={formData.orderNumber}
                onChange={(value) => handleInputChange("orderNumber", value)}
                placeholder="Enter order number"
                required
                autoComplete="off"
              />

              <FormField
                label="Company Name"
                id="companyName"
                value={formData.companyName}
                onChange={(value) => handleInputChange("companyName", value)}
                placeholder="Enter company name"
                required
                autoComplete="organization"
              />

              <FormField
                label="Customer Name"
                id="customerName"
                value={formData.customerName}
                onChange={(value) => handleInputChange("customerName", value)}
                placeholder="Enter customer name"
                required
                autoComplete="name"
              />

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

                {showSuggestions && (
                  <div ref={suggestionsRef}>
                    <AutocompleteSuggestions
                      suggestions={suggestions}
                      isSearching={isSearching}
                      onSelect={handleSuggestionSelect}
                    />
                  </div>
                )}
              </div>

              <FormField
                label="Trailer Number"
                id="trailerNumber"
                value={formData.trailerNumber}
                onChange={(value) => handleInputChange("trailerNumber", value)}
                placeholder="Enter trailer number (optional)"
                autoComplete="off"
              />

              <FormField
                label="Driver Name"
                id="driverName"
                value={formData.driverName}
                onChange={(value) => handleInputChange("driverName", value)}
                placeholder="Enter driver name"
                required
                autoComplete="name"
              />

              <FormField
                label="Driver Phone Number"
                id="driverPhoneNumber"
                value={formData.driverPhoneNumber}
                onChange={(value) =>
                  handleInputChange("driverPhoneNumber", value)
                }
                placeholder="Enter driver phone number (optional)"
                type="tel"
                autoComplete="tel"
              />

              <FormField
                label="No. Drum"
                id="numberOfDrums"
                value={formData.numberOfDrums}
                onChange={(value) => handleInputChange("numberOfDrums", value)}
                placeholder="Enter number of drums"
                type="number"
                min="1"
                required
              />

              <FormField
                label="Order Date"
                id="orderDate"
                value={formData.orderDate}
                onChange={(value) => handleInputChange("orderDate", value)}
                placeholder="Select order date"
                type="datetime-local"
                required
              />

              <FormField
                label="Amount in (liter)"
                id="amountInLiters"
                value={formData.amountInLiters}
                onChange={(value) => handleInputChange("amountInLiters", value)}
                placeholder="Enter amount in liters"
                type="number"
                min="1"
                step="0.01"
                required
              />

              {/* Tank Number Select */}
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
);

AddVehicleFormOptimized.displayName = "AddVehicleFormOptimized";

export default AddVehicleFormOptimized;
