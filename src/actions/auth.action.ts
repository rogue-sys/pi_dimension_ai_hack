"use server";

import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { User } from "@/models/user.model";
import { sendPasswordResetEmail } from "@/lib/mailer";


export async function sendPasswordReset(email: string) {
  await connectDB();

  const user = await User.findOne({ email });

  if (!user || user?.provider !== 'credential') {
    return { success: false, error: "No account found with this email." };
  }

  if (!user.emailVerified) {
    return { success: false, error: "No account found with this email. Please register first." };
  }

  const cooldownMs = 3 * 60 * 1000;

  if (user.resetToken && user.resetExpire) {
    const tokenAge = Date.now() + 15 * 60 * 1000 - user.resetExpire;
    if (tokenAge < cooldownMs) {
      const waitTime = Math.ceil((cooldownMs - tokenAge) / 1000);
      return {
        success: false,
        error: `Please wait ${waitTime} seconds before requesting another reset link.`,
      };
    }
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetToken = resetToken;
  user.resetExpire = Date.now() + 15 * 60 * 1000;
  await user.save();

  await sendPasswordResetEmail(user.email, resetToken);

  return { success: true, message: "Reset link sent to your email." };
}

export async function resetPassword(token: string, newPassword: string) {
  await connectDB();

  const user = await User.findOne({
    resetToken: token,
    resetExpire: { $gt: Date.now() }
  });

  if (!user) {
    return { success: false, error: "Invalid or expired reset link." };
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetToken = undefined;
  user.resetExpire = undefined;
  await user.save();

  return { success: true, message: "Password reset successfully." };
}

export const checkResetTokenStatus = async (token: string) => {
  try {
    if (!token) {
      return { success: false, status: "invalid", error: "No token provided" };
    }

    await connectDB();

    const user = await User.findOne({
      resetToken: token,
      resetExpire: { $gt: Date.now() },
    }).lean();

    if (!user) {
      return { success: false, status: "expired", error: "Reset link expired or invalid." };
    }

    return { success: true, status: "valid" };
  } catch (err) {
    console.error("checkResetTokenStatus ERROR:", err);
    return { success: false, status: "error", error: "Something went wrong" };
  }
};
