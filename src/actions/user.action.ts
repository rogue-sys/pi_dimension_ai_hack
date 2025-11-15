"use server";

import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";
import { registerSchema } from "@/utils/validations/user.validation";
import z from "zod";
import cloudinary from "@/lib/cloudinary";
import { UploadApiResponse } from "cloudinary";
import { auth } from "@/services/common.service";

const updateNameSchema = registerSchema.pick({ name: true });

export async function updateProfileName(data: { name: string }) {
    try {
        const parsed = updateNameSchema.safeParse(data);
        if (!parsed.success) {
            return {
                success: false,
                status: 400,
                error: parsed.error.issues[0]?.message || "Invalid input",
            };
        }

        await connectDB();
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, status: 401, error: "Unauthorized" };
        }

        const updated = await User.findByIdAndUpdate(
            session.user.id,
            { name: parsed.data.name },
            { new: true }
        ).lean();

        if (!updated) {
            return { success: false, status: 404, error: "User not found" };
        }

        return {
            success: true,
            status: 200,
            message: "Profile updated successfully",
            name: data?.name
        };
    } catch (error) {
        console.error("updateProfileName error:", error);
        return { success: false, status: 500, error: "Internal Server Error" };
    }
}

const updateProfilePictureSchema = z.object({
  file: z.instanceof(File, { message: "File is required" }),
});

export async function updateProfilePicture(data: { file: File }) {
  try {
    const parsed = updateProfilePictureSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        status: 400,
        error: parsed.error.issues[0]?.message || "Invalid input",
      };
    }

    await connectDB();

    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, status: 401, error: "Unauthorized" };
    }

    const arrayBuffer = await data.file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise<UploadApiResponse>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "profile_pictures" }, (error, result) => {
            if (error) reject(error);
            else resolve(result!);
          })
          .end(buffer);
      }
    );

    const updated = await User.findByIdAndUpdate(
      session.user.id,
      { profile_url: uploadResult.secure_url },
      { new: true }
    ).lean();

    if (!updated) {
      return { success: false, status: 404, error: "User not found" };
    }

    return {
      success: true,
      status: 200,
      message: "Profile picture updated successfully",
      profile_url: uploadResult.secure_url,
    };
  } catch (error) {
    console.error("updateProfilePicture error:", error);
    return { success: false, status: 500, error: "Internal Server Error" };
  }
}