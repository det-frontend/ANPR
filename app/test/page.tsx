"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestPage() {
  const [testResults, setTestResults] = useState<any>({});

  const testVehiclesAPI = async () => {
    try {
      console.log("Testing /api/vehicles...");
      const response = await fetch("/api/vehicles");
      const data = await response.json();
      console.log("Vehicles API response:", data);
      setTestResults((prev) => ({ ...prev, vehicles: data }));
    } catch (error) {
      console.error("Vehicles API error:", error);
      setTestResults((prev) => ({
        ...prev,
        vehicles: { error: error.message },
      }));
    }
  };

  const testSeedDataAPI = async () => {
    try {
      console.log("Testing /api/seed-data...");
      const response = await fetch("/api/seed-data", { method: "POST" });
      const data = await response.json();
      console.log("Seed data API response:", data);
      setTestResults((prev) => ({ ...prev, seedData: data }));
    } catch (error) {
      console.error("Seed data API error:", error);
      setTestResults((prev) => ({
        ...prev,
        seedData: { error: error.message },
      }));
    }
  };

  const testCheckPlateAPI = async () => {
    try {
      console.log("Testing /api/check-plate...");
      const response = await fetch("/api/check-plate?plate=TRK-001");
      const data = await response.json();
      console.log("Check plate API response:", data);
      setTestResults((prev) => ({ ...prev, checkPlate: data }));
    } catch (error) {
      console.error("Check plate API error:", error);
      setTestResults((prev) => ({
        ...prev,
        checkPlate: { error: error.message },
      }));
    }
  };

  const testAddVehicleAPI = async () => {
    try {
      console.log("Testing /api/add-vehicle...");
      const testVehicle = {
        orderNumber: "TEST-001",
        companyName: "Test Company",
        customerName: "Test Customer",
        orderDate: new Date().toISOString(),
        truckNumber: "TEST-TRUCK-001",
        trailerNumber: "TEST-TRAILER-001",
        driverName: "Test Driver",
        driverPhoneNumber: "+1234567890",
        numberOfDrums: 10,
        amountInLiters: 2500,
        tankNumber: 1,
      };

      const response = await fetch("/api/add-vehicle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testVehicle),
      });
      const data = await response.json();
      console.log("Add vehicle API response:", data);
      setTestResults((prev) => ({ ...prev, addVehicle: data }));
    } catch (error) {
      console.error("Add vehicle API error:", error);
      setTestResults((prev) => ({
        ...prev,
        addVehicle: { error: error.message },
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">API Test Page</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button
            onClick={testVehiclesAPI}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Test /api/vehicles
          </Button>
          <Button
            onClick={testSeedDataAPI}
            className="bg-green-600 hover:bg-green-700"
          >
            Test /api/seed-data
          </Button>
          <Button
            onClick={testCheckPlateAPI}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Test /api/check-plate
          </Button>
          <Button
            onClick={testAddVehicleAPI}
            className="bg-orange-600 hover:bg-orange-700"
          >
            Test /api/add-vehicle
          </Button>
        </div>

        <div className="space-y-4">
          {testResults.vehicles && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Vehicles API Result
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-green-400 text-sm overflow-auto">
                  {JSON.stringify(testResults.vehicles, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {testResults.seedData && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Seed Data API Result
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-green-400 text-sm overflow-auto">
                  {JSON.stringify(testResults.seedData, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {testResults.checkPlate && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Check Plate API Result
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-green-400 text-sm overflow-auto">
                  {JSON.stringify(testResults.checkPlate, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {testResults.addVehicle && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Add Vehicle API Result
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-green-400 text-sm overflow-auto">
                  {JSON.stringify(testResults.addVehicle, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
