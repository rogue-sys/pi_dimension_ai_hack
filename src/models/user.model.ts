import mongoose, { Schema, Document, models } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  profile_url: string;
  password?: string;
  provider: "credential" | "google" | "github" | "facebook";
  role: "user" | "admin" | "moderator";
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String },
    profile_url: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    provider: {
      type: String,
      enum: ["credential", "google", "github", "facebook"],
      default: "credential",
    },

    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },


  },
  { timestamps: true }
);


export const User =
  models.User || mongoose.model<IUser>("User", UserSchema);
