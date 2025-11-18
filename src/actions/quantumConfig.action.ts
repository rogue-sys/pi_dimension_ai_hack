"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Profile } from "@/models/profile.model";
import { RealityResult } from "@/models/realityResult.model";
import { revalidatePath } from "next/cache";
import { fetchGeminiContent } from "../utils/gemini";
import mongoose from "mongoose";

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

    // 3️⃣ Enhanced World-Building Prompt
    const systemPrompt = `
You are an advanced world-simulation AI tasked with generating detailed alternate-universe doppelganger identities.
Your job is to merge the user’s real traits with the selected archetype, universe-focus, language, and place,
and produce a fully consistent, lore-accurate, place-aware alternate reality profile.

Your output MUST:
1. Be valid JSON.
2. Exactly match the RealityResult.generatedProfile schema.
3. Be highly descriptive, imaginative, and immersive.
4. Be written COMPLETELY in the user's selected language.
5. Strongly incorporate the user's selected real-world place:
   - The alternate reality must include this place's environment, culture, people, traditions, climate, architecture, food, lifestyle, and world perception.
   - The place should influence personality, backstory, and current reality.
6. Remain internally consistent with all traits provided.
7. Include a "what_is_he_doing_now" array, structured exactly as shown.
8. Contain no commentary, no explanations, and no extra text outside the JSON.

The generated JSON MUST match this schema EXACTLY:

{
  "archetype": "string",
  "name": "string",
  "alternate_universe_dob": "string",
  "backstory": "1 paragraph, 6-10 sentences, very detailed and narrative",
  "personality_traits": ["trait1", "trait2", "trait3", "trait4", "trait5"],
  "what_is_he_doing_now": [
    {
      "content": "Describe the current activity in vivid detail",
      "time": "ISO 8601 timestamp",
      "coordinate": "latitude, longitude or fictional coordinates"
    }
  ],
  "location_coordinates": "latitude, longitude",
  "daily_routine": "1 immersive narrative paragraph",
  "portrait": "Very detailed visual description (no image)",
  "major_achievements": [
    "achievement1",
    "achievement2"
  ],
  "strengths": [
    "strength1",
    "strength2"
  ],
  "weaknesses": [
    "weakness1",
    "weakness2"
  ],
  "friends_and_rivals": {
    "friends": ["friend1", "friend2"],
    "rivals": ["rival1"]
  },
  "secrets_and_quirks": [
    "secret or quirk 1",
    "secret or quirk 2"
  ],
  "favorite_quotes": [
    "quote1",
    "quote2"
  ]
}

ADDITIONAL REQUIREMENTS:
- Archetype controls the world's logic, culture, tone, and role.
- Universe focus changes environment, lifestyle, and worldview.
- Output language MUST be exactly the user's selected language with no mixing.
- The user’s selected place must shape:
  * traditions
  * geography
  * architecture
  * climate
  * daily life
  * cultural norms
  * personality development
  * backstory and achievements
  * current surroundings
- Personality must be a recognizable but exaggerated reflection of the user's traits.
- Backstory must include origins, emotional depth, cultural influences from the chosen place, and major turning points.
- Achievements must be earned and specific.
- Weaknesses must be psychologically meaningful.
- Coordinates MUST make sense for the world or fictional universe.
- "what_is_he_doing_now" must be an array of objects exactly like:
  { "content": "<activity description>", "time": "<ISO timestamp>", "coordinate": "<location>" }
- NO extra text outside the JSON.
`;

    const userQuery = `
USER TRAITS:
- Name: ${profile.name}
- Actual Appearance: ${profile.appearance}
- Date of Birth: ${profile.dateOfBirth}
- Personality Keywords: ${profile.personality}
- Additional Traits: ${profile.additionalTraits}
- Vibe / Style: ${profile.vibeStyle}
- Sexuality: ${profile.sexuality}
- Gender: ${profile.gender}
- Interests: ${profile.interests.join(", ")}
- Preference: ${profile.preference}
- Place/Nationality: ${profile.place}

USER CUSTOMIZATION:
- Selected Output Language: ${profile.language}
- User's Selected Place to Integrate Into Reality: ${profile.place}

SELECTED UNIVERSE INPUTS:
- Archetype: "${quantumData.archetype}"
- Universe Focus: "${quantumData.universeFocus}"
- Core Personality Modifier: "${quantumData.corePersonality}"
`;

    const aiOutput = await fetchGeminiContent(userQuery, systemPrompt);

    let parsedOutput: any;
    try {
      const jsonMatch = aiOutput.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found in AI output");
      parsedOutput = JSON.parse(jsonMatch[0]);
      if (!Array.isArray(parsedOutput.what_is_he_doing_now)) {
        parsedOutput.what_is_he_doing_now = [];
      }
    } catch (err) {
      console.error("Failed to parse AI JSON:", err, aiOutput);
      return { success: false, error: "AI returned invalid JSON" };
    }

    const savedResult = await RealityResult.create({
      userId: new mongoose.Types.ObjectId(userId),
      generatedProfile: parsedOutput,
    });
    console.log("Saved RealityResult _id:", savedResult._id);

    return { success: true, realityId: savedResult._id };
  } catch (err: any) {
    console.error("GENERATE REALITY ERROR:", err);
    return { success: false, error: err.message };
  }
}
