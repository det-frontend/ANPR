import { NextResponse } from "next/server";
import { VehicleDB } from "@/lib/db-helper";

export async function GET() {
  try {
    console.log("GET /api/vehicles called");
    const vehicles = await VehicleDB.getAllVehicles();
    console.log("Retrieved vehicles from DB:", vehicles.length);

    const response = {
      vehicles: vehicles.map((vehicle) => ({
        ...vehicle,
        _id: vehicle._id?.toString(),
      })),
    };

    console.log("Sending response:", response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error getting vehicles:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error", details: errorMessage },
      { status: 500 }
    );
  }
}
