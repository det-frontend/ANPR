"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  Filter,
  Download,
  BarChart3,
  TrendingUp,
  Users,
  Truck,
  User,
  X,
  Database,
  FileText,
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
import { DatePickerWithRange } from "@/components/DateRangePicker";
import AnalyticsChart from "@/components/AnalyticsChart";
import SummaryStats from "@/components/SummaryStats";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboard } from "@/contexts/DashboardContext";
import { useVehicleInfo } from "@/contexts/VehicleInfoContext";
import { format } from "date-fns";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const {
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
  } = useDashboard();

  const { vehicleInfo } = useVehicleInfo();

  const getUniqueCompanies = () => {
    // Get companies from both vehicle entries and vehicle info
    const vehicleCompanies = vehicles
      .map((v) => v.companyName || v.customerLevel1 || "Unknown")
      .filter(Boolean);

    const vehicleInfoCompanies = vehicleInfo
      .map((v) => v.companyName || "Unknown")
      .filter(Boolean);

    const allCompanies = [...vehicleCompanies, ...vehicleInfoCompanies];
    return ["all", ...Array.from(new Set(allCompanies))];
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
      const response = await fetch("/api/vehicle-info/seed", {
        method: "POST",
      });

      if (response.ok) {
        // Refresh both vehicle entries and vehicle info
        fetchVehicles();
        // Trigger a page refresh to update vehicle info context
        window.location.reload();
        alert("Sample data loaded successfully!");
      } else {
        alert("Failed to load sample data");
      }
    } catch (error) {
      console.error("Error loading sample data:", error);
      alert("Error loading sample data");
    }
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
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="w-full px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-3 sm:gap-4">
            {/* Logo and Title Section */}
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-start">
              <BarChart3 className="h-7 w-7 sm:h-8 sm:w-8 text-blue-400 flex-shrink-0" />
              <div className="text-center sm:text-left min-w-0">
                <h1 className="text-xl sm:text-xl md:text-2xl font-bold text-white truncate">
                  ANPR Dashboard
                </h1>
                <p className="text-gray-400 text-xs sm:text-sm truncate">
                  Vehicle Entry Analysis & Statistics
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

        {/* Analytics Chart */}
        <div className="mb-8">
          <AnalyticsChart vehicles={vehicles} days={7} />
        </div>

        {/* Summary Statistics */}
        <div className="mb-8">
          <SummaryStats vehicles={vehicles} />
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
                <DatePickerWithRange date={dateRange} setDate={setDateRange} />
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
                <Select value={companyFilter} onValueChange={setCompanyFilter}>
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
                onClick={clearFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
              >
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table Navigation */}
        <div className="mb-6">
          <div className="flex gap-4">
            <Button
              onClick={() => router.push("/dashboard")}
              variant={pathname === "/dashboard" ? "default" : "outline"}
              className={
                pathname === "/dashboard"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
              }
            >
              <Database className="h-4 w-4 mr-2" />
              Vehicle Info
            </Button>
            <Button
              onClick={() => router.push("/dashboard/entries")}
              variant={
                pathname === "/dashboard/entries" ? "default" : "outline"
              }
              className={
                pathname === "/dashboard/entries"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
              }
            >
              <FileText className="h-4 w-4 mr-2" />
              Vehicle Entries
            </Button>
          </div>
        </div>

        {/* Render children (table content) */}
        {children}
      </main>
    </div>
  );
}
