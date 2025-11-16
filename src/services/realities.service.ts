"use server";

import { connectDB } from "@/lib/db";
import { RealityResult, RealityResultType } from "@/models/realityResult.model";
import { auth } from "./common.service";
import { redirect } from "next/navigation";

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