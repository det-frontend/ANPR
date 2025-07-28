"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  History,
  RefreshCw,
  Building,
  Users,
  Package,
  Droplets,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

export default function RecentVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/vehicles");
      const data = await response.json();
      const safeVehicles = Array.isArray(data.vehicles) ? data.vehicles : [];
      setVehicles(safeVehicles.slice(0, 5)); // Show only last 5
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-white flex items-center gap-2">
          <History className="h-5 w-5 text-blue-400" />
          Recent Entries
        </CardTitle>
        <Button
          onClick={fetchVehicles}
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-700 h-20 rounded"
              ></div>
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <p className="text-gray-400 text-center py-4">
            No vehicles registered yet
          </p>
        ) : (
          <div className="space-y-3">
            {vehicles.map((vehicle) => (
              <div key={vehicle._id} className="bg-gray-700 p-3 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-blue-600 text-white text-xs"
                    >
                      {vehicle.queueNumber || "N/A"}
                    </Badge>
                    <span className="font-bold text-white">
                      {vehicle.truckNumber}
                    </span>
                  </div>
                  <span className="text-gray-300 text-sm">
                    {vehicle.driverName}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1 text-gray-400">
                    <Building className="h-3 w-3" />
                    <span className="truncate">
                      {vehicle.companyName || vehicle.customerLevel1 || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Users className="h-3 w-3" />
                    <span className="truncate">
                      {vehicle.customerName || vehicle.customerLevel2 || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Package className="h-3 w-3" />
                    <span>
                      {vehicle.numberOfDrums || vehicle.dam_capacity || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Droplets className="h-3 w-3" />
                    <span>
                      {vehicle.amountInLiters
                        ? `${vehicle.amountInLiters.toLocaleString()}L`
                        : "N/A"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <Badge
                    variant="outline"
                    className="text-xs border-gray-500 text-gray-300"
                  >
                    {vehicle.tankNumber ? `Tank ${vehicle.tankNumber}` : "N/A"}
                  </Badge>
                  <span className="text-gray-500 text-xs">
                    {format(new Date(vehicle.createdAt), "MMM dd, HH:mm")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
