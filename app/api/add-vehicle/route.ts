export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { VehicleDB, Vehicle } from "@/lib/db-helper";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      orderNumber,
      customerLevel1,
      customerLevel2,
      orderDate,
      queueNumber,
      truckNumber,
      trailerNumber,
      driverName,
      driverPhoneNumber,
      dam_capacity,
    } = body;

    // Validation
    if (
      !orderNumber ||
      !customerLevel1 ||
      !customerLevel2 ||
      !orderDate ||
      !truckNumber ||
      !driverName
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: orderNumber, customerLevel1, customerLevel2, orderDate, truckNumber, driverName",
        },
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
    const vehicleData: Omit<Vehicle, "_id" | "createdAt" | "updatedAt"> = {
      orderNumber,
      customerLevel1,
      customerLevel2,
      orderDate: orderDate ? new Date(orderDate) : new Date(),
      queueNumber: queueNumber || "",
      truckNumber,
      trailerNumber: trailerNumber || "",
      driverName,
      driverPhoneNumber: driverPhoneNumber || "",
      dam_capacity: dam_capacity || "",
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
