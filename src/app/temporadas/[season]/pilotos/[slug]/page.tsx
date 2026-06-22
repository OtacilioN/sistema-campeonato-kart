import { SeasonPilotProfileView } from "@/components/SeasonViews";

export const dynamic = "force-dynamic";

type SeasonPilotPageProps = {
  params: Promise<{
    season: string;
    slug: string;
  }>;
};

export default async function SeasonPilotPage({ params }: SeasonPilotPageProps) {
  const { season, slug } = await params;
  return <SeasonPilotProfileView pilotSlug={slug} seasonSlug={season} />;
}
