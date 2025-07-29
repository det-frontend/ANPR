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
import { FileText } from "lucide-react";
import VehicleEntriesModal from "@/components/VehicleEntriesModal";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useDashboard } from "@/contexts/DashboardContext";
import { format, parseISO } from "date-fns";

export default function VehicleEntriesTable() {
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const { filteredVehicles, isLoading, vehicles } = useDashboard();

  return (
    <ProtectedRoute>
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Vehicle Entries
          </CardTitle>
          <CardDescription className="text-gray-400">
            Showing {filteredVehicles.length} of {vehicles.length} vehicles
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              <span className="ml-2 text-gray-300">Loading vehicles...</span>
            </div>
          ) : (
            <div className="w-full">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Queue #</TableHead>
                    <TableHead className="text-gray-300">Order #</TableHead>
                    <TableHead className="text-gray-300">
                      Company Name
                    </TableHead>
                    <TableHead className="text-gray-300">
                      Customer Name
                    </TableHead>
                    <TableHead className="text-gray-300">Order Date</TableHead>
                    <TableHead className="text-gray-300">Truck #</TableHead>
                    <TableHead className="text-gray-300">Driver</TableHead>
                    <TableHead className="text-gray-300">Trailer #</TableHead>
                    <TableHead className="text-gray-300">Drums</TableHead>
                    <TableHead className="text-gray-300">Amount (L)</TableHead>
                    <TableHead className="text-gray-300">Tank</TableHead>
                    <TableHead className="text-gray-300">Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.map((vehicle) => (
                    <TableRow
                      key={vehicle._id}
                      className="border-gray-700 hover:bg-gray-700 cursor-pointer"
                      onClick={() => setSelectedVehicle(vehicle)}
                    >
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-blue-600 text-white"
                        >
                          {vehicle.queueNumber || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white font-medium">
                        {vehicle.orderNumber || "N/A"}
                      </TableCell>
                      <TableCell className="text-white">
                        {vehicle.companyName || vehicle.customerLevel1 || "N/A"}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {vehicle.customerName ||
                          vehicle.customerLevel2 ||
                          "N/A"}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {vehicle.orderDate
                          ? format(parseISO(vehicle.orderDate), "MMM dd, yyyy")
                          : format(parseISO(vehicle.createdAt), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-green-600 text-white"
                        >
                          {vehicle.truckNumber}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-white font-medium">
                          {vehicle.driverName}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {vehicle.trailerNumber || "-"}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {vehicle.numberOfDrums || vehicle.dam_capacity || "N/A"}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {vehicle.amountInLiters
                          ? vehicle.amountInLiters.toLocaleString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-white border-gray-500"
                        >
                          {vehicle.tankNumber
                            ? `Tank ${vehicle.tankNumber}`
                            : "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {format(parseISO(vehicle.createdAt), "MMM dd, HH:mm")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {!isLoading &&
            filteredVehicles.length === 0 &&
            vehicles.length === 0 && (
              <div className="text-center py-8">
                <div className="max-w-md mx-auto">
                  <div className="text-gray-400 mb-4">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      No Vehicles Found
                    </h3>
                    <p className="text-gray-400 mb-4">
                      There are no vehicles in the database yet.
                    </p>
                  </div>
                </div>
              </div>
            )}

          {!isLoading &&
            filteredVehicles.length === 0 &&
            vehicles.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">
                  No vehicles found matching your current filters.
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Try adjusting your search criteria or date range.
                </p>
              </div>
            )}
        </CardContent>
      </Card>

      {/* Vehicle Entries Modal */}
      <VehicleEntriesModal
        vehicle={selectedVehicle}
        isOpen={!!selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
      />
    </ProtectedRoute>
  );
}
