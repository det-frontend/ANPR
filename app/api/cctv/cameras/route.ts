import { NextRequest, NextResponse } from "next/server";
import { CCTVEventDBInstance } from "@/lib/cctv-db";

export const dynamic = "force-dynamic";

// GET - Get all cameras
export async function GET() {
  try {
    const cameras = await CCTVEventDBInstance.getAllCameras();
    return NextResponse.json({
      success: true,
      cameras,
    });
  } catch (error) {
    console.error("Error fetching cameras:", error);
    return NextResponse.json(
      { error: "Failed to fetch cameras" },
      { status: 500 }
    );
  }
}

// POST - Add new camera
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cameraId, cameraName, location, zone, ipAddress, targetGateIds } =
      body;

    // Validation
    if (!cameraId || !cameraName || !location || !zone) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: cameraId, cameraName, location, zone",
        },
        { status: 400 }
      );
    }

    const camera = await CCTVEventDBInstance.addCamera({
      cameraId,
      cameraName,
      location,
      zone,
      ipAddress: ipAddress || "",
      isActive: true,
      targetGateIds: targetGateIds || [],
    });

    return NextResponse.json({
      success: true,
      camera,
    });
  } catch (error) {
    console.error("Error adding camera:", error);
    return NextResponse.json(
      { error: "Failed to add camera" },
      { status: 500 }
    );
  }
}
