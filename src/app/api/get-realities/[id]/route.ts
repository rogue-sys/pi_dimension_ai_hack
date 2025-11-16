import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { RealityResult } from "@/models/realityResult.model";
import { connectDB } from "@/lib/db";

export async function GET(req: NextRequest) {
  console.log("===== GET SINGLE REALITY START =====");

  try {
    await connectDB();

    // Extract ID from the URL
    const url = new URL(req.url);
    const parts = url.pathname.split("/");
    const id = parts[parts.length - 1]; // last segment = id

    console.log("Requested reality ID:", id);

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid reality ID" },
        { status: 400 }
      );
    }

    const reality = await RealityResult.findById(id).lean();
    console.log("Fetched reality from DB:", reality);

    if (!reality) {
      return NextResponse.json(
        { success: false, error: "Reality not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: reality });
  } catch (err) {
    console.error("Error fetching single reality:", err);
    return NextResponse.json(
      { success: false, error: "Server error fetching reality" },
      { status: 500 }
    );
  } finally {
    console.log("===== GET SINGLE REALITY END =====");
  }
}
