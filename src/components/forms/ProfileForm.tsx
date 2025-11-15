"use client";

import { useState, useEffect } from "react";
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

type CoreIdentityStepProps = {
  initialData?: FullProfileData;
};

export default function ProfileForm({ initialData }: CoreIdentityStepProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [interestsInput, setInterestsInput] = useState<string>("");

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

  const onSubmit = async (values: FullProfileData) => {
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

    if (imageFile) formData.append("image", imageFile);

    const result = await saveCoreIdentity(formData);

    if (result.success) console.log("Profile saved successfully");
    else console.error(result.error);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto p-5"
    >
      <Card className="bg-[#12031b] border border-purple-700/40 shadow-[0_0_25px_rgba(168,85,247,0.25)] rounded-2xl p-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} >
            <CardContent className="p-0 space-y-6">
              <h2 className="text-xl font-semibold text-purple-200">
                Step 1: Core Identity
              </h2>

              <div className="grid grid-cols-2 gap-5 ">
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
                          className="bg-[#1c0b2b] border-purple-600/40"
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
                          className="bg-[#1c0b2b] border-purple-600/40"
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
                          className="bg-[#1c0b2b] border-purple-600/40"
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
                          className="bg-[#1c0b2b] border-purple-600/40"
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
                          className="bg-[#1c0b2b] border-purple-600/40"
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
                          className="bg-[#1c0b2b] border-purple-600/40"
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
                          className="bg-[#1c0b2b] border-purple-600/40"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel className="text-purple-300">
                    Interests (comma separated)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Reading, Music, Travel"
                      className="bg-[#1c0b2b] border-purple-600/40"
                      value={interestsInput}
                      onChange={(e) => setInterestsInput(e.target.value)}
                    />
                  </FormControl>
                </FormItem>
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
                          className="bg-[#1c0b2b] border-purple-600/40"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel className="text-purple-300">
                    Profile Image
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      className="bg-[#1c0b2b] border-purple-600/40"
                      onChange={(e) =>
                        setImageFile(e.target.files?.[0] || null)
                      }
                    />
                  </FormControl>
                </FormItem>
                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 py-5"
                >
                  → Next: Mental Configuration
                </Button>
              </div>
            </CardContent>
          </form>
        </Form>
      </Card>
    </motion.div>
  );
}
