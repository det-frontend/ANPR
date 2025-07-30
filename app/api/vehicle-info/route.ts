import { NextResponse } from "next/server";
import { VehicleInfoDB } from "@/lib/vehicle-info-db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    console.log("GET /api/vehicle-info called");
    const vehicleInfo = await VehicleInfoDB.getAllVehicleInfo();
    console.log("Retrieved vehicle info from DB:", vehicleInfo.length);

    const response = {
      vehicles: vehicleInfo.map((info) => ({
        ...info,
        _id: info._id?.toString() || "",
        createdAt: info.createdAt?.toISOString(),
        updatedAt: info.updatedAt?.toISOString(),
      })),
    };

    console.log("Sending response:", response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error getting vehicle info:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("POST /api/vehicle-info called with body:", body);

    const {
      vehicleNumber,
      driverName,
      driverPhone,
      trailerNumber,
      customerName,
      companyName,
    } = body;

    // Validation
    if (!vehicleNumber || !driverName || !customerName || !companyName) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: vehicleNumber, driverName, customerName, companyName",
        },
        { status: 400 }
      );
    }

    const vehicleData = {
      vehicleNumber,
      driverName,
      driverPhone: driverPhone || "",
      trailerNumber: trailerNumber || "",
      customerName,
      companyName,
    };

    const vehicle = await VehicleInfoDB.addVehicleInfo(vehicleData);

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
    console.error("Error adding vehicle info:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to add vehicle info",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
