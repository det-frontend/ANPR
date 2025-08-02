import { ObjectId } from "mongodb";

// Base Vehicle interface for database operations
export interface Vehicle {
  _id?: ObjectId;
  queueNumber: string; // Auto generated, reset by day
  orderNumber: string;
  orderDate: Date;
  companyName: string; // Changed from customerLevel1
  customerName: string; // Changed from customerLevel2
  truckNumber: string;
  trailerNumber: string;
  driverName: string;
  driverPhoneNumber: string;
  numberOfDrums: number; // Changed from dam_capacity
  amountInLiters: number; // New field
  tankNumber: number; // New field (1-6)
  createdAt: Date;
  updatedAt: Date;
}

// Vehicle interface for API responses (with string IDs and optional fields for backward compatibility)
export interface VehicleResponse {
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

// Vehicle input interface for creating new vehicles
export interface VehicleInput {
  orderNumber: string;
  companyName: string;
  customerName: string;
  orderDate: Date;
  truckNumber: string;
  trailerNumber: string;
  driverName: string;
  driverPhoneNumber: string;
  numberOfDrums: number;
  amountInLiters: number;
  tankNumber: number;
  queueNumber?: string; // Optional, will be auto-generated if not provided
}

// Form data interface for AddVehicleForm
export interface VehicleFormData {
  orderNumber: string;
  companyName: string;
  customerName: string;
  orderDate: Date;
  truckNumber: string;
  trailerNumber: string;
  driverName: string;
  driverPhoneNumber: string;
  numberOfDrums: string;
  amountInLiters: string;
  tankNumber: string;
}
