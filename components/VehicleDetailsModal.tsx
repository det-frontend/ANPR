"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import {
  X,
  Truck,
  User,
  Building,
  Calendar,
  Phone,
  Package,
  Droplets,
} from "lucide-react";

interface Vehicle {
  _id: string;
  queueNumber?: string;
  orderNumber?: string;
  orderDate?: string;
  companyName?: string;
  customerName?: string;
  vehicleNumber: string;
  trailerNumber?: string;
  driverName: string;
  driverPhoneNumber?: string;
  numberOfDrums?: number;
  amountInLiters?: number;
  tankNumber?: number;
  createdAt: string;
  updatedAt?: string;
  customerLevel1?: string;
  customerLevel2?: string;
  dam_capacity?: string;
}

interface VehicleDetailsModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function VehicleDetailsModal({
  vehicle,
  isOpen,
  onClose,
}: VehicleDetailsModalProps) {
  if (!vehicle) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Truck className="h-5 w-5 text-blue-400" />
            Vehicle Details
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Detailed information for vehicle {vehicle.vehicleNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Queue and Order Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Queue Number
              </label>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-blue-600 text-white">
                  {vehicle.queueNumber || "N/A"}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Order Number
              </label>
              <div className="text-white font-medium">
                {vehicle.orderNumber || "N/A"}
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Truck className="h-4 w-4 text-blue-400" />
              Vehicle Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Truck Number
                </label>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-green-600 text-white"
                  >
                    {vehicle.vehicleNumber}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Trailer Number
                </label>
                <div className="text-white">
                  {vehicle.trailerNumber || "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* Driver Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <User className="h-4 w-4 text-green-400" />
              Driver Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Driver Name
                </label>
                <div className="text-white font-medium">
                  {vehicle.driverName}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  Phone Number
                </label>
                <div className="text-white">
                  {vehicle.driverPhoneNumber || "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Building className="h-4 w-4 text-purple-400" />
              Company Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Company Name
                </label>
                <div className="text-white">
                  {vehicle.companyName || vehicle.customerLevel1 || "N/A"}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Customer Name
                </label>
                <div className="text-white">
                  {vehicle.customerName || vehicle.customerLevel2 || "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* Order Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-orange-400" />
              Order Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Order Date
                </label>
                <div className="text-white">
                  {vehicle.orderDate
                    ? format(
                        parseISO(vehicle.orderDate),
                        "MMM dd, yyyy 'at' HH:mm"
                      )
                    : format(
                        parseISO(vehicle.createdAt),
                        "MMM dd, yyyy 'at' HH:mm"
                      )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Created At
                </label>
                <div className="text-white">
                  {format(
                    parseISO(vehicle.createdAt),
                    "MMM dd, yyyy 'at' HH:mm"
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Cargo Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Package className="h-4 w-4 text-yellow-400" />
              Cargo Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Number of Drums
                </label>
                <div className="text-white">
                  {vehicle.numberOfDrums || vehicle.dam_capacity || "N/A"}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-1">
                  <Droplets className="h-3 w-3" />
                  Amount (Liters)
                </label>
                <div className="text-white">
                  {vehicle.amountInLiters
                    ? vehicle.amountInLiters.toLocaleString()
                    : "N/A"}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Tank Number
                </label>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="text-white border-gray-500"
                  >
                    {vehicle.tankNumber ? `Tank ${vehicle.tankNumber}` : "N/A"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
