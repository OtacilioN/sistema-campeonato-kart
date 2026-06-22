import { SeasonCalendarView } from "@/components/SeasonViews";

export const dynamic = "force-dynamic";

type SeasonCalendarPageProps = {
  params: Promise<{
    season: string;
  }>;
  searchParams?: Promise<{
    periodo?: string;
  }>;
};

export default async function SeasonCalendarPage({ params, searchParams }: SeasonCalendarPageProps) {
  const { season } = await params;
  return <SeasonCalendarView searchParams={searchParams} seasonSlug={season} />;
}
