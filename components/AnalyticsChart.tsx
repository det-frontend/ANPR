"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format, subDays, startOfDay } from "date-fns";

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

export default function AnalyticsChart({
  vehicles,
  days = 7,
}: AnalyticsChartProps) {
  const generateChartData = () => {
    const data = [];
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
  };

  const chartData = generateChartData();
  const totalVehicles = chartData.reduce((sum, day) => sum + day.vehicles, 0);
  const maxVehicles = Math.max(...chartData.map((d) => d.vehicles), 1);

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">
          Vehicle Entries - Last {days} Days
        </CardTitle>
        <CardDescription className="text-gray-400">
          Daily vehicle entry trends ({totalVehicles} total vehicles)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {totalVehicles > 0 ? (
          <div className="space-y-4">
            {/* Chart bars */}
            <div className="space-y-3">
              {chartData.map((day, index) => (
                <div key={index} className="flex items-center space-x-4">
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
              ))}
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {totalVehicles}
                </div>
                <div className="text-xs text-gray-400">Total Entries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {Math.round((totalVehicles / days) * 10) / 10}
                </div>
                <div className="text-xs text-gray-400">Daily Average</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {chartData.filter((d) => d.vehicles > 0).length}
                </div>
                <div className="text-xs text-gray-400">Active Days</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-400">
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-lg mb-2">
                No vehicle entries in the last {days} days
              </p>
              <p className="text-sm">
                Try loading sample data or adjusting the date range
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
