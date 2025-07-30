import { NextResponse, NextRequest } from "next/server";
import { AuthService } from "@/lib/auth";
import { hash } from "bcryptjs";

export async function GET() {
  try {
    const users = await AuthService.getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, role, username, password } = await req.json();

    // Validate required fields
    if (!email || !role || !username || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    const userData = {
      username,
      email,
      password: hashedPassword,
      role,
      name: username, // Use username as name for backward compatibility
    };

    const newUser = await AuthService.createUser(userData);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
