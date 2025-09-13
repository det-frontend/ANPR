import { NextRequest, NextResponse } from "next/server";
import { CCTVEventDBInstance } from "@/lib/cctv-db";

export const dynamic = "force-dynamic";

interface GateControlRequest {
  action: "open" | "close" | "status";
  plateNumber?: string;
  reason?: string;
  operatorId?: string;
}

// PUT - Control specific gate
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ gateId: string }> }
) {
  try {
    const { gateId } = await params;
    const body: GateControlRequest = await request.json();
    const { action, plateNumber, reason, operatorId } = body;

    if (!action) {
      return NextResponse.json(
        { error: "Action is required (open, close, or status)" },
        { status: 400 }
      );
    }

    // Get gate information
    const gate = await CCTVEventDBInstance.getGateById(gateId);
    if (!gate) {
      return NextResponse.json(
        { error: `Gate ${gateId} not found` },
        { status: 404 }
      );
    }

    let response: any = {
      success: true,
      action,
      gateId,
      gateName: gate.gateName,
      timestamp: new Date().toISOString(),
    };

    switch (action) {
      case "open":
        if (gate.isOpen) {
          response.message = `Gate ${gate.gateName} is already open`;
          response.gateStatus = gate;
        } else {
          // Update gate status
          const updatedGate = await CCTVEventDBInstance.updateGateStatus(
            gateId,
            true,
            "opened",
            plateNumber,
            operatorId
          );

          // Log gate event
          await CCTVEventDBInstance.addGateEvent({
            gateId,
            gateName: gate.gateName,
            action: "open",
            plateNumber,
            operatorId,
            reason,
            timestamp: new Date(),
            success: true,
          });

          response.message = `Gate ${gate.gateName} opening...`;
          response.gateStatus = updatedGate;

          console.log(
            `Gate ${gate.gateName} opened by ${operatorId || "System"}`
          );

          // Here you would integrate with your actual gate control hardware
          // await openGate(gateId, plateNumber, operatorId);

          // Simulate auto-close after 30 seconds
          setTimeout(async () => {
            await CCTVEventDBInstance.updateGateStatus(
              gateId,
              false,
              "auto-closed",
              plateNumber,
              "System"
            );
            console.log(`Gate ${gate.gateName} auto-closed`);
          }, 30000);
        }
        break;

      case "close":
        if (!gate.isOpen) {
          response.message = `Gate ${gate.gateName} is already closed`;
          response.gateStatus = gate;
        } else {
          // Update gate status
          const updatedGate = await CCTVEventDBInstance.updateGateStatus(
            gateId,
            false,
            "closed",
            plateNumber,
            operatorId
          );

          // Log gate event
          await CCTVEventDBInstance.addGateEvent({
            gateId,
            gateName: gate.gateName,
            action: "close",
            plateNumber,
            operatorId,
            reason,
            timestamp: new Date(),
            success: true,
          });

          response.message = `Gate ${gate.gateName} closing...`;
          response.gateStatus = updatedGate;

          console.log(
            `Gate ${gate.gateName} closed by ${operatorId || "System"}`
          );

          // Here you would integrate with your actual gate control hardware
          // await closeGate(gateId, operatorId);
        }
        break;

      case "status":
        response.message = `Gate ${gate.gateName} status retrieved`;
        response.gateStatus = gate;
        break;

      default:
        return NextResponse.json(
          { error: "Invalid action. Use 'open', 'close', or 'status'" },
          { status: 400 }
        );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Gate control error:", error);
    return NextResponse.json(
      { error: "Failed to control gate" },
      { status: 500 }
    );
  }
}

// GET - Get gate status
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gateId: string }> }
) {
  try {
    const { gateId } = await params;
    const gate = await CCTVEventDBInstance.getGateById(gateId);

    if (!gate) {
      return NextResponse.json(
        { error: `Gate ${gateId} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      gate,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error getting gate status:", error);
    return NextResponse.json(
      { error: "Failed to get gate status" },
      { status: 500 }
    );
  }
}
