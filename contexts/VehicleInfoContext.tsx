"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { VehicleInfo } from "@/lib/vehicle-info-db";
import { EventBus, EVENTS } from "@/lib/events";

interface VehicleInfoResponse {
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

interface VehicleInfoContextType {
  vehicleInfo: VehicleInfoResponse[];
  filteredVehicleInfo: VehicleInfoResponse[];
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  clearFilters: () => void;
  fetchVehicleInfo: () => Promise<void>;
}

const VehicleInfoContext = createContext<VehicleInfoContextType | undefined>(
  undefined
);

export function VehicleInfoProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfoResponse[]>([]);
  const [filteredVehicleInfo, setFilteredVehicleInfo] = useState<
    VehicleInfoResponse[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchVehicleInfo = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching vehicle info...");
      const response = await fetch("/api/vehicle-info");
      console.log("Response status:", response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched vehicle info:", data);
      console.log("Vehicle info array:", data.vehicles);
      console.log("Vehicle info length:", data.vehicles?.length || 0);
      setVehicleInfo(data.vehicles || []);
    } catch (error) {
      console.error("Error fetching vehicle info:", error);
      setVehicleInfo([]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...vehicleInfo];
    console.log(
      "Applying filters to",
      vehicleInfo.length,
      "vehicle info records"
    );

    // Search term filter
    if (searchTerm) {
      console.log("Search term filter:", searchTerm);
      filtered = filtered.filter(
        (info) =>
          info.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          info.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          info.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          info.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log(
        "After search filter:",
        filtered.length,
        "vehicle info records"
      );
    }

    console.log("Final filtered vehicle info:", filtered.length);
    setFilteredVehicleInfo(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
  };

  // Load vehicle info on component mount
  useEffect(() => {
    fetchVehicleInfo();
  }, []);

  // Listen for vehicle info added events
  useEffect(() => {
    const unsubscribe = EventBus.subscribe(EVENTS.VEHICLE_INFO_ADDED, () => {
      console.log(
        "Vehicle info added event received, refreshing vehicle info..."
      );
      fetchVehicleInfo();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Apply filters when data or filters change
  useEffect(() => {
    applyFilters();
  }, [vehicleInfo, searchTerm]);

  const value = {
    vehicleInfo,
    filteredVehicleInfo,
    isLoading,
    searchTerm,
    setSearchTerm,
    clearFilters,
    fetchVehicleInfo,
  };

  return (
    <VehicleInfoContext.Provider value={value}>
      {children}
    </VehicleInfoContext.Provider>
  );
}

export function useVehicleInfo() {
  const context = useContext(VehicleInfoContext);
  if (context === undefined) {
    throw new Error("useVehicleInfo must be used within a VehicleInfoProvider");
  }
  return context;
}
