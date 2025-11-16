import { auth } from "@/services/common.service";
import { notFound } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user?.id) {
    notFound();
  }

  return <div>{children}</div>;
}
