import { NextResponse } from "next/server";
import { VehicleDB } from "@/lib/db-helper";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const queueNumber = await VehicleDB.generateQueueNumber();

    return NextResponse.json({
      success: true,
      queueNumber,
    });
  } catch (error) {
    console.error("Error generating queue number:", error);
    return NextResponse.json(
      {
        error: "Failed to generate queue number",
      },
      { status: 500 }
    );
  }
}
