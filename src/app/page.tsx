import { SeasonHomeView } from "@/components/SeasonViews";

export const dynamic = "force-dynamic";

export default async function Home() {
  return <SeasonHomeView />;
}
