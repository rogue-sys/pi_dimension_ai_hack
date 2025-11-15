"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { BiLogoGoogle } from "react-icons/bi";
import { motion } from "framer-motion";

const loginSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    if (res?.error) {
      let msg = "Something went wrong. Please try again.";

      if (res.error === "EMAIL_NOT_VERIFIED")
        msg = "Please verify your email before logging in.";
      else if (res.error === "GOOGLE_ACCOUNT")
        msg = "This account is linked with Google. Please sign in using Google.";
      else if (res.error.toLowerCase().includes("invalid"))
        msg = "Invalid email or password.";

      setError(msg);
      setLoading(false);
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-screen px-4"
    >
      <Card className="w-full max-w-md bg-[#12031b] border border-purple-700/40 shadow-[0_0_25px_rgba(168,85,247,0.25)] rounded-2xl">
        <CardContent className="p-6 space-y-6 text-purple-200">
          <h2 className="text-center text-2xl  text-purple-200 font-semibold">
           <span className="font-light opacity-60"> Login to </span>π
          </h2>

          <div className="bg-[#1c0b2b] border border-purple-600/40 p-5 rounded-xl space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-300">Email</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-[#0d0114] border-purple-700/40 text-purple-100"
                          placeholder="you@example.com"
                          {...field}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel className="text-purple-300">Password</FormLabel>
                        
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="******"
                            className="bg-[#0d0114] border-purple-700/40 text-purple-100 pr-10"
                            {...field}
                            disabled={loading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-purple-400"
                            tabIndex={-1}
                          >
                            {showPassword ? <EyeOff /> : <Eye />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && (
                  <p className="text-sm text-red-400 font-medium">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </Form>
          </div>

          <div className="flex items-center gap-3 text-purple-400">
            <div className="grow border-t border-purple-800/50" />
            <span className="text-xs">OR</span>
            <div className="grow border-t border-purple-800/50" />
          </div>

          {/* Google Login */}
          <Button
            variant="outline"
            className="w-full border-purple-700/40 text-purple-200 bg-[#1c0b2b] hover:bg-[#240c38]"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            disabled={loading}
          >
            <BiLogoGoogle className="mr-2" /> Continue with Google
          </Button>

          <p className="mt-4 text-center text-sm text-purple-300">
            Don’t have an account?{" "}
            <Link href="/register" className="text-purple-400 hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LoginForm;
