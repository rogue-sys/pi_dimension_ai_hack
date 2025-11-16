import RealityView from "@/components/twinapp/RealityView";
import { getRealityById } from "@/services/realities.service";
import { notFound } from "next/navigation";

type Params = {
  params: Promise<{
    id: string;
  }>;
};
export default async function SingleRealityPage({ params }: Params) {
  const { id } = await params;

  const { reality } = await getRealityById(id);

  if (!reality) {
    notFound();
  }

  return <RealityView reality={reality} />;
}
