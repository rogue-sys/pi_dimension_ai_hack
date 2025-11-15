"use server";

import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";

export async function registerUser(values: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    await connectDB();

    const existingUser = await User.findOne({ email: values.email });

    if (existingUser) {
      return { success: false, message: "Email already in use" };
    }

    const hashedPassword = await bcrypt.hash(values.password, 10);

    await User.create({
      name: values.name,
      email: values.email,
      password: hashedPassword,
      provider: "credential",
      role: "user",
    });

    return { success: true, message: "Account created successfully" };
  } catch (err) {
    console.error(err);
    return { success: false, message: "Server error" };
  }
}
