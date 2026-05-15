import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role = "SALES", companyName, inviteCode } = await req.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare user data
    const userData: any = {
      email,
      name,
      password: hashedPassword,
      role,
    };

    // If admin signup, add company name
    if (role === "ADMIN") {
      if (!companyName) {
        return NextResponse.json(
          { message: "Company name is required for admin signup" },
          { status: 400 }
        );
      }
      userData.companyName = companyName;
    }

    // If worker signup, validate invite code
    if (role === "SALES" || role === "MANAGER") {
      if (!inviteCode) {
        return NextResponse.json(
          { message: "Invite code is required for worker signup" },
          { status: 400 }
        );
      }
      // For now, we'll use inviteCode as companyId
      // In future, you can add an Invitations table to validate properly
      userData.companyId = inviteCode;
    }

    // Create user
    const user = await prisma.user.create({
      data: userData,
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}