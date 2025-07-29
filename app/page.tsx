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
import PlateInput from "@/components/PlateInput";
import VehicleInfo from "@/components/VehicleInfo";
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
  const [currentPlate, setCurrentPlate] = useState("");
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const handlePlateSubmit = async (plate: string) => {
    setCurrentPlate(plate);
    setVehicle(null);
    setShowAddForm(false);
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/check-plate?plate=${encodeURIComponent(plate)}`
      );
      const data = await response.json();

      if (data.exists) {
        setVehicle(data.vehicle);
      } else {
        setShowAddForm(true);
      }
    } catch (error) {
      console.error("Error checking plate:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVehicleAdded = (newVehicle: Vehicle) => {
    setVehicle(newVehicle);
    setShowAddForm(false);
  };

  const resetView = () => {
    setCurrentPlate("");
    setVehicle(null);
    setShowAddForm(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ProtectedRoute allowedRoles={["client", "manager"]}>
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
                {user?.role === "manager" && (
                  <a
                    href="/dashboard"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <BarChart3 className="h-4 w-4" />
                    Dashboard
                  </a>
                )}

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
          {/* Left Column - Input and Results */}
          <div className="lg:col-span-2 space-y-6">
              <PlateInput
                onPlateSubmit={handlePlateSubmit}
                isLoading={isLoading}
              />
            
            {isLoading && (
              <div className="bg-gray-800 p-8 rounded-lg text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                  <p className="text-gray-300">
                    Checking plate: {currentPlate}
                  </p>
              </div>
            )}
            
            {vehicle && (
              <div className="space-y-4">
                <VehicleInfo vehicle={vehicle} />
                <button
                  onClick={resetView}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Check Another Plate
                </button>
              </div>
            )}
            
            {showAddForm && (
              <div className="space-y-4">
                <AddVehicleForm
                  plateNumber={currentPlate}
                  onVehicleAdded={handleVehicleAdded}
                />
                <button
                  onClick={resetView}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
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
