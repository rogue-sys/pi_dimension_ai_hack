import mongoose from "mongoose";

import { Document, Types } from "mongoose";

export interface UserProfile {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    imageUrl: string;

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

export interface IUserProfile extends Document, Omit<UserProfile, '_id'> { }

const UserProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
            unique: true
        },

        imageUrl: {
            type: String,
            required: true
        },

        appearance: {
            type: String,
            required: true,
        },

        dateOfBirth: {
            type: String,
            required: true
        },

        personality: {
            type: String,
            required: true,
        },

        additionalTraits: {
            type: String,
            default: ""
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
            default: Date.now
        }
    },
    { collection: "user_profiles" }
);

export const Profile = mongoose.models.UserProfile ||
    mongoose.model("UserProfile", UserProfileSchema);