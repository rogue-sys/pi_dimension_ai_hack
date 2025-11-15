import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

type Props = {
  handleNext: () => void;
};
export default function CoreIdentityStep({ handleNext }: Props) {
  return (
    <>
      <CardContent className="p-0 space-y-6 ">
        <h2 className="text-xl font-semibold text-purple-200">
          Step 1: Core Identity
        </h2>

        <div className="space-y-1">
          <label className="text-sm text-purple-300">
            Your Designation (Full Name)
          </label>
          <Input
            placeholder="Enter full name"
            className="bg-[#1c0b2b] border-purple-600/40 text-purple-100 focus-visible:ring-purple-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-purple-300">
            Date of Origin (Real DOB)
          </label>
          <Input
            type="date"
            className="bg-[#1c0b2b] border-purple-600/40 text-purple-100 focus-visible:ring-purple-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-purple-300">
            Physical Manifestation Details (Height, Weight, Defining Marks)
          </label>
          <Textarea
            placeholder="e.g., 6'1, 180 lbs, blue eyes, scar above left eyebrow."
            className="bg-[#1c0b2b] border-purple-600/40 text-purple-100 focus-visible:ring-purple-500"
          />
        </div>

        <Button
          onClick={handleNext}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-5 flex items-center justify-center gap-2 text-sm sm:text-base shadow-[0_0_10px_rgba(168,85,247,0.4)]"
        >
          → Next: Mental Configuration
        </Button>
      </CardContent>
    </>
  );
}
