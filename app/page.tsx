"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  Database,
  Activity,
  LogOut,
  User,
  BarChart3,
} from "lucide-react";
import AddVehicleForm from "@/components/AddVehicleForm";
import RecentVehicles from "@/components/RecentVehicles";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

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

export default function Home() {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  const { user, logout } = useAuth();

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

  const handleVehicleAdded = (newVehicle: Vehicle) => {
    setVehicle(newVehicle);
  };

  const resetView = () => {
    setVehicle(null);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ProtectedRoute allowedRoles={["client", "manager", "admin"]}>
      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <header className="bg-gray-800 shadow-lg border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-blue-400" />
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    CCTV ANPR System
                  </h1>
                  <p className="text-gray-400 text-sm">
                    Automatic Number Plate Recognition
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

                {/* Navigation based on role */}
                {/* {(user?.role === "manager" || user?.role === "admin") && (
                  <a
                    href="/dashboard"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <BarChart3 className="h-4 w-4" />
                    Dashboard
                  </a>
                )} */}

                {/* Logout Button */}
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
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - New Vehicle Registration */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                {/* <h2 className="text-xl font-semibold text-gray-200 mb-4">
                  New Entry
                </h2> */}
                <AddVehicleForm
                  plateNumber=""
                  onVehicleAdded={handleVehicleAdded}
                />
              </div>

              {vehicle && (
                <div className="space-y-4">
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

            {/* Right Column - Recent Vehicles */}
            <div className="space-y-6">
              <RecentVehicles />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
