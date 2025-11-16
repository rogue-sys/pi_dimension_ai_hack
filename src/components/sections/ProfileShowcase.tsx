"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function ProfileShowcase({ profile }: { profile: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto p-5"
    >
      <Card className="bg-[#12031b] border border-purple-700/40 shadow-[0_0_25px_rgba(168,85,247,0.25)] text-white rounded-2xl p-5">

        <CardContent className="p-0 space-y-10">
          <div className="flex justify-center">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-purple-500 shadow-lg">
              <img
                src={profile.profile_pic}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold text-purple-200">{profile.name}</h1>
            <p className="text-purple-300 text-sm">{profile.place}</p>
            <p className="text-purple-400 text-sm">{profile.gender} • {profile.sexuality}</p>
            <p className="text-purple-400 text-sm">Born: {profile.dateOfBirth}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            
            <ProfileSection title="Personality" text={profile.personality} />
            <ProfileSection title="Appearance" text={profile.appearance} />
            <ProfileSection title="Additional Traits" text={profile.additionalTraits} />
            <ProfileSection title="Vibe / Style" text={profile.vibeStyle} />
            
            <ProfileSection title="Preference" text={profile.preference} />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-purple-300 mb-3">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests?.map((interest: string, i: number) => (
                <span
                  key={i}
                  className="px-3 py-1 text-sm bg-purple-600/20 border border-purple-500/40 rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-purple-300 mb-3">
              Additional Photos
            </h3>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {profile.imageUrls?.map((url: string, i: number) => (
                <motion.img
                  key={i}
                  src={url}
                  className="w-full h-28 sm:h-32 object-cover rounded-lg border border-purple-500/40"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                />
              ))}
            </div>
          </div>

        </CardContent>
      </Card>
    </motion.div>
  );
}

function ProfileSection({ title, text }: { title: string; text: string }) {
  if (!text) return null;

  return (
    <div className="bg-[#1c0b2b] border border-purple-600/40 rounded-xl p-4 shadow-inner">
      <h3 className="text-purple-300 font-semibold mb-1">{title}</h3>
      <p className="text-purple-200 text-sm leading-relaxed">{text}</p>
    </div>
  );
}
