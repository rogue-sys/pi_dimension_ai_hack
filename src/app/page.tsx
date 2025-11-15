import Welcome from "@/components/auth/Welcome";
import Logout from "@/components/buttons/Logout";
import ProfileForm from "@/components/forms/ProfileForm";
import { getProfile } from "@/services/common.service";
import Link from "next/link";

export default async function PiDimension() {
  const { data, success, error } = await getProfile();

  if (data?.profile) {
    return (
      <div>
        <Link href={'/profile/edit'}>Edit</Link>
        <Logout />
      </div>
    );
  }

  if (data?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ProfileForm />
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-purple-300 p-6">
      <div className="text-center mb-10">
        <div className="text-6xl font-sans!  font-bold mb-2">π</div>
        <div className="text-xl  tracking-wide font-roboto-mono">
          AI π Dimension
        </div>
      </div>

      <Welcome />
    </div>
  );
}
