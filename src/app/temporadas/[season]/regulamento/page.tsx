import { SeasonRegulationView } from "@/components/SeasonViews";

type RegulationSeasonPageProps = {
  params: Promise<{ season: string }>;
};

export default async function RegulationSeasonPage({ params }: RegulationSeasonPageProps) {
  const { season } = await params;
  return <SeasonRegulationView seasonSlug={season} />;
}
