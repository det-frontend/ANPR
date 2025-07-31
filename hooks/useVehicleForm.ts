import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { VehicleResponse } from "@/lib/types";
import { EventBus, EVENTS } from "@/lib/events";

interface FormData {
  orderNumber: string;
  companyName: string;
  customerName: string;
  orderDate: string;
  truckNumber: string;
  trailerNumber: string;
  driverName: string;
  driverPhoneNumber: string;
  numberOfDrums: string;
  amountInLiters: string;
  tankNumber: string;
}

interface UseVehicleFormProps {
  plateNumber: string;
  queueNumber: string;
  onVehicleAdded: (vehicle: VehicleResponse) => void;
}

const getInitialFormState = (plateNumber: string): FormData => ({
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

export const useVehicleForm = ({
  plateNumber,
  queueNumber,
  onVehicleAdded,
}: UseVehicleFormProps) => {
  const [formData, setFormData] = useState<FormData>(() =>
    getInitialFormState(plateNumber)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [copied, setCopied] = useState(false);

  // Autocomplete state
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Memoized form validation
  const isFormValid = useMemo(() => {
    return (
      formData.orderNumber.trim() &&
      formData.companyName.trim() &&
      formData.customerName.trim() &&
      formData.orderDate &&
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
      formData.orderDate,
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
          `/api/search-vehicles?q=${encodeURIComponent(query.trim())}`
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
    }, 300);
  }, []);

  const handleSuggestionSelect = useCallback((vehicle: any) => {
    setFormData((prev) => ({
      ...prev,
      truckNumber: vehicle.truckNumber,
      trailerNumber: vehicle.trailerNumber || "",
      driverName: vehicle.driverName,
      driverPhoneNumber: vehicle.driverPhoneNumber || "",
      companyName: vehicle.companyName,
      customerName: vehicle.customerName,
    }));
    setShowSuggestions(false);
    setSuggestions([]);
  }, []);

  const handleInputChange = useCallback(
    (field: string, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Trigger search for truck number field
      if (field === "truckNumber") {
        searchVehicles(value);
      }
    },
    [searchVehicles]
  );

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

  return {
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
  };
};
