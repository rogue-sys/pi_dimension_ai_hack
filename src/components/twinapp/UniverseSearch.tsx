"use client";
import React, { useState } from "react";
import axios from "axios";

export default function UniverseSearch({
  onGenerate,
  onResult,
}: {
  onGenerate: () => void;
  onResult: (p: any) => void;
}) {
  const [query, setQuery] = useState("");
  const [isLoading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    onGenerate();
    try {
      const res = await axios.post("/api/generate", { query });
      onResult(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900/90 p-6 rounded-2xl space-y-4">
      <h3 className="text-2xl">Search the Multiverse</h3>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Universe focus..."
        className="w-full p-3 rounded"
      />
      <button
        disabled={!query || isLoading}
        onClick={handleGenerate}
        className="w-full bg-gradient-to-r from-purple-700 to-indigo-700 p-3 rounded"
      >
        Initiate Quantum Generation
      </button>
    </div>
  );
}
