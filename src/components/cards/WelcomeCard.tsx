"use client";
import React from "react";
import { Globe, ArrowRight } from "lucide-react";

export default function WelcomeCard({ onNext }: { onNext: () => void }) {
  return (
    <div className="bg-gray-900/90 p-8 rounded-2xl">
      <h2 className="text-4xl text-purple-300">Welcome to the π Dimension</h2>
      <p className="mt-4 text-gray-400">Create your alternate-universe twin.</p>
      <button
        onClick={onNext}
        className="mt-6 bg-gradient-to-r from-purple-700 to-indigo-700 px-6 py-3 rounded-xl"
      >
        Start <ArrowRight className="inline-block ml-2" />
      </button>
    </div>
  );
}
