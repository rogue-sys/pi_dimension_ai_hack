"use server";

import { connectDB } from "@/lib/db";
import { Profile } from "@/models/profile.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import { FullProfileSchema } from "@/utils/validations/profile.validation";




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

    let imageUrl: string | undefined;
    const imageFile = formData.get("image") as File | null;
    if (imageFile) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult = await new Promise(
        (resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: "user_profiles", resource_type: "image" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result!);
            }
          ).end(buffer);
        }
      );

      imageUrl = (uploadResult as any)?.secure_url;
    }

    const profile = await Profile.findOneAndUpdate(
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
        ...(imageUrl && { imageUrl }),
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return { success: true, data: profile };
  } catch (err: any) {
    console.error(`SAVE CORE IDENTITY ERROR for user:`, err);
    return { success: false, error: err.message };
  }
}
