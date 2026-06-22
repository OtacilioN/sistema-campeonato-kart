import { SeasonRankingView } from "@/components/SeasonViews";

export const dynamic = "force-dynamic";

type RankingPageProps = {
  searchParams?: Promise<{
    bateria?: string;
  }>;
};

export default async function RankingPage({ searchParams }: RankingPageProps) {
  return <SeasonRankingView searchParams={searchParams} />;
}
