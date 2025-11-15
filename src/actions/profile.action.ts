"use server";

import { connectDB } from "@/lib/db";
import { Profile } from "@/models/profile.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import { FullProfileSchema } from "@/utils/validations/profile.validation";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function saveCoreIdentity(formData: FormData) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user) return { success: false, error: "Unauthorized" };

    const userId = session.user.id;

    const json = JSON.parse(formData.get("data") as string);
    const parsed = FullProfileSchema.safeParse(json);

    if (!parsed.success) {
      return {
        success: false,
        error: "Validation failed",
        issues: parsed.error.flatten().fieldErrors,
      };
    }

    const {
      appearance,
      dateOfBirth,
      personality,
      additionalTraits,
      vibeStyle,
      sexuality,
      gender,
      interests,
      preference,
    } = parsed.data;

    let profile_pic: string | undefined;
    const profilePicFile = formData.get("profile_pic") as File | null;
    if (profilePicFile) {
      const arrayBuffer = await profilePicFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "user_profiles", resource_type: "image" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result!);
          }
        ).end(buffer);
      });

      profile_pic = (uploadResult as any)?.secure_url;
    }

    const additionalFiles = formData.getAll("imageUrls") as File[];
    const imageUrls: string[] = [];

    for (const file of additionalFiles) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "user_profiles", resource_type: "image" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result!);
          }
        ).end(buffer);
      });

      imageUrls.push((uploadResult as any)?.secure_url);
    }

    if (imageUrls.length < 3) {
      return { success: false, error: "Please upload at least 3 additional images." };
    }

     await Profile.findOneAndUpdate(
      { userId },
      {
        appearance,
        dateOfBirth,
        personality,
        additionalTraits,
        vibeStyle,
        sexuality,
        gender,
        interests,
        preference,
        ...(profile_pic && { profile_pic }),
        ...(imageUrls.length > 0 && { imageUrls }),
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

  } catch (err: any) {
    console.error(`SAVE CORE IDENTITY ERROR for user:`, err);
    return { success: false, error: err.message };
  }
  revalidatePath('/')
  redirect('/')
}
