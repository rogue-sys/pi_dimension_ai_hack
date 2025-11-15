'use server'
import { auth } from "@/services/common.service";
import { redirect } from "next/navigation";

export async function getAdmin() {
  const session = await auth();

  if (session?.user?.role !== 'admin') {
    redirect("/v1/login");
  }

  return session!.user;
}

export async function isAdmin(): Promise<boolean> {
  const session = await auth();

  if (session?.user?.role !== 'admin') {
    return false
  }
  return true;
}


export async function getUser() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }
  return session!.user;
}
