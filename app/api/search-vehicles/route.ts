import { NextResponse } from "next/server";
import { VehicleDB } from "@/lib/db-helper";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ vehicles: [] });
    }

    const vehicles = await VehicleDB.searchVehiclesByTruckNumber(query.trim());

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
    console.error("Error searching vehicles:", error);
    return NextResponse.json(
      {
        error: "Failed to search vehicles",
      },
      { status: 500 }
    );
  }
}
