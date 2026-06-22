"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { ADMIN_COOKIE, isAdminCookieValid } from "@/lib/admin-auth";
import { parseManualReviewRows, parseReviewRowsFromForm, reviewPayloadFromOfficialReport, type ReviewPayload } from "@/lib/domain/review";
import { pilotSlug } from "@/lib/domain/text";
import { parseBrazilianDateTime } from "@/lib/domain/time";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const cookieStore = await cookies();
  if (!isAdminCookieValid(cookieStore.get(ADMIN_COOKIE)?.value)) {
    redirect("/admin");
  }
}

function required(value: FormDataEntryValue | null, field: string) {
  const stringValue = String(value ?? "").trim();
  if (!stringValue) throw new Error(`Campo obrigatório: ${field}`);
  return stringValue;
}

export async function createSeasonAction(formData: FormData) {
  await requireAdmin();
  const year = Number(required(formData.get("year"), "ano"));
  const period = Number(required(formData.get("period"), "periodo"));
  const slug = `${year}-${period}`;

  await prisma.season.upsert({
    where: { year_period: { year, period } },
    update: {
      slug,
      name: `Temporada ${year}.${period}`,
    },
    create: {
      year,
      period,
      slug,
      name: `Temporada ${year}.${period}`,
    },
  });

  revalidatePath("/admin");
}

export async function activateSeasonAction(formData: FormData) {
  await requireAdmin();
  const seasonId = required(formData.get("seasonId"), "temporada");

  await prisma.$transaction([
    prisma.season.updateMany({ data: { active: false } }),
    prisma.season.update({ where: { id: seasonId }, data: { active: true } }),
  ]);

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function createBatteryAction(formData: FormData) {
  await requireAdmin();
  const seasonId = required(formData.get("seasonId"), "temporada");
  const number = Number(required(formData.get("number"), "numero"));
  const monthLabel = String(formData.get("monthLabel") ?? "").trim() || null;
  const scheduledAtValue = String(formData.get("scheduledAt") ?? "").trim();
  const scheduledAt = scheduledAtValue ? new Date(scheduledAtValue) : null;

  await prisma.battery.upsert({
    where: { seasonId_number: { seasonId, number } },
    update: {
      label: `${number}ª Bateria`,
      monthLabel,
      scheduledAt,
    },
    create: {
      seasonId,
      number,
      label: `${number}ª Bateria`,
      monthLabel,
      scheduledAt,
    },
  });

  revalidatePath("/admin");
}

export async function cancelBatteryAction(formData: FormData) {
  await requireAdmin();
  const batteryId = required(formData.get("batteryId"), "bateria");
  await prisma.battery.update({ where: { id: batteryId }, data: { status: "CANCELED" } });
  revalidatePath("/admin");
}

export async function createManualReviewAction(formData: FormData) {
  await requireAdmin();
  const batteryId = required(formData.get("batteryId"), "bateria");
  const battery = await prisma.battery.findUnique({ where: { id: batteryId }, select: { status: true } });
  const rows = parseManualReviewRows(required(formData.get("rows"), "linhas"));
  const payload: ReviewPayload = {
    batteryLabel: null,
    batteryNumber: null,
    type: "Corrida",
    category: null,
    circuit: "Circuito Paladino",
    occurredAtText: null,
    rows,
  };

  const review = await prisma.resultReview.create({
    data: {
      batteryId,
      source: "MANUAL",
      reviewPayload: payload as unknown as Prisma.InputJsonValue,
    },
  });
  await prisma.battery.update({
    where: { id: batteryId },
    data: { status: battery?.status === "CONFIRMED" ? "CONFIRMED" : "IN_REVIEW" },
  });

  revalidatePath("/admin");
  redirect(`/admin/revisoes/${review.id}`);
}

export async function importOfficialPdfAction(formData: FormData) {
  await requireAdmin();
  const batteryId = required(formData.get("batteryId"), "bateria");
  const battery = await prisma.battery.findUnique({ where: { id: batteryId }, select: { status: true } });
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Selecione um PDF oficial.");
  }

  const { parseOfficialReport } = await import("@/lib/domain/pdf");
  const parsed = await parseOfficialReport(Buffer.from(await file.arrayBuffer()));
  const payload = reviewPayloadFromOfficialReport(parsed);
  const review = await prisma.resultReview.create({
    data: {
      batteryId,
      source: "OFFICIAL_PDF",
      fileName: file.name,
      parsedPayload: parsed as unknown as Prisma.InputJsonValue,
      reviewPayload: payload as unknown as Prisma.InputJsonValue,
      messages: parsed.messages,
    },
  });

  await prisma.battery.update({
    where: { id: batteryId },
    data: {
      status: battery?.status === "CONFIRMED" ? "CONFIRMED" : "IN_REVIEW",
      category: parsed.category,
      type: parsed.type,
      scheduledAt: parseBrazilianDateTime(parsed.occurredAtText),
    },
  });

  revalidatePath("/admin");
  redirect(`/admin/revisoes/${review.id}`);
}

