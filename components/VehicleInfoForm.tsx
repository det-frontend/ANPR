"use client";

import { useState } from "react";
import { PlusCircle, Save, Truck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VehicleInfo {
  _id: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  trailerNumber: string;
  customerName: string;
  companyName: string;
  createdAt: string;
  updatedAt: string;
}

interface VehicleInfoFormProps {
  onVehicleAdded: (vehicle: VehicleInfo) => void;
  onCancel?: () => void;
}

export default function VehicleInfoForm({
  onVehicleAdded,
  onCancel,
}: VehicleInfoFormProps) {
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    driverName: "",
    driverPhone: "",
    trailerNumber: "",
    customerName: "",
    companyName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/vehicle-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        onVehicleAdded(data.vehicle);
        // Reset form
        setFormData({
          vehicleNumber: "",
          driverName: "",
          driverPhone: "",
          trailerNumber: "",
          customerName: "",
          companyName: "",
        });
      } else {
        setError(data.error || "Failed to add vehicle info");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-yellow-400 flex items-center gap-2">
          <PlusCircle className="h-5 w-5" />
          Vehicle Information Registration
        </CardTitle>
        <p className="text-gray-400 text-sm">
          Register new vehicle information in the database.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-900 border border-red-700 rounded-lg p-3">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vehicle Number */}
            <div className="space-y-2">
              <Label htmlFor="vehicleNumber" className="text-gray-300">
                Vehicle Number *
              </Label>
              <Input
                id="vehicleNumber"
                type="text"
                value={formData.vehicleNumber}
                onChange={(e) =>
                  handleInputChange("vehicleNumber", e.target.value)
                }
                placeholder="Enter vehicle number"
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>

            {/* Trailer Number */}
            <div className="space-y-2">
              <Label htmlFor="trailerNumber" className="text-gray-300">
                Trailer Number *
              </Label>
              <Input
                id="trailerNumber"
                type="text"
                value={formData.trailerNumber}
                onChange={(e) =>
                  handleInputChange("trailerNumber", e.target.value)
                }
                placeholder="Enter trailer number"
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>

            {/* Driver Name */}
            <div className="space-y-2">
              <Label htmlFor="driverName" className="text-gray-300">
                Driver Name *
              </Label>
              <Input
                id="driverName"
                type="text"
                value={formData.driverName}
                onChange={(e) =>
                  handleInputChange("driverName", e.target.value)
                }
                placeholder="Enter driver name"
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>

            {/* Customer Name */}
            <div className="space-y-2">
              <Label htmlFor="customerName" className="text-gray-300">
                Customer Name *
              </Label>
              <Input
                id="customerName"
                type="text"
                value={formData.customerName}
                onChange={(e) =>
                  handleInputChange("customerName", e.target.value)
                }
                placeholder="Enter customer name"
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>

            {/* Driver Phone */}
            <div className="space-y-2">
              <Label htmlFor="driverPhone" className="text-gray-300">
                Driver Phone *
              </Label>
              <Input
                id="driverPhone"
                type="tel"
                value={formData.driverPhone}
                onChange={(e) =>
                  handleInputChange("driverPhone", e.target.value)
                }
                placeholder="Enter driver phone number"
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>

            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-gray-300">
                Company Name *
              </Label>
              <Input
                id="companyName"
                type="text"
                value={formData.companyName}
                onChange={(e) =>
                  handleInputChange("companyName", e.target.value)
                }
                placeholder="Enter company name"
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Saving..." : "Save Vehicle Info"}
            </Button>

            {onCancel && (
              <Button
                type="button"
                onClick={onCancel}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
