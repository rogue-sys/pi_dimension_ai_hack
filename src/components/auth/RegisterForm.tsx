"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { registerUser } from "@/actions/register.action";
import { registerSchema } from "@/utils/validations/user.validation";
import { Eye, EyeOff } from "lucide-react";

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [isPending, startTransition] = useTransition();
  const [response, setResponse] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = (values: RegisterFormValues) => {
    startTransition(async () => {
      const res = await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      setResponse(res);
      if (res.success) form.reset();
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex justify-center items-center min-h-screen px-4"
    >
      <Card className="w-full max-w-lg bg-[#12031b] border border-purple-700/40 shadow-[0_0_25px_rgba(168,85,247,0.25)] rounded-2xl">
        <CardContent className="p-6 space-y-6 text-purple-200">
          <h2 className="text-center text-2xl font-semibold text-purple-200">
            <span className="font-light opacity-60">Create your </span>π{" "}
            <span className="font-light opacity-60">Identity</span>
          </h2>

          <div className="bg-[#1c0b2b] border border-purple-600/40 rounded-xl p-5 space-y-4 text-sm">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-300">Name</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-[#0d0114] text-purple-100 border-purple-700/40"
                          placeholder="John Doe"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-300">Email</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-[#0d0114] text-purple-100 border-purple-700/40"
                          placeholder="you@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-300">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="bg-[#0d0114] text-purple-100 border-purple-700/40 pr-10"
                            type={showPassword ? "text" : "password"}
                            placeholder="******"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-3 flex items-center text-purple-400 hover:text-purple-300"
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-300">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="bg-[#0d0114] text-purple-100 border-purple-700/40 pr-10"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="******"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute inset-y-0 right-3 flex items-center text-purple-400 hover:text-purple-300"
                          >
                            {showConfirmPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl"
                  disabled={isPending}
                >
                  {isPending ? "Creating..." : "Sign up"}
                </Button>
              </form>
            </Form>
          </div>

          {response && (
            <p
              className={`text-center text-sm ${
                response.success ? "text-green-400" : "text-red-400"
              }`}
            >
              {response.message}
            </p>
          )}

          <p className="text-center text-sm text-purple-300">
            Already have an account?{" "}
            <Link href="/login" className="text-purple-400 hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RegisterForm;
