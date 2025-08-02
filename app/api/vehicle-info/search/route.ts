import { NextResponse } from "next/server";
import { VehicleInfoDB } from "@/lib/vehicle-info-db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ vehicles: [] });
    }

    const vehicles = await VehicleInfoDB.searchVehicleInfo(query.trim());

    return NextResponse.json({
      success: true,
      vehicles: vehicles.map((vehicle) => ({
        ...vehicle,
        _id: vehicle._id?.toString() || "",
        createdAt: vehicle.createdAt?.toISOString(),
        updatedAt: vehicle.updatedAt?.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Error searching vehicle info:", error);
    return NextResponse.json(
      {
        error: "Failed to search vehicle info",
      },
      { status: 500 }
    );
  }
}
