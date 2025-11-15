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

type CoreIdentityStepProps = {
  initialData?: FullProfileData;
};

export default function ProfileForm({ initialData }: CoreIdentityStepProps) {
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
  const [additionalPreviews, setAdditionalPreviews] = useState<string[]>([]);

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
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        interests: initialData.interests || [],
      });
      setInterestsInput((initialData.interests || []).join(", "));
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
  const MAX_ADDITIONAL_MB = 10;
  const MIN_ADDITIONAL_COUNT = 3;

  function validateProfileImages(
    profilePic: File | null,
    additionalFiles: File[]
  ) {
    if (!profilePic) {
      toast.error("Profile picture is required.");
      return false;
    }

    if (profilePic.size > MAX_PROFILE_PIC_MB * 1024 * 1024) {
      toast.error("Profile picture must be smaller than 1 MB.");
      return false;
    }

    if (additionalFiles.length < MIN_ADDITIONAL_COUNT) {
      toast.error("Please upload at least 3 additional images.");
      return false;
    }

    for (const file of additionalFiles) {
      if (file.size > MAX_ADDITIONAL_MB * 1024 * 1024) {
        toast.error(`${file.name} exceeds 10 MB.`);
        return false;
      }
    }

    return true;
  }
  useEffect(() => {
    const previews: string[] = [];
    additionalFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        previews.push(reader.result as string);
        if (previews.length === additionalFiles.length) {
          setAdditionalPreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });
  }, [additionalFiles]);

  const onSubmit = async (values: FullProfileData) => {
    const isValid = validateProfileImages(profilePicFile, additionalFiles);
    if (!isValid) return;
    setLoading(true);
    const formData = new FormData();
    const interestsArray = interestsInput
      ? interestsInput.split(",").map((s) => s.trim())
      : [];

    formData.append(
      "data",
      JSON.stringify({
        ...values,
        interests: interestsArray,
      })
    );

    if (profilePicFile) formData.append("profile_pic", profilePicFile);
    additionalFiles.forEach((file) => formData.append("imageUrls", file));
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
              <h2 className="text-xl font-semibold text-purple-200">
                Step 1: Core Identity
              </h2>

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

              <FormItem>
                <FormLabel className="text-purple-300">
                  Additional images of you (min 3)
                </FormLabel>
                <FormControl>
                  <>
                    <div className="flex gap-3 flex-wrap">
                      {additionalPreviews.map((preview, i) => (
                        <img
                          key={i}
                          src={preview}
                          alt={`Additional ${i + 1}`}
                          className="w-24 h-24 object-cover rounded-lg border border-purple-500"
                        />
                      ))}
                      <div
                        onClick={() => additionalInputRef.current?.click()}
                        className="w-24 h-24 flex items-center justify-center border border-dashed border-purple-500 rounded-lg cursor-pointer text-purple-300"
                      >
                        Add
                      </div>
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      ref={additionalInputRef}
                      className="hidden"
                      onChange={(e) =>
                        setAdditionalFiles(Array.from(e.target.files || []))
                      }
                    />
                  </>
                </FormControl>
              </FormItem>

              <div className="grid md:grid-cols-2 gap-5 ">
                <FormField
                  control={form.control}
                  name="appearance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-300">
                        Full Name / Designation
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your full name"
                          className="bg-[#1c0b2b]!   border-purple-600/40"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                          placeholder="Select your birth date"
                          className="bg-[#1c0b2b]! text-white border-purple-600/40"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="personality"
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
                <FormField
                  control={form.control}
                  name="vibeStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-300">
                        Vibe / Style
                      </FormLabel>
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
                <FormField
                  control={form.control}
                  name="sexuality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-300">
                        Sexuality
                      </FormLabel>
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

                <FormField
                  control={form.control}
                  name="preference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-300">
                        Preference
                      </FormLabel>
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
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 py-5 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                    Saving...
                  </>
                ) : (
                  "→ Next: Mental Configuration"
                )}
              </Button>
            </CardContent>
          </form>
        </Form>
      </Card>
    </motion.div>
  );
}
