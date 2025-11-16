// models/realityResult.model.ts
import mongoose, { Schema, model, Model, Document } from "mongoose";

export interface IRealityResult extends Document {
  userId: string; // reference to the user
  generatedProfile: {
    alternate_universe_dob: string;
    backstory: string;
    personality_traits: string[];
    location_coordinates: string;
    daily_routine: string;
    major_achievements: string[];
    strengths: string[];
    weaknesses: string[];
    friends_and_rivals: {
      friends: string[];
      rivals: string[];
    };
    secrets_and_quirks: string[];
    favorite_quotes: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const RealityResultSchema: Schema<IRealityResult> = new Schema(
  {
    userId: { type: String, required: true, index: true },
    generatedProfile: {
      alternate_universe_dob: { type: String, required: true },
      backstory: { type: String, required: true },
      personality_traits: [{ type: String, required: true }],
      location_coordinates: { type: String, required: true },
      daily_routine: { type: String, required: true },
      major_achievements: [{ type: String, required: true }],
      strengths: [{ type: String, required: true }],
      weaknesses: [{ type: String, required: true }],
      friends_and_rivals: {
        friends: [{ type: String, required: true }],
        rivals: [{ type: String, required: true }],
      },
      secrets_and_quirks: [{ type: String, required: true }],
      favorite_quotes: [{ type: String, required: true }],
    },
  },
  { timestamps: true }
);

export const RealityResult: Model<IRealityResult> =
  mongoose.models.RealityResult || model<IRealityResult>("RealityResult", RealityResultSchema);
