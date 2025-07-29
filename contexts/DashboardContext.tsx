"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { startOfDay, endOfDay, parseISO } from "date-fns";
import { DateRange } from "react-day-picker";

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

interface DashboardContextType {
  vehicles: Vehicle[];
  filteredVehicles: Vehicle[];
  isLoading: boolean;
  dateRange: DateRange;
  searchTerm: string;
  companyFilter: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  setDateRange: (range: DateRange) => void;
  setSearchTerm: (term: string) => void;
  setCompanyFilter: (filter: string) => void;
  setSortBy: (sort: string) => void;
  setSortOrder: (order: "asc" | "desc") => void;
  clearFilters: () => void;
  fetchVehicles: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfDay(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
    to: endOfDay(new Date()),
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const fetchVehicles = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching vehicles...");
      const response = await fetch("/api/vehicles");
      console.log("Response status:", response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched vehicles:", data);
      console.log("Vehicles array:", data.vehicles);
      console.log("Vehicles length:", data.vehicles?.length || 0);
      setVehicles(data.vehicles || []);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setVehicles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...vehicles];
    console.log("Applying filters to", vehicles.length, "vehicles");

    // Date range filter
    if (dateRange.from && dateRange.to) {
      console.log("Date range filter:", dateRange.from, "to", dateRange.to);
      filtered = filtered.filter((vehicle) => {
        const vehicleDate = vehicle.orderDate
          ? parseISO(vehicle.orderDate)
          : new Date(vehicle.createdAt);
        const isInRange =
          vehicleDate >= dateRange.from! && vehicleDate <= dateRange.to!;
        console.log(
          "Vehicle",
          vehicle.truckNumber,
          "date:",
          vehicleDate,
          "in range:",
          isInRange
        );
        return isInRange;
      });
      console.log("After date filter:", filtered.length, "vehicles");
    }

    // Search term filter
    if (searchTerm) {
      console.log("Search term filter:", searchTerm);
      filtered = filtered.filter(
        (vehicle) =>
          vehicle.truckNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          vehicle.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.orderNumber
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          false ||
          vehicle.companyName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          false
      );
      console.log("After search filter:", filtered.length, "vehicles");
    }

    // Company filter
    if (companyFilter !== "all") {
      console.log("Company filter:", companyFilter);
      filtered = filtered.filter(
        (vehicle) => vehicle.companyName === companyFilter
      );
      console.log("After company filter:", filtered.length, "vehicles");
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Vehicle];
      let bValue: any = b[sortBy as keyof Vehicle];

      if (sortBy === "orderDate" || sortBy === "createdAt") {
        aValue = new Date(aValue || new Date()).getTime();
        bValue = new Date(bValue || new Date()).getTime();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    console.log("Final filtered vehicles:", filtered.length);
    setFilteredVehicles(filtered);
  };

  const clearFilters = () => {
    setDateRange({
      from: startOfDay(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
      to: endOfDay(new Date()),
    });
    setSearchTerm("");
    setCompanyFilter("all");
    setSortBy("createdAt");
    setSortOrder("desc");
  };

  // Load vehicles on component mount
  useEffect(() => {
    fetchVehicles();
  }, []);

  // Apply filters when data or filters change
  useEffect(() => {
    applyFilters();
  }, [vehicles, dateRange, searchTerm, companyFilter, sortBy, sortOrder]);

  const value = {
    vehicles,
    filteredVehicles,
    isLoading,
    dateRange,
    searchTerm,
    companyFilter,
    sortBy,
    sortOrder,
    setDateRange,
    setSearchTerm,
    setCompanyFilter,
    setSortBy,
    setSortOrder,
    clearFilters,
    fetchVehicles,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