export async function confirmReviewAction(formData: FormData) {
  await requireAdmin();
  const reviewId = required(formData.get("reviewId"), "revisao");
  const rows = parseReviewRowsFromForm(formData);
  const review = await prisma.resultReview.findUnique({
    where: { id: reviewId },
    include: { battery: { include: { season: true } } },
  });
  if (!review) throw new Error("Revisão não encontrada.");

  const seen = new Set<string>();
  for (const row of rows) {
    const key = `${row.fullName.toLowerCase()}|${row.uf}`;
    if (seen.has(key)) throw new Error(`Piloto duplicado na bateria: ${row.fullName} ${row.uf}`);
    seen.add(key);
  }

  const reviewPayload = review.reviewPayload as unknown as ReviewPayload;

  await prisma.$transaction(async (tx) => {
    await tx.batteryResult.deleteMany({ where: { batteryId: review.batteryId } });

    for (const row of rows) {
      const pilot = await upsertPilot(tx, row.fullName, row.uf);
      await tx.batteryResult.create({
        data: {
          batteryId: review.batteryId,
          pilotId: pilot.id,
          pilotNumber: row.pilotNumber,
          position: row.position,
          status: row.status,
          bestLapNumber: row.bestLapNumber,
          bestLapTime: row.bestLapTime,
          totalTime: row.totalTime,
          gapToLeader: row.gapToLeader,
          gapToPrevious: row.gapToPrevious,
          lastLapTime: row.lastLapTime,
          totalLaps: row.totalLaps,
          averageSpeed: row.averageSpeed ? row.averageSpeed.replace(",", ".") : null,
          positionPoints: row.positionPoints,
          poleBonus: row.poleBonus,
          bestLapBonus: row.bestLapBonus,
          penaltyPoints: row.penaltyPoints,
          penaltyReason: row.penaltyReason,
          finalPoints: row.finalPoints,
        },
      });
    }

    await tx.resultReview.update({
      where: { id: reviewId },
      data: {
        status: "CONFIRMED",
        confirmedAt: new Date(),
        reviewPayload: { ...reviewPayload, rows } as unknown as Prisma.InputJsonValue,
      },
    });
    await tx.battery.update({
      where: { id: review.batteryId },
      data: {
        status: "CONFIRMED",
        type: reviewPayload.type,
        category: reviewPayload.category,
        parsedPayload: (review.parsedPayload ?? review.reviewPayload) as Prisma.InputJsonValue,
        scheduledAt: parseBrazilianDateTime(reviewPayload.occurredAtText) ?? review.battery.scheduledAt,
      },
    });
  });

  revalidatePath("/");
  revalidatePath("/ranking");
  revalidatePath("/pilotos");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function uploadLapToLapAction(formData: FormData) {
  const resultId = required(formData.get("resultId"), "resultado");
  const returnTo = String(formData.get("returnTo") ?? "/");
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Selecione um PDF de lap-to-lap.");
  }

  const result = await prisma.batteryResult.findUnique({
    where: { id: resultId },
    include: { pilot: true, lapToLap: true },
  });
  if (!result) throw new Error("Resultado não encontrado.");

  const { parseLapToLap, validateLapToLap } = await import("@/lib/domain/pdf");
  const parsed = await parseLapToLap(Buffer.from(await file.arrayBuffer()));
  const validation = validateLapToLap({
    parsed,
    pilotName: result.pilot.fullName,
    pilotNumber: result.pilotNumber,
    bestLapTime: result.bestLapTime,
    totalTime: result.totalTime,
  });
  if (!validation.ok) {
    throw new Error(validation.messages.join(" "));
  }

  await prisma.$transaction(async (tx) => {
    const existing = await tx.lapToLap.findUnique({ where: { batteryResultId: resultId } });
    if (existing) {
      await tx.lap.deleteMany({ where: { lapToLapId: existing.id } });
      await tx.lapToLap.delete({ where: { id: existing.id } });
    }

    await tx.lapToLap.create({
      data: {
        batteryResultId: resultId,
        pilotId: result.pilotId,
        validationStatus: "VALIDATED",
        extractedPilotName: parsed.pilotName,
        extractedPilotNumber: parsed.pilotNumber,
        extractedBestLapTime: parsed.bestLapTime,
        extractedBestLapNumber: parsed.bestLapNumber,
        extractedTotalTime: parsed.totalTime,
        parsedPayload: parsed as unknown as Prisma.InputJsonValue,
        laps: {
          create: parsed.laps.map((lap) => ({
            lapNumber: lap.lapNumber,
            lapTime: lap.lapTime,
            deltaBestLap: lap.deltaBestLap,
            deltaCategory: lap.deltaCategory,
            accumulatedTime: lap.accumulatedTime,
            averageSpeed: lap.averageSpeed ? lap.averageSpeed.replace(",", ".") : null,
          })),
        },
      },
    });
  });

  revalidatePath(returnTo);
  redirect(returnTo);
}

async function upsertPilot(tx: Prisma.TransactionClient, fullName: string, uf: string) {
  return tx.pilot.upsert({
    where: { fullName_uf: { fullName, uf } },
    update: { active: true },
    create: {
      fullName,
      uf,
      slug: pilotSlug(fullName, uf),
    },
  });
}
