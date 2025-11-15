export type SafeUserType = {
  id: string;
  name: string;
  email: string;
  profile_url?: string;
  role: "user" | "admin" | "moderator";
  provider: "credential" | "google" | "github" | "facebook";
  emailVerified: boolean;
  createdAt: string | null;
};