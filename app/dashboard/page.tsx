"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import VehicleInfoModal from "@/components/VehicleInfoModal";
import VehicleEntriesTable from "@/components/VehicleEntriesTable";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useDashboard } from "@/contexts/DashboardContext";
import { useVehicleInfo } from "@/contexts/VehicleInfoContext";
import { format, parseISO } from "date-fns";
import { VehicleResponse } from "@/lib/types";
import { Pagination } from "@/components/ui/pagination";
import { usePagination } from "@/hooks/usePagination";

export default function VehicleInfoTable() {
  const [selectedVehicle, setSelectedVehicle] =
    useState<VehicleResponse | null>(null);
  const {
    filteredVehicles,
    isLoading,
    vehicles,
    dateRange,
    searchTerm,
    companyFilter,
    sortBy,
    sortOrder,
  } = useDashboard();
  const {
    vehicleInfo,
    fetchVehicleInfo,
    isLoading: vehicleInfoLoading,
  } = useVehicleInfo();

  // Apply shared filters to vehicle info data
  const filteredVehicleInfo = vehicleInfo
    .filter((info) => {
      // Date range filter
      if (dateRange.from && dateRange.to) {
        const vehicleDate = new Date(info.createdAt);
        const isInRange =
          vehicleDate >= dateRange.from && vehicleDate <= dateRange.to;
        if (!isInRange) return false;
      }

      // Search term filter
      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase().trim();
        const matches =
          info.vehicleNumber.toLowerCase().includes(searchLower) ||
          info.driverName.toLowerCase().includes(searchLower) ||
          info.driverPhone.toLowerCase().includes(searchLower) ||
          info.trailerNumber.toLowerCase().includes(searchLower) ||
          info.customerName.toLowerCase().includes(searchLower) ||
          info.companyName.toLowerCase().includes(searchLower);
        if (!matches) return false;
      }

      // Company filter
      if (companyFilter !== "all") {
        if (info.companyName !== companyFilter) return false;
      }

      return true;
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy as keyof typeof a];
      let bValue: any = b[sortBy as keyof typeof b];

      if (sortBy === "createdAt") {
        aValue = new Date(aValue || new Date()).getTime();
        bValue = new Date(bValue || new Date()).getTime();
      } else {
        // For string fields, convert to lowercase for consistent sorting
        if (typeof aValue === "string") aValue = aValue.toLowerCase();
        if (typeof bValue === "string") bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Pagination for vehicle info
  const {
    currentData: paginatedVehicleInfo,
    currentPage: vehicleInfoPage,
    totalPages: vehicleInfoTotalPages,
    totalItems: vehicleInfoTotalItems,
    goToPage: goToVehicleInfoPage,
  } = usePagination({
    data: filteredVehicleInfo,
    itemsPerPage: 10,
  });

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Vehicle Information Table */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Vehicle Information
            </CardTitle>
            <CardDescription className="text-gray-400">
              Showing {vehicleInfoTotalItems} of {vehicleInfo.length} vehicle
              information records
            </CardDescription>
          </CardHeader>
          <CardContent>
            {vehicleInfoLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                <span className="ml-2 text-gray-300">
                  Loading vehicle information...
                </span>
              </div>
            ) : (
              <div className="w-full">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Vehicle #</TableHead>
                      <TableHead className="text-gray-300">Driver</TableHead>
                      <TableHead className="text-gray-300">
                        Driver Phone
                      </TableHead>
                      <TableHead className="text-gray-300">
                        Company Name
                      </TableHead>
                      <TableHead className="text-gray-300">
                        Customer Name
                      </TableHead>
                      <TableHead className="text-gray-300">Trailer #</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedVehicleInfo.map((info) => (
                      <TableRow
                        key={info._id}
                        className="border-gray-700 hover:bg-gray-700 cursor-pointer"
                        onClick={() => setSelectedVehicle(info as any)}
                      >
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="bg-green-600 text-white"
                          >
                            {info.vehicleNumber}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-white font-medium">
                            {info.driverName}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {info.driverPhone || "N/A"}
                        </TableCell>
                        <TableCell className="text-white">
                          {info.companyName || "N/A"}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {info.customerName || "N/A"}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {info.trailerNumber || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {!vehicleInfoLoading &&
              paginatedVehicleInfo.length === 0 &&
              vehicleInfo.length === 0 && (
                <div className="text-center py-8">
                  <div className="max-w-md mx-auto">
                    <div className="text-gray-400 mb-4">
                      <Edit className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium text-white mb-2">
                        No Vehicle Information Found
                      </h3>
                      <p className="text-gray-400 mb-4">
                        There is no vehicle information in the database yet.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            {!vehicleInfoLoading &&
              paginatedVehicleInfo.length === 0 &&
              vehicleInfo.length > 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-400">
                    No vehicle information found matching your current filters.
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Try adjusting your search criteria.
                  </p>
                </div>
              )}

            {/* Pagination */}
            {!vehicleInfoLoading && vehicleInfoTotalPages > 1 && (
              <Pagination
                currentPage={vehicleInfoPage}
                totalPages={vehicleInfoTotalPages}
                totalItems={vehicleInfoTotalItems}
                itemsPerPage={10}
                onPageChange={goToVehicleInfoPage}
                className="border-t border-gray-700"
              />
            )}
          </CardContent>
        </Card>

        {/* Vehicle Entries Table */}
        {/* <VehicleEntriesTable /> */}

        {/* Vehicle Info Modal */}
        <VehicleInfoModal
          vehicle={selectedVehicle}
          isOpen={!!selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      </div>
    </ProtectedRoute>
  );
}
