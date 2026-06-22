import { SeasonPilotProfileView } from "@/components/SeasonViews";

export const dynamic = "force-dynamic";

type PilotPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PilotPage({ params }: PilotPageProps) {
  const { slug } = await params;
  return <SeasonPilotProfileView pilotSlug={slug} />;
}
