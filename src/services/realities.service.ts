"use server";

import { connectDB } from "@/lib/db";
import { RealityResult, RealityResultType } from "@/models/realityResult.model";
import { auth } from "./common.service";

export async function getUserRealities() {
    try {
        await connectDB();

        const session = await auth();
        if (!session || !session.user?.id) {
            return {
                success: false,
                error: "Unauthorized",
                realities: []
            };
        }

        const realities = await RealityResult
            .find({ userId: session.user.id })
            .sort({ createdAt: -1 });

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
