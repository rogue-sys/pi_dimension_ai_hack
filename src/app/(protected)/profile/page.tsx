import ProfileShowcase from "@/components/sections/ProfileShowcase";
import { getProfile } from "@/services/common.service";
import { notFound } from "next/navigation";

const page = async () => {
  const { data } = await getProfile();

  if (!data?.profile) {
    notFound();
  }

  return (
    <div>
      <ProfileShowcase profile={data?.profile} />
    </div>
  );
};

export default page;
