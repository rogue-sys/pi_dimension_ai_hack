import { z } from "zod";

export const FullProfileSchema = z.object({
  appearance: z.string().min(2),
  dateOfBirth: z.string().min(1),
  personality: z.string().min(5),
  additionalTraits: z.string().optional(),
  vibeStyle: z.string().optional(),
  sexuality: z.string().optional(),
  gender: z.string().optional(),
  interests: z.array(z.string()).optional(),
  preference: z.string().optional(),
});

export type FullProfileData = z.infer<typeof FullProfileSchema>;
