"use server";
import { authOptions } from "@/lib/auth";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { connectDB } from "@/lib/db";
import { IUser, User } from "@/models/user.model";
import { SafeUserType } from "@/types/user.type";
import { getServerSession } from "next-auth";

export const auth =  async()=>{
  return await getServerSession(authOptions);
}

export const getProfile = async (): Promise<{
  success: boolean;
  error?: string;
  data: { profile: SafeUserType } | null;
}> => {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized", data: null };
    }

    const userId = session.user.id;
    const user = (await User.findById(userId)
      .select("-password -resetToken -verificationToken")
      .lean()) as (IUser & { createdAt?: Date }) | null;

    if (!user) {
      return { success: false, error: "User not found", data: null };
    }


    return {
      success: true,
      data: {
        profile: {
          id: (user as any)._id.toString(),
          name: user.name,
          email: user.email,
          profile_url: user.profile_url,
          provider: user.provider,
          role: user.role,
          createdAt: user.createdAt?.toISOString() || null,
        } as SafeUserType,
      },
    };
  } catch (error: any) {
    console.error("Error in getProfileAndWishlist:", error);
    return { success: false, error: error.message || "Internal server error", data: null };
  }
};
