"use client";

import { useState } from "react";
import { PlusCircle, Save } from "lucide-react";
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
}
export default function AddVehicleForm({
  plateNumber,
  onVehicleAdded,
}: AddVehicleFormProps) {
  const [formData, setFormData] = useState({
    orderNumber: "",
    customerLevel1: "",
    customerLevel2: "",
    orderDate: new Date().toISOString().slice(0, 16),
    queueNumber: "",
    truckNumber: "",
    trailerNumber: "",
    driverName: "",
    driverPhoneNumber: "",
    dam_capacity: "",
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
        body: JSON.stringify(formData),
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
              <Label htmlFor="customerLevel1" className="text-gray-300">
                Customer Level 1 *
              </Label>
              <Input
                id="customerLevel1"
                value={formData.customerLevel1}
                onChange={(e) =>
                  setFormData({ ...formData, customerLevel1: e.target.value })
                }
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="customerLevel2" className="text-gray-300">
                Customer Level 2 *
              </Label>
              <Input
                id="customerLevel2"
                value={formData.customerLevel2}
                onChange={(e) =>
                  setFormData({ ...formData, customerLevel2: e.target.value })
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
              <Label htmlFor="queueNumber" className="text-gray-300">
                Queue Number
              </Label>
              <Input
                id="queueNumber"
                value={formData.queueNumber}
                onChange={(e) =>
                  setFormData({ ...formData, queueNumber: e.target.value })
                }
                className="bg-gray-700 border-gray-600 text-white"
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
              <Label htmlFor="dam_capacity" className="text-gray-300">
                Dam Capacity
              </Label>
              <Input
                id="dam_capacity"
                value={formData.dam_capacity}
                onChange={(e) =>
                  setFormData({ ...formData, dam_capacity: e.target.value })
                }
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded border border-red-800">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={
              isSubmitting ||
              !formData.orderNumber ||
              !formData.customerLevel1 ||
              !formData.customerLevel2 ||
              !formData.orderDate ||
              !formData.truckNumber ||
              !formData.driverName
            }
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? "Adding Vehicle..." : "Add Vehicle"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
