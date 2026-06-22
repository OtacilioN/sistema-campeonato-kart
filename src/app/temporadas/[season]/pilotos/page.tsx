import { SeasonPilotsView } from "@/components/SeasonViews";

export const dynamic = "force-dynamic";

type SeasonPilotsPageProps = {
  params: Promise<{
    season: string;
  }>;
};

export default async function SeasonPilotsPage({ params }: SeasonPilotsPageProps) {
  const { season } = await params;
  return <SeasonPilotsView seasonSlug={season} />;
}
