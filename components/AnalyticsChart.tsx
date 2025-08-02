"use client";

import React, { useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format, subDays, startOfDay } from "date-fns";
import { BarChart3, TrendingUp, Calendar, Activity } from "lucide-react";

interface Vehicle {
  _id: string;
  orderDate?: string;
  companyName?: string;
  customerName?: string;
  customerLevel1?: string; // Legacy field
  driverName: string;
  createdAt: string;
}

interface AnalyticsChartProps {
  vehicles: Vehicle[];
  days?: number;
}

interface ChartDataPoint {
  date: string;
  vehicles: number;
  fullDate: Date;
}

// Memoized chart bar component
const ChartBar = React.memo<{
  day: ChartDataPoint;
  maxVehicles: number;
  index: number;
}>(({ day, maxVehicles, index }) => (
  <div className="flex items-center space-x-4">
    <span className="text-gray-300 w-16 text-sm font-medium">
      {day.date}
    </span>
    <div className="flex-1 bg-gray-700 rounded-lg h-8 relative overflow-hidden">
      {day.vehicles > 0 && (
        <div
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-lg transition-all duration-500 ease-out"
          style={{
            width: `${(day.vehicles / maxVehicles) * 100}%`,
          }}
        >
          <div className="flex items-center justify-center h-full">
            <span className="text-white text-xs font-semibold">
              {day.vehicles}
            </span>
          </div>
        </div>
      )}
    </div>
    <span className="text-gray-400 w-8 text-right text-sm">
      {day.vehicles}
    </span>
  </div>
));

ChartBar.displayName = "ChartBar";

// Memoized summary stat component
const SummaryStat = React.memo<{
  value: number | string;
  label: string;
  icon: React.ReactNode;
  color: string;
}>(({ value, label, icon, color }) => (
  <div className="text-center">
    <div className={`text-2xl font-bold ${color} flex items-center justify-center gap-2`}>
      {icon}
      {value}
    </div>
    <div className="text-xs text-gray-400">{label}</div>
  </div>
));

SummaryStat.displayName = "SummaryStat";

// Memoized empty state component
const EmptyState = React.memo<{ days: number }>(({ days }) => (
  <div className="flex items-center justify-center h-[300px] text-gray-400">
    <div className="text-center">
      <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-500" />
      <p className="text-lg mb-2">
        No vehicle entries in the last {days} days
      </p>
      <p className="text-sm">
        Try loading sample data or adjusting the date range
      </p>
    </div>
  </div>
));

EmptyState.displayName = "EmptyState";

const AnalyticsChart = React.memo<AnalyticsChartProps>(({
  vehicles,
  days = 7,
}) => {
  // Memoized chart data generation
  const chartData = useMemo(() => {
    const data: ChartDataPoint[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(today, i);
      const dayStart = startOfDay(date);
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

      const dayVehicles = vehicles.filter((vehicle) => {
        const vehicleDate = new Date(vehicle.createdAt);
        return vehicleDate >= dayStart && vehicleDate < dayEnd;
      });

      data.push({
        date: format(date, "MMM dd"),
        vehicles: dayVehicles.length,
        fullDate: date,
      });
    }

    return data;
  }, [vehicles, days]);

  // Memoized calculations
  const { totalVehicles, maxVehicles, dailyAverage, activeDays } = useMemo(() => {
    const total = chartData.reduce((sum, day) => sum + day.vehicles, 0);
    const max = Math.max(...chartData.map((d) => d.vehicles), 1);
    const average = Math.round((total / days) * 10) / 10;
    const active = chartData.filter((d) => d.vehicles > 0).length;

    return {
      totalVehicles: total,
      maxVehicles: max,
      dailyAverage: average,
      activeDays: active,
    };
  }, [chartData, days]);

  // Memoized chart header
  const chartHeader = useMemo(() => (
    <CardHeader>
      <CardTitle className="text-white flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-blue-400" />
        Vehicle Entries - Last {days} Days
      </CardTitle>
      <CardDescription className="text-gray-400">
        Daily vehicle entry trends ({totalVehicles} total vehicles)
      </CardDescription>
    </CardHeader>
  ), [days, totalVehicles]);

  // Memoized summary stats
  const summaryStats = useMemo(() => (
    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
      <SummaryStat
        value={totalVehicles}
        label="Total Entries"
        icon={<Activity className="h-4 w-4" />}
        color="text-blue-400"
      />
      <SummaryStat
        value={dailyAverage}
        label="Daily Average"
        icon={<TrendingUp className="h-4 w-4" />}
        color="text-green-400"
      />
      <SummaryStat
        value={activeDays}
        label="Active Days"
        icon={<Calendar className="h-4 w-4" />}
        color="text-yellow-400"
      />
    </div>
  ), [totalVehicles, dailyAverage, activeDays]);

  return (
    <Card className="bg-gray-800 border-gray-700">
      {chartHeader}
      <CardContent>
        {totalVehicles > 0 ? (
          <div className="space-y-4">
            {/* Chart bars */}
            <div className="space-y-3">
              {chartData.map((day, index) => (
                <ChartBar
                  key={`${day.date}-${index}`}
                  day={day}
                  maxVehicles={maxVehicles}
                  index={index}
                />
              ))}
            </div>

            {/* Summary stats */}
            {summaryStats}
          </div>
        ) : (
          <EmptyState days={days} />
        )}
      </CardContent>
    </Card>
  );
});

AnalyticsChart.displayName = "AnalyticsChart";

export default AnalyticsChart;
