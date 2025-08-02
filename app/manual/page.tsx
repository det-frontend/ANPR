"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Truck,
  BarChart3,
  Search,
  Settings,
  User,
  FileText,
  Download,
  Filter,
  Calendar,
  Plus,
  Eye,
  Edit,
  Printer,
  Copy,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronRight,
  Home,
  Save,
  Database,
  AlertTriangle,
  Shield,
  Wrench,
  Mail,
  Video,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

export default function UserManual() {
  const { user } = useAuth();
  const [openSections, setOpenSections] = useState<string[]>([
    "getting-started",
  ]);

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const sections = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: <Home className="h-5 w-5" />,
      roles: ["client", "manager", "admin"],
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 rounded-xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-600/20 rounded-xl">
                <Info className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xl mb-3">
                  Welcome to ANPR System
                </h4>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  This comprehensive system helps you manage vehicle entries,
                  track deliveries, and generate reports efficiently. Get
                  started by understanding your role and the available features.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-600/20">
                    <h5 className="font-semibold text-blue-300 text-sm mb-2">
                      System Purpose
                    </h5>
                    <p className="text-xs text-gray-300">
                      Automated Number Plate Recognition system for vehicle
                      management and delivery tracking
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-green-600/10 border border-green-600/20">
                    <h5 className="font-semibold text-green-300 text-sm mb-2">
                      Key Features
                    </h5>
                    <p className="text-xs text-gray-300">
                      Vehicle registration, entry tracking, invoice generation,
                      and data management
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 shadow-xl">
              <CardHeader className="border-b border-gray-600 pb-4">
                <CardTitle className="flex items-center gap-4 text-white text-xl">
                  <div className="p-2 bg-blue-600/20 rounded-lg">
                    <User className="h-6 w-6 text-blue-400" />
                  </div>
                  User Roles & Permissions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-700/50 border border-gray-600 hover:border-gray-500 transition-colors duration-200">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-600/20 rounded-lg">
                      <User className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <span className="text-base font-semibold text-white block">
                        Client
                      </span>
                      <p className="text-sm text-gray-300">Basic user access</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Can create vehicle entries and generate receipts
                      </p>
                    </div>
                  </div>
                  {/* <Badge
                    variant="secondary"
                    className="bg-blue-600/20 text-blue-300 border-blue-600 px-3 py-1"
                  >
                    Basic Access
                  </Badge> */}
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-700/50 border border-gray-600 hover:border-gray-500 transition-colors duration-200">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-green-600/20 rounded-lg">
                      <Settings className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <span className="text-base font-semibold text-white block">
                        Manager
                      </span>
                      <p className="text-sm text-gray-300">
                        Full system access
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Can register vehicles, manage data, and access all
                        features
                      </p>
                    </div>
                  </div>
                  {/* <Badge
                    variant="default"
                    className="bg-green-600/20 text-green-300 border-green-600 px-3 py-1"
                  >
                    Full Access
                  </Badge> */}
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-700/50 border border-gray-600 hover:border-gray-500 transition-colors duration-200">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-red-600/20 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <span className="text-base font-semibold text-white block">
                        Admin
                      </span>
                      <p className="text-sm text-gray-300">
                        System administration
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Full control including user management and system
                        settings
                      </p>
                    </div>
                  </div>
                  {/* <Badge
                    variant="destructive"
                    className="bg-red-600/20 text-red-300 border-red-600 px-3 py-1"
                  >
                    System Admin
                  </Badge> */}
                </div>

                <div className="mt-6 p-4 bg-blue-600/10 rounded-xl border border-blue-600/20">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-gray-300">
                      <span className="font-semibold text-blue-300">
                        Role-based access:
                      </span>{" "}
                      Each role has specific permissions and features available.
                      Contact your administrator to change roles. Higher roles
                      inherit permissions from lower roles.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 shadow-xl">
              <CardHeader className="border-b border-gray-600 pb-4">
                <CardTitle className="flex items-center gap-4 text-white text-xl">
                  <div className="p-2 bg-blue-600/20 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-400" />
                  </div>
                  Quick Navigation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-700/50 border border-gray-600 hover:border-gray-500 transition-colors duration-200">
                  <div className="p-2 bg-blue-600/20 rounded-lg">
                    <Home className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <span className="text-base font-semibold text-white block">
                      New Entry
                    </span>
                    <span className="text-sm text-gray-300">
                      Register vehicles for invoice/receipt
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                      Create daily vehicle entries with auto-generated queue
                      numbers
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-blue-600/20 text-blue-300 border-blue-600 px-3 py-1"
                  >
                    Entry
                  </Badge>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-700/50 border border-gray-600 hover:border-gray-500 transition-colors duration-200">
                  <div className="p-2 bg-green-600/20 rounded-lg">
                    <Truck className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <span className="text-base font-semibold text-white block">
                      Vehicle Entry
                    </span>
                    <span className="text-sm text-gray-300">
                      Invoice/Receipt generation
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                      Generate and print receipts for vehicle deliveries
                    </p>
                  </div>
                  <Badge
                    variant="default"
                    className="bg-green-600/20 text-green-300 border-green-600 px-3 py-1"
                  >
                    Invoice
                  </Badge>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-700/50 border border-gray-600 hover:border-gray-500 transition-colors duration-200">
                  <div className="p-2 bg-purple-600/20 rounded-lg">
                    <Save className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <span className="text-base font-semibold text-white block">
                      Register
                    </span>
                    <span className="text-sm text-gray-300">
                      Vehicle information database
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                      Permanent vehicle registration with unique number plates
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-purple-600/20 text-purple-300 border-purple-600 px-3 py-1"
                  >
                    Database
                  </Badge>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-700/50 border border-gray-600 hover:border-gray-500 transition-colors duration-200">
                  <div className="p-2 bg-orange-600/20 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <span className="text-base font-semibold text-white block">
                      Search
                    </span>
                    <span className="text-sm text-gray-300">
                      View and search data
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                      Advanced search and filtering with data export
                      capabilities
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-orange-600/20 text-orange-300 border-orange-600 px-3 py-1"
                  >
                    Search
                  </Badge>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-700/50 border border-gray-600 hover:border-gray-500 transition-colors duration-200">
                  <div className="p-2 bg-red-600/20 rounded-lg">
                    <Settings className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <span className="text-base font-semibold text-white block">
                      User
                    </span>
                    <span className="text-sm text-gray-300">
                      System settings & management
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                      User management, system configuration, and administrative
                      tasks
                    </p>
                  </div>
                  <Badge
                    variant="destructive"
                    className="bg-red-600/20 text-red-300 border-red-600 px-3 py-1"
                  >
                    Settings
                  </Badge>
                </div>

                <div className="mt-6 p-4 bg-blue-600/10 rounded-xl border border-blue-600/20">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-gray-300">
                      <span className="font-semibold text-blue-300">
                        Navigation tip:
                      </span>{" "}
                      Use the sidebar menu to quickly access these features.
                      Each section has specific permissions based on your role.
                      The system provides real-time updates and notifications.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 shadow-xl">
              <CardHeader className="border-b border-gray-600 pb-4">
                <CardTitle className="flex items-center gap-3 text-white text-lg">
                  <div className="p-2 bg-blue-600/20 rounded-lg">
                    <div className="w-4 h-4 text-blue-400 font-bold">📊</div>
                  </div>
                  System Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-600/10 border border-blue-600/20">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm text-gray-300">
                      Real-time data processing
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-green-600/10 border border-green-600/20">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-gray-300">
                      Secure authentication
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-600/10 border border-purple-600/20">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-sm text-gray-300">
                      Role-based access control
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-600/10 border border-orange-600/20">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span className="text-sm text-gray-300">
                      Data export capabilities
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 shadow-xl">
              <CardHeader className="border-b border-gray-600 pb-4">
                <CardTitle className="flex items-center gap-3 text-white text-lg">
                  <div className="p-2 bg-green-600/20 rounded-lg">
                    <div className="w-4 h-4 text-green-400 font-bold">⚡</div>
                  </div>
                  Quick Start Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">
                      1
                    </div>
                    <span className="text-sm text-gray-300">
                      Log in with your credentials
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">
                      2
                    </div>
                    <span className="text-sm text-gray-300">
                      Review your role permissions
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">
                      3
                    </div>
                    <span className="text-sm text-gray-300">
                      Navigate to desired section
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">
                      4
                    </div>
                    <span className="text-sm text-gray-300">
                      Follow section-specific guides
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 shadow-xl">
              <CardHeader className="border-b border-gray-600 pb-4">
                <CardTitle className="flex items-center gap-3 text-white text-lg">
                  <div className="p-2 bg-orange-600/20 rounded-lg">
                    <div className="w-4 h-4 text-orange-400 font-bold">💡</div>
                  </div>
                  Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                    <span className="text-sm text-gray-300">
                      Always fill required fields marked with *
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                    <span className="text-sm text-gray-300">
                      Use proper phone number format
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                    <span className="text-sm text-gray-300">
                      Save work frequently
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                    <span className="text-sm text-gray-300">
                      Contact support for issues
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: "vehicle-entry",
      title: "Vehicle Entry (Invoice/Receipt)",
      icon: <Truck className="h-5 w-5" />,
      roles: ["manager", "admin"],
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-950/20 to-blue-900/20 border border-blue-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-600/20 rounded-xl">
                <CheckCircle className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h4 className="font-bold text-blue-100 text-xl mb-3">
                  Vehicle Entry Process
                </h4>
                <p className="text-blue-300 text-base leading-relaxed mb-4">
                  Create invoices and receipts for vehicle deliveries. This is
                  for temporary entry tracking and receipt generation.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-600/20">
                    <h5 className="font-semibold text-blue-300 text-sm mb-2">
                      Purpose
                    </h5>
                    <p className="text-xs text-gray-300">
                      Generate invoices and receipts for daily vehicle
                      deliveries
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-green-600/10 border border-green-600/20">
                    <h5 className="font-semibold text-green-300 text-sm mb-2">
                      Data Storage
                    </h5>
                    <p className="text-xs text-gray-300">
                      Temporary tracking in vehicles collection
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-6">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold flex-shrink-0 mt-1 shadow-lg">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white text-lg mb-3">
                  Access Entry Form
                </h4>
                <p className="text-gray-300 text-base leading-relaxed mb-3">
                  Navigate to &ldquo;New Entry&rdquo; page. System
                  auto-generates daily queue number for receipt tracking.
                </p>
                <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-600/20">
                  <h5 className="font-semibold text-blue-300 text-sm mb-2">
                    What happens automatically:
                  </h5>
                  <ul className="text-xs text-gray-300 space-y-1">
                    <li>• Daily queue number generation</li>
                    <li>• Current date and time stamp</li>
                    <li>• Form validation setup</li>
                    <li>• Receipt template preparation</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold flex-shrink-0 mt-1 shadow-lg">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white text-lg mb-3">
                  Fill Required Fields
                </h4>
                <p className="text-gray-300 text-base leading-relaxed mb-3">
                  Complete all fields marked with red asterisk (*): Order
                  Number, Company Name, Customer Name, Truck Number, Driver
                  Name, Number of Drums, Amount in Liters, Tank Number (1-6).
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-600/20">
                    <h5 className="font-semibold text-blue-300 text-sm mb-2">
                      Required Fields (*)
                    </h5>
                    <ul className="text-xs text-gray-300 space-y-1">
                      <li>• Order Number (unique identifier)</li>
                      <li>• Company Name (delivery company)</li>
                      <li>• Customer Name (recipient)</li>
                      <li>• Truck Number (vehicle plate)</li>
                      <li>• Driver Name (delivery driver)</li>
                      <li>• Number of Drums (quantity)</li>
                      <li>• Amount in Liters (volume)</li>
                      <li>• Tank Number (1-6 selection)</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-green-600/10 border border-green-600/20">
                    <h5 className="font-semibold text-green-300 text-sm mb-2">
                      Optional Fields
                    </h5>
                    <ul className="text-xs text-gray-300 space-y-1">
                      <li>• Additional Notes</li>
                      <li>• Special Instructions</li>
                      <li>• Contact Information</li>
                      <li>• Delivery Time</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold flex-shrink-0 mt-1 shadow-lg">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white text-lg mb-3">
                  Submit & Print
                </h4>
                <p className="text-gray-300 text-base leading-relaxed mb-3">
                  Click &ldquo;Save Entry&rdquo; to create receipt, &ldquo;Print
                  Receipt&rdquo; for driver copy, or &ldquo;Copy Details&rdquo;
                  for clipboard.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-600/20">
                    <h5 className="font-semibold text-blue-300 text-sm mb-2">
                      Save Entry
                    </h5>
                    <p className="text-xs text-gray-300">
                      Creates receipt and stores data in database
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-green-600/10 border border-green-600/20">
                    <h5 className="font-semibold text-green-300 text-sm mb-2">
                      Print Receipt
                    </h5>
                    <p className="text-xs text-gray-300">
                      Generates printable receipt for driver
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-purple-600/10 border border-purple-600/20">
                    <h5 className="font-semibold text-purple-300 text-sm mb-2">
                      Copy Details
                    </h5>
                    <p className="text-xs text-gray-300">
                      Copies entry details to clipboard
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 shadow-xl">
              <CardHeader className="border-b border-gray-600 pb-4">
                <CardTitle className="flex items-center gap-4 text-white text-xl">
                  <div className="p-2 bg-orange-600/20 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-orange-500" />
                  </div>
                  Important Notes - Vehicle Entry
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-orange-600/10 border border-orange-600/20">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300 text-base">
                    Queue numbers reset daily and are auto-generated
                  </span>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-orange-600/10 border border-orange-600/20">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300 text-base">
                    All required fields must be filled before submission
                  </span>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-orange-600/10 border border-orange-600/20">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300 text-base">
                    Tank numbers range from 1 to 6
                  </span>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-600/10 border border-blue-600/20">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300 text-base">
                    Same number plates can be used in multiple entries (for
                    different deliveries)
                  </span>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-600/10 border border-blue-600/20">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300 text-base">
                    This is for invoice/receipt generation only, not permanent
                    registration
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 shadow-xl">
              <CardHeader className="border-b border-gray-600 pb-4">
                <CardTitle className="flex items-center gap-4 text-white text-xl">
                  <div className="p-2 bg-blue-600/20 rounded-lg">
                    <div className="w-4 h-4 text-blue-400 font-bold">📋</div>
                  </div>
                  Field Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-blue-600/10 border border-blue-600/20">
                    <h6 className="font-semibold text-blue-300 text-sm mb-1">
                      Order Number
                    </h6>
                    <p className="text-xs text-gray-300">
                      Use company's internal order reference number
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-600/10 border border-green-600/20">
                    <h6 className="font-semibold text-green-300 text-sm mb-1">
                      Phone Numbers
                    </h6>
                    <p className="text-xs text-gray-300">
                      Use international format: +1234567890
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-600/10 border border-purple-600/20">
                    <h6 className="font-semibold text-purple-300 text-sm mb-1">
                      Tank Selection
                    </h6>
                    <p className="text-xs text-gray-300">
                      Choose from dropdown menu (1-6)
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-orange-600/10 border border-orange-600/20">
                    <h6 className="font-semibold text-orange-300 text-sm mb-1">
                      Amount in Liters
                    </h6>
                    <p className="text-xs text-gray-300">
                      Enter numeric value only (e.g., 1000)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 shadow-xl">
            <CardHeader className="border-b border-gray-600 pb-4">
              <CardTitle className="flex items-center gap-4 text-white text-xl">
                <div className="p-2 bg-purple-600/20 rounded-lg">
                  <div className="w-4 h-4 text-purple-400 font-bold">🔄</div>
                </div>
                Complete Workflow
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mx-auto mb-2">
                      1
                    </div>
                    <h6 className="font-semibold text-blue-300 text-sm">
                      Access Form
                    </h6>
                    <p className="text-xs text-gray-400 mt-1">
                      Navigate to New Entry page
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mx-auto mb-2">
                      2
                    </div>
                    <h6 className="font-semibold text-blue-300 text-sm">
                      Fill Fields
                    </h6>
                    <p className="text-xs text-gray-400 mt-1">
                      Complete required information
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mx-auto mb-2">
                      3
                    </div>
                    <h6 className="font-semibold text-blue-300 text-sm">
                      Save Entry
                    </h6>
                    <p className="text-xs text-gray-400 mt-1">
                      Create receipt in database
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mx-auto mb-2">
                      4
                    </div>
                    <h6 className="font-semibold text-blue-300 text-sm">
                      Print/Share
                    </h6>
                    <p className="text-xs text-gray-400 mt-1">
                      Generate receipt for driver
                    </p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-600/20">
                  <h6 className="font-semibold text-blue-300 text-sm mb-2">
                    Workflow Benefits:
                  </h6>
                  <ul className="text-xs text-gray-300 space-y-1">
                    <li>• Automated queue number generation</li>
                    <li>• Real-time data validation</li>
                    <li>• Instant receipt generation</li>
                    <li>• Data backup and recovery</li>
                    <li>• Audit trail maintenance</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      id: "vehicle-registration",
      title: "Vehicle Information Registration",
      icon: <Save className="h-5 w-5" />,
      roles: ["manager", "admin"],
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-950/20 to-purple-900/20 border border-purple-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-600/20 rounded-xl">
                <Save className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h4 className="font-bold text-purple-100 text-xl mb-3">
                  Vehicle Information Registration Process
                </h4>
                <p className="text-purple-300 text-base leading-relaxed mb-4">
                  Register vehicle information in the database for permanent
                  storage and management.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 rounded-xl bg-purple-600/10 border border-purple-600/20">
                    <h5 className="font-semibold text-purple-300 text-sm mb-2">
                      Purpose
                    </h5>
                    <p className="text-xs text-gray-300">
                      Permanent vehicle database registration with unique number
                      plates
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-600/20">
                    <h5 className="font-semibold text-blue-300 text-sm mb-2">
                      Data Storage
                    </h5>
                    <p className="text-xs text-gray-300">
                      Permanent records in vehicle_info collection
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-6">
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold flex-shrink-0 mt-1 shadow-lg">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white text-lg mb-3">
                  Access Vehicle Information Page
                </h4>
                <p className="text-gray-300 text-base leading-relaxed mb-3">
                  Navigate to &ldquo;Register&rdquo; page from the sidebar menu.
                </p>
                <div className="p-4 rounded-xl bg-purple-600/10 border border-purple-600/20">
                  <h5 className="font-semibold text-purple-300 text-sm mb-2">
                    What happens when you access:
                  </h5>
                  <ul className="text-xs text-gray-300 space-y-1">
                    <li>• Form validation setup for unique vehicle numbers</li>
                    <li>• Database connection verification</li>
                    <li>• User permission validation</li>
                    <li>• Registration template preparation</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold flex-shrink-0 mt-1 shadow-lg">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white text-lg mb-3">
                  Fill Required Information
                </h4>
                <p className="text-gray-300 text-base leading-relaxed mb-3">
                  Enter vehicle details: Vehicle Number, Driver Name, Driver
                  Phone, Trailer Number, Customer Name, Company Name.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-purple-600/10 border border-purple-600/20">
                    <h5 className="font-semibold text-purple-300 text-sm mb-2">
                      Required Fields (*)
                    </h5>
                    <ul className="text-xs text-gray-300 space-y-1">
                      <li>• Vehicle Number (unique identifier)</li>
                      <li>• Driver Name (full name)</li>
                      <li>• Driver Phone (contact number)</li>
                      <li>• Customer Name (recipient)</li>
                      <li>• Company Name (delivery company)</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-600/20">
                    <h5 className="font-semibold text-blue-300 text-sm mb-2">
                      Optional Fields
                    </h5>
                    <ul className="text-xs text-gray-300 space-y-1">
                      <li>• Trailer Number</li>
                      <li>• Additional Notes</li>
                      <li>• Emergency Contact</li>
                      <li>• Vehicle Type</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold flex-shrink-0 mt-1 shadow-lg">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white text-lg mb-3">
                  Submit Registration
                </h4>
                <p className="text-gray-300 text-base leading-relaxed mb-3">
                  Click &ldquo;Register Vehicle&rdquo; to save vehicle
                  information to the database.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-purple-600/10 border border-purple-600/20">
                    <h5 className="font-semibold text-purple-300 text-sm mb-2">
                      Validation Check
                    </h5>
                    <p className="text-xs text-gray-300">
                      System verifies unique vehicle number
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-600/20">
                    <h5 className="font-semibold text-blue-300 text-sm mb-2">
                      Database Save
                    </h5>
                    <p className="text-xs text-gray-300">
                      Creates permanent record in vehicle_info collection
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-green-600/10 border border-green-600/20">
                    <h5 className="font-semibold text-green-300 text-sm mb-2">
                      Confirmation
                    </h5>
                    <p className="text-xs text-gray-300">
                      Success message and record ID generation
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 shadow-xl">
              <CardHeader className="border-b border-gray-600 pb-4">
                <CardTitle className="flex items-center gap-4 text-white text-xl">
                  <div className="p-2 bg-red-600/20 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-red-500" />
                  </div>
                  Critical Notes - Vehicle Information Registration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-red-600/10 border border-red-600/20">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300 text-base">
                    Vehicle numbers MUST be unique - no duplicates allowed
                  </span>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-red-600/10 border border-red-600/20">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300 text-base">
                    This creates permanent database records in vehicle_info
                    collection
                  </span>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-red-600/10 border border-red-600/20">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300 text-base">
                    Only managers and admins can register vehicle information
                  </span>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-orange-600/10 border border-orange-600/20">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300 text-base">
                    Required fields: Vehicle Number, Driver Name, Customer Name,
                    Company Name
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 shadow-xl">
              <CardHeader className="border-b border-gray-600 pb-4">
                <CardTitle className="flex items-center gap-4 text-white text-xl">
                  <div className="p-2 bg-purple-600/20 rounded-lg">
                    <div className="w-4 h-4 text-purple-400 font-bold">📋</div>
                  </div>
                  Field Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-purple-600/10 border border-purple-600/20">
                    <h6 className="font-semibold text-purple-300 text-sm mb-1">
                      Vehicle Number
                    </h6>
                    <p className="text-xs text-gray-300">
                      Must be unique across the entire database
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-600/10 border border-blue-600/20">
                    <h6 className="font-semibold text-blue-300 text-sm mb-1">
                      Driver Phone
                    </h6>
                    <p className="text-xs text-gray-300">
                      Use international format: +1234567890
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-600/10 border border-green-600/20">
                    <h6 className="font-semibold text-green-300 text-sm mb-1">
                      Names
                    </h6>
                    <p className="text-xs text-gray-300">
                      Use full names for better identification
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-orange-600/10 border border-orange-600/20">
                    <h6 className="font-semibold text-orange-300 text-sm mb-1">
                      Trailer Number
                    </h6>
                    <p className="text-xs text-gray-300">
                      Optional but recommended for complete records
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 shadow-xl">
            <CardHeader className="border-b border-gray-600 pb-4">
              <CardTitle className="flex items-center gap-4 text-white text-xl">
                <div className="p-2 bg-purple-600/20 rounded-lg">
                  <div className="w-4 h-4 text-purple-400 font-bold">🔄</div>
                </div>
                Registration Workflow
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mx-auto mb-2">
                      1
                    </div>
                    <h6 className="font-semibold text-purple-300 text-sm">
                      Access Form
                    </h6>
                    <p className="text-xs text-gray-400 mt-1">
                      Navigate to Register page
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mx-auto mb-2">
                      2
                    </div>
                    <h6 className="font-semibold text-purple-300 text-sm">
                      Fill Details
                    </h6>
                    <p className="text-xs text-gray-400 mt-1">
                      Complete vehicle information
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mx-auto mb-2">
                      3
                    </div>
                    <h6 className="font-semibold text-purple-300 text-sm">
                      Validate
                    </h6>
                    <p className="text-xs text-gray-400 mt-1">
                      Check unique vehicle number
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mx-auto mb-2">
                      4
                    </div>
                    <h6 className="font-semibold text-purple-300 text-sm">
                      Save Record
                    </h6>
                    <p className="text-xs text-gray-400 mt-1">
                      Create permanent database entry
                    </p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-purple-600/10 border border-purple-600/20">
                  <h6 className="font-semibold text-purple-300 text-sm mb-2">
                    Registration Benefits:
                  </h6>
                  <ul className="text-xs text-gray-300 space-y-1">
                    <li>• Permanent vehicle database</li>
                    <li>• Unique identification system</li>
                    <li>• Data integrity and validation</li>
                    <li>• Audit trail maintenance</li>
                    <li>• Search and retrieval capabilities</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      id: "dashboard-search",
      title: "Dashboard & Data Management",
      icon: <BarChart3 className="h-5 w-5" />,
      roles: ["manager", "admin"],
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-950/20 to-orange-900/20 border border-orange-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-600/20 rounded-xl">
                <BarChart3 className="h-6 w-6 text-orange-400" />
              </div>
              <div>
                <h4 className="font-bold text-orange-100 text-xl mb-3">
                  Dashboard & Data Management System
                </h4>
                <p className="text-orange-300 text-base leading-relaxed mb-4">
                  Comprehensive dashboard for viewing, searching, and managing
                  vehicle data with advanced filtering and export capabilities.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 rounded-xl bg-orange-600/10 border border-orange-600/20">
                    <h5 className="font-semibold text-orange-300 text-sm mb-2">
                      Purpose
                    </h5>
                    <p className="text-xs text-gray-300">
                      Data visualization, search, and management for all vehicle
                      records
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-600/20">
                    <h5 className="font-semibold text-blue-300 text-sm mb-2">
                      Access Level
                    </h5>
                    <p className="text-xs text-gray-300">
                      Manager and Admin roles only
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-6">
              <div className="bg-gradient-to-br from-orange-600 to-orange-800 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold flex-shrink-0 mt-1 shadow-lg">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white text-lg mb-3">
                  Access Dashboard
                </h4>
                <p className="text-gray-300 text-base leading-relaxed mb-3">
                  Navigate to &ldquo;Search&rdquo; page from the sidebar menu.
                </p>
                <div className="p-4 rounded-xl bg-orange-600/10 border border-orange-600/20">
                  <h5 className="font-semibold text-orange-300 text-sm mb-2">
                    Dashboard Overview:
                  </h5>
                  <ul className="text-xs text-gray-300 space-y-1">
                    <li>• Real-time data loading from database</li>
                    <li>• Statistics and metrics calculation</li>
                    <li>• User permission verification</li>
                    <li>• Search interface initialization</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="bg-gradient-to-br from-orange-600 to-orange-800 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold flex-shrink-0 mt-1 shadow-lg">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white text-lg mb-3">
                  View Statistics & Data
                </h4>
                <p className="text-gray-300 text-base leading-relaxed mb-3">
                  Dashboard displays comprehensive statistics and vehicle data
                  with filtering options.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-orange-600/10 border border-orange-600/20">
                    <h5 className="font-semibold text-orange-300 text-sm mb-2">
                      Available Statistics
                    </h5>
                    <ul className="text-xs text-gray-300 space-y-1">
                      <li>• Total vehicle entries count</li>
                      <li>• Today&apos;s entries</li>
                      <li>• This week&apos;s entries</li>
                      <li>• This month&apos;s entries</li>
                      <li>• Total registered vehicles</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-600/20">
                    <h5 className="font-semibold text-blue-300 text-sm mb-2">
                      Data Display
                    </h5>
                    <ul className="text-xs text-gray-300 space-y-1">
                      <li>• Vehicle entry records</li>
                      <li>• Vehicle registration data</li>
                      <li>• Date and time stamps</li>
                      <li>• User activity logs</li>
                      <li>• System performance metrics</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="bg-gradient-to-br from-orange-600 to-orange-800 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold flex-shrink-0 mt-1 shadow-lg">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white text-lg mb-3">
                  Use Advanced Search & Filters
                </h4>
                <p className="text-gray-300 text-base leading-relaxed mb-3">
                  Utilize search functionality and filters to find specific
                  vehicle records and data.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-orange-600/10 border border-orange-600/20">
                    <h5 className="font-semibold text-orange-300 text-sm mb-2">
                      Search Options
                    </h5>
                    <p className="text-xs text-gray-300">
                      Search by vehicle number, driver name, or customer name
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-600/20">
                    <h5 className="font-semibold text-blue-300 text-sm mb-2">
                      Date Filters
                    </h5>
                    <p className="text-xs text-gray-300">
                      Filter by specific date ranges or periods
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-green-600/10 border border-green-600/20">
                    <h5 className="font-semibold text-green-300 text-sm mb-2">
                      Status Filters
                    </h5>
                    <p className="text-xs text-gray-300">
                      Filter by entry status or registration type
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="bg-gradient-to-br from-orange-600 to-orange-800 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold flex-shrink-0 mt-1 shadow-lg">
                4
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white text-lg mb-3">
                  Export & Manage Data
                </h4>
                <p className="text-gray-300 text-base leading-relaxed mb-3">
                  Export filtered data and manage records with various
                  administrative functions.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-orange-600/10 border border-orange-600/20">
                    <h5 className="font-semibold text-orange-300 text-sm mb-2">
                      Export Functions
                    </h5>
                    <p className="text-xs text-gray-300">
                      Download data in CSV, Excel, or PDF formats
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-600/20">
                    <h5 className="font-semibold text-blue-300 text-sm mb-2">
                      Data Management
                    </h5>
                    <p className="text-xs text-gray-300">
                      View, edit, or delete records as needed
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-green-600/10 border border-green-600/20">
                    <h5 className="font-semibold text-green-300 text-sm mb-2">
                      Analytics
                    </h5>
                    <p className="text-xs text-gray-300">
                      Generate reports and analyze trends
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 shadow-xl">
              <CardHeader className="border-b border-gray-600 pb-4">
                <CardTitle className="flex items-center gap-4 text-white text-xl">
                  <div className="p-2 bg-orange-600/20 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-orange-500" />
                  </div>
                  Dashboard Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-orange-600/10 border border-orange-600/20">
                    <h6 className="font-semibold text-orange-300 text-sm mb-1">
                      Real-time Statistics
                    </h6>
                    <p className="text-xs text-gray-300">
                      Live updates of vehicle entry counts and metrics
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-600/10 border border-blue-600/20">
                    <h6 className="font-semibold text-blue-300 text-sm mb-1">
                      Data Visualization
                    </h6>
                    <p className="text-xs text-gray-300">
                      Charts and graphs for better data understanding
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-600/10 border border-green-600/20">
                    <h6 className="font-semibold text-green-300 text-sm mb-1">
                      Quick Actions
                    </h6>
                    <p className="text-xs text-gray-300">
                      Fast access to common functions and operations
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-600/10 border border-purple-600/20">
                    <h6 className="font-semibold text-purple-300 text-sm mb-1">
                      System Status
                    </h6>
                    <p className="text-xs text-gray-300">
                      Monitor system health and performance indicators
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 shadow-xl">
              <CardHeader className="border-b border-gray-600 pb-4">
                <CardTitle className="flex items-center gap-4 text-white text-xl">
                  <div className="p-2 bg-blue-600/20 rounded-lg">
                    <Search className="h-6 w-6 text-blue-500" />
                  </div>
                  Search & Filter Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-blue-600/10 border border-blue-600/20">
                    <h6 className="font-semibold text-blue-300 text-sm mb-1">
                      Text Search
                    </h6>
                    <p className="text-xs text-gray-300">
                      Search by vehicle number, driver, or customer name
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-600/10 border border-green-600/20">
                    <h6 className="font-semibold text-green-300 text-sm mb-1">
                      Date Range
                    </h6>
                    <p className="text-xs text-gray-300">
                      Filter by specific date periods or ranges
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-orange-600/10 border border-orange-600/20">
                    <h6 className="font-semibold text-orange-300 text-sm mb-1">
                      Status Filter
                    </h6>
                    <p className="text-xs text-gray-300">
                      Filter by entry status or registration type
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-600/10 border border-purple-600/20">
                    <h6 className="font-semibold text-purple-300 text-sm mb-1">
                      Advanced Filters
                    </h6>
                    <p className="text-xs text-gray-300">
                      Multiple criteria combination for precise results
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 shadow-xl">
            <CardHeader className="border-b border-gray-600 pb-4">
              <CardTitle className="flex items-center gap-4 text-white text-xl">
                <div className="p-2 bg-green-600/20 rounded-lg">
                  <Download className="h-6 w-6 text-green-500" />
                </div>
                Data Export & Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-4 p-4 rounded-xl bg-green-600/10 border border-green-600/20">
                  <h5 className="font-bold text-green-300 text-lg">
                    Export Options
                  </h5>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>CSV format for spreadsheet analysis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Excel format with formatting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>PDF reports for documentation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Filtered data export</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Custom date range exports</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4 p-4 rounded-xl bg-blue-600/10 border border-blue-600/20">
                  <h5 className="font-bold text-blue-300 text-lg">
                    Data Management
                  </h5>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>View detailed record information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Edit existing records</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Delete outdated entries</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Bulk operations support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Data validation checks</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4 p-4 rounded-xl bg-orange-600/10 border border-orange-600/20">
                  <h5 className="font-bold text-orange-300 text-lg">
                    Analytics & Reports
                  </h5>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Trend analysis and charts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Performance metrics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Custom report generation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Data insights and patterns</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Scheduled report delivery</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 shadow-xl">
            <CardHeader className="border-b border-gray-600 pb-4">
              <CardTitle className="flex items-center gap-4 text-white text-xl">
                <div className="p-2 bg-orange-600/20 rounded-lg">
                  <div className="w-4 h-4 text-orange-400 font-bold">📊</div>
                </div>
                Dashboard Workflow
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mx-auto mb-2">
                      1
                    </div>
                    <h6 className="font-semibold text-orange-300 text-sm">
                      Access Dashboard
                    </h6>
                    <p className="text-xs text-gray-400 mt-1">
                      Navigate to Search page
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mx-auto mb-2">
                      2
                    </div>
                    <h6 className="font-semibold text-orange-300 text-sm">
                      View Statistics
                    </h6>
                    <p className="text-xs text-gray-400 mt-1">
                      Check metrics and data
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mx-auto mb-2">
                      3
                    </div>
                    <h6 className="font-semibold text-orange-300 text-sm">
                      Search & Filter
                    </h6>
                    <p className="text-xs text-gray-400 mt-1">
                      Find specific records
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mx-auto mb-2">
                      4
                    </div>
                    <h6 className="font-semibold text-orange-300 text-sm">
                      Export & Manage
                    </h6>
                    <p className="text-xs text-gray-400 mt-1">
                      Download and manage data
                    </p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-orange-600/10 border border-orange-600/20">
                  <h6 className="font-semibold text-orange-300 text-sm mb-2">
                    Dashboard Benefits:
                  </h6>
                  <ul className="text-xs text-gray-300 space-y-1">
                    <li>• Comprehensive data overview</li>
                    <li>• Advanced search capabilities</li>
                    <li>• Multiple export formats</li>
                    <li>• Real-time statistics</li>
                    <li>• Data management tools</li>
                    <li>• Analytics and reporting</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting",
      icon: <AlertTriangle className="h-5 w-5" />,
      roles: ["client", "manager", "admin"],
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-red-950/20 to-red-900/20 border border-red-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-600/20 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <h4 className="font-bold text-red-100 text-xl mb-3">
                  Troubleshooting & Support System
                </h4>
                <p className="text-red-300 text-base leading-relaxed mb-4">
                  Comprehensive guide to resolve common issues, system errors,
                  and get technical support for the ANPR system.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 rounded-xl bg-red-600/10 border border-red-600/20">
                    <h5 className="font-semibold text-red-300 text-sm mb-2">
                      Purpose
                    </h5>
                    <p className="text-xs text-gray-300">
                      Resolve system issues and provide technical support
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-600/20">
                    <h5 className="font-semibold text-blue-300 text-sm mb-2">
                      Support Level
                    </h5>
                    <p className="text-xs text-gray-300">
                      Self-help guides and contact information
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-6">
              <div className="bg-gradient-to-br from-red-600 to-red-800 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold flex-shrink-0 mt-1 shadow-lg">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white text-lg mb-3">
                  Identify the Issue
                </h4>
                <p className="text-gray-300 text-base leading-relaxed mb-3">
                  First, determine the type of problem you&apos;re experiencing
                  and categorize it for proper resolution.
                </p>
                <div className="p-4 rounded-xl bg-red-600/10 border border-red-600/20">
                  <h5 className="font-semibold text-red-300 text-sm mb-2">
                    Common Issue Categories:
                  </h5>
                  <ul className="text-xs text-gray-300 space-y-1">
                    <li>• Form validation errors and field issues</li>
                    <li>• System access and permission problems</li>
                    <li>• Data entry and submission errors</li>
                    <li>• Database connection and storage issues</li>
                    <li>• User interface and navigation problems</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="bg-gradient-to-br from-red-600 to-red-800 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold flex-shrink-0 mt-1 shadow-lg">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white text-lg mb-3">
                  Apply Troubleshooting Steps
                </h4>
                <p className="text-gray-300 text-base leading-relaxed mb-3">
                  Follow the specific troubleshooting steps for your issue
                  category to resolve the problem.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-red-600/10 border border-red-600/20">
                    <h5 className="font-semibold text-red-300 text-sm mb-2">
                      Immediate Actions
                    </h5>
                    <ul className="text-xs text-gray-300 space-y-1">
                      <li>• Check error messages carefully</li>
                      <li>• Verify input data format</li>
                      <li>• Refresh the page</li>
                      <li>• Clear browser cache</li>
                      <li>• Check internet connection</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-600/20">
                    <h5 className="font-semibold text-blue-300 text-sm mb-2">
                      Advanced Steps
                    </h5>
                    <ul className="text-xs text-gray-300 space-y-1">
                      <li>• Check user permissions</li>
                      <li>• Verify database connectivity</li>
                      <li>• Review system logs</li>
                      <li>• Test with different browser</li>
                      <li>• Contact system administrator</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="bg-gradient-to-br from-red-600 to-red-800 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold flex-shrink-0 mt-1 shadow-lg">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white text-lg mb-3">
                  Contact Support if Needed
                </h4>
                <p className="text-gray-300 text-base leading-relaxed mb-3">
                  If the issue persists after following troubleshooting steps,
                  contact technical support for assistance.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-red-600/10 border border-red-600/20">
                    <h5 className="font-semibold text-red-300 text-sm mb-2">
                      Support Channels
                    </h5>
                    <p className="text-xs text-gray-300">
                      Email, phone, or in-person support options
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-600/20">
                    <h5 className="font-semibold text-blue-300 text-sm mb-2">
                      Information to Provide
                    </h5>
                    <p className="text-xs text-gray-300">
                      Error details, steps taken, and system information
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-green-600/10 border border-green-600/20">
                    <h5 className="font-semibold text-green-300 text-sm mb-2">
                      Response Time
                    </h5>
                    <p className="text-xs text-gray-300">
                      Expected resolution timeframes and updates
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 shadow-xl">
              <CardHeader className="border-b border-gray-600 pb-4">
                <CardTitle className="flex items-center gap-4 text-white text-xl">
                  <div className="p-2 bg-red-600/20 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-red-500" />
                  </div>
                  Common Form Issues
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-red-600/10 border border-red-600/20">
                    <h6 className="font-semibold text-red-300 text-sm mb-1">
                      Required Field Errors
                    </h6>
                    <p className="text-xs text-gray-300">
                      Ensure all required fields (*) are completed before
                      submission
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-orange-600/10 border border-orange-600/20">
                    <h6 className="font-semibold text-orange-300 text-sm mb-1">
                      Format Validation
                    </h6>
                    <p className="text-xs text-gray-300">
                      Check phone number format and vehicle number format
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-yellow-600/10 border border-yellow-600/20">
                    <h6 className="font-semibold text-yellow-300 text-sm mb-1">
                      Duplicate Vehicle Numbers
                    </h6>
                    <p className="text-xs text-gray-300">
                      Vehicle registration requires unique vehicle numbers
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-600/10 border border-blue-600/20">
                    <h6 className="font-semibold text-blue-300 text-sm mb-1">
                      Network Issues
                    </h6>
                    <p className="text-xs text-gray-300">
                      Check internet connection and try refreshing the page
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 shadow-xl">
              <CardHeader className="border-b border-gray-600 pb-4">
                <CardTitle className="flex items-center gap-4 text-white text-xl">
                  <div className="p-2 bg-orange-600/20 rounded-lg">
                    <Shield className="h-6 w-6 text-orange-500" />
                  </div>
                  System Access Issues
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-orange-600/10 border border-orange-600/20">
                    <h6 className="font-semibold text-orange-300 text-sm mb-1">
                      Login Problems
                    </h6>
                    <p className="text-xs text-gray-300">
                      Verify username/password and check account status
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-red-600/10 border border-red-600/20">
                    <h6 className="font-semibold text-red-300 text-sm mb-1">
                      Permission Denied
                    </h6>
                    <p className="text-xs text-gray-300">
                      Contact admin to verify user role and permissions
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-yellow-600/10 border border-yellow-600/20">
                    <h6 className="font-semibold text-yellow-300 text-sm mb-1">
                      Session Expired
                    </h6>
                    <p className="text-xs text-gray-300">
                      Re-login if session has timed out
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-600/10 border border-blue-600/20">
                    <h6 className="font-semibold text-blue-300 text-sm mb-1">
                      Browser Compatibility
                    </h6>
                    <p className="text-xs text-gray-300">
                      Use supported browsers: Chrome, Firefox, Safari, Edge
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 shadow-xl">
            <CardHeader className="border-b border-gray-600 pb-4">
              <CardTitle className="flex items-center gap-4 text-white text-xl">
                <div className="p-2 bg-blue-600/20 rounded-lg">
                  <Wrench className="h-6 w-6 text-blue-500" />
                </div>
                Troubleshooting Solutions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-4 p-4 rounded-xl bg-blue-600/10 border border-blue-600/20">
                  <h5 className="font-bold text-blue-300 text-lg">
                    Quick Fixes
                  </h5>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Refresh the browser page</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Clear browser cache and cookies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Check internet connection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Try different browser</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Restart the application</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4 p-4 rounded-xl bg-green-600/10 border border-green-600/20">
                  <h5 className="font-bold text-green-300 text-lg">
                    Data Issues
                  </h5>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Verify all required fields</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Check data format requirements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Ensure unique vehicle numbers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Validate phone number format</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Check for special characters</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4 p-4 rounded-xl bg-orange-600/10 border border-orange-600/20">
                  <h5 className="font-bold text-orange-300 text-lg">
                    System Issues
                  </h5>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Check user permissions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Verify database connection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Review error logs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Check system status</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Contact system administrator</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 shadow-xl">
            <CardHeader className="border-b border-gray-600 pb-4">
              <CardTitle className="flex items-center gap-4 text-white text-xl">
                <div className="p-2 bg-blue-600/20 rounded-lg">
                  <Mail className="h-6 w-6 text-blue-500" />
                </div>
                Contact Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4 p-4 rounded-xl bg-blue-600/10 border border-blue-600/20">
                  <h5 className="font-bold text-blue-300 text-lg">
                    Support Information
                  </h5>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Email: support@anpr-system.com</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Phone: +1 (555) 123-4567</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Hours: Mon-Fri 9:00 AM - 6:00 PM</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Emergency: 24/7 hotline available</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4 p-4 rounded-xl bg-green-600/10 border border-green-600/20">
                  <h5 className="font-bold text-green-300 text-lg">
                    Information to Provide
                  </h5>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Detailed error message</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Steps to reproduce the issue</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Browser and version used</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>User role and permissions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Screenshots if applicable</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 shadow-xl">
            <CardHeader className="border-b border-gray-600 pb-4">
              <CardTitle className="flex items-center gap-4 text-white text-xl">
                <div className="p-2 bg-red-600/20 rounded-lg">
                  <div className="w-4 h-4 text-red-400 font-bold">🔧</div>
                </div>
                Troubleshooting Workflow
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mx-auto mb-2">
                      1
                    </div>
                    <h6 className="font-semibold text-red-300 text-sm">
                      Identify Issue
                    </h6>
                    <p className="text-xs text-gray-400 mt-1">
                      Determine problem type
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mx-auto mb-2">
                      2
                    </div>
                    <h6 className="font-semibold text-red-300 text-sm">
                      Apply Fixes
                    </h6>
                    <p className="text-xs text-gray-400 mt-1">
                      Follow troubleshooting steps
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mx-auto mb-2">
                      3
                    </div>
                    <h6 className="font-semibold text-red-300 text-sm">
                      Test Solution
                    </h6>
                    <p className="text-xs text-gray-400 mt-1">
                      Verify issue is resolved
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mx-auto mb-2">
                      4
                    </div>
                    <h6 className="font-semibold text-red-300 text-sm">
                      Contact Support
                    </h6>
                    <p className="text-xs text-gray-400 mt-1">
                      If issue persists
                    </p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-red-600/10 border border-red-600/20">
                  <h6 className="font-semibold text-red-300 text-sm mb-2">
                    Troubleshooting Benefits:
                  </h6>
                  <ul className="text-xs text-gray-300 space-y-1">
                    <li>• Quick problem resolution</li>
                    <li>• Self-service support</li>
                    <li>• Reduced downtime</li>
                    <li>• Improved user experience</li>
                    <li>• Systematic issue resolution</li>
                    <li>• Professional support backup</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      id: "cctv-anpr",
      title: "CCTV ANPR",
      icon: <Video className="h-5 w-5" />,
      roles: ["client", "manager", "admin"],
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-950/20 to-indigo-900/20 border border-indigo-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-600/20 rounded-xl">
                <Video className="h-6 w-6 text-indigo-400" />
              </div>
              <div>
                <h4 className="font-bold text-indigo-100 text-xl mb-3">
                  CCTV ANPR System
                </h4>
                <p className="text-indigo-300 text-base leading-relaxed mb-4">
                  Advanced Automatic Number Plate Recognition system with
                  real-time CCTV monitoring and automated vehicle detection.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 rounded-xl bg-indigo-600/10 border border-indigo-600/20">
                    <h5 className="font-semibold text-indigo-300 text-sm mb-2">
                      Status
                    </h5>
                    <p className="text-xs text-gray-300">
                      Coming Soon - Under Development
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-600/20">
                    <h5 className="font-semibold text-blue-300 text-sm mb-2">
                      Expected Release
                    </h5>
                    <p className="text-xs text-gray-300">
                      Q2 2025 - Advanced Features
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 shadow-xl">
              <CardHeader className="border-b border-gray-600 pb-4">
                <CardTitle className="flex items-center gap-4 text-white text-xl">
                  <div className="p-2 bg-indigo-600/20 rounded-lg">
                    <Video className="h-6 w-6 text-indigo-500" />
                  </div>
                  Planned Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-indigo-600/10 border border-indigo-600/20">
                    <h6 className="font-semibold text-indigo-300 text-sm mb-1">
                      Real-time Monitoring
                    </h6>
                    <p className="text-xs text-gray-300">
                      Live CCTV feed with automatic number plate detection
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-600/10 border border-blue-600/20">
                    <h6 className="font-semibold text-blue-300 text-sm mb-1">
                      Automated Recognition
                    </h6>
                    <p className="text-xs text-gray-300">
                      AI-powered license plate recognition and vehicle tracking
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-600/10 border border-green-600/20">
                    <h6 className="font-semibold text-green-300 text-sm mb-1">
                      Alert System
                    </h6>
                    <p className="text-xs text-gray-300">
                      Instant notifications for unauthorized vehicles
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-600/10 border border-purple-600/20">
                    <h6 className="font-semibold text-purple-300 text-sm mb-1">
                      Analytics Dashboard
                    </h6>
                    <p className="text-xs text-gray-300">
                      Advanced reporting and traffic flow analysis
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 shadow-xl">
              <CardHeader className="border-b border-gray-600 pb-4">
                <CardTitle className="flex items-center gap-4 text-white text-xl">
                  <div className="p-2 bg-orange-600/20 rounded-lg">
                    <Clock className="h-6 w-6 text-orange-500" />
                  </div>
                  Development Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-orange-600/10 border border-orange-600/20">
                    <h6 className="font-semibold text-orange-300 text-sm mb-1">
                      Phase 1: Core Development
                    </h6>
                    <p className="text-xs text-gray-300">
                      CCTV integration and basic ANPR functionality
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-600/10 border border-blue-600/20">
                    <h6 className="font-semibold text-blue-300 text-sm mb-1">
                      Phase 2: AI Enhancement
                    </h6>
                    <p className="text-xs text-gray-300">
                      Machine learning algorithms and accuracy improvement
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-600/10 border border-green-600/20">
                    <h6 className="font-semibold text-green-300 text-sm mb-1">
                      Phase 3: Advanced Features
                    </h6>
                    <p className="text-xs text-gray-300">
                      Multi-camera support and advanced analytics
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-600/10 border border-purple-600/20">
                    <h6 className="font-semibold text-purple-300 text-sm mb-1">
                      Phase 4: Integration
                    </h6>
                    <p className="text-xs text-gray-300">
                      Full system integration and user training
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div> */}

          {/* <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 shadow-xl">
            <CardHeader className="border-b border-gray-600 pb-4">
              <CardTitle className="flex items-center gap-4 text-white text-xl">
                <div className="p-2 bg-indigo-600/20 rounded-lg">
                  <div className="w-4 h-4 text-indigo-400 font-bold">🚀</div>
                </div>
                Coming Soon Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-4 p-4 rounded-xl bg-indigo-600/10 border border-indigo-600/20">
                  <h5 className="font-bold text-indigo-300 text-lg">
                    Real-time Monitoring
                  </h5>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Live CCTV camera feeds</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Automatic number plate detection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Vehicle tracking and logging</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Multi-camera support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>24/7 automated monitoring</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4 p-4 rounded-xl bg-blue-600/10 border border-blue-600/20">
                  <h5 className="font-bold text-blue-300 text-lg">
                    AI-Powered Recognition
                  </h5>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Advanced OCR technology</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>High accuracy recognition</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Multiple plate format support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Low-light condition handling</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Weather-resistant detection</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4 p-4 rounded-xl bg-green-600/10 border border-green-600/20">
                  <h5 className="font-bold text-green-300 text-lg">
                    Security & Analytics
                  </h5>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Instant security alerts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Traffic flow analysis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Vehicle pattern recognition</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Automated reporting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Integration with existing systems</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 shadow-xl">
            <CardHeader className="border-b border-gray-600 pb-4">
              <CardTitle className="flex items-center gap-4 text-white text-xl">
                <div className="p-2 bg-orange-600/20 rounded-lg">
                  <div className="w-4 h-4 text-orange-400 font-bold">📧</div>
                </div>
                Stay Updated
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-orange-600/10 border border-orange-600/20">
                  <h6 className="font-semibold text-orange-300 text-sm mb-2">
                    Get Notified When Available:
                  </h6>
                  <ul className="text-xs text-gray-300 space-y-1">
                    <li>• Subscribe to our newsletter for updates</li>
                    <li>• Contact sales team for early access</li>
                    <li>• Follow our development blog</li>
                    <li>• Join beta testing program</li>
                    <li>• Request demo when ready</li>
                  </ul>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-600/20">
                    <h6 className="font-semibold text-blue-300 text-sm mb-2">
                      Contact Sales
                    </h6>
                    <p className="text-xs text-gray-300">
                      Email: sales@anpr-system.com
                    </p>
                    <p className="text-xs text-gray-300">
                      Phone: +1 (555) 987-6543
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-green-600/10 border border-green-600/20">
                    <h6 className="font-semibold text-green-300 text-sm mb-2">
                      Development Updates
                    </h6>
                    <p className="text-xs text-gray-300">
                      Blog: dev.anpr-system.com
                    </p>
                    <p className="text-xs text-gray-300">
                      GitHub: github.com/anpr-system
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>
      ),
    },
  ];

  const userRole = user?.role || "client";
  const filteredSections = sections.filter(
    (section) => section.roles?.includes(userRole) || false
  );

  return (
    <ProtectedRoute allowedRoles={["client", "manager", "admin"]}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Enhanced Header */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-6 mb-8">
              <div className="p-5 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <BookOpen className="h-12 w-12 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 bg-clip-text text-transparent mb-2">
                  User Manual
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full"></div>
              </div>
            </div>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8 px-4">
              Complete guide to using the ANPR Vehicle Management System. Learn
              how to register vehicles, manage data, and utilize all system
              features effectively.
            </p>
            {/* <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-gray-800/80 to-gray-700/80 border border-gray-600 rounded-2xl backdrop-blur-sm shadow-lg">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <User className="h-5 w-5 text-blue-400" />
              </div>
              <div className="text-left">
                <span className="text-gray-300 font-semibold text-lg block">
                  {user?.name}
                </span>
                <span className="text-blue-400 text-sm capitalize">
                  {user?.role} Access
                </span>
              </div>
            </div> */}
          </div>

          {/* Enhanced Manual Content */}
          <div className="space-y-8">
            {filteredSections.map((section, index) => (
              <Card
                key={section.id}
                className="overflow-hidden bg-gray-800/80 border-gray-700 backdrop-blur-sm shadow-xl"
              >
                <Collapsible
                  open={openSections.includes(section.id)}
                  onOpenChange={() => toggleSection(section.id)}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer border-b border-gray-700 hover:bg-gray-700/50 transition-all duration-300 p-6">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-6 text-white text-2xl font-bold">
                          <div className="p-3 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-xl shadow-lg">
                            {section.icon}
                          </div>
                          <div>
                            <div className="text-2xl font-bold">
                              {section.title}
                            </div>
                            <div className="text-sm text-gray-400 font-normal mt-1">
                              {section.roles?.length > 1
                                ? "All Roles"
                                : section.roles?.[0] || "All Users"}{" "}
                              Access
                            </div>
                          </div>
                        </CardTitle>
                        <div className="flex items-center gap-4">
                          {/* <Badge
                            variant="outline"
                            className="bg-gray-700/50 text-gray-300 border-gray-600 px-3 py-1 text-sm"
                          >
                            {section.roles.join(", ")}
                          </Badge> */}
                          <div className="p-2 bg-gray-700/50 rounded-lg">
                            {openSections.includes(section.id) ? (
                              <ChevronDown className="h-6 w-6 text-blue-400 transition-transform duration-300" />
                            ) : (
                              <ChevronRight className="h-6 w-6 text-gray-400 transition-transform duration-300" />
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="overflow-hidden transition-all duration-300 ease-in-out">
                    <CardContent className="pt-6">
                      {section.content}
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>

          {/* Enhanced Footer */}
          <div className="mt-20 pt-12 border-t border-gray-700/50">
            <div className="text-center">
              <div className="inline-flex items-center gap-4 mb-6">
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
                <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                ANPR Vehicle Management System
              </h3>
              <p className="text-gray-400 font-medium text-lg mb-4">
                Complete User Manual & Documentation
              </p>
              {/* <div className="inline-flex items-center gap-6 px-8 py-4 bg-gray-800/50 border border-gray-700 rounded-2xl backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-sm text-gray-500">Version</div>
                  <div className="text-blue-400 font-bold">1.0</div>
                </div>
                <div className="w-px h-8 bg-gray-600"></div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Last Updated</div>
                  <div className="text-gray-300 font-medium">December 2024</div>
                </div>
                <div className="w-px h-8 bg-gray-600"></div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Technology</div>
                  <div className="text-gray-300 font-medium">
                    Next.js & TypeScript
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Built with Next.js
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  TypeScript
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Tailwind CSS
                </span>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
