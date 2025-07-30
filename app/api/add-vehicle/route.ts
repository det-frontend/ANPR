import { NextResponse } from "next/server";
import { VehicleDB } from "@/lib/db-helper";
import { VehicleInput } from "@/lib/types";

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

    // Note: Removed duplicate check to allow multiple entries with same truck number
    // This allows the same truck to make multiple deliveries/entries

    // Create new vehicle
    const vehicleData: VehicleInput = {
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
        _id: vehicle._id?.toString() || "",
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
