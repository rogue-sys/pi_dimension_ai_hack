import mongoose, { Document, Types } from "mongoose";

export interface UserProfile {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  profile_pic: string;    
  imageUrls: string[];     

  appearance: string;
  dateOfBirth: string;
  personality: string;

  additionalTraits: string;
  vibeStyle: string;
  sexuality: string;
  gender: string;

  interests: string[];
  preference: string;

  createdAt: Date;
}

export interface IUserProfile extends Document, Omit<UserProfile, "_id"> {}

const UserProfileSchema = new mongoose.Schema<IUserProfile>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      unique: true,
    },

    profile_pic: {
      type: String,
      required: true, 
    },

    imageUrls: {
      type: [String],
      default: [], 
    },

    appearance: {
      type: String,
      required: true,
    },

    dateOfBirth: {
      type: String,
      required: true,
    },

    personality: {
      type: String,
      required: true,
    },

    additionalTraits: {
      type: String,
      default: "",
    },

    vibeStyle: {
      type: String,
      default: "",
    },

    sexuality: {
      type: String,
      default: "",
    },

    gender: {
      type: String,
      default: "",
    },

    interests: {
      type: [String],
      default: [],
    },

    preference: {
      type: String,
      default: "",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "user_profiles" }
);

export const Profile =
  mongoose.models.UserProfile ||
  mongoose.model<IUserProfile>("UserProfile", UserProfileSchema);
