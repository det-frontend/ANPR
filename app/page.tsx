"use client";

import { useState, useEffect } from "react";
import { Shield, Database, Activity, User, BarChart3 } from "lucide-react";
import AddVehicleForm from "@/components/AddVehicleForm";
import RecentVehicles from "@/components/RecentVehicles";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { VehicleResponse } from "@/lib/types";
import { EventBus, EVENTS } from "@/lib/events";

export default function Home() {
  const [vehicle, setVehicle] = useState<VehicleResponse | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [queueNumber, setQueueNumber] = useState<string>("");

  const { user, logout } = useAuth();

  // Fetch queue number on component mount
  useEffect(() => {
    const fetchQueueNumber = async () => {
      try {
        const response = await fetch("/api/generate-queue-number");
        if (response.ok) {
          const data = await response.json();
          setQueueNumber(data.queueNumber);
        }
      } catch (error) {
        console.error("Error fetching queue number:", error);
      }
    };

    fetchQueueNumber();
  }, []);

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

  const handleVehicleAdded = (newVehicle: VehicleResponse) => {
    setVehicle(newVehicle);
  };

  const resetView = () => {
    setVehicle(null);
  };

  // Listen for vehicle added events to refresh queue number
  useEffect(() => {
    const unsubscribe = EventBus.subscribe(EVENTS.VEHICLE_ADDED, () => {
      console.log("Vehicle added event received, refreshing queue number...");
      // Refresh queue number after vehicle is added
      const fetchQueueNumber = async () => {
        try {
          const response = await fetch("/api/generate-queue-number");
          if (response.ok) {
            const data = await response.json();
            setQueueNumber(data.queueNumber);
          }
        } catch (error) {
          console.error("Error fetching queue number:", error);
        }
      };
      fetchQueueNumber();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <ProtectedRoute allowedRoles={["client", "manager", "admin"]}>
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
                    ANPR System
                  </h1>
                  <p className="text-gray-400 text-xs sm:text-sm truncate">
                    Automatic Number Plate Recognition
                  </p>
                </div>
              </div>

              {/* User Info Section */}
              <div className="hidden sm:flex items-center sm:justify-end w-full sm:w-auto">
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
                  queueNumber={queueNumber}
                  onVehicleAdded={handleVehicleAdded}
                />
              </div>

              {vehicle && (
                <div className="space-y-4">
                  <div className="bg-green-900 border border-green-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-green-200 mb-2">
                      Vehicle Entry Registered Successfully!
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
