"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AppAboutSection({
  latestRealities = [],
}: {
  latestRealities: any[];
}) {
  return (
    <div className="w-full px-6 py-10 space-y-10 text-purple-200">

      {/* LATEST REALITIES */}
      <Card className="bg-[#140a22] border-purple-700/40 shadow-lg">
        <CardHeader>
          <CardTitle className="text-purple-300 text-2xl">
            Latest Generated Realities
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {latestRealities.length === 0 ? (
            <p className="text-purple-400 italic">No realities created yet…</p>
          ) : (
            <ul className="space-y-3">
              {latestRealities.map((r: any, i: number) => (
                <li
                  key={i}
                  className="bg-[#1c0b2b] border border-purple-600/40 rounded-xl p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-purple-300">{r.name}</p>
                    <p className="text-sm text-purple-400">{r.archetype}</p>
                  </div>
                  <span className="text-purple-500 text-xs">{r.createdAt}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* ABOUT THE APP */}
      <Card className="bg-[#140a22] border-purple-700/40 shadow-lg">
        <CardHeader>
          <CardTitle className="text-purple-300 text-2xl">
            About Pi (π)
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-purple-200 leading-relaxed">
          <p>
            <span className="text-purple-400 font-semibold">Pi (π)</span>{" "}
            is a multiverse generator based on the concept that every person has
            countless alternate versions of themselves across infinite universes —
            a concept rooted in{" "}
            <span className="text-purple-400 font-semibold">Schrödinger’s Cat</span>{" "}
            and modern quantum interpretation theories.
          </p>

          <p>
            Each time you generate a{" "}
            <span className="text-purple-400">Quantum Doppelgänger</span>, you
            synchronize with one identity among an infinite pool of timelines,
            archetypes, and world-branches.
          </p>

          <p>
            Pi doesn’t guess — it{" "}
            <span className="text-purple-300 italic">
              maps probabilistic manifestations
            </span>{" "}
            using archetype patterns, multiversal branching logic, and quantum
            identity dynamics.
          </p>
        </CardContent>
      </Card>

      {/* PI SECTION */}
      <Card className="bg-[#140a22] border-purple-700/40 shadow-lg">
        <CardHeader>
          <CardTitle className="text-purple-300 text-2xl">
            π (Pi) — The Number of Infinite Outcomes
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-purple-200 leading-relaxed">
          <p>
            <span className="font-semibold text-purple-400">
              π = 3.14159265358979…
            </span>{" "}
            is an irrational number containing *infinite non-repeating digits*.
            Many mathematicians and physicists see π as a symbolic mirror of
            all possible realities:
          </p>

          <ul className="list-disc ml-6 space-y-2">
            <li>Your full name appears somewhere inside π.</li>
            <li>A different version of you appears elsewhere inside it.</li>
            <li>
              Every event, dream, memory, and possible timeline is encoded in its
              infinite sequence.
            </li>
          </ul>

          <p>
            π becomes a mathematical metaphor for the multiverse — infinite,
            branching, and echoing every possible you. Pi is built on this
            idea.
          </p>
        </CardContent>
      </Card>

      {/* PARALLEL UNIVERSES */}
      <Card className="bg-[#140a22] border-purple-700/40 shadow-lg">
        <CardHeader>
          <CardTitle className="text-purple-300 text-2xl">
            Parallel Universes & Quantum Reality
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 leading-relaxed text-purple-200">
          <p>
            Quantum physics suggests our universe may be only one strand in an
            endless multiverse. According to the{" "}
            <span className="text-purple-400">Many-Worlds Interpretation</span>,
            every decision you make creates a new universe:
          </p>

          <ul className="list-disc ml-6 space-y-2">
            <li>In one reality, you’re a hacker.</li>
            <li>In another, you’re a warrior.</li>
            <li>
              Somewhere, you became a philosopher, engineer, musician, pilot, or mystic.
            </li>
          </ul>

          <p>
            Pi visualizes these branching identities — giving form to
            versions of you that may already exist in parallel timelines.
          </p>
        </CardContent>
      </Card>

      <p className="text-center text-purple-500 text-sm mt-6">
        © 2025 Pi — All Worlds, All Versions.
      </p>
    </div>
  );
}
