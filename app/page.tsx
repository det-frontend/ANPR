"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Shield,
  Database,
  Activity,
  User,
  BarChart3,
  Loader2,
} from "lucide-react";
import AddVehicleForm from "@/components/AddVehicleForm";
import RecentVehicles from "@/components/RecentVehicles";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { VehicleResponse } from "@/lib/types";
import { EventBus, EVENTS } from "@/lib/events";
import { toast } from "sonner";

// Memoized header component
const AppHeader = React.memo<{ user: any }>(({ user }) => (
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
));

AppHeader.displayName = "AppHeader";

const Home = React.memo(() => {
  const [isOnline, setIsOnline] = useState(true);
  const [queueNumber, setQueueNumber] = useState<string>("");
  const [isLoadingQueue, setIsLoadingQueue] = useState(true);

  const { user, logout } = useAuth();

  // Memoized queue number fetcher
  const fetchQueueNumber = useCallback(async () => {
    try {
      setIsLoadingQueue(true);
      const response = await fetch("/api/generate-queue-number");
      if (response.ok) {
        const data = await response.json();
        setQueueNumber(data.queueNumber);
      }
    } catch (error) {
      console.error("Error fetching queue number:", error);
    } finally {
      setIsLoadingQueue(false);
    }
  }, []);

  // Memoized vehicle added handler
  const handleVehicleAdded = useCallback((newVehicle: VehicleResponse) => {
    toast.success("Vehicle Entry Registered Successfully!", {
      description: "The vehicle entry has been added to the system.",
      duration: 5000, // Auto disappear after 5 seconds
    });
  }, []);

  // Memoized online status handlers
  const handleOnline = useCallback(() => setIsOnline(true), []);
  const handleOffline = useCallback(() => setIsOnline(false), []);

  // Memoized refresh queue number handler
  const refreshQueueNumber = useCallback(async () => {
    try {
      const response = await fetch("/api/generate-queue-number");
      if (response.ok) {
        const data = await response.json();
        setQueueNumber(data.queueNumber);
      }
    } catch (error) {
      console.error("Error fetching queue number:", error);
    }
  }, []);

  // Fetch queue number on component mount
  useEffect(() => {
    fetchQueueNumber();
  }, [fetchQueueNumber]);

  // Check online status
  useEffect(() => {
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [handleOnline, handleOffline]);

  // Listen for vehicle added events to refresh queue number
  useEffect(() => {
    const unsubscribe = EventBus.subscribe(EVENTS.VEHICLE_ADDED, () => {
      console.log("Vehicle added event received, refreshing queue number...");
      refreshQueueNumber();
    });

    return () => {
      unsubscribe();
    };
  }, [refreshQueueNumber]);

  // Memoized main content
  const mainContent = useMemo(
    () => (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - New Vehicle Registration */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <AddVehicleForm
                plateNumber=""
                queueNumber={queueNumber}
                onVehicleAdded={handleVehicleAdded}
                isLoadingQueue={isLoadingQueue}
              />
            </div>
          </div>

          {/* Right Column - Recent Vehicles */}
          <div className="space-y-6">
            <RecentVehicles />
          </div>
        </div>
      </main>
    ),
    [queueNumber, isLoadingQueue, handleVehicleAdded]
  );

  return (
    <ProtectedRoute allowedRoles={["client", "manager", "admin"]}>
      <div className="min-h-screen bg-gray-900">
        <AppHeader user={user} />
        {mainContent}
      </div>
    </ProtectedRoute>
  );
});

Home.displayName = "Home";

export default Home;
