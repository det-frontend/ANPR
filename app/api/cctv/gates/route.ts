import { NextRequest, NextResponse } from "next/server";
import { CCTVEventDBInstance } from "@/lib/cctv-db";

export const dynamic = "force-dynamic";

// GET - Get all gates
export async function GET() {
  try {
    const gates = await CCTVEventDBInstance.getAllGates();
    return NextResponse.json({
      success: true,
      gates,
    });
  } catch (error) {
    console.error("Error fetching gates:", error);
    return NextResponse.json(
      { error: "Failed to fetch gates" },
      { status: 500 }
    );
  }
}

// POST - Add new gate
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gateId, gateName, location, zone, gateType } = body;

    // Validation
    if (!gateId || !gateName || !location || !zone || !gateType) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: gateId, gateName, location, zone, gateType",
        },
        { status: 400 }
      );
    }

    const gate = await CCTVEventDBInstance.addGate({
      gateId,
      gateName,
      location,
      zone,
      gateType,
      isOpen: false,
      lastAction: "closed",
      lastActionTime: new Date(),
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      gate,
    });
  } catch (error) {
    console.error("Error adding gate:", error);
    return NextResponse.json({ error: "Failed to add gate" }, { status: 500 });
  }
}
