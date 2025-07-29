import { NextResponse } from "next/server";
import { VehicleDB } from "@/lib/db-helper";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
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
      queueNumber,
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

    // Check if vehicle already exists
    const existingVehicle = await VehicleDB.findByPlate(truckNumber);
    if (existingVehicle) {
      return NextResponse.json(
        {
          error: "Vehicle with this truck number already exists",
        },
        { status: 409 }
      );
    }

    // Create new vehicle
    const vehicleData = {
      orderNumber,
      companyName,
      customerName,
      orderDate: new Date(orderDate),
      truckNumber,
      trailerNumber: trailerNumber || "",
      driverName,
      driverPhoneNumber: driverPhoneNumber || "",
      numberOfDrums,
      amountInLiters,
      tankNumber,
      queueNumber,
    };

    const vehicle = await VehicleDB.addVehicle(vehicleData);

    return NextResponse.json({
      success: true,
      vehicle: {
        ...vehicle,
        _id: vehicle._id?.toString(),
        createdAt: vehicle.createdAt?.toISOString(),
        updatedAt: vehicle.updatedAt?.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error adding vehicle:", error);
    return NextResponse.json(
      {
        error: "Failed to add vehicle",
      },
      { status: 500 }
    );
  }
}
