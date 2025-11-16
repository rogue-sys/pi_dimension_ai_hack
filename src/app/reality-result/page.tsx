"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface RealityOutput {
  _id: string;
  generatedProfile?: {
    alternate_universe_dob?: string;
    backstory?: string;
    personality_traits?: string[];
    location_coordinates?: string;
    daily_routine?: string;
    major_achievements?: string[];
    strengths?: string[];
    weaknesses?: string[];
    friends_and_rivals?: {
      friends?: string[];
      rivals?: string[];
    };
    secrets_and_quirks?: string[];
    favorite_quotes?: string[];
  };
  createdAt: string;
}

export default function RealityResultPage() {
  const [realities, setRealities] = useState<RealityOutput[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRealities = async () => {
      try {
        const res = await fetch("/api/get-realities");
        const data = await res.json();
        if (data.success) {
          // Filter out any entries without valid generatedProfile
          setRealities(data.data.filter((r: RealityOutput) => r.generatedProfile));
        } else {
          toast.error(data.error || "Failed to fetch realities");
        }
      } catch (err) {
        console.error(err);
        toast.error("Server call failed");
      } finally {
        setLoading(false);
      }
    };

    fetchRealities();
  }, []);

  if (loading)
    return <p className="text-center mt-20 text-purple-300">Loading...</p>;

  return (
    <div className="min-h-screen bg-[#0b0615] text-purple-200 px-6 py-10">
      <h1 className="text-3xl font-semibold text-center mb-8 text-purple-300">
        Previously Generated Realities
      </h1>

      <div className="space-y-8 max-w-5xl mx-auto">
        {realities.length === 0 && <p>No realities generated yet.</p>}

        {realities.map((r) => (
          <div
            key={r._id}
            className="bg-[#140a22] border border-purple-700/40 rounded-2xl p-6 shadow-lg"
          >
            <p className="text-sm text-purple-400 mb-4">
              Generated on: {new Date(r.createdAt).toLocaleString()}
            </p>

            <div className="space-y-2">
              <p>
                <span className="font-semibold">DOB:</span>{" "}
                {r.generatedProfile?.alternate_universe_dob || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Backstory:</span>{" "}
                {r.generatedProfile?.backstory || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Personality Traits:</span>{" "}
                {r.generatedProfile?.personality_traits?.join(", ") || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Location:</span>{" "}
                {r.generatedProfile?.location_coordinates || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Daily Routine:</span>{" "}
                {r.generatedProfile?.daily_routine || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Achievements:</span>{" "}
                {r.generatedProfile?.major_achievements?.join(", ") || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Strengths:</span>{" "}
                {r.generatedProfile?.strengths?.join(", ") || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Weaknesses:</span>{" "}
                {r.generatedProfile?.weaknesses?.join(", ") || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Friends:</span>{" "}
                {r.generatedProfile?.friends_and_rivals?.friends?.join(", ") || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Rivals:</span>{" "}
                {r.generatedProfile?.friends_and_rivals?.rivals?.join(", ") || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Secrets & Quirks:</span>{" "}
                {r.generatedProfile?.secrets_and_quirks?.join(", ") || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Favorite Quotes:</span>{" "}
                {r.generatedProfile?.favorite_quotes?.join(" | ") || "N/A"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
