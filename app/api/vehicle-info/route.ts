export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { VehicleInfoDB } from "@/lib/vehicle-info-db";

// GET - Get all vehicle info
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    console.log("API: Search parameter:", search);

    let vehicles;
    if (search && search.trim()) {
      console.log("API: Searching for:", search);
      vehicles = await VehicleInfoDB.searchVehicleInfo(search.trim());
    } else {
      console.log("API: Getting all vehicles");
      vehicles = await VehicleInfoDB.getAllVehicleInfo();
    }

    console.log("API: Found vehicles:", vehicles.length);

    return NextResponse.json({
      success: true,
      vehicles: vehicles.map((vehicle) => ({
        ...vehicle,
        _id: vehicle._id?.toString(),
        createdAt: vehicle.createdAt?.toISOString(),
        updatedAt: vehicle.updatedAt?.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Error fetching vehicle info:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Add new vehicle info
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      vehicleNumber,
      driverName,
      driverPhone,
      trailerNumber,
      customerName,
      companyName,
    } = body;

    // Validation
    if (
      !vehicleNumber ||
      !driverName ||
      !driverPhone ||
      !trailerNumber ||
      !customerName ||
      !companyName
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: vehicleNumber, driverName, driverPhone, trailerNumber, customerName, companyName",
        },
        { status: 400 }
      );
    }

    // Create new vehicle info
    const vehicleData = {
      vehicleNumber,
      driverName,
      driverPhone,
      trailerNumber,
      customerName,
      companyName,
    };

    const newVehicle = await VehicleInfoDB.addVehicleInfo(vehicleData);

    return NextResponse.json(
      {
        success: true,
        vehicle: {
          ...newVehicle,
          _id: newVehicle._id?.toString(),
          createdAt: newVehicle.createdAt?.toISOString(),
          updatedAt: newVehicle.updatedAt?.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding vehicle info:", error);

    if (error instanceof Error && error.message.includes("already exists")) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
