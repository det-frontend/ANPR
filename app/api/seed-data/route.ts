export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { VehicleDB } from "@/lib/db-helper";
import { VehicleInput } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const sampleVehicles: VehicleInput[] = [
      {
        orderNumber: "ORD-001",
        companyName: "ABC Logistics",
        customerName: "Warehouse A",
        orderDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
        truckNumber: "TRK-001",
        trailerNumber: "TRL-001",
        driverName: "John Smith",
        driverPhoneNumber: "+1234567890",
        numberOfDrums: 20,
        amountInLiters: 5000,
        tankNumber: 1,
      },
      {
        orderNumber: "ORD-002",
        companyName: "XYZ Transport",
        customerName: "Distribution Center",
        orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        truckNumber: "TRK-002",
        trailerNumber: "TRL-002",
        driverName: "Jane Doe",
        driverPhoneNumber: "+1234567891",
        numberOfDrums: 25,
        amountInLiters: 6250,
        tankNumber: 2,
      },
      {
        orderNumber: "ORD-003",
        companyName: "ABC Logistics",
        customerName: "Warehouse B",
        orderDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
        truckNumber: "TRK-003",
        trailerNumber: "TRL-003",
        driverName: "Mike Johnson",
        driverPhoneNumber: "+1234567892",
        numberOfDrums: 18,
        amountInLiters: 4500,
        tankNumber: 3,
      },
      {
        orderNumber: "ORD-004",
        companyName: "Fast Freight",
        customerName: "Main Hub",
        orderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        truckNumber: "TRK-004",
        trailerNumber: "TRL-004",
        driverName: "Sarah Wilson",
        driverPhoneNumber: "+1234567893",
        numberOfDrums: 22,
        amountInLiters: 5500,
        tankNumber: 4,
      },
      {
        orderNumber: "ORD-005",
        companyName: "XYZ Transport",
        customerName: "Secondary Hub",
        orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        truckNumber: "TRK-005",
        trailerNumber: "TRL-005",
        driverName: "John Smith",
        driverPhoneNumber: "+1234567890",
        numberOfDrums: 30,
        amountInLiters: 7500,
        tankNumber: 5,
      },
      {
        orderNumber: "ORD-006",
        companyName: "ABC Logistics",
        customerName: "Warehouse A",
        orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        truckNumber: "TRK-006",
        trailerNumber: "TRL-006",
        driverName: "Jane Doe",
        driverPhoneNumber: "+1234567891",
        numberOfDrums: 15,
        amountInLiters: 3750,
        tankNumber: 6,
      },
      {
        orderNumber: "ORD-007",
        companyName: "Fast Freight",
        customerName: "Main Hub",
        orderDate: new Date(), // Today
        truckNumber: "TRK-007",
        trailerNumber: "TRL-007",
        driverName: "Mike Johnson",
        driverPhoneNumber: "+1234567892",
        numberOfDrums: 28,
        amountInLiters: 7000,
        tankNumber: 1,
      },
    ];

    const addedVehicles = [];

    for (const vehicleData of sampleVehicles) {
      try {
        const vehicle = await VehicleDB.addVehicle(vehicleData);
        addedVehicles.push(vehicle);
      } catch (error) {
        console.log(
          `Vehicle ${vehicleData.truckNumber} might already exist, skipping...`
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Added ${addedVehicles.length} sample vehicles`,
        vehicles: addedVehicles,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error seeding data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
