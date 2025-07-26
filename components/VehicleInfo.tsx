"use client";

import { format } from "date-fns";
import { Car, Truck, Calendar, User, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Vehicle {
  _id: string;
  truckNumber: string;
  driverName: string;
  orderDate: string;
  createdAt: string;
}

interface VehicleInfoProps {
  vehicle: Vehicle;
}

export default function VehicleInfo({ vehicle }: VehicleInfoProps) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-green-400 flex items-center gap-2">
            ✓ Vehicle Found
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-2xl font-bold text-white text-center mb-2">
              {vehicle.truckNumber}
            </h3>
            <p className="text-gray-400 text-center text-sm">Number Plate</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white">
              <span className="text-gray-400">Driver:</span>
              <span className="font-medium">{vehicle.driverName}</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <span className="text-gray-400">Order Date:</span>
              <span className="font-medium">
                {format(new Date(vehicle.orderDate), "MMM dd, yyyy HH:mm")}
              </span>
            </div>
          </div>
        </div>
        <div className="pt-2 border-t border-gray-700">
          <p className="text-xs text-gray-500">
            Added: {format(new Date(vehicle.createdAt), "MMM dd, yyyy HH:mm")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
