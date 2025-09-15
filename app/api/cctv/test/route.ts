import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Test endpoint to simulate CCTV plate recognition
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plateNumber, testType = "registered" } = body;

    if (!plateNumber) {
      return NextResponse.json(
        { error: "Plate number is required for testing" },
        { status: 400 }
      );
    }

    // Simulate CCTV detection data
    const cctvData = {
      plateNumber,
      timestamp: new Date().toISOString(),
      ipAddress: "192.168.1.101",
      cameraName: "Main Entrance Camera",
      location: "Main Entrance",
      zone: "Zone A",
      confidence: 0.95,
      imageUrl: `https://example.com/cctv-images/${plateNumber}-${Date.now()}.jpg`,
    };

    // Call the plate recognition API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/cctv/plate-recognition`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cctvData),
      }
    );

    if (!response.ok) {
      throw new Error(`Plate recognition API failed: ${response.statusText}`);
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: "CCTV test completed successfully",
      testData: cctvData,
      result,
    });
  } catch (error) {
    console.error("CCTV test error:", error);
    return NextResponse.json(
      {
        error: "CCTV test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET endpoint to get test scenarios
export async function GET() {
  const testScenarios = [
    {
      id: "registered-vehicle",
      name: "Registered Vehicle Test",
      description: "Test with a vehicle that exists in the system",
      plateNumber: "TRK-001",
      expectedResult: "Gate should open",
    },
    {
      id: "unregistered-vehicle",
      name: "Unregistered Vehicle Test",
      description: "Test with a vehicle that doesn't exist in the system",
      plateNumber: "UNKNOWN-123",
      expectedResult: "Gate should remain closed",
    },
    {
      id: "random-plate",
      name: "Random Plate Test",
      description: "Test with a randomly generated plate number",
      plateNumber: `TEST-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      expectedResult: "Gate should remain closed",
    },
  ];

  return NextResponse.json({
    success: true,
    testScenarios,
    instructions: {
      title: "CCTV Testing Instructions",
      steps: [
        "1. First, ensure you have some vehicles in your system (use the seed data API if needed)",
        "2. Use the POST endpoint with a plate number to simulate CCTV detection",
        "3. Check the response to see if the gate control action is correct",
        "4. Monitor the CCTV dashboard to see the event logged",
        "5. Test both registered and unregistered vehicles",
      ],
    },
  });
}
