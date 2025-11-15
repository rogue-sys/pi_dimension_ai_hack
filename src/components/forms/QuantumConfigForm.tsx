"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function QuantumConfigForm() {
  return (
    <div className="min-h-screen w-full bg-[#0b0615] text-purple-200 px-6 py-10 flex justify-center items-center">
      <div className="w-full max-w-4xl space-y-10">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-semibold text-center text-purple-300">
          Single-Form Quantum Configuration
        </h1>

        <div className="bg-[#140a22] border border-purple-700/40 rounded-2xl p-8 space-y-8 shadow-xl">
          <h2 className="text-xl font-semibold text-purple-300">
            Alternate Reality Parameters
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-purple-300">
                Chosen Doppelgänger Archetype
              </Label>
              <Select>
                <SelectTrigger className="bg-[#1c0b2b]! border-purple-600/40 text-purple-100">
                  <SelectValue placeholder="Cyberpunk Hacker" />
                </SelectTrigger>

                <SelectContent className="bg-[#1c0b2b]! text-purple-100 border-purple-600/40">
                  <SelectItem value="cyberpunk">Cyberpunk Hacker</SelectItem>
                  <SelectItem value="warrior">
                    Interdimensional Warrior
                  </SelectItem>
                  <SelectItem value="mage">Arcane Technomancer</SelectItem>
                  <SelectItem value="pilot">Starship Rogue Pilot</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-purple-300">
                Universe Focus (Descriptive Setting)
              </Label>
              <Input
                placeholder="e.g., 'A neon-soaked cyber realm ruled by rogue AIs'"
                className="bg-[#1c0b2b]! border-purple-600/40 text-purple-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-purple-300">
              Core Personality Profile (Hobbies, Fears, Aspirations)
            </Label>
            <Textarea
              placeholder="e.g., Loves history, fears spiders, aspires to write."
              className="bg-[#1c0b2b]! border-purple-600/40 text-purple-100 min-h-[120px]"
            />
          </div>
        </div>

        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-6 text-lg rounded-xl">
          Find the reality
        </Button>
      </div>
    </div>
  );
}
