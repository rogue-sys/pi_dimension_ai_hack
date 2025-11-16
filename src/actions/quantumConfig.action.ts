"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Profile } from "@/models/profile.model";
import { RealityResult } from "@/models/realityResult.model";
import { revalidatePath } from "next/cache";
import { fetchGeminiContent } from "../utils/gemini";

export async function generateReality(quantumData: {
  archetype: string;
  universeFocus: string;
  corePersonality: string;
}) {
  try {
    // 1️⃣ Get user session
    const session = await getServerSession(authOptions);
    if (!session?.user) return { success: false, error: "Unauthorized" };
    const userId = session.user.id;

    // 2️⃣ Fetch user profile
    const profileDoc = await Profile.findOne({ userId });
    if (!profileDoc) return { success: false, error: "User profile not found" };
    const profile = profileDoc.toObject();

    // 3️⃣ Prepare AI prompt
    const systemPrompt = `
You are generating an alternate-universe doppelganger profile.
Return output ONLY in valid JSON, EXACTLY in this format:
{
  "alternate_universe_dob": "string",
  "backstory": "1 detailed paragraph",
  "personality_traits": ["trait1", "trait2", "trait3"],
  "location_coordinates": "latitude, longitude",
  "daily_routine": "1 paragraph",
  "major_achievements": ["achievement1", "achievement2"],
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "friends_and_rivals": {
    "friends": ["friend1", "friend2"],
    "rivals": ["rival1"]
  },
  "secrets_and_quirks": ["secret or quirk 1", "secret or quirk 2"],
  "favorite_quotes": ["quote1", "quote2"]
}
`;

    const userQuery = `
USER TRAITS:
- Name / Designation: ${profile.appearance}
- Appearance: ${profile.appearance}
- Date of Birth: ${profile.dateOfBirth}
- Personality Keywords: ${profile.personality}
- Additional Traits: ${profile.additionalTraits}
- Vibe / Style: ${profile.vibeStyle}
- Sexuality: ${profile.sexuality}
- Gender: ${profile.gender}
- Interests: ${profile.interests.join(", ")}
- Preference: ${profile.preference}

SELECTED UNIVERSE:
- Archetype: "${quantumData.archetype}"
- Universe Focus: "${quantumData.universeFocus}"
- Core Personality Input: "${quantumData.corePersonality}"
`;

    // 4️⃣ Call Gemini API
    const aiOutput = await fetchGeminiContent(userQuery, systemPrompt);

    // 5️⃣ Extract JSON safely
    let parsedOutput: any;
    try {
      const jsonMatch = aiOutput.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found in AI output");
      parsedOutput = JSON.parse(jsonMatch[0]);
    } catch (err) {
      console.error("Failed to parse AI JSON:", err, aiOutput);
      return { success: false, error: "AI returned invalid JSON" };
    }

    // 6️⃣ Save each result under `generatedProfile`
    const savedResult = await RealityResult.create({
      userId,
      generatedProfile: parsedOutput,
      createdAt: new Date(),
    });

    console.log("Saved RealityResult _id:", savedResult._id);

    console.log("Saved RealityResult:", savedResult);

    // 7️⃣ Revalidate home page if needed
    revalidatePath("/");

    // ✅ Return properly for frontend
    return { 
  success: true, 
  realityId: savedResult._id  // <-- return at top-level
};


  } catch (err: any) {
    console.error("GENERATE REALITY ERROR:", err);
    return { success: false, error: err.message };
  }
}
