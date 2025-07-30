export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { VehicleDB } from "@/lib/db-helper";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const plate = searchParams.get("plate");

    if (!plate) {
      return NextResponse.json(
        { error: "Plate number is required" },
        { status: 400 }
      );
    }

    const vehicle = await VehicleDB.findByPlate(plate);

    if (vehicle) {
      return NextResponse.json({
        exists: true,
        vehicle: {
          ...vehicle,
          _id: vehicle._id?.toString() || "",
        },
      });
    } else {
      return NextResponse.json({
        exists: false,
        vehicle: null,
      });
    }
  } catch (error) {
    console.error("Error checking plate:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
