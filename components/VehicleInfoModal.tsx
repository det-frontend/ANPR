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
import { VehicleResponse } from "@/lib/types";

// Interface for vehicle info data
interface VehicleInfoData {
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

interface VehicleInfoModalProps {
  vehicle: VehicleResponse | VehicleInfoData | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function VehicleInfoModal({
  vehicle,
  isOpen,
  onClose,
}: VehicleInfoModalProps) {
  if (!vehicle) return null;

  // Helper functions to safely access properties
  const isVehicleEntry = (data: any): data is VehicleResponse => {
    return "truckNumber" in data && "queueNumber" in data;
  };

  const isVehicleInfo = (data: any): data is VehicleInfoData => {
    return "vehicleNumber" in data && "driverPhone" in data;
  };

  // Get display values based on data type
  const getVehicleNumber = () => {
    if (isVehicleEntry(vehicle)) return vehicle.truckNumber;
    if (isVehicleInfo(vehicle)) return vehicle.vehicleNumber;
    return "N/A";
  };

  const getTrailerNumber = () => {
    if (isVehicleEntry(vehicle)) return vehicle.trailerNumber;
    if (isVehicleInfo(vehicle)) return vehicle.trailerNumber;
    return "N/A";
  };

  const getDriverPhone = () => {
    if (isVehicleEntry(vehicle)) return vehicle.driverPhoneNumber;
    if (isVehicleInfo(vehicle)) return vehicle.driverPhone;
    return "N/A";
  };

  const getCompanyName = () => {
    if (isVehicleEntry(vehicle))
      return vehicle.companyName || vehicle.customerLevel1;
    if (isVehicleInfo(vehicle)) return vehicle.companyName;
    return "N/A";
  };

  const getCustomerName = () => {
    if (isVehicleEntry(vehicle))
      return vehicle.customerName || vehicle.customerLevel2;
    if (isVehicleInfo(vehicle)) return vehicle.customerName;
    return "N/A";
  };

  const getCreatedAt = () => {
    return vehicle.createdAt;
  };

  // Additional fields for vehicle entries
  const getQueueNumber = () => {
    if (isVehicleEntry(vehicle)) return vehicle.queueNumber;
    return null;
  };

  const getOrderNumber = () => {
    if (isVehicleEntry(vehicle)) return vehicle.orderNumber;
    return null;
  };

  const getOrderDate = () => {
    if (isVehicleEntry(vehicle) && vehicle.orderDate) {
      return format(parseISO(vehicle.orderDate), "MMM dd, yyyy");
    }
    return null;
  };

  const getNumberOfDrums = () => {
    if (isVehicleEntry(vehicle)) return vehicle.numberOfDrums;
    return null;
  };

  const getAmountInLiters = () => {
    if (isVehicleEntry(vehicle)) return vehicle.amountInLiters;
    return null;
  };

  const getTankNumber = () => {
    if (isVehicleEntry(vehicle)) return vehicle.tankNumber;
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-white text-xl font-bold">
            {isVehicleEntry(vehicle)
              ? "Vehicle Entry Details"
              : "Vehicle Information"}
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
                      {getVehicleNumber()}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Trailer Number
                  </label>
                  <div className="text-white">{getTrailerNumber()}</div>
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
                  <div className="text-white">{getDriverPhone()}</div>
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
                  <div className="text-white">{getCompanyName()}</div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Customer Name
                  </label>
                  <div className="text-white">{getCustomerName()}</div>
                </div>
              </div>
            </div>

            {/* Vehicle Entry Details (only for vehicle entries) */}
            {(getQueueNumber() || getOrderNumber() || getOrderDate()) && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">
                  Entry Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getQueueNumber() && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        Queue Number
                      </label>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-blue-600 text-white text-xs"
                        >
                          {getQueueNumber()}
                        </Badge>
                      </div>
                    </div>
                  )}
                  {getOrderNumber() && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        Order Number
                      </label>
                      <div className="text-white">{getOrderNumber()}</div>
                    </div>
                  )}
                  {getOrderDate() && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        Order Date
                      </label>
                      <div className="text-white">{getOrderDate()}</div>
                    </div>
                  )}
                  {getTankNumber() && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        Tank Number
                      </label>
                      <div className="text-white">Tank {getTankNumber()}</div>
                    </div>
                  )}
                </div>

                {/* Cargo Information */}
                {(getNumberOfDrums() || getAmountInLiters()) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {getNumberOfDrums() && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          Number of Drums
                        </label>
                        <div className="text-white">{getNumberOfDrums()}</div>
                      </div>
                    )}
                    {getAmountInLiters() && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                          <Droplets className="h-4 w-4" />
                          Amount (Liters)
                        </label>
                        <div className="text-white">
                          {getAmountInLiters()?.toLocaleString()} L
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

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
                      parseISO(getCreatedAt()),
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
                      {getVehicleNumber()}
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
                      Top view of {getVehicleNumber()}
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
