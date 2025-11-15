import React from "react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PiIntro() {
  return (
    <CardContent className="space-y-6 p-0 text-sm sm:text-base">
      <h2 className="text-center text-2xl font-semibold text-purple-200">
        Welcome to the π Dimension
      </h2>

      <div className="bg-[#1c0b2b] border border-purple-600/40 rounded-xl p-5 leading-relaxed text-purple-200 text-sm space-y-3">
        <h3 className="font-semibold text-purple-300">About the Application</h3>
        <p>
          The <strong>AI Doppelgänger Dimension</strong> uses the infinite,
          non‑repeating nature of π to conceptualize an alternate, chaotic
          version of yourself in a fictional universe.
        </p>
        <ol className="list-decimal ml-4 space-y-2">
          <li>
            <strong>Input Reality</strong>: Provide your real-world traits.
          </li>
          <li>
            <strong>Select Archetype</strong>: Choose a bizarre role for your
            twin (e.g., Cyberpunk Hacker, Evil Twin).
          </li>
          <li>
            <strong>Quantum Generation</strong>: We use the Gemini and Imagen
            APIs to construct a full persona, including a backstory, stats, and
            an exclusive AI portrait.
          </li>
          <li>
            <strong>Chat Interface</strong>: Interact with your newly created
            alternate self, who responds in character.
          </li>
        </ol>
      </div>

      <Button
        className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-6 text-sm sm:text-base"
      >
        → Begin Transmission: Create
      </Button>
    </CardContent>
  );
}
