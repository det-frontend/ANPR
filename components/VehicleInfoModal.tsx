"use client";

import {
  Dialog,
  DialogContent,
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
  truckNumber: string;
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

interface VehicleInfoModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function VehicleInfoModal({
  vehicle,
  isOpen,
  onClose,
}: VehicleInfoModalProps) {
  if (!vehicle) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-white text-xl font-bold">
            Vehicle Information
          </DialogTitle>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Vehicle Data */}
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">
                Basic Information
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
                      {vehicle.truckNumber}
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
              <h3 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">
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
                  <label className="text-sm font-medium text-gray-300">
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
              <h3 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">
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

            {/* Dates */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">
                Dates
              </h3>

              <div className="grid grid-cols-1 gap-4">
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
          </div>

          {/* Right Side - Car Images */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">
              Vehicle Images
            </h3>

            <div className="space-y-4">
              {/* Front Number Plate */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Front Number Plate
                </label>
                <div className="bg-gray-700 rounded-lg p-4 h-48 flex items-center justify-center border border-gray-600">
                  <div className="text-center text-gray-400">
                    <Truck className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Front Number Plate Image</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {vehicle.truckNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Trailer Number Plate */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Trailer Number Plate
                </label>
                <div className="bg-gray-700 rounded-lg p-4 h-48 flex items-center justify-center border border-gray-600">
                  <div className="text-center text-gray-400">
                    <Truck className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Trailer Number Plate Image</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {vehicle.trailerNumber || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Car Above View */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Car Above View
                </label>
                <div className="bg-gray-700 rounded-lg p-4 h-48 flex items-center justify-center border border-gray-600">
                  <div className="text-center text-gray-400">
                    <Truck className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Car Above View Image</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Top view of {vehicle.truckNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
