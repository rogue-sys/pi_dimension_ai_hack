import mongoose from "mongoose";

const TwinProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },

        universeType: {
            type: String,
            required: true,
        },

        alternateUniverseDOB: {
            type: String,
            required: true
        },

        backstory: {
            type: String,
            required: true
        },

        personalityTraits: {
            type: [String],
            default: []
        },

        locationCoordinates: {
            type: String,
            default: ""
        },

        dailyRoutine: {
            type: String,
            default: ""
        },

        majorAchievements: {
            type: [String],
            default: []
        },

        strengths: {
            type: [String],
            default: []
        },

        weaknesses: {
            type: [String],
            default: []
        },

        friendsAndRivals: {
            friends: { type: [String], default: [] },
            rivals: { type: [String], default: [] }
        },

        secretsAndQuirks: {
            type: [String],
            default: []
        },

        favoriteQuotes: {
            type: [String],
            default: []
        },

        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    { collection: "twin_profiles" }
);

export const TwinProfile = mongoose.models.TwinProfile ||
    mongoose.model("TwinProfile", TwinProfileSchema);