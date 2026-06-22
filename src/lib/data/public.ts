import { prisma } from "@/lib/prisma";
import { buildRanking } from "@/lib/domain/scoring";
import type { BatteryResultInput, RankingRow } from "@/lib/domain/types";

export async function getActiveSeason() {
  return prisma.season.findFirst({
    where: { active: true },
    include: {
      batteries: {
        orderBy: { number: "asc" },
        include: {
          results: {
            include: {
              pilot: true,
              lapToLap: { include: { laps: { orderBy: { lapNumber: "asc" } } } },
            },
            orderBy: [{ position: "asc" }, { createdAt: "asc" }],
          },
        },
      },
    },
  });
}

export async function getSeasonBySlug(slug: string) {
  return prisma.season.findUnique({
    where: { slug },
    include: {
      batteries: {
        orderBy: { number: "asc" },
        include: {
          results: {
            include: {
              pilot: true,
              lapToLap: { include: { laps: { orderBy: { lapNumber: "asc" } } } },
            },
            orderBy: [{ position: "asc" }, { createdAt: "asc" }],
          },
        },
      },
    },
  });
}

export async function getPublicRanking(seasonSlug?: string) {
  const season = seasonSlug ? await getSeasonBySlug(seasonSlug) : await getActiveSeason();
  if (!season) return { season: null, ranking: [] as RankingRow[] };

  const confirmed = season.batteries.filter((battery) => battery.status === "CONFIRMED");
  const confirmedNumbers = confirmed.map((battery) => battery.number);
  const results: BatteryResultInput[] = confirmed.flatMap((battery) =>
    battery.results.map((result) => ({
      pilotId: result.pilotId,
      pilotName: result.pilot.displayName || result.pilot.fullName,
      pilotSlug: result.pilot.slug,
      uf: result.pilot.uf,
      batteryId: battery.id,
      batteryNumber: battery.number,
      status: result.status,
      position: result.position,
      positionPoints: result.positionPoints,
      poleBonus: result.poleBonus,
      bestLapBonus: result.bestLapBonus,
      penaltyPoints: result.penaltyPoints,
      finalPoints: result.finalPoints,
    })),
  );

  return { season, ranking: buildRanking(results, confirmedNumbers) };
}

export async function getPilotProfile(slug: string) {
  return prisma.pilot.findUnique({
    where: { slug },
    include: {
      results: {
        include: {
          battery: { include: { season: true } },
          lapToLap: { include: { laps: { orderBy: { lapNumber: "asc" } } } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function getBatteryDetail(seasonSlug: string, batterySlug: string) {
  const number = Number(batterySlug.match(/^(\d+)/)?.[1]);
  if (!number) return null;

  return prisma.battery.findFirst({
    where: { number, season: { slug: seasonSlug } },
    include: {
      season: true,
      results: {
        include: {
          pilot: true,
          lapToLap: { include: { laps: { orderBy: { lapNumber: "asc" } } } },
        },
        orderBy: [{ position: "asc" }, { createdAt: "asc" }],
      },
      videos: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}
