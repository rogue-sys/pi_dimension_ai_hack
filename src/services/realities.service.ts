"use server";

import { connectDB } from "@/lib/db";
import { RealityResult, RealityResultType } from "@/models/realityResult.model";
import { auth } from "./common.service";
import { redirect } from "next/navigation";
import { fetchGeminiContent } from "@/utils/gemini";

export async function getUserRealities() {
    const session = await auth();
    if (!session || !session.user?.id) {
        redirect('/')
    }
    try {
        await connectDB();


        const realities = await RealityResult
            .find({ userId: session.user.id })
            .sort({ createdAt: -1 });

        console.log(realities)
        return {
            success: true,
            realities: JSON.parse(JSON.stringify(realities)) as RealityResultType[],
        };
    } catch (error) {
        console.error("Error fetching realities:", error);
        return {
            success: false,
            error: "Failed to fetch realities",
            realities: []
        };
    }
}

export async function getRealityById(id: string) {
    try {
        await connectDB();

        const session = await auth();
        if (!session || !session.user?.id) {
            return {
                success: false,
                error: "Unauthorized",
                reality: null
            };
        }

        const reality = await RealityResult.findOne({
            _id: id,
            userId: session.user.id,
        });


        if (!reality) {
            return {
                success: false,
                error: "Reality not found",
                reality: null
            };
        }

        return {
            success: true,
            reality: JSON.parse(JSON.stringify(reality)) as RealityResultType,
        };

    } catch (error) {
        console.error("Error fetching reality by ID:", error);
        return {
            success: false,
            error: "Failed to fetch reality",
            reality: null
        };
    }
}


export async function updateRealityWithActivity(id: string) {
    try {
        await connectDB();

        // Authenticate user
        const session = await auth();
        if (!session || !session.user?.id) {
            return { success: false, error: "Unauthorized", reality: null };
        }

        // Fetch existing reality
        const reality = await RealityResult.findOne({
            _id: id,
            userId: session.user.id,
        });

        if (!reality) {
            return { success: false, error: "Reality not found", reality: null };
        }

        const systemPrompt = `
      You are an AI assistant tasked with creating a realistic current activity for a character.
      Use the character's archetype, personality traits, backstory, daily routine, strengths, weaknesses, and friends/rivals.
      Provide output in the following JSON format:
      {
        "content": "<what he is doing now>",
        "time": "<ISO timestamp>",
        "coordinate": "latitude, longitude"
      }
    `;

        const pastActivities = reality.generatedProfile.what_is_he_doing_now
            ?.map(
                (act, idx) =>
                    `Activity ${idx + 1}: "${act.content}" at ${act.time} (Location: ${act.coordinate})`
            )
            .join("\n");

        const userQuery = `
      Character Data:
      Name: ${reality.generatedProfile.name}
      Archetype: ${reality.generatedProfile.archetype}
      Backstory: ${reality.generatedProfile.backstory}
      Personality Traits: ${reality.generatedProfile.personality_traits.join(", ")}
      Daily Routine: ${reality.generatedProfile.daily_routine}
      Strengths: ${reality.generatedProfile.strengths.join(", ")}
      Weaknesses: ${reality.generatedProfile.weaknesses.join(", ")}
      Friends: ${reality.generatedProfile.friends_and_rivals.friends.join(", ")}
      Rivals: ${reality.generatedProfile.friends_and_rivals.rivals.join(", ")}
      Previous Activities: ${pastActivities || "None"}
    `;

        const geminiResponse = await fetchGeminiContent(userQuery, systemPrompt);

        let newActivity;
        try {
            // Extract JSON object from Gemini output
            const jsonMatch = geminiResponse.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("No JSON found in Gemini output");

            newActivity = JSON.parse(jsonMatch[0]);

            // Validate fields
            if (!newActivity.content || !newActivity.time || !newActivity.coordinate) {
                throw new Error("Invalid Gemini output");
            }
        } catch (err) {
            console.error("Failed to parse Gemini response:", err);

            // Fallback if parsing fails
            newActivity = {
                content: geminiResponse, // raw text if JSON parsing failed
                time: new Date().toISOString(),
                coordinate: "Unknown",
            };
        }
        reality.generatedProfile.what_is_he_doing_now.push(newActivity);
        await reality.save();

        console.log(reality?.generatedProfile?.what_is_he_doing_now)
        return { success: true, reality: JSON.parse(JSON.stringify(reality)) as RealityResultType };
    } catch (err: any) {
        console.error("Error updating reality with activity:", err);
        return { success: false, error: err.message, reality: null };
    }
}
