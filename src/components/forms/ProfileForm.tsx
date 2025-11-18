"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { motion } from "framer-motion";
import {
  FullProfileSchema,
  FullProfileData,
} from "@/utils/validations/profile.validation";
import { saveCoreIdentity } from "@/actions/profile.action";
import toast from "react-hot-toast";
import { UserProfile } from "@/models/profile.model";
import { BiArrowBack } from "react-icons/bi";
import { useRouter } from "next/navigation";

type CoreIdentityStepProps = {
  initialData?: UserProfile;
};

export default function ProfileForm({ initialData }: CoreIdentityStepProps) {
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const [interestsInput, setInterestsInput] = useState<string>("");

  const profilePicInputRef = useRef<HTMLInputElement | null>(null);
  const additionalInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<FullProfileData>({
    resolver: zodResolver(FullProfileSchema),
    defaultValues: initialData || {
      appearance: "",
      dateOfBirth: "",
      personality: "",
      additionalTraits: "",
      vibeStyle: "",
      sexuality: "",
      gender: "",
      interests: [],
      preference: "",
      place: "",
      language: "", // ⭐ ADDED
    },
  });

  // Load initial data
  useEffect(() => {
    if (!initialData) return;

    form.reset({
      ...initialData,
      interests: initialData.interests || [],
      language: initialData.language || "", // ⭐ ADDED
    });

    setInterestsInput((initialData.interests || []).join(", "));

    if (initialData.profile_pic) {
      setProfilePicPreview(initialData.profile_pic);

      fetch(initialData.profile_pic)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "profile_pic.jpg", { type: blob.type });
          setProfilePicFile(file);
        });
    }
  }, [initialData, form]);

  useEffect(() => {
    if (profilePicFile) {
      const reader = new FileReader();
      reader.onload = () => setProfilePicPreview(reader.result as string);
      reader.readAsDataURL(profilePicFile);
    }
  }, [profilePicFile]);

  const MAX_PROFILE_PIC_MB = 1;

  function validateProfileImages(profilePic: File | null) {
    if (!profilePic) {
      toast.error("Profile picture is required.");
      return false;
    }
    if (profilePic.size > MAX_PROFILE_PIC_MB * 1024 * 1024) {
      toast.error("Profile picture must be smaller than 1 MB.");
      return false;
    }
    return true;
  }

  const onSubmit = async (values: FullProfileData) => {
    const isValid = validateProfileImages(profilePicFile);
    if (!isValid) return;

    setLoading(true);

    const interestsArray = interestsInput
      ? interestsInput.split(",").map((s) => s.trim())
      : [];

    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        ...values,
        interests: interestsArray,
        language: values.language, // ⭐ ADDED
      })
    );

    if (profilePicFile) formData.append("profile_pic", profilePicFile);

    const result = await saveCoreIdentity(formData);

    setLoading(false);

    if (!result.success) toast.error(result.error);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto p-5"
    >
      <Card className="bg-[#12031b] border border-purple-700/40 shadow-[0_0_25px_rgba(168,85,247,0.25)] text-white rounded-2xl p-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="p-0 space-y-6">
              <h2 className="text-xl font-semibold text-purple-200 ">
                {initialData ? (
                  <span className="flex items-center flex-wrap gap-2">
                    <BiArrowBack
                      className="cursor-pointer"
                      onClick={() => router.back()}
                    />
                    Customize your profile
                  </span>
                ) : (
                  " Step 1: Core Identity"
                )}
              </h2>

              {/* Profile Pic */}
              <div className="flex justify-center mb-5">
                <div
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-2 border-purple-500 overflow-hidden cursor-pointer hover:opacity-80"
                  onClick={() => profilePicInputRef.current?.click()}
                >
                  {profilePicPreview ? (
                    <img
                      src={profilePicPreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-purple-300 bg-[#1c0b2b]">
                      Upload
                    </div>
                  )}
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  ref={profilePicInputRef}
                  className="hidden"
                  onChange={(e) =>
                    setProfilePicFile(e.target.files?.[0] || null)
                  }
                />
              </div>

              <div className="grid md:grid-cols-2 gap-5 ">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-300">Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your full name"
                          className="bg-[#1c0b2b]! border-purple-600/40"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* DOB */}
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-300">
                        Date of Birth
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="bg-[#1c0b2b]! border-purple-600/40"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Language ⭐ NEW FIELD */}
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-300">
                        Preferred Language ⭐
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Malayalam, Hindi, Tamil, English"
                          className="bg-[#1c0b2b]! border-purple-600/40"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Appearance */}
                <FormField
                  control={form.control}
                  name="appearance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-300">
                        Physical Manifestation Details
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Height, weight, marks..."
                          className="bg-[#1c0b2b]! border-purple-600/40"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Personality */}
                <FormField
                  control={form.control}
                  name="personality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-300">Personality</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Your personality"
                          className="bg-[#1c0b2b]! border-purple-600/40"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Additional Traits */}
                <FormField
                  control={form.control}
                  name="additionalTraits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-300">
                        Additional Traits
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Other distinguishing traits"
                          className="bg-[#1c0b2b]! border-purple-600/40"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Vibe Style */}
                <FormField
                  control={form.control}
                  name="vibeStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-300">Vibe / Style</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Describe your style or vibe"
                          className="bg-[#1c0b2b]! border-purple-600/40"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Sexuality */}
                <FormField
                  control={form.control}
                  name="sexuality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-300">Sexuality</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Heterosexual, Bisexual..."
                          className="bg-[#1c0b2b]! border-purple-600/40"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Gender */}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-300">Gender</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Male, Female, Non-binary"
                          className="bg-[#1c0b2b]! border-purple-600/40"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Interests */}
                <FormField
                  control={form.control}
                  name="interests"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-purple-300">
                        Interests (comma separated)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Reading, Music, Travel"
                          className="bg-[#1c0b2b]! border-purple-600/40"
                          value={interestsInput}
                          onChange={(e) => {
                            const value = e.target.value;
                            setInterestsInput(value);
                            form.setValue(
                              "interests",
                              value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean),
                              { shouldValidate: true }
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Preference */}
                <FormField
                  control={form.control}
                  name="preference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-300">Preference</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your preference"
                          className="bg-[#1c0b2b]! border-purple-600/40"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Place */}
                <FormField
                  control={form.control}
                  name="place"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-300">
                        Place / Nationality
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your place"
                          className="bg-[#1c0b2b]! border-purple-600/40"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 py-5 flex items-center justify-center gap-2"
              >
                {loading ? "Saving..." : "Save & Continue"}
              </Button>
            </CardContent>
          </form>
        </Form>
      </Card>
    </motion.div>
  );
}
