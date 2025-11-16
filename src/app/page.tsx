import Welcome from "@/components/auth/Welcome";
import { ProfileMenu } from "@/components/common/ProfileMenu";
import ProfileForm from "@/components/forms/ProfileForm";
import AppAboutSection from "@/components/sections/AppAboutSection";
import { Card } from "@/components/ui/card";
import { getProfile } from "@/services/common.service";
import Link from "next/link";

export default async function PiDimension() {
  const { data } = await getProfile();


  if (data?.profile) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="px-6 pt-6">
          <Card className="bg-[#140a22] border-purple-700/40 p-5 shadow-lg flex-row">
            <ProfileMenu
              email={data?.user?.email}
              name={data?.user?.name}
              avatar={data?.profile?.profile_pic || data?.user?.profile_url}
            />
            <div className="text-purple-400">
              <p>{data?.user?.name}</p>
              <p>{data?.user?.email}</p>
            </div>
          </Card>
        </div>
        <div className="px-6 pt-6">
          <Card className="bg-[#140a22] border-purple-700/40 p-5 shadow-lg flex-row ">
            <Link
              className="px-5 py-2 rounded bg-purple-900 cursor-pointer text-white"
              href={"/realities"}
            >
              Find you in our realities
            </Link>
          </Card>
        </div>
        <AppAboutSection  />
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
