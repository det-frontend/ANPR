"use client";

import { useState } from "react";
import { X, Printer, Camera, FileText, Truck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";

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
  // Legacy fields for backward compatibility
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
  const [isPrinting, setIsPrinting] = useState(false);

  if (!vehicle) return null;

  const handlePrint = () => {
    setIsPrinting(true);
    // Simulate print delay
    setTimeout(() => {
    //   window.print();
    console.log("print");
      setIsPrinting(false);
    }, 500);
  };

  // Sample images - you can replace these with actual vehicle images
  const sampleImages = [
    {
      id: 1,
      title: "Front View",
      description: "Vehicle front license plate",
      src: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      title: "Side View",
      description: "Vehicle side profile",
      src: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      title: "Rear View",
      description: "Vehicle rear and trailer",
      src: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-400" />
              Vehicle Details
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Number Header */}
          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-blue-400">
                  Order #{vehicle.orderNumber || "N/A"}
                </h2>
                <p className="text-gray-300 text-sm">
                  {vehicle.orderDate
                    ? format(
                        parseISO(vehicle.orderDate),
                        "MMMM dd, yyyy 'at' HH:mm"
                      )
                    : format(
                        parseISO(vehicle.createdAt),
                        "MMMM dd, yyyy 'at' HH:mm"
                      )}
                </p>
              </div>
              <Badge variant="secondary" className="bg-green-600 text-white">
                Queue #{vehicle.queueNumber || "N/A"}
              </Badge>
            </div>
          </div>

          {/* Vehicle Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Camera className="h-5 w-5 text-purple-400" />
              Vehicle Images
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sampleImages.map((image) => (
                <div
                  key={image.id}
                  className="bg-gray-700 rounded-lg overflow-hidden border border-gray-600"
                >
                  <div className="aspect-video bg-gray-600 relative">
                    <img
                      src={image.src}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-end">
                      <div className="p-3 w-full bg-gradient-to-t from-black/60 to-transparent">
                        <h4 className="text-white font-medium text-sm">
                          {image.title}
                        </h4>
                        <p className="text-gray-300 text-xs">
                          {image.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Truck className="h-5 w-5 text-green-400" />
                Vehicle Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Truck Number:</span>
                  <span className="text-white font-medium">
                    {vehicle.truckNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Trailer Number:</span>
                  <span className="text-white">
                    {vehicle.trailerNumber || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tank Number:</span>
                  <span className="text-white">
                    {vehicle.tankNumber ? `Tank ${vehicle.tankNumber}` : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Number of Drums:</span>
                  <span className="text-white">
                    {vehicle.numberOfDrums || vehicle.dam_capacity || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount (Liters):</span>
                  <span className="text-white">
                    {vehicle.amountInLiters
                      ? vehicle.amountInLiters.toLocaleString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-yellow-400" />
                Customer & Driver Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Company:</span>
                  <span className="text-white font-medium">
                    {vehicle.companyName || vehicle.customerLevel1 || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Customer:</span>
                  <span className="text-white">
                    {vehicle.customerName || vehicle.customerLevel2 || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Driver Name:</span>
                  <span className="text-white font-medium">
                    {vehicle.driverName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Driver Phone:</span>
                  <span className="text-white">
                    {vehicle.driverPhoneNumber || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Entry Time:</span>
                  <span className="text-white">
                    {format(parseISO(vehicle.createdAt), "MMM dd, yyyy HH:mm")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Print Button */}
          <div className="flex justify-center pt-4 border-t border-gray-700">
            <Button
              onClick={handlePrint}
              disabled={isPrinting}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3"
            >
              <Printer className="h-5 w-5 mr-2" />
              {isPrinting ? "Printing..." : "Print Details"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
