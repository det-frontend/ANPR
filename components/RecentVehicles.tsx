"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { format } from "date-fns";
import {
  History,
  RefreshCw,
  Building,
  Users,
  Package,
  Droplets,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { VehicleResponse } from "@/lib/types";
import { EventBus, EVENTS } from "@/lib/events";

// Memoized vehicle card component for better performance
const VehicleCard = React.memo<{ vehicle: VehicleResponse }>(({ vehicle }) => (
  <div className="bg-gray-700 p-3 rounded-lg hover:bg-gray-650 transition-colors">
    <div className="flex justify-between items-start mb-2">
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="bg-blue-600 text-white text-xs">
          {vehicle.queueNumber || "N/A"}
        </Badge>
        <span className="font-bold text-white">{vehicle.truckNumber}</span>
      </div>
      <span className="text-gray-300 text-sm">{vehicle.driverName}</span>
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
        <span>{vehicle.numberOfDrums || vehicle.dam_capacity || "N/A"}</span>
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
));

VehicleCard.displayName = "VehicleCard";

// Memoized loading skeleton component
const LoadingSkeleton = React.memo(() => (
  <div className="space-y-2">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="animate-pulse bg-gray-700 h-20 rounded"></div>
    ))}
  </div>
));

LoadingSkeleton.displayName = "LoadingSkeleton";

// Memoized empty state component
const EmptyState = React.memo(() => (
  <div className="text-center py-8">
    <AlertCircle className="h-8 w-8 text-gray-500 mx-auto mb-2" />
    <p className="text-gray-400">No vehicles registered yet</p>
  </div>
));

EmptyState.displayName = "EmptyState";

// Memoized header component
const RecentVehiclesHeader = React.memo<{
  onRefresh: () => void;
  isLoading: boolean;
}>(({ onRefresh, isLoading }) => (
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-white flex items-center gap-2">
      <History className="h-5 w-5 text-blue-400" />
      Recent Entries
    </CardTitle>
    <Button
      onClick={onRefresh}
      variant="ghost"
      size="sm"
      className="text-gray-400 hover:text-white transition-colors"
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <RefreshCw className="h-4 w-4" />
      )}
    </Button>
  </CardHeader>
));

RecentVehiclesHeader.displayName = "RecentVehiclesHeader";

const RecentVehicles = React.memo(() => {
  const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/vehicles");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch vehicles");
      }

      const safeVehicles = Array.isArray(data.vehicles) ? data.vehicles : [];
      setVehicles(safeVehicles.slice(0, 5)); // Show only last 5
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch vehicles"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Memoized recent vehicles
  const recentVehicles = useMemo(() => {
    return vehicles.slice(0, 5);
  }, [vehicles]);

  // Memoized vehicle count
  const vehicleCount = useMemo(() => {
    return recentVehicles.length;
  }, [recentVehicles]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Listen for vehicle added events
  useEffect(() => {
    const unsubscribe = EventBus.subscribe(EVENTS.VEHICLE_ADDED, () => {
      console.log(
        "Vehicle added event received, refreshing recent vehicles..."
      );
      fetchVehicles();
    });

    return () => {
      unsubscribe();
    };
  }, [fetchVehicles]);

  return (
    <Card className="bg-gray-800 border-gray-700">
      <RecentVehiclesHeader onRefresh={fetchVehicles} isLoading={loading} />

      <CardContent>
        {error ? (
          <Alert className="border-red-800 bg-red-900/20">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-400">
              {error}
            </AlertDescription>
          </Alert>
        ) : loading ? (
          <LoadingSkeleton />
        ) : vehicleCount === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {recentVehicles.map((vehicle) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

RecentVehicles.displayName = "RecentVehicles";

export default RecentVehicles;
