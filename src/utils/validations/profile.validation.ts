import { z } from "zod";

export const FullProfileSchema = z.object({
  appearance: z.string().min(2, "Full name / designation is required"),
  dateOfBirth: z.string().min(1, "Date of Birth is required"),
  personality: z.string().min(5, "Personality details are required ( min 5 characters )"),
  additionalTraits: z.string().min(1, "Additional traits are required"),
  vibeStyle: z.string().min(1, "Vibe / style is required"),
  sexuality: z.string().min(1, "Sexuality is required"),
  gender: z.string().min(1, "Gender is required"),
  interests: z.array(z.string().min(1)).min(1, "At least one interest is required"),
  preference: z.string().min(1, "Preference is required"),
});

export type FullProfileData = z.infer<typeof FullProfileSchema>;
