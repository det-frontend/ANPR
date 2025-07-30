"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  Database,
  Activity,
  LogOut,
  User,
  BarChart3,
  Calendar,
  Filter,
  Download,
  TrendingUp,
  Users,
  Truck,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DatePickerWithRange } from "@/components/DateRangePicker";
import VehicleInfoForm from "@/components/VehicleInfoForm";
import VehicleInfoDetailsModal from "@/components/VehicleInfoDetailsModal";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { addDays, format, startOfDay, endOfDay, parseISO } from "date-fns";
import { DateRange } from "react-day-picker";

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

export default function VehiclePage() {
  const [vehicles, setVehicles] = useState<VehicleInfo[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<VehicleInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfDay(new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)), // 1 year ago
    to: endOfDay(new Date()),
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleInfo | null>(
    null
  );
  const [newVehicle, setNewVehicle] = useState<VehicleInfo | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  const { user, logout } = useAuth();

  // Load vehicles on component mount
  useEffect(() => {
    console.log("Component mounted, fetching vehicles...");
    fetchVehicles();
  }, []);

  // Apply filters when data or filters change
  useEffect(() => {
    console.log("useEffect triggered - vehicles length:", vehicles.length);
    applyFilters();
  }, [vehicles, dateRange, searchTerm, companyFilter, sortBy, sortOrder]);

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const fetchVehicles = async () => {
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
      console.log("Vehicles array:", data.vehicles);
      console.log("Vehicles length:", data.vehicles?.length || 0);

      if (data.vehicles && Array.isArray(data.vehicles)) {
        console.log("Setting vehicles:", data.vehicles);
        setVehicles(data.vehicles);
      } else {
        console.log("No vehicles array found, setting empty array");
        setVehicles([]);
      }
    } catch (error) {
      console.error("Error fetching vehicle info:", error);
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
        const vehicleDate = new Date(vehicle.createdAt);
        const isInRange =
          vehicleDate >= dateRange.from! && vehicleDate <= dateRange.to!;
        return isInRange;
      });
      console.log("After date filter:", filtered.length, "vehicles");
    }

    // Search term filter
    if (searchTerm.trim()) {
      console.log("Search term filter:", searchTerm);
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (vehicle) =>
          vehicle.vehicleNumber.toLowerCase().includes(searchLower) ||
          vehicle.driverName.toLowerCase().includes(searchLower) ||
          vehicle.driverPhone.toLowerCase().includes(searchLower) ||
          vehicle.trailerNumber.toLowerCase().includes(searchLower) ||
          vehicle.customerName.toLowerCase().includes(searchLower) ||
          vehicle.companyName.toLowerCase().includes(searchLower)
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
      let aValue: any = a[sortBy as keyof VehicleInfo];
      let bValue: any = b[sortBy as keyof VehicleInfo];

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

    console.log("Final filtered vehicles:", filtered.length);
    setFilteredVehicles(filtered);
  };

  const getUniqueCompanies = () => {
    const companies = vehicles
      .map((v) => v.companyName || "Unknown")
      .filter(Boolean);
    return ["all", ...Array.from(new Set(companies))];
  };

  const getStats = () => {
    const totalVehicles = filteredVehicles.length;
    const uniqueDrivers = new Set(filteredVehicles.map((v) => v.driverName))
      .size;
    const uniqueCompanies = new Set(
      filteredVehicles.map((v) => v.companyName || "Unknown")
    ).size;
    const todayVehicles = filteredVehicles.filter((v) => {
      const today = new Date();
      const vehicleDate = new Date(v.createdAt);
      return vehicleDate.toDateString() === today.toDateString();
    }).length;

    return { totalVehicles, uniqueDrivers, uniqueCompanies, todayVehicles };
  };

  const clearFilters = () => {
    setDateRange({
      from: startOfDay(new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)),
      to: endOfDay(new Date()),
    });
    setSearchTerm("");
    setCompanyFilter("all");
    setSortBy("createdAt");
    setSortOrder("desc");
  };

  const exportToCSV = () => {
    const headers = [
      "Vehicle Number",
      "Driver Name",
      "Driver Phone",
      "Trailer Number",
      "Customer Name",
      "Company Name",
      "Created At",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredVehicles.map((vehicle) =>
        [
          vehicle.vehicleNumber,
          vehicle.driverName,
          vehicle.driverPhone,
          vehicle.trailerNumber,
          vehicle.customerName,
          vehicle.companyName,
          vehicle.createdAt,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vehicle-info-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleVehicleAdded = (newVehicle: VehicleInfo) => {
    setNewVehicle(newVehicle);
    // Refresh the vehicles list
    fetchVehicles();
  };

  const resetView = () => {
    setNewVehicle(null);
  };

  const loadSampleData = async () => {
    try {
      const response = await fetch("/api/vehicle-info/seed", {
        method: "POST",
      });

      if (response.ok) {
        // Refresh the vehicles list
        fetchVehicles();
        alert("Sample data loaded successfully!");
      } else {
        alert("Failed to load sample data");
      }
    } catch (error) {
      console.error("Error loading sample data:", error);
      alert("Error loading sample data");
    }
  };

  const clearAllData = async () => {
    if (
      confirm(
        "Are you sure you want to clear all vehicle data? This action cannot be undone."
      )
    ) {
      try {
        const response = await fetch("/api/vehicle-info/seed", {
          method: "DELETE",
        });

        if (response.ok) {
          // Refresh the vehicles list
          fetchVehicles();
          alert("All data cleared successfully!");
        } else {
          alert("Failed to clear data");
        }
      } catch (error) {
        console.error("Error clearing data:", error);
        alert("Error clearing data");
      }
    }
  };

  const stats = getStats();

  return (
    <ProtectedRoute allowedRoles={["manager", "admin"]}>
      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <header className="bg-gray-800 shadow-lg border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-3 sm:gap-4">
              {/* Logo and Title Section */}
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-start">
                <Shield className="h-7 w-7 sm:h-8 sm:w-8 text-blue-400 flex-shrink-0" />
                <div className="text-center sm:text-left min-w-0">
                  <h1 className="text-xl sm:text-xl md:text-2xl font-bold text-white truncate">
                    Vehicle Information Management
                  </h1>
                  <p className="text-gray-400 text-xs sm:text-sm truncate">
                    Vehicle Information Registration and Database
                  </p>
                </div>
              </div>

              {/* User Info and Actions Section */}
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
                {/* User Info */}
                <div className="hidden sm:flex items-center justify-center sm:justify-end w-full sm:w-auto">
                  <div className="flex items-center gap-2 text-gray-300 bg-gray-700/50 px-3 py-2 rounded-lg">
                    <User className="h-4 w-4 text-blue-400" />
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1">
                      <span className="text-sm font-medium text-white">
                        {user?.name}
                      </span>
                      <span className="text-xs text-gray-400 sm:text-sm">
                        ({user?.role})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
                  <Button
                    onClick={exportToCSV}
                    className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm px-3 py-2"
                  >
                    <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Export CSV</span>
                    <span className="sm:hidden">Export</span>
                  </Button>
                  {/* <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 text-xs sm:text-sm px-3 py-2"
                  >
                    <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Logout</span>
                    <span className="sm:hidden">Logout</span>
                  </Button> */}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Stats Cards */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Total Vehicles
                </CardTitle>
                <Truck className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {stats.totalVehicles}
                </div>
                <p className="text-xs text-gray-400">In selected period</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Unique Drivers
                </CardTitle>
                <Users className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {stats.uniqueDrivers}
                </div>
                <p className="text-xs text-gray-400">Active drivers</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Companies
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {stats.uniqueCompanies}
                </div>
                <p className="text-xs text-gray-400">Unique companies</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Today&apos;s Entries
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {stats.todayVehicles}
                </div>
                <p className="text-xs text-gray-400">Today&apos;s vehicles</p>
              </CardContent>
            </Card>
          </div> */}

          {/* New Vehicle Registration */}
          <div className="mb-8">
            <VehicleInfoForm onVehicleAdded={handleVehicleAdded} />
            {newVehicle && (
              <div className="mt-4 space-y-4">
                <div className="bg-green-900 border border-green-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-green-200 mb-2">
                    Vehicle Registered Successfully!
                  </h3>
                  <p className="text-green-300">
                    The vehicle has been added to the system.
                  </p>
                </div>
                <button
                  onClick={resetView}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Register Another Vehicle
                </button>
              </div>
            )}
          </div>

          {/* Filters */}
          <Card className="bg-gray-800 border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Date Range</Label>
                  <DatePickerWithRange
                    date={dateRange}
                    setDate={setDateRange}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Search</Label>
                  <Input
                    placeholder="Search vehicles, drivers, phones, customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Company</Label>
                  <Select
                    value={companyFilter}
                    onValueChange={setCompanyFilter}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {getUniqueCompanies().map((company) => (
                        <SelectItem
                          key={company}
                          value={company}
                          className="text-white"
                        >
                          {company === "all" ? "All Companies" : company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="createdAt" className="text-white">
                        Created Date
                      </SelectItem>
                      <SelectItem value="vehicleNumber" className="text-white">
                        Vehicle Number
                      </SelectItem>
                      <SelectItem value="driverName" className="text-white">
                        Driver Name
                      </SelectItem>
                      <SelectItem value="driverPhone" className="text-white">
                        Driver Phone
                      </SelectItem>
                      <SelectItem value="companyName" className="text-white">
                        Company
                      </SelectItem>
                      <SelectItem value="customerName" className="text-white">
                        Customer
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={clearFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Data Table */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                Vehicle Information Database
              </CardTitle>
              <CardDescription className="text-gray-400">
                Showing {filteredVehicles.length} of {vehicles.length} vehicle
                records
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                  <span className="ml-2 text-gray-300">
                    Loading vehicles...
                  </span>
                </div>
              ) : (
                <div className="w-full">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-300">
                          Vehicle #
                        </TableHead>
                        <TableHead className="text-gray-300">
                          Driver Name
                        </TableHead>
                        <TableHead className="text-gray-300">
                          Driver Phone
                        </TableHead>
                        <TableHead className="text-gray-300">
                          Trailer #
                        </TableHead>
                        <TableHead className="text-gray-300">
                          Customer
                        </TableHead>
                        <TableHead className="text-gray-300">Company</TableHead>
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
                              className="bg-green-600 text-white"
                            >
                              {vehicle.vehicleNumber}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white font-medium">
                            {vehicle.driverName}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="text-white border-gray-500"
                            >
                              {vehicle.driverPhone}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {vehicle.trailerNumber}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {vehicle.customerName}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {vehicle.companyName}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {format(
                              parseISO(vehicle.createdAt),
                              "MMM dd, HH:mm"
                            )}
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
                        <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium text-white mb-2">
                          No Vehicles Found
                        </h3>
                        <p className="text-gray-400 mb-4">
                          There are no vehicles in the database yet. Register a
                          new vehicle to get started.
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
        </main>

        {/* Vehicle Details Modal */}
        <VehicleInfoDetailsModal
          vehicle={selectedVehicle}
          isOpen={!!selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      </div>
    </ProtectedRoute>
  );
}
