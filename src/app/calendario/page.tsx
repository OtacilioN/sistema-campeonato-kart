import { SeasonCalendarView } from "@/components/SeasonViews";

export const dynamic = "force-dynamic";

type CalendarioPageProps = {
  searchParams?: Promise<{
    periodo?: string;
  }>;
};

export default async function CalendarioPage({ searchParams }: CalendarioPageProps) {
  return <SeasonCalendarView searchParams={searchParams} />;
}
