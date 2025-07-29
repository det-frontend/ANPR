"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";

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

interface VehicleInfoDetailsModalProps {
  vehicle: VehicleInfo | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function VehicleInfoDetailsModal({
  vehicle,
  isOpen,
  onClose,
}: VehicleInfoDetailsModalProps) {
  if (!vehicle) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center justify-between">
            Vehicle Information Details
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Vehicle Number */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-400">
              Vehicle Number
            </h3>
            <Badge
              variant="secondary"
              className="bg-green-600 text-white text-lg px-3 py-1"
            >
              {vehicle.vehicleNumber}
            </Badge>
          </div>

          {/* Driver Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-400">Driver Name</h3>
              <p className="text-white font-medium">{vehicle.driverName}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-400">
                Driver Phone
              </h3>
              <Badge variant="outline" className="text-white border-gray-500">
                {vehicle.driverPhone}
              </Badge>
            </div>
          </div>

          {/* Trailer Information */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-400">
              Trailer Number
            </h3>
            <p className="text-white font-medium">{vehicle.trailerNumber}</p>
          </div>

          {/* Customer and Company Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-400">
                Customer Name
              </h3>
              <p className="text-white font-medium">{vehicle.customerName}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-400">
                Company Name
              </h3>
              <p className="text-white font-medium">{vehicle.companyName}</p>
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-400">Created At</h3>
              <p className="text-gray-300 text-sm">
                {format(parseISO(vehicle.createdAt), "MMM dd, yyyy 'at' HH:mm")}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-400">
                Last Updated
              </h3>
              <p className="text-gray-300 text-sm">
                {format(parseISO(vehicle.updatedAt), "MMM dd, yyyy 'at' HH:mm")}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
