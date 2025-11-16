"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SingleRealityPage() {
  const params = useParams();
  const router = useRouter();
  const [reality, setReality] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReality = async () => {
      try {
        const res = await fetch(`/api/get-realities/${params.id}`);
        const data = await res.json();
        console.log("Single reality page fetched data:", data);
        if (data.success) {
          setReality(data.data);
        } else {
          toast.error(data.error || "Failed to fetch reality");
        }
      } catch (err) {
        console.error(err);
        toast.error("Server call failed");
      } finally {
        setLoading(false);
      }
    };

    fetchReality();
  }, [params.id]);

  if (loading) return <p className="text-center mt-20 text-purple-300">Loading...</p>;
  if (!reality) return <p className="text-center mt-20 text-purple-300">Reality not found</p>;

  const r = reality.generatedProfile; // Using `generatedProfile` from DB

  return (
    <div className="min-h-screen bg-[#0b0615] text-purple-200 px-6 py-10">
      <button
        onClick={() => router.back()}
        className="mb-6 px-4 py-2 bg-purple-700 rounded hover:bg-purple-800"
      >
        ← Back
      </button>

      <div className="bg-[#140a22] border border-purple-700/40 rounded-2xl p-6 shadow-lg max-w-4xl mx-auto">
        <p className="text-sm text-purple-400 mb-4">
          Generated on: {new Date(reality.createdAt).toLocaleString()}
        </p>

        <div className="space-y-2">
          <p><span className="font-semibold">DOB:</span> {r.alternate_universe_dob || "N/A"}</p>
          <p><span className="font-semibold">Backstory:</span> {r.backstory || "N/A"}</p>
          <p><span className="font-semibold">Personality Traits:</span> {r.personality_traits?.join(", ") || "N/A"}</p>
          <p><span className="font-semibold">Location:</span> {r.location_coordinates || "N/A"}</p>
          <p><span className="font-semibold">Daily Routine:</span> {r.daily_routine || "N/A"}</p>
          <p><span className="font-semibold">Achievements:</span> {r.major_achievements?.join(", ") || "N/A"}</p>
          <p><span className="font-semibold">Strengths:</span> {r.strengths?.join(", ") || "N/A"}</p>
          <p><span className="font-semibold">Weaknesses:</span> {r.weaknesses?.join(", ") || "N/A"}</p>
          <p><span className="font-semibold">Friends:</span> {r.friends_and_rivals?.friends?.join(", ") || "N/A"}</p>
          <p><span className="font-semibold">Rivals:</span> {r.friends_and_rivals?.rivals?.join(", ") || "N/A"}</p>
          <p><span className="font-semibold">Secrets & Quirks:</span> {r.secrets_and_quirks?.join(", ") || "N/A"}</p>
          <p><span className="font-semibold">Favorite Quotes:</span> {r.favorite_quotes?.join(" | ") || "N/A"}</p>
        </div>
      </div>
    </div>
  );
}
