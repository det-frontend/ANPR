export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { VehicleInfoDB } from "@/lib/vehicle-info-db";

// POST - Seed sample vehicle info data
export async function POST(request: NextRequest) {
  try {
    await VehicleInfoDB.seedSampleData();

    return NextResponse.json({
      success: true,
      message: "Sample vehicle info data seeded successfully",
    });
  } catch (error) {
    console.error("Error seeding vehicle info data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Clear all vehicle info data
export async function DELETE(request: NextRequest) {
  try {
    await VehicleInfoDB.clearAllData();

    return NextResponse.json({
      success: true,
      message: "All vehicle info data cleared successfully",
    });
  } catch (error) {
    console.error("Error clearing vehicle info data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
