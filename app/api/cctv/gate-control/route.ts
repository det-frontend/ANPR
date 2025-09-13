import { NextRequest, NextResponse } from "next/server";
import { CCTVEventDBInstance } from "@/lib/cctv-db";

export const dynamic = "force-dynamic";

interface GateControlRequest {
  action: "open" | "close" | "status";
  plateNumber?: string;
  reason?: string;
  operatorId?: string;
}

interface GateStatus {
  isOpen: boolean;
  lastAction: string;
  lastActionTime: string;
  plateNumber?: string;
  operatorId?: string;
}

// Mock gate status - in production, this would be stored in database or connected to actual gate hardware
let gateStatus: GateStatus = {
  isOpen: false,
  lastAction: "closed",
  lastActionTime: new Date().toISOString(),
};

export async function POST(request: NextRequest) {
  try {
    const body: GateControlRequest = await request.json();
    const { action, plateNumber, reason, operatorId } = body;

    if (!action) {
      return NextResponse.json(
        { error: "Action is required (open, close, or status)" },
        { status: 400 }
      );
    }

    let response: any = {
      success: true,
      action,
      timestamp: new Date().toISOString(),
    };

    switch (action) {
      case "open":
        if (gateStatus.isOpen) {
          response.message = "Gate is already open";
          response.gateStatus = gateStatus;
        } else {
          // Simulate gate opening process
          gateStatus = {
            isOpen: true,
            lastAction: "opened",
            lastActionTime: new Date().toISOString(),
            plateNumber,
            operatorId,
          };

          response.message = "Gate opening...";
          response.gateStatus = gateStatus;

          // Log gate opening
          console.log(
            `Gate opened for vehicle: ${plateNumber || "Manual"} by operator: ${operatorId || "System"}`
          );

          // Log gate event
          await CCTVEventDBInstance.addGateEvent({
            action: "open",
            plateNumber,
            operatorId,
            reason,
            timestamp: new Date(),
            success: true,
          });

          // Here you would integrate with your actual gate control hardware
          // await openGate(plateNumber, operatorId);

          // Simulate gate closing after 30 seconds (in production, this might be triggered by vehicle sensor)
          setTimeout(() => {
            gateStatus = {
              ...gateStatus,
              isOpen: false,
              lastAction: "auto-closed",
              lastActionTime: new Date().toISOString(),
            };
            console.log(`Gate auto-closed after vehicle passed`);
          }, 30000);
        }
        break;

      case "close":
        if (!gateStatus.isOpen) {
          response.message = "Gate is already closed";
          response.gateStatus = gateStatus;
        } else {
          gateStatus = {
            isOpen: false,
            lastAction: "closed",
            lastActionTime: new Date().toISOString(),
            plateNumber,
            operatorId,
          };

          response.message = "Gate closing...";
          response.gateStatus = gateStatus;

          // Log gate closing
          console.log(`Gate closed by operator: ${operatorId || "System"}`);

          // Log gate event
          await CCTVEventDBInstance.addGateEvent({
            action: "close",
            plateNumber,
            operatorId,
            reason,
            timestamp: new Date(),
            success: true,
          });

          // Here you would integrate with your actual gate control hardware
          // await closeGate(operatorId);
        }
        break;

      case "status":
        response.message = "Gate status retrieved";
        response.gateStatus = gateStatus;
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

// GET endpoint to check gate status
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      gateStatus,
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
