"use client";
import React, { useState } from "react";

export default function StepMental({ onNext }: { onNext: () => void }) {
  const [persona, setPersona] = useState("");
  return (
    <div className="bg-gray-900/90 p-6 rounded-2xl space-y-4">
      <h3 className="text-2xl">Step 2: Mental Configuration</h3>
      <textarea
        value={persona}
        onChange={(e) => setPersona(e.target.value)}
        placeholder="Personality traits"
        className="w-full p-3 rounded"
      />
      <button
        disabled={!persona}
        onClick={onNext}
        className="w-full bg-gradient-to-r from-purple-700 to-indigo-700 p-3 rounded"
      >
        Next
      </button>
    </div>
  );
}
