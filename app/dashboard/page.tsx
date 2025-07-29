"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Filter,
  Download,
  BarChart3,
  TrendingUp,
  Users,
  Truck,
  LogOut,
  User,
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
import AnalyticsChart from "@/components/AnalyticsChart";
import SummaryStats from "@/components/SummaryStats";
import VehicleDetailsModal from "@/components/VehicleDetailsModal";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { addDays, format, startOfDay, endOfDay, parseISO } from "date-fns";
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
  // Legacy fields for backward compatibility
  customerLevel1?: string;
  customerLevel2?: string;
  dam_capacity?: string;
}

export default function Dashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfDay(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)), // 30 days ago
    to: endOfDay(new Date()),
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const { user, logout } = useAuth();

  // Load vehicles on component mount
  useEffect(() => {
    fetchVehicles();
  }, []);

  // Apply filters when data or filters change
  useEffect(() => {
    applyFilters();
  }, [vehicles, dateRange, searchTerm, companyFilter, sortBy, sortOrder]);

  const handleLogout = async () => {
    await logout();
  };

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

  const getUniqueCompanies = () => {
    const companies = vehicles
      .map((v) => v.companyName || v.customerLevel1 || "Unknown")
      .filter(Boolean);
    return ["all", ...Array.from(new Set(companies))];
  };

  const getStats = () => {
    const totalVehicles = filteredVehicles.length;
    const uniqueDrivers = new Set(filteredVehicles.map((v) => v.driverName))
      .size;
    const uniqueCompanies = new Set(
      filteredVehicles.map(
        (v) => v.companyName || v.customerLevel1 || "Unknown"
      )
    ).size;
    const todayVehicles = filteredVehicles.filter((v) => {
      const today = new Date();
      const vehicleDate = v.orderDate
        ? new Date(v.orderDate)
        : new Date(v.createdAt);
      return vehicleDate.toDateString() === today.toDateString();
    }).length;

    return { totalVehicles, uniqueDrivers, uniqueCompanies, todayVehicles };
  };

  const loadSampleData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/seed-data", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Sample data loaded:", data);

      // Refresh the vehicles list
      await fetchVehicles();

      alert(
        `Successfully loaded ${data.vehicles?.length || 0} sample vehicles!`
      );
    } catch (error) {
      console.error("Error loading sample data:", error);
      alert("Error loading sample data. Please try again.");
    } finally {
      setIsLoading(false);
    }
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

  const exportToCSV = () => {
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
  };

  const stats = getStats();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <header className="bg-gray-800 shadow-lg border-b border-gray-700">
          <div className="w-full px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-blue-400" />
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    ANPR Analysis Dashboard
                  </h1>
                  <p className="text-gray-400 text-sm">
                    Vehicle Entry Analysis & Statistics
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* User Info */}
                <div className="flex items-center gap-2 text-gray-300">
                  <User className="h-4 w-4" />
                  <span className="text-sm">
                    {user?.name} ({user?.role})
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {/* <Button
                    onClick={loadSampleData}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                  >
                    Load Sample Data
                  </Button>
                  <Button
                    onClick={fetchVehicles}
                    className="bg-gray-600 hover:bg-gray-700"
                    disabled={isLoading}
                  >
                    Refresh
                  </Button>
                  <Button
                    onClick={clearFilters}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Clear Filters
                  </Button> */}
                  <Button
                    onClick={exportToCSV}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="w-full px-4 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                    placeholder="Search trucks, drivers, orders..."
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
                      <SelectItem value="orderDate" className="text-white">
                        Order Date
                      </SelectItem>
                      <SelectItem value="truckNumber" className="text-white">
                        Truck Number
                      </SelectItem>
                      <SelectItem value="driverName" className="text-white">
                        Driver Name
                      </SelectItem>
                      <SelectItem value="companyName" className="text-white">
                        Company
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  variant={sortOrder === "desc" ? "default" : "outline"}
                  onClick={() => setSortOrder("desc")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Descending
                </Button>
                <Button
                  variant={sortOrder === "asc" ? "default" : "outline"}
                  onClick={() => setSortOrder("asc")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Ascending
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Chart */}
          <div className="mb-8">
            <AnalyticsChart vehicles={vehicles} days={7} />
          </div>

          {/* Summary Statistics */}
          <div className="mb-8">
            <SummaryStats vehicles={vehicles} />
          </div>

          {/* Data Table */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Vehicle Entries</CardTitle>
              <CardDescription className="text-gray-400">
                Showing {filteredVehicles.length} of {vehicles.length} vehicles
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
                        <TableHead className="text-gray-300">Queue #</TableHead>
                        <TableHead className="text-gray-300">Order #</TableHead>
                        <TableHead className="text-gray-300">Company</TableHead>
                        <TableHead className="text-gray-300">
                          Customer
                        </TableHead>
                        <TableHead className="text-gray-300">
                          Order Date
                        </TableHead>
                        <TableHead className="text-gray-300">Truck #</TableHead>
                        <TableHead className="text-gray-300">Driver</TableHead>
                        <TableHead className="text-gray-300">
                          Trailer #
                        </TableHead>
                        <TableHead className="text-gray-300">Drums</TableHead>
                        <TableHead className="text-gray-300">
                          Amount (L)
                        </TableHead>
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
                          <TableCell>
                            <div>
                              <div className="text-white">
                                {vehicle.companyName ||
                                  vehicle.customerLevel1 ||
                                  "N/A"}
                              </div>
                              <div className="text-gray-400 text-sm">
                                {vehicle.customerName ||
                                  vehicle.customerLevel2 ||
                                  "N/A"}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {vehicle.customerName ||
                              vehicle.customerLevel2 ||
                              "N/A"}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {vehicle.orderDate
                              ? format(
                                  parseISO(vehicle.orderDate),
                                  "MMM dd, yyyy"
                                )
                              : format(
                                  parseISO(vehicle.createdAt),
                                  "MMM dd, yyyy"
                                )}
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
                            <div>
                              <div className="text-white">
                                {vehicle.driverName}
                              </div>
                              <div className="text-gray-400 text-sm">
                                {vehicle.driverPhoneNumber || "N/A"}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {vehicle.trailerNumber || "-"}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {vehicle.numberOfDrums ||
                              vehicle.dam_capacity ||
                              "N/A"}
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
                          There are no vehicles in the database yet. Load some
                          sample data to get started.
                        </p>
                        <Button
                          onClick={loadSampleData}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Load Sample Data
                        </Button>
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
        <VehicleDetailsModal
          vehicle={selectedVehicle}
          isOpen={!!selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      </div>
    </ProtectedRoute>
  );
}
