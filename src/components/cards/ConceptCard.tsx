"use client";
import React from "react";
import { Globe } from "lucide-react";

export default function ConceptCard({ onNext }: { onNext: () => void }) {
  return (
    <div className="bg-gray-900/90 p-6 rounded-2xl text-center">
      <h1 className="text-6xl text-purple-400">π</h1>
      <p className="mt-4 text-gray-400">Infinite alternate possibilities.</p>
      <button
        onClick={onNext}
        className="mt-6 bg-gradient-to-r from-purple-700 to-indigo-700 p-3 rounded"
      >
        Acknowledge <Globe className="inline ml-2" />
      </button>
    </div>
  );
}
