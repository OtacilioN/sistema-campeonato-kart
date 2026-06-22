import { SeasonHomeView } from "@/components/SeasonViews";

export const dynamic = "force-dynamic";

type SeasonPageProps = {
  params: Promise<{
    season: string;
  }>;
};

export default async function SeasonPage({ params }: SeasonPageProps) {
  const { season } = await params;
  return <SeasonHomeView seasonSlug={season} />;
}
