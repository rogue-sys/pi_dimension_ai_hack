"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
export default function Welcome() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-xl mx-auto"
    >
      <Card className="bg-[#12031b] border border-purple-700/40 shadow-[0_0_25px_rgba(168,85,247,0.25)] rounded-2xl">
        <CardContent className="space-y-6 text-sm sm:text-base">
          <h2 className="text-center text-2xl font-semibold text-purple-200">
            Welcome to the π Dimension
          </h2>

          <div className="bg-[#1c0b2b] border border-purple-600/40 rounded-xl p-5 leading-relaxed text-purple-200 text-sm space-y-3">
            <h3 className="font-semibold text-purple-300">
              About the Application
            </h3>
            <p>
              The <strong>AI Doppelgänger Dimension</strong> uses the infinite,
              non-repeating nature of π to conceptualize an alternate, chaotic
              version of yourself in a fictional universe.
            </p>

            <ol className="list-decimal ml-4 space-y-2">
              <li>
                <strong>Input Reality</strong>: Provide your real-world traits.
              </li>
              <li>
                <strong>Select Archetype</strong>: Choose a bizarre role for
                your twin (e.g., Cyberpunk Hacker, Evil Twin).
              </li>
              <li>
                <strong>Quantum Generation</strong>: We use the Gemini and
                Imagen APIs to construct a full persona, including a backstory,
                stats, and an exclusive AI portrait.
              </li>
              <li>
                <strong>Chat Interface</strong>: Interact with your newly
                created alternate self, who responds in character.
              </li>
            </ol>
          </div>

          <Link href="/register" className="block">
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-6 text-sm sm:text-base">
              → Begin Transmission: Create
            </Button>
          </Link>

          <Link href="/login" className="block">
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-6 text-sm sm:text-base">
              → Continue Transmission: Login
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}
