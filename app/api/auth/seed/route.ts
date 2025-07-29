import { NextResponse } from "next/server";
import { AuthService } from "@/lib/auth";

export async function POST() {
  try {
    await AuthService.seedDefaultUsers();

    return NextResponse.json({
      success: true,
      message: "Default users created successfully",
      users: {
        manager: {
          username: "manager",
          password: "manager123",
          role: "manager",
        },
        client: {
          username: "client",
          password: "client123",
          role: "client",
        },
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed users" },
      { status: 500 }
    );
  }
}
