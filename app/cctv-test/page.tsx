"use client";

import React, { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  Play,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { toast } from "sonner";

interface TestResult {
  success: boolean;
  message: string;
  testData?: any;
  result?: any;
  error?: string;
}

export default function CCTVTestPage() {
  const [plateNumber, setPlateNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  const runTest = async (testPlate: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/cctv/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plateNumber: testPlate,
        }),
      });

      const result = await response.json();

      const testResult: TestResult = {
        success: response.ok,
        message: result.message || "Test completed",
        testData: result.testData,
        result: result.result,
        error: result.error,
      };

      setTestResults((prev) => [testResult, ...prev]);

      if (response.ok) {
        toast.success("CCTV test completed successfully");
      } else {
        toast.error("CCTV test failed");
      }
    } catch (error) {
      const testResult: TestResult = {
        success: false,
        message: "Test failed",
        error: error instanceof Error ? error.message : "Unknown error",
      };
      setTestResults((prev) => [testResult, ...prev]);
      toast.error("CCTV test failed");
    } finally {
      setIsLoading(false);
    }
  };

  const runPredefinedTests = async () => {
    const testPlates = ["TRK-001", "UNKNOWN-123", "TEST-ABC"];

    for (const plate of testPlates) {
      await runTest(plate);
      // Small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  };

  const getResultIcon = (result: TestResult) => {
    if (result.success) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getGateActionBadge = (action: string) => {
    switch (action) {
      case "open":
        return <Badge className="bg-green-600 text-white">Gate Opened</Badge>;
      case "deny":
        return <Badge className="bg-red-600 text-white">Access Denied</Badge>;
      case "close":
        return <Badge className="bg-gray-600 text-white">Gate Closed</Badge>;
      default:
        return <Badge className="bg-yellow-600 text-white">Unknown</Badge>;
    }
  };

  return (
    <ProtectedRoute allowedRoles={["manager", "admin"]}>
      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <header className="bg-gray-800 shadow-lg border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <Camera className="h-8 w-8 text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">
                  CCTV Integration Test
                </h1>
                <p className="text-gray-400">
                  Test the CCTV plate recognition and gate control system
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Test Controls */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Test Controls
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Simulate CCTV plate recognition events
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Custom Plate Test */}
                <div className="space-y-2">
                  <Label className="text-gray-300">Custom Plate Number</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter plate number (e.g., TRK-001)"
                      value={plateNumber}
                      onChange={(e) => setPlateNumber(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <Button
                      onClick={() => runTest(plateNumber)}
                      disabled={!plateNumber.trim() || isLoading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Test
                    </Button>
                  </div>
                </div>

                {/* Predefined Tests */}
                <div className="space-y-2">
                  <Label className="text-gray-300">Predefined Tests</Label>
                  <Button
                    onClick={runPredefinedTests}
                    disabled={isLoading}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Run All Tests
                  </Button>
                  <p className="text-xs text-gray-500">
                    Tests: TRK-001 (registered), UNKNOWN-123 (unregistered),
                    TEST-ABC (random)
                  </p>
                </div>

                {/* Quick Tests */}
                <div className="space-y-2">
                  <Label className="text-gray-300">Quick Tests</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => runTest("TRK-001")}
                      disabled={isLoading}
                      variant="outline"
                      className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                    >
                      Test TRK-001
                    </Button>
                    <Button
                      onClick={() => runTest("UNKNOWN-123")}
                      disabled={isLoading}
                      variant="outline"
                      className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                    >
                      Test Unknown
                    </Button>
                  </div>
                </div>

                {isLoading && (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                    <span className="ml-2 text-gray-300">Running test...</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Test Results */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Test Results
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Recent test results and responses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {testResults.length === 0 ? (
                    <div className="text-center py-8">
                      <Camera className="h-12 w-12 mx-auto mb-4 text-gray-400 opacity-50" />
                      <p className="text-gray-400">No tests run yet</p>
                      <p className="text-gray-500 text-sm">
                        Run a test to see results here
                      </p>
                    </div>
                  ) : (
                    testResults.map((result, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-700 rounded-lg border border-gray-600"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getResultIcon(result)}
                            <span className="text-white font-medium">
                              {result.testData?.plateNumber || "Unknown Plate"}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400">
                            {new Date().toLocaleTimeString()}
                          </span>
                        </div>

                        <p className="text-gray-300 text-sm mb-2">
                          {result.message}
                        </p>

                        {result.result?.gateControl && (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-gray-400 text-sm">
                              Gate Action:
                            </span>
                            {getGateActionBadge(
                              result.result.gateControl.action
                            )}
                          </div>
                        )}

                        {result.result?.gateControl?.vehicle && (
                          <div className="text-xs text-gray-400">
                            Vehicle Found:{" "}
                            {result.result.gateControl.vehicle.truckNumber ||
                              result.result.gateControl.vehicle.vehicleNumber}
                          </div>
                        )}

                        {result.error && (
                          <div className="text-red-400 text-xs mt-2">
                            Error: {result.error}
                          </div>
                        )}

                        <details className="mt-2">
                          <summary className="text-xs text-gray-500 cursor-pointer">
                            View Raw Response
                          </summary>
                          <pre className="text-xs text-gray-400 mt-2 bg-gray-800 p-2 rounded overflow-x-auto">
                            {JSON.stringify(result.result, null, 2)}
                          </pre>
                        </details>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Instructions */}
          <Card className="bg-gray-800 border-gray-700 mt-8">
            <CardHeader>
              <CardTitle className="text-white">
                Integration Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-white font-medium mb-2">
                    For CCTV System Integration:
                  </h3>
                  <ol className="text-gray-300 text-sm space-y-1 list-decimal list-inside">
                    <li>
                      Configure your CCTV system to send HTTP POST requests
                    </li>
                    <li>
                      Endpoint:{" "}
                      <code className="bg-gray-700 px-1 rounded">
                        /api/cctv/plate-recognition
                      </code>
                    </li>
                    <li>
                      Required fields:{" "}
                      <code className="bg-gray-700 px-1 rounded">
                        plateNumber
                      </code>
                      ,{" "}
                      <code className="bg-gray-700 px-1 rounded">
                        timestamp
                      </code>
                    </li>
                    <li>
                      Optional fields:{" "}
                      <code className="bg-gray-700 px-1 rounded">cameraId</code>
                      ,{" "}
                      <code className="bg-gray-700 px-1 rounded">location</code>
                      ,{" "}
                      <code className="bg-gray-700 px-1 rounded">
                        confidence
                      </code>
                    </li>
                    <li>
                      System will automatically check if vehicle is registered
                    </li>
                    <li>
                      Gate will open for registered vehicles, remain closed for
                      unregistered
                    </li>
                  </ol>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">
                    For Gate Control Integration:
                  </h3>
                  <ol className="text-gray-300 text-sm space-y-1 list-decimal list-inside">
                    <li>Use the gate control API for manual operations</li>
                    <li>
                      Endpoint:{" "}
                      <code className="bg-gray-700 px-1 rounded">
                        /api/cctv/gate-control
                      </code>
                    </li>
                    <li>
                      Actions:{" "}
                      <code className="bg-gray-700 px-1 rounded">open</code>,{" "}
                      <code className="bg-gray-700 px-1 rounded">close</code>,{" "}
                      <code className="bg-gray-700 px-1 rounded">status</code>
                    </li>
                    <li>
                      Replace the mock gate control with your actual hardware
                      integration
                    </li>
                    <li>Monitor events in the CCTV dashboard</li>
                    <li>All events are logged for audit purposes</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
}
