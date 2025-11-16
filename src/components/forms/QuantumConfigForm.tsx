"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function QuantumConfigForm() {
  const router = useRouter();
  const [archetypeInput, setArchetypeInput] = useState("");
  const [universeInput, setUniverseInput] = useState("");
  const [personalityInput, setPersonalityInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!archetypeInput || !universeInput || !personalityInput) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/reality", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          archetype: archetypeInput,
          universeFocus: universeInput,
          corePersonality: personalityInput,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Reality generated!");
        const realityId = result.realityId;
        router.push(`/realities/${realityId}`);
      } else {
        toast.error(result.error || "Failed to generate reality");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server call failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0b0615] text-purple-200 px-6 py-10 flex justify-center items-center">
      <div className="w-full max-w-4xl space-y-10">
        <h1 className="text-3xl md:text-4xl font-semibold text-center text-purple-300">
          Lets Findout your pi version
        </h1>

        <div className="bg-[#140a22] border border-purple-700/40 rounded-2xl p-8 space-y-8 shadow-xl">
          <h2 className="text-xl font-semibold text-purple-300">
            Alternate Reality Parameters
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Replaced Select with free text input */}
            <div className="space-y-2">
              <Label className="text-purple-300">Your π Archetype</Label>
              <Input
                value={archetypeInput}
                onChange={(e) => setArchetypeInput(e.target.value)}
                placeholder="e.g., 'Cyberpunk', 'Zombie', etc."
                className="bg-[#1c0b2b]! border-purple-600/40 text-purple-100"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-purple-300">Universe Focus</Label>
              <Input
                value={universeInput}
                onChange={(e) => setUniverseInput(e.target.value)}
                placeholder="e.g., A neon-soaked cyber realm ruled by rogue AIs"
                className="bg-[#1c0b2b]! border-purple-600/40 text-purple-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-purple-300">Core Personality Profile</Label>
            <Textarea
              value={personalityInput}
              onChange={(e) => setPersonalityInput(e.target.value)}
              placeholder="Describe hobbies, fears, ambitions..."
              className="bg-[#1c0b2b]! border-purple-600/40 text-purple-100 min-h-[120px]"
            />
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-6 text-lg rounded-xl"
          disabled={loading}
        >
          {loading ? "Generating..." : "Find the reality"}
        </Button>
      </div>
    </div>
  );
}
