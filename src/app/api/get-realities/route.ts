import { NextRequest, NextResponse } from "next/server";
import { RealityResult } from "@/models/realityResult.model";
import { connectDB } from "@/lib/db";

export async function GET(req: NextRequest) {
  console.log("===== GET ALL REALITIES START =====");

  try {
    await connectDB(); // ensure DB connection

    // Fetch latest realities, sorted by creation date descending
    const realities = await RealityResult.find()
      .sort({ createdAt: -1 })
      .lean();

    // Filter out entries without generatedProfile
    const filtered = realities.filter(r => r.generatedProfile);

    return NextResponse.json({ success: true, data: filtered });
  } catch (err) {
    console.error("Error fetching all realities:", err);
    return NextResponse.json(
      { success: false, error: "Server error fetching realities" },
      { status: 500 }
    );
  } finally {
    console.log("===== GET ALL REALITIES END =====");
  }
}
