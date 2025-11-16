import BackButton from "@/components/buttons/BackButton";
import { getRealityById } from "@/services/realities.service";
import { notFound } from "next/navigation";

type Params = {
  params: Promise<{
    id: string;
  }>;
};
export default async function SingleRealityPage({ params }: Params) {
  const { id } = await params;

  const { reality } = await getRealityById(id);

  if (!reality) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0b0615] text-purple-200 px-6 py-10">
      <BackButton />

      <div className="bg-[#140a22] border border-purple-700/40 rounded-2xl p-6 shadow-lg max-w-4xl mx-auto">
        <p className="text-sm text-purple-400 mb-4">
          Generated on: {new Date(reality.createdAt).toLocaleString()}
        </p>

        <div className="space-y-2">
          <p>
            <span className="font-semibold">DOB:</span>{" "}
            {reality?.generatedProfile.alternate_universe_dob || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Backstory:</span>{" "}
            {reality?.generatedProfile.backstory || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Personality Traits:</span>{" "}
            {reality?.generatedProfile.personality_traits?.join(", ") || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Location:</span>{" "}
            {reality?.generatedProfile.location_coordinates || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Daily Routine:</span>{" "}
            {reality?.generatedProfile.daily_routine || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Achievements:</span>{" "}
            {reality?.generatedProfile.major_achievements?.join(", ") || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Strengths:</span>{" "}
            {reality?.generatedProfile.strengths?.join(", ") || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Weaknesses:</span>{" "}
            {reality?.generatedProfile.weaknesses?.join(", ") || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Friends:</span>{" "}
            {reality?.generatedProfile.friends_and_rivals?.friends?.join(
              ", "
            ) || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Rivals:</span>{" "}
            {reality?.generatedProfile.friends_and_rivals?.rivals?.join(", ") ||
              "N/A"}
          </p>
          <p>
            <span className="font-semibold">Secrets & Quirks:</span>{" "}
            {reality?.generatedProfile.secrets_and_quirks?.join(", ") || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Favorite Quotes:</span>{" "}
            {reality?.generatedProfile.favorite_quotes?.join(" | ") || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
