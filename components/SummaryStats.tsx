"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Building, Calendar, Clock } from "lucide-react";

interface Vehicle {
  _id: string;
  orderNumber?: string;
  companyName?: string;
  customerName?: string;
  customerLevel1?: string; // Legacy field
  customerLevel2?: string; // Legacy field
  orderDate?: string;
  queueNumber?: string;
  truckNumber: string;
  trailerNumber?: string;
  driverName: string;
  driverPhoneNumber?: string;
  numberOfDrums?: number;
  amountInLiters?: number;
  tankNumber?: number;
  dam_capacity?: string; // Legacy field
  createdAt: string;
  updatedAt?: string;
}

interface SummaryStatsProps {
  vehicles: Vehicle[];
}

export default function SummaryStats({ vehicles }: SummaryStatsProps) {
  const getStats = () => {
    const totalVehicles = vehicles.length;
    const uniqueDrivers = new Set(vehicles.map((v) => v.driverName)).size;
    const uniqueCustomers = new Set(
      vehicles.map((v) => v.companyName || v.customerLevel1 || "Unknown")
    ).size;
    const uniqueTrucks = new Set(vehicles.map((v) => v.truckNumber)).size;

    // Top customers
    const customerCounts = vehicles.reduce((acc, vehicle) => {
      const customerName =
        vehicle.companyName || vehicle.customerLevel1 || "Unknown";
      acc[customerName] = (acc[customerName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topCustomers = Object.entries(customerCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([customer, count]) => ({ customer, count }));

    // Top drivers
    const driverCounts = vehicles.reduce((acc, vehicle) => {
      acc[vehicle.driverName] = (acc[vehicle.driverName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topDrivers = Object.entries(driverCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([driver, count]) => ({ driver, count }));

    // Recent activity (last 24 hours)
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentVehicles = vehicles.filter(
      (v) => new Date(v.createdAt) > last24Hours
    ).length;

    return {
      totalVehicles,
      uniqueDrivers,
      uniqueCustomers,
      uniqueTrucks,
      topCustomers,
      topDrivers,
      recentVehicles,
    };
  };

  const stats = getStats();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Customers */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Building className="h-5 w-5 text-purple-400" />
            Top Companies
          </CardTitle>
          <CardDescription className="text-gray-400">
            Most active companies by vehicle count
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.topCustomers.map((customer, index) => (
              <div
                key={customer.customer}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-gray-700 text-white">
                    #{index + 1}
                  </Badge>
                  <span className="text-white font-medium">
                    {customer.customer}
                  </span>
                </div>
                <span className="text-gray-300">{customer.count} vehicles</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Drivers */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-green-400" />
            Top Drivers
          </CardTitle>
          <CardDescription className="text-gray-400">
            Most active drivers by vehicle count
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.topDrivers.map((driver, index) => (
              <div
                key={driver.driver}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-gray-700 text-white">
                    #{index + 1}
                  </Badge>
                  <span className="text-white font-medium">
                    {driver.driver}
                  </span>
                </div>
                <span className="text-gray-300">{driver.count} vehicles</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Overview */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-400" />
            System Overview
          </CardTitle>
          <CardDescription className="text-gray-400">
            Key metrics and statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {stats.totalVehicles}
              </div>
              <div className="text-sm text-gray-400">Total Vehicles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {stats.uniqueTrucks}
              </div>
              <div className="text-sm text-gray-400">Unique Trucks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {stats.uniqueDrivers}
              </div>
              <div className="text-sm text-gray-400">Active Drivers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {stats.uniqueCustomers}
              </div>
              <div className="text-sm text-gray-400">Companies</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-400" />
            Recent Activity
          </CardTitle>
          <CardDescription className="text-gray-400">
            Last 24 hours activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {stats.recentVehicles}
            </div>
            <div className="text-sm text-gray-400">
              New vehicles in last 24 hours
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Average: {Math.round((stats.recentVehicles / 24) * 10) / 10} per
              hour
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
