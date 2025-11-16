import { NextRequest, NextResponse } from "next/server";
import { generateReality } from "@/actions/quantumConfig.action";
import { connectDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    // 1. Ensure database is connected
    await connectDB();

    // 2. Parse request body
    const body = await req.json();

    // body should include: { archetype, universeFocus, corePersonality }
    if (!body.archetype || !body.universeFocus || !body.corePersonality) {
      return NextResponse.json({
        success: false,
        error: "Missing required fields",
      });
    }

    // 3. Call the reality generation action
    const result = await generateReality(body);

    // 4. Return the result
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("REALITY API ERROR:", err);
    return NextResponse.json({ success: false, error: err.message });
  }
}
