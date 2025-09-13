"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Camera,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  Lock,
  Unlock,
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";

interface CCTVEvent {
  _id: string;
  plateNumber: string;
  timestamp: string;
  cameraId: string;
  cameraName: string;
  location: string;
  zone: string;
  confidence: number;
  imageUrl?: string;
  action: "open" | "close" | "deny";
  vehicleFound: boolean;
  targetGateId?: string;
  targetGateName?: string;
  gateStatus: "opening" | "closing" | "open" | "closed";
  createdAt: string;
}

interface Gate {
  _id: string;
  gateId: string;
  gateName: string;
  location: string;
  zone: string;
  gateType: "entrance" | "exit" | "both";
  isOpen: boolean;
  lastAction: string;
  lastActionTime: string;
  lastPlateNumber?: string;
  lastOperatorId?: string;
  isActive: boolean;
}

interface Camera {
  _id: string;
  cameraId: string;
  cameraName: string;
  location: string;
  zone: string;
  ipAddress?: string;
  isActive: boolean;
  targetGateIds: string[];
}

export default function CCTVMonitoringPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<CCTVEvent[]>([]);
  const [gates, setGates] = useState<Gate[]>([]);
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [stats, setStats] = useState({
    totalEvents: 0,
    successfulEntries: 0,
    deniedEntries: 0,
    todayEvents: 0,
    uniqueVehicles: 0,
  });

  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch("/api/cctv/plate-recognition?limit=100");
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error("Error fetching CCTV events:", error);
      toast.error("Failed to fetch CCTV events");
    }
  }, []);

  const fetchGates = useCallback(async () => {
    try {
      const response = await fetch("/api/cctv/gates");
      if (response.ok) {
        const data = await response.json();
        setGates(data.gates || []);
      }
    } catch (error) {
      console.error("Error fetching gates:", error);
    }
  }, []);

  const fetchCameras = useCallback(async () => {
    try {
      const response = await fetch("/api/cctv/cameras");
      if (response.ok) {
        const data = await response.json();
        setCameras(data.cameras || []);
      }
    } catch (error) {
      console.error("Error fetching cameras:", error);
    }
  }, []);

  const controlGate = useCallback(
    async (gateId: string, action: "open" | "close", plateNumber?: string) => {
      try {
        const response = await fetch(`/api/cctv/gates/${gateId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action,
            plateNumber,
            operatorId: user?.username,
            reason: "Manual control from CCTV dashboard",
          }),
        });

        if (response.ok) {
          const data = await response.json();
          toast.success(data.message);
          fetchGates();
        } else {
          toast.error("Failed to control gate");
        }
      } catch (error) {
        console.error("Error controlling gate:", error);
        toast.error("Failed to control gate");
      }
    },
    [user, fetchGates]
  );

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([fetchEvents(), fetchGates(), fetchCameras()]);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchEvents, fetchGates, fetchCameras]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await refreshData();
      setIsLoading(false);
    };

    loadData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, [refreshData]);

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.cameraId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.cameraName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction =
      actionFilter === "all" || event.action === actionFilter;

    const matchesZone = zoneFilter === "all" || event.zone === zoneFilter;

    return matchesSearch && matchesAction && matchesZone;
  });

  const uniqueZones = Array.from(
    new Set([
      ...events.map((e) => e.zone),
      ...gates.map((g) => g.zone),
      ...cameras.map((c) => c.zone),
    ])
  );

  const getActionIcon = (action: string) => {
    switch (action) {
      case "open":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "deny":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "close":
        return <Lock className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case "open":
        return <Badge className="bg-green-600 text-white">Allowed</Badge>;
      case "deny":
        return <Badge className="bg-red-600 text-white">Denied</Badge>;
      case "close":
        return <Badge className="bg-gray-600 text-white">Closed</Badge>;
      default:
        return <Badge className="bg-yellow-600 text-white">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={["manager", "admin"]}>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading CCTV monitoring...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["manager", "admin"]}>
      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <header className="bg-gray-800 shadow-lg border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Camera className="h-8 w-8 text-blue-400" />
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    CCTV Monitoring
                  </h1>
                  <p className="text-gray-400">
                    Real-time vehicle recognition and gate control
                  </p>
                </div>
              </div>
              <Button
                onClick={refreshData}
                disabled={isRefreshing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Gates Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {gates.map((gate) => (
              <Card key={gate.gateId} className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center gap-2 text-lg">
                    <Shield className="h-5 w-5" />
                    {gate.gateName}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    {gate.location} • {gate.zone}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      {gate.isOpen ? (
                        <Unlock className="h-5 w-5 text-green-500" />
                      ) : (
                        <Lock className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <p className="text-white font-medium">
                          Status: {gate.isOpen ? "OPEN" : "CLOSED"}
                        </p>
                        <p className="text-gray-400 text-sm">
                          Last: {gate.lastAction} at{" "}
                          {format(parseISO(gate.lastActionTime), "HH:mm:ss")}
                        </p>
                        {gate.lastPlateNumber && (
                          <p className="text-gray-400 text-xs">
                            Plate: {gate.lastPlateNumber}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => controlGate(gate.gateId, "open")}
                        disabled={gate.isOpen}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Unlock className="h-3 w-3 mr-1" />
                        Open
                      </Button>
                      <Button
                        onClick={() => controlGate(gate.gateId, "close")}
                        disabled={!gate.isOpen}
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Lock className="h-3 w-3 mr-1" />
                        Close
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Total Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {stats.totalEvents}
                </div>
                <p className="text-xs text-gray-400">All time</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Active Gates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">
                  {gates.filter((g) => g.isActive).length}
                </div>
                <p className="text-xs text-gray-400">of {gates.length} total</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Open Gates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-400">
                  {gates.filter((g) => g.isOpen).length}
                </div>
                <p className="text-xs text-gray-400">Currently open</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Active Cameras
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">
                  {cameras.filter((c) => c.isActive).length}
                </div>
                <p className="text-xs text-gray-400">
                  of {cameras.length} total
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="bg-gray-800 border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Search</Label>
                  <Input
                    placeholder="Search by plate number, camera, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Action</Label>
                  <Select value={actionFilter} onValueChange={setActionFilter}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem
                        value="all"
                        className="text-white hover:bg-gray-600"
                      >
                        All Actions
                      </SelectItem>
                      <SelectItem
                        value="open"
                        className="text-white hover:bg-gray-600"
                      >
                        Allowed
                      </SelectItem>
                      <SelectItem
                        value="deny"
                        className="text-white hover:bg-gray-600"
                      >
                        Denied
                      </SelectItem>
                      <SelectItem
                        value="close"
                        className="text-white hover:bg-gray-600"
                      >
                        Closed
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Events Table */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Recent CCTV Events
              </CardTitle>
              <CardDescription className="text-gray-400">
                Showing {filteredEvents.length} of {events.length} events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Time</TableHead>
                      <TableHead className="text-gray-300">
                        Plate Number
                      </TableHead>
                      <TableHead className="text-gray-300">Camera</TableHead>
                      <TableHead className="text-gray-300">Location</TableHead>
                      <TableHead className="text-gray-300">Zone</TableHead>
                      <TableHead className="text-gray-300">Action</TableHead>
                      <TableHead className="text-gray-300">
                        Target Gate
                      </TableHead>
                      <TableHead className="text-gray-300">
                        Confidence
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.map((event) => (
                      <TableRow
                        key={event._id}
                        className="border-gray-700 hover:bg-gray-700"
                      >
                        <TableCell className="text-gray-300">
                          {format(
                            parseISO(event.timestamp),
                            "MMM dd, HH:mm:ss"
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-blue-600 text-white">
                            {event.plateNumber}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {event.cameraId}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {event.location}
                        </TableCell>
                        <TableCell className="flex items-center gap-2">
                          {getActionIcon(event.action)}
                          {getActionBadge(event.action)}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {(event.confidence * 100).toFixed(1)}%
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              event.gateStatus === "open" ||
                              event.gateStatus === "opening"
                                ? "text-green-400 border-green-400"
                                : "text-gray-400 border-gray-400"
                            }
                          >
                            {event.gateStatus}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredEvents.length === 0 && (
                <div className="text-center py-8">
                  <Camera className="h-12 w-12 mx-auto mb-4 text-gray-400 opacity-50" />
                  <h3 className="text-lg font-medium text-white mb-2">
                    No Events Found
                  </h3>
                  <p className="text-gray-400">
                    {events.length === 0
                      ? "No CCTV events have been recorded yet."
                      : "No events match your current filters."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
}
