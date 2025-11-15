import Welcome from "@/components/auth/Welcome";
import Logout from "@/components/buttons/Logout";
import { getProfile } from "@/services/common.service";

export default async function PiDimension() {
  const { data, success, error } = await getProfile();

  if (data?.profile) {
    return (
      <div>
        <p>{data?.profile?.email}</p>
        <Logout />
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-purple-300 p-6">
      <div className="text-center mb-10">
        <div className="text-6xl font-sans!  font-bold mb-2">π</div>
        <div className="text-xl  tracking-wide font-roboto-mono">
          AI Doppelgänger Dimension
        </div>
      </div>

      <Welcome />
    </div>
  );
}
