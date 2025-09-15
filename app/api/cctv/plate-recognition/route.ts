import { NextRequest, NextResponse } from "next/server";
import { VehicleDB } from "@/lib/db-helper";
import { VehicleInfoDB } from "@/lib/vehicle-info-db";
import { CCTVEventDBInstance } from "@/lib/cctv-db";

export const dynamic = "force-dynamic";

interface CCTVPlateData {
  plateNumber: string;
  timestamp: string;
  ipAddress: string;
  cameraName?: string;
  location?: string;
  zone?: string;
  confidence?: number;
  imageUrl?: string;
}

interface GateControlResponse {
  action: "open" | "close" | "deny";
  message: string;
  vehicle?: any;
  targetGates: Array<{
    gateId: string;
    gateName: string;
    gateStatus: "opening" | "closing" | "open" | "closed";
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const body: CCTVPlateData = await request.json();
    const {
      plateNumber,
      timestamp,
      ipAddress,
      cameraName,
      location,
      zone,
      confidence,
      imageUrl,
    } = body;

    // Validate required fields
    if (!plateNumber || !timestamp || !ipAddress) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: plateNumber, timestamp, and ipAddress are required",
        },
        { status: 400 }
      );
    }

    // Get camera information by IP
    const camera = await CCTVEventDBInstance.getCameraByIp(ipAddress);
    if (!camera) {
      return NextResponse.json(
        { error: `Camera ${ipAddress} not found in system` },
        { status: 404 }
      );
    }

    // Get target gates for this camera
    const targetGates = await CCTVEventDBInstance.getTargetGatesForCamera(
      camera.cameraId
    );
    if (targetGates.length === 0) {
      return NextResponse.json(
        { error: `No target gates configured for camera ${ipAddress}` },
        { status: 400 }
      );
    }

    // Log the CCTV detection
    console.log(
      `CCTV Detection: Plate ${plateNumber} detected at ${timestamp}`,
      {
        ipAddress,
        cameraId: camera.cameraId,
        cameraName: cameraName || camera.cameraName,
        location: location || camera.location,
        zone: zone || camera.zone,
        confidence,
        imageUrl,
        targetGates: targetGates.map((g) => g.gateName),
      }
    );

    // Check if vehicle exists in the system
    const vehicle = await VehicleDB.findByPlate(plateNumber);
    const vehicleInfo = await VehicleInfoDB.findByVehicleNumber(plateNumber);

    let gateResponse: GateControlResponse;

    if (vehicle || vehicleInfo) {
      // Vehicle is registered - allow entry
      const vehicleData = vehicle || vehicleInfo;

      // Open all target gates for this camera
      const gateActions = await Promise.all(
        targetGates.map(async (gate) => {
          await CCTVEventDBInstance.updateGateStatus(
            gate.gateId,
            true,
            "opened",
            plateNumber,
            "CCTV System"
          );

          // Log gate event
          await CCTVEventDBInstance.addGateEvent({
            gateId: gate.gateId,
            gateName: gate.gateName,
            action: "open",
            plateNumber,
            operatorId: "CCTV System",
            reason: "Automatic gate opening for registered vehicle",
            cameraId: camera.cameraId,
            cameraName: cameraName || camera.cameraName,
            timestamp: new Date(),
            success: true,
          });

          return {
            gateId: gate.gateId,
            gateName: gate.gateName,
            gateStatus: "opening" as const,
          };
        })
      );

      gateResponse = {
        action: "open",
        message: `Vehicle ${plateNumber} is registered. Opening ${targetGates.length} gate(s).`,
        vehicle: vehicleData,
        targetGates: gateActions,
      };

      // Log successful entry
      console.log(
        `Gates opened for registered vehicle: ${plateNumber} at gates: ${targetGates.map((g) => g.gateName).join(", ")}`
      );

      // Here you would integrate with your actual gate control system
      // For example: await controlGates(targetGates, "open", plateNumber);
    } else {
      // Vehicle not registered - deny entry
      const gateActions = targetGates.map((gate) => ({
        gateId: gate.gateId,
        gateName: gate.gateName,
        gateStatus: "closed" as const,
      }));

      gateResponse = {
        action: "deny",
        message: `Vehicle ${plateNumber} is not registered. Access denied.`,
        targetGates: gateActions,
      };

      // Log denied entry
      console.log(
        `Access denied for unregistered vehicle: ${plateNumber} at camera: ${camera.cameraName}`
      );
    }

    // Store the CCTV event in database
    const cctvEvent = await CCTVEventDBInstance.addCCTVEvent({
      plateNumber,
      timestamp: new Date(timestamp),
      cameraId: camera.cameraId,
      cameraName: cameraName || camera.cameraName,
      location: location || camera.location,
      zone: zone || camera.zone,
      confidence: confidence || 0,
      imageUrl: imageUrl || "",
      action: gateResponse.action,
      vehicleFound: !!(vehicle || vehicleInfo),
      vehicleData: vehicle || vehicleInfo,
      targetGateId: targetGates[0]?.gateId,
      targetGateName: targetGates[0]?.gateName,
      gateStatus: gateResponse.targetGates[0]?.gateStatus || "closed",
    });

    return NextResponse.json({
      success: true,
      plateNumber,
      timestamp,
      gateControl: gateResponse,
      event: cctvEvent,
    });
  } catch (error) {
    console.error("CCTV plate recognition error:", error);
    return NextResponse.json(
      { error: "Failed to process plate recognition" },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve recent CCTV events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const plateNumber = searchParams.get("plate");

    const events = await CCTVEventDBInstance.getRecentCCTVEvents(
      limit,
      plateNumber || undefined
    );
    const stats = await CCTVEventDBInstance.getCCTVStats();

    return NextResponse.json({
      success: true,
      events,
      stats,
      total: events.length,
    });
  } catch (error) {
    console.error("Error fetching CCTV events:", error);
    return NextResponse.json(
      { error: "Failed to fetch CCTV events" },
      { status: 500 }
    );
  }
}
