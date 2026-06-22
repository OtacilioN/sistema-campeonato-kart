import { SeasonRankingView } from "@/components/SeasonViews";

export const dynamic = "force-dynamic";

type RankingSeasonPageProps = {
  params: Promise<{
    season: string;
  }>;
  searchParams?: Promise<{
    bateria?: string;
  }>;
};

export default async function RankingSeasonPage({ params, searchParams }: RankingSeasonPageProps) {
  const { season } = await params;
  return <SeasonRankingView searchParams={searchParams} seasonSlug={season} />;
}
