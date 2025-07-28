"use client";

import { format } from "date-fns";
import {
  Car,
  Truck,
  Calendar,
  User,
  FileText,
  Building,
  Users,
  Package,
  Droplets,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Vehicle {
  _id: string;
  queueNumber?: string;
  orderNumber?: string;
  orderDate?: string;
  companyName?: string;
  customerName?: string;
  truckNumber: string;
  trailerNumber?: string;
  driverName: string;
  driverPhoneNumber?: string;
  numberOfDrums?: number;
  amountInLiters?: number;
  tankNumber?: number;
  createdAt: string;
  // Legacy fields for backward compatibility
  customerLevel1?: string;
  customerLevel2?: string;
  dam_capacity?: string;
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
          <Badge variant="secondary" className="bg-blue-600 text-white">
            {vehicle.queueNumber || "N/A"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-2xl font-bold text-white text-center mb-2">
              {vehicle.truckNumber}
            </h3>
            <p className="text-gray-400 text-center text-sm">Truck Number</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white">
              <span className="text-gray-400">Order:</span>
              <span className="font-medium">
                {vehicle.orderNumber || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <span className="text-gray-400">Driver:</span>
              <span className="font-medium">{vehicle.driverName}</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <span className="text-gray-400">Order Date:</span>
              <span className="font-medium">
                {vehicle.orderDate
                  ? format(new Date(vehicle.orderDate), "MMM dd, yyyy HH:mm")
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white">
              <Building className="h-4 w-4 text-blue-400" />
              <span className="text-gray-400">Company:</span>
              <span className="font-medium">
                {vehicle.companyName || vehicle.customerLevel1 || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Users className="h-4 w-4 text-green-400" />
              <span className="text-gray-400">Customer:</span>
              <span className="font-medium">
                {vehicle.customerName || vehicle.customerLevel2 || "N/A"}
              </span>
            </div>
            {vehicle.trailerNumber && (
              <div className="flex items-center gap-2 text-white">
                <Truck className="h-4 w-4 text-purple-400" />
                <span className="text-gray-400">Trailer:</span>
                <span className="font-medium">{vehicle.trailerNumber}</span>
              </div>
            )}
            {vehicle.driverPhoneNumber && (
              <div className="flex items-center gap-2 text-white">
                <User className="h-4 w-4 text-orange-400" />
                <span className="text-gray-400">Phone:</span>
                <span className="font-medium">{vehicle.driverPhoneNumber}</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white">
              <Package className="h-4 w-4 text-yellow-400" />
              <span className="text-gray-400">Drums:</span>
              <span className="font-medium">
                {vehicle.numberOfDrums || vehicle.dam_capacity || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Droplets className="h-4 w-4 text-cyan-400" />
              <span className="text-gray-400">Amount:</span>
              <span className="font-medium">
                {vehicle.amountInLiters
                  ? `${vehicle.amountInLiters.toLocaleString()} L`
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <span className="text-gray-400">Tank:</span>
              <Badge variant="outline" className="text-white border-gray-500">
                {vehicle.tankNumber ? `Tank ${vehicle.tankNumber}` : "N/A"}
              </Badge>
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
