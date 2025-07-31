import { useState, useCallback, useMemo, useEffect } from "react";
import { format } from "date-fns";
import { VehicleResponse } from "@/lib/types";

interface UseDashboardOptimizedProps {
  vehicles: VehicleResponse[];
  vehicleInfo: any[];
}

export const useDashboardOptimized = ({
  vehicles,
  vehicleInfo,
}: UseDashboardOptimizedProps) => {
  // Memoized companies list
  const companies = useMemo(() => {
    const vehicleCompanies = vehicles
      .map((v) => v.companyName || v.customerLevel1 || "Unknown")
      .filter(Boolean);

    const vehicleInfoCompanies = vehicleInfo
      .map((v) => v.companyName || "Unknown")
      .filter(Boolean);

    const allCompanies = [...vehicleCompanies, ...vehicleInfoCompanies];
    return ["all", ...Array.from(new Set(allCompanies))];
  }, [vehicles, vehicleInfo]);

  // Memoized stats calculation
  const stats = useMemo(() => {
    const totalVehicles = vehicles.length;
    const uniqueDrivers = new Set(vehicles.map((v) => v.driverName)).size;
    const uniqueCompanies = new Set(
      vehicles.map((v) => v.companyName || v.customerLevel1 || "Unknown")
    ).size;
    const todayVehicles = vehicles.filter((v) => {
      const today = new Date();
      const vehicleDate = v.orderDate
        ? new Date(v.orderDate)
        : new Date(v.createdAt);
      return vehicleDate.toDateString() === today.toDateString();
    }).length;

    return { totalVehicles, uniqueDrivers, uniqueCompanies, todayVehicles };
  }, [vehicles]);

  // Memoized export handler
  const handleExport = useCallback((filteredVehicles: VehicleResponse[]) => {
    const headers = [
      "Queue Number",
      "Order Number",
      "Company Name",
      "Customer Name",
      "Order Date",
      "Truck Number",
      "Trailer Number",
      "Driver Name",
      "Driver Phone",
      "No. Drum",
      "Amount in (liter)",
      "Tank No",
      "Created At",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredVehicles.map((vehicle) =>
        [
          vehicle.queueNumber,
          vehicle.orderNumber,
          vehicle.companyName,
          vehicle.customerName,
          vehicle.orderDate,
          vehicle.truckNumber,
          vehicle.trailerNumber,
          vehicle.driverName,
          vehicle.driverPhoneNumber,
          vehicle.numberOfDrums,
          vehicle.amountInLiters,
          vehicle.tankNumber,
          vehicle.createdAt,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `anpr-data-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, []);

  // Memoized sample data loader
  const handleLoadSampleData = useCallback(
    async (fetchVehicles: () => void) => {
      try {
        const response = await fetch("/api/vehicle-info/seed", {
          method: "POST",
        });

        if (response.ok) {
          fetchVehicles();
          window.location.reload();
          return { success: true, message: "Sample data loaded successfully!" };
        } else {
          return { success: false, message: "Failed to load sample data" };
        }
      } catch (error) {
        console.error("Error loading sample data:", error);
        return { success: false, message: "Error loading sample data" };
      }
    },
    []
  );

  return {
    companies,
    stats,
    handleExport,
    handleLoadSampleData,
  };
};
