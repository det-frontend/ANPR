"use client";

import { useState } from "react";
import { PlusCircle, Save, Truck, Printer, X } from "lucide-react";
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

interface AddVehicleFormProps {
  plateNumber: string;
  onVehicleAdded: (vehicle: any) => void;
  onCancel?: () => void;
}
export default function AddVehicleForm({
  plateNumber,
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
          numberOfDrums: Number(formData.numberOfDrums),
          amountInLiters: Number(formData.amountInLiters),
          tankNumber: Number(formData.tankNumber),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onVehicleAdded(data.vehicle);
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
    console.log('print')
  };

  const handleSaveAndPrint = async () => {
    // First save the vehicle, then print
    await handleSubmit(new Event("submit") as any);
    if (!error) {
      handlePrint();
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-yellow-400 flex items-center gap-2">
          <PlusCircle className="h-5 w-5" />
          New Vehicle Registration
        </CardTitle>
        <p className="text-gray-400 text-sm">
          Vehicle not found in database. Please add vehicle information.
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="truckNumber" className="text-gray-300">
                Truck Number *
              </Label>
              <Input
                id="truckNumber"
                value={formData.truckNumber}
                onChange={(e) =>
                  setFormData({ ...formData, truckNumber: e.target.value })
                }
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
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
          <div className="flex gap-4">
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
          </div>

          {/* Second row of buttons */}
          <div className="space-y-2">
            <Button
              type="button"
              onClick={handleSaveAndPrint}
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
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              <Save className="h-4 w-4 mr-2" />
              Save and Print
            </Button>
            {/* <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="w-full bg-gray-600 hover:bg-gray-700 text-white border-gray-500"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button> */}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
