"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";

import { IUser, User } from "@/models/user.model";
import { Profile, UserProfile } from "@/models/profile.model";

import { SafeUserType } from "@/types/user.type";

export const auth = async () => {
  return await getServerSession(authOptions);
};

export const getProfile = async (): Promise<{
  success: boolean;
  error?: string;
  data:
  | {
    user: SafeUserType;
    profile: UserProfile | null;
  }
  | null;
}> => {
  try {
    await connectDB();

    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized", data: null };
    }

    const userId = session.user.id;

    const user = (await User.findById(userId)
      .select("-password -resetToken -verificationToken")
      .lean()) as IUser & { createdAt?: Date } | null;

    if (!user) {
      return { success: false, error: "User not found", data: null };
    }

    const profile = (await Profile.findOne({ userId }).lean()) as
      | UserProfile
      | null;

    return {
      success: true,
      data: {
        user: {
          id: (user as any)._id.toString(),
          name: user.name,
          email: user.email,
          profile_url: user.profile_url,
          provider: user.provider,
          role: user.role,
          createdAt: user.createdAt?.toISOString() ?? null,
        },

        profile: profile
          ? JSON.parse(JSON.stringify(profile))
          : null,
      },
    };
  } catch (error: any) {
    console.error("Error in getProfile:", error);
    return {
      success: false,
      error: error.message || "Internal server error",
      data: null,
    };
  }
};
