import { NextResponse, NextRequest } from "next/server";
import { AuthService } from "@/lib/auth";
import { hash } from "bcryptjs";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { email, role, username, password } = await req.json();

    if (!email || !role || !username) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {
      email,
      role,
      username,
      name: username, // Use username as name for backward compatibility
    };

    // Hash password if provided
    if (password) {
      const hashedPassword = await hash(password, 12);
      updateData.password = hashedPassword;
    }

    await AuthService.updateUser(id, updateData);

    return NextResponse.json({ _id: id, email, role, username });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await AuthService.deleteUser(id);
    return NextResponse.json({ _id: id });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
