import ProfileForm from "@/components/forms/ProfileForm";
import { getProfile } from "@/services/common.service";
import { notFound } from "next/navigation";

const page = async () => {
  const { data } = await getProfile();

  if (!data?.profile) {
    notFound();
  }

  return (
    <div>
      <ProfileForm initialData={data?.profile} />
    </div>
  );
};

export default page;
