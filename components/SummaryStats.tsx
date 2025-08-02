"use client";

import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Building, Calendar, Clock, TrendingUp, Activity } from "lucide-react";

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

interface StatsData {
  totalVehicles: number;
  uniqueDrivers: number;
  uniqueCustomers: number;
  uniqueTrucks: number;
  topCustomers: Array<{ customer: string; count: number }>;
  topDrivers: Array<{ driver: string; count: number }>;
  recentVehicles: number;
}

// Memoized stat item component
const StatItem = React.memo<{
  label: string;
  value: number;
  icon?: React.ReactNode;
  color?: string;
}>(({ label, value, icon, color = "text-white" }) => (
  <div className="text-center">
    <div className={`text-2xl font-bold ${color} flex items-center justify-center gap-1`}>
      {icon}
      {value}
    </div>
    <div className="text-sm text-gray-400">{label}</div>
  </div>
));

StatItem.displayName = "StatItem";

// Memoized ranking item component
const RankingItem = React.memo<{
  rank: number;
  name: string;
  count: number;
}>(({ rank, name, count }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <Badge variant="outline" className="bg-gray-700 text-white">
        #{rank}
      </Badge>
      <span className="text-white font-medium truncate">
        {name}
      </span>
    </div>
    <span className="text-gray-300">{count} vehicles</span>
  </div>
));

RankingItem.displayName = "RankingItem";

// Memoized top customers card
const TopCustomersCard = React.memo<{ topCustomers: Array<{ customer: string; count: number }> }>(
  ({ topCustomers }) => (
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
          {topCustomers.map((customer, index) => (
            <RankingItem
              key={customer.customer}
              rank={index + 1}
              name={customer.customer}
              count={customer.count}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
);

TopCustomersCard.displayName = "TopCustomersCard";

// Memoized top drivers card
const TopDriversCard = React.memo<{ topDrivers: Array<{ driver: string; count: number }> }>(
  ({ topDrivers }) => (
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
          {topDrivers.map((driver, index) => (
            <RankingItem
              key={driver.driver}
              rank={index + 1}
              name={driver.driver}
              count={driver.count}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
);

TopDriversCard.displayName = "TopDriversCard";

// Memoized system overview card
const SystemOverviewCard = React.memo<{
  totalVehicles: number;
  uniqueTrucks: number;
  uniqueDrivers: number;
  uniqueCustomers: number;
}>(({ totalVehicles, uniqueTrucks, uniqueDrivers, uniqueCustomers }) => (
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
        <StatItem
          label="Total Vehicles"
          value={totalVehicles}
          icon={<Activity className="h-4 w-4" />}
          color="text-white"
        />
        <StatItem
          label="Unique Trucks"
          value={uniqueTrucks}
          icon={<Building className="h-4 w-4" />}
          color="text-blue-400"
        />
        <StatItem
          label="Active Drivers"
          value={uniqueDrivers}
          icon={<Users className="h-4 w-4" />}
          color="text-green-400"
        />
        <StatItem
          label="Companies"
          value={uniqueCustomers}
          icon={<Building className="h-4 w-4" />}
          color="text-purple-400"
        />
      </div>
    </CardContent>
  </Card>
));

SystemOverviewCard.displayName = "SystemOverviewCard";

// Memoized recent activity card
const RecentActivityCard = React.memo<{ recentVehicles: number }>(({ recentVehicles }) => (
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
        <div className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <TrendingUp className="h-6 w-6" />
          {recentVehicles}
        </div>
        <div className="text-sm text-gray-400">
          New vehicles in last 24 hours
        </div>
        <div className="mt-4 text-xs text-gray-500">
          Average: {Math.round((recentVehicles / 24) * 10) / 10} per hour
        </div>
      </div>
    </CardContent>
  </Card>
));

RecentActivityCard.displayName = "RecentActivityCard";

const SummaryStats = React.memo<SummaryStatsProps>(({ vehicles }) => {
  // Memoized stats calculation
  const stats = useMemo((): StatsData => {
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
  }, [vehicles]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <TopCustomersCard topCustomers={stats.topCustomers} />
      <TopDriversCard topDrivers={stats.topDrivers} />
      <SystemOverviewCard
        totalVehicles={stats.totalVehicles}
        uniqueTrucks={stats.uniqueTrucks}
        uniqueDrivers={stats.uniqueDrivers}
        uniqueCustomers={stats.uniqueCustomers}
      />
      <RecentActivityCard recentVehicles={stats.recentVehicles} />
    </div>
  );
});

SummaryStats.displayName = "SummaryStats";

export default SummaryStats;
