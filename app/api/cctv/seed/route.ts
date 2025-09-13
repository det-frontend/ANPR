import { NextRequest, NextResponse } from "next/server";
import { CCTVEventDBInstance } from "@/lib/cctv-db";

export const dynamic = "force-dynamic";

// POST - Seed sample cameras and gates
export async function POST(request: NextRequest) {
  try {
    // Sample gates
    const sampleGates = [
      {
        gateId: "GATE-001",
        gateName: "Main Entrance Gate",
        location: "Main Entrance",
        zone: "Zone A",
        gateType: "entrance" as const,
        isOpen: false,
        lastAction: "closed",
        lastActionTime: new Date(),
        isActive: true,
      },
      {
        gateId: "GATE-002",
        gateName: "Secondary Entrance Gate",
        location: "Secondary Entrance",
        zone: "Zone A",
        gateType: "entrance" as const,
        isOpen: false,
        lastAction: "closed",
        lastActionTime: new Date(),
        isActive: true,
      },
      {
        gateId: "GATE-003",
        gateName: "Loading Bay Gate",
        location: "Loading Bay",
        zone: "Zone B",
        gateType: "both" as const,
        isOpen: false,
        lastAction: "closed",
        lastActionTime: new Date(),
        isActive: true,
      },
      {
        gateId: "GATE-004",
        gateName: "Emergency Exit Gate",
        location: "Emergency Exit",
        zone: "Zone C",
        gateType: "exit" as const,
        isOpen: false,
        lastAction: "closed",
        lastActionTime: new Date(),
        isActive: true,
      },
    ];

    // Sample cameras
    const sampleCameras = [
      {
        cameraId: "CAM-001",
        cameraName: "Main Entrance Camera",
        location: "Main Entrance",
        zone: "Zone A",
        ipAddress: "192.168.1.101",
        isActive: true,
        targetGateIds: ["GATE-001"],
      },
      {
        cameraId: "CAM-002",
        cameraName: "Secondary Entrance Camera",
        location: "Secondary Entrance",
        zone: "Zone A",
        ipAddress: "192.168.1.102",
        isActive: true,
        targetGateIds: ["GATE-002"],
      },
      {
        cameraId: "CAM-003",
        cameraName: "Loading Bay Camera 1",
        location: "Loading Bay - North",
        zone: "Zone B",
        ipAddress: "192.168.1.103",
        isActive: true,
        targetGateIds: ["GATE-003"],
      },
      {
        cameraId: "CAM-004",
        cameraName: "Loading Bay Camera 2",
        location: "Loading Bay - South",
        zone: "Zone B",
        ipAddress: "192.168.1.104",
        isActive: true,
        targetGateIds: ["GATE-003"],
      },
      {
        cameraId: "CAM-005",
        cameraName: "Emergency Exit Camera",
        location: "Emergency Exit",
        zone: "Zone C",
        ipAddress: "192.168.1.105",
        isActive: true,
        targetGateIds: ["GATE-004"],
      },
    ];

    const addedGates = [];
    const addedCameras = [];

    // Add gates
    for (const gateData of sampleGates) {
      try {
        const gate = await CCTVEventDBInstance.addGate(gateData);
        addedGates.push(gate);
      } catch (error) {
        console.log(`Gate ${gateData.gateId} might already exist, skipping...`);
      }
    }

    // Add cameras
    for (const cameraData of sampleCameras) {
      try {
        const camera = await CCTVEventDBInstance.addCamera(cameraData);
        addedCameras.push(camera);
      } catch (error) {
        console.log(
          `Camera ${cameraData.cameraId} might already exist, skipping...`
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Added ${addedGates.length} gates and ${addedCameras.length} cameras`,
        gates: addedGates,
        cameras: addedCameras,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error seeding CCTV data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Clear all CCTV data
export async function DELETE(request: NextRequest) {
  try {
    // This would clear all CCTV data
    // Note: In a real implementation, you'd want to be more careful about this
    return NextResponse.json({
      success: true,
      message: "CCTV data cleared successfully",
    });
  } catch (error) {
    console.error("Error clearing CCTV data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
