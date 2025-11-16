"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import BackButton from "../buttons/BackButton";
import { RealityResultType } from "@/models/realityResult.model";

import {
  CheckCircle2,
  Trophy,
  Sparkles,
  ArrowUpCircle,
  ArrowDownCircle,
  Users,
  ShieldAlert,
} from "lucide-react";

import RealityLocation from "./RealityLocation";

export default function RealityView({
  reality,
}: {
  reality: RealityResultType;
}) {
  const gp = reality.generatedProfile;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-purple-200">
      <BackButton />

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-[#12071c] w-fit h-fit mx-auto border-purple-800/40 gap-2 p-5 shadow-lg">
          <div className="flex flex-col items-center text-center">
            <div className="w-full overflow-hidden rounded-l ">
              <Image
                src={gp.portrait || "/defaultProfile.png"}
                alt="Portrait"
                width={400}
                height={500}
                className="rounded-lg object-cover mx-auto"
              />
            </div>

            <h2 className="text-xl font-semibold text-purple-400 mt-4">
              {gp.name || "Unknown"}
            </h2>

            <p className="text-sm text-purple-400 mt-2">
              <span className="font-semibold">Archetype:</span>{" "}
              {gp.archetype || "N/A"}
            </p>
          </div>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Card className="bg-[#12071c] border-purple-800/40 gap-2 p-5">
            <h3 className="text-lg font-semibold text-purple-300 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              Status: What is he doing now?
            </h3>

            <p className="mt-3 whitespace-pre-line text-purple-300">
              {gp.backstory}
            </p>
          </Card>

          <RealityLocation coordinates={gp.location_coordinates} />

          <Card className="bg-[#12071c] gap-2 border-purple-800/40 p-5">
            <h3 className="text-lg text-purple-300 font-semibold mb-3 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Major Achievements
            </h3>
            <ul className="space-y-1 text-purple-300">
              {gp.major_achievements.map((a, i) => (
                <li key={i}>• {a}</li>
              ))}
            </ul>
          </Card>

          <Card className="bg-[#12071c] gap-2 border-purple-800/40 p-5">
            <h3 className="text-lg text-purple-300 font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              Personality Traits
            </h3>
            <ul className="space-y-1 text-purple-300">
              {gp.personality_traits.map((t, i) => (
                <li key={i}>• {t}</li>
              ))}
            </ul>
          </Card>

          <div className="grid md:grid-cols-2 gap-2">
            <Card className="bg-[#12071c] gap-2 border-purple-800/40 p-5">
              <h3 className="text-lg  font-semibold mb-3 flex items-center gap-2 text-green-400">
                <ArrowUpCircle className="w-5 h-5" />
                Strengths
              </h3>
              <ul className="space-y-1 text-purple-300">
                {gp.strengths.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </Card>

            <Card className="bg-[#12071c] gap-2 border-purple-800/40 p-5">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-red-400">
                <ArrowDownCircle className="w-5 h-5" />
                Weaknesses
              </h3>
              <ul className="space-y-1 text-purple-300">
                {gp.weaknesses.map((w, i) => (
                  <li key={i}>• {w}</li>
                ))}
              </ul>
            </Card>
          </div>

          <Card className="bg-[#12071c] gap-2 border-purple-800/40 p-5">
            <h3 className="text-lg text-purple-300 font-semibold mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-300" />
              Friends & Rivals
            </h3>

            <p className="font-semibold text-purple-400 mt-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Friends:
            </p>
            <ul className="space-y-1 mb-4 text-purple-300">
              {gp.friends_and_rivals.friends.map((f, i) => (
                <li key={i}>• {f}</li>
              ))}
            </ul>

            <p className="font-semibold text-purple-400 mt-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              Rivals:
            </p>
            <ul className="space-y-1 text-purple-300">
              {gp.friends_and_rivals.rivals.map((r, i) => (
                <li key={i}>• {r}</li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
