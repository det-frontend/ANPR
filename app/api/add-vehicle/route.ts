export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { VehicleDB, Vehicle } from "@/lib/db-helper";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      orderNumber,
      companyName,
      customerName,
      orderDate,
      truckNumber,
      trailerNumber,
      driverName,
      driverPhoneNumber,
      numberOfDrums,
      amountInLiters,
      tankNumber,
    } = body;

    // Validation
    if (
      !orderNumber ||
      !companyName ||
      !customerName ||
      !orderDate ||
      !truckNumber ||
      !driverName ||
      numberOfDrums === undefined ||
      amountInLiters === undefined ||
      tankNumber === undefined
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: orderNumber, companyName, customerName, orderDate, truckNumber, driverName, numberOfDrums, amountInLiters, tankNumber",
        },
        { status: 400 }
      );
    }

    // Validate tank number (1-6)
    if (tankNumber < 1 || tankNumber > 6) {
      return NextResponse.json(
        { error: "Tank number must be between 1 and 6" },
        { status: 400 }
      );
    }

    // Check if vehicle already exists (by truckNumber)
    const existingVehicle = await VehicleDB.findByPlate(truckNumber);
    if (existingVehicle) {
      return NextResponse.json(
        { error: "Vehicle with this truck number already exists" },
        { status: 409 }
      );
    }

    // Create new vehicle
    const vehicleData: Omit<
      Vehicle,
      "_id" | "createdAt" | "updatedAt" | "queueNumber"
    > = {
      orderNumber,
      companyName,
      customerName,
      orderDate: orderDate ? new Date(orderDate) : new Date(),
      truckNumber,
      trailerNumber: trailerNumber || "",
      driverName,
      driverPhoneNumber: driverPhoneNumber || "",
      numberOfDrums: Number(numberOfDrums),
      amountInLiters: Number(amountInLiters),
      tankNumber: Number(tankNumber),
    };

    const newVehicle = await VehicleDB.addVehicle(vehicleData);

    return NextResponse.json(
      {
        success: true,
        vehicle: {
          ...newVehicle,
          _id: newVehicle._id?.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding vehicle:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
