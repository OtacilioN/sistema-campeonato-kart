"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { ADMIN_COOKIE, isAdminCookieValid } from "@/lib/admin-auth";
import { ensureUniqueReviewPilotNames, parseManualReviewRows, parseReviewRowsFromForm, reviewPayloadFromOfficialReport, type ReviewPayload } from "@/lib/domain/review";
import { pilotSlug, preferredPilotName } from "@/lib/domain/text";
import { parseBrazilianDateTime } from "@/lib/domain/time";
import type { ReviewRow } from "@/lib/domain/types";
import { parseYouTubeVideoLink } from "@/lib/domain/youtube";
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

export async function createConfirmedResultReviewAction(formData: FormData) {
  await requireAdmin();
  const batteryId = required(formData.get("batteryId"), "bateria");
  const battery = await prisma.battery.findUnique({
    where: { id: batteryId },
    include: {
      results: {
        orderBy: [{ position: "asc" }, { createdAt: "asc" }],
        include: { pilot: true },
      },
    },
  });

  if (!battery) throw new Error("Bateria não encontrada.");
  if (battery.status !== "CONFIRMED" || battery.results.length === 0) {
    throw new Error("Só é possível editar uma bateria com resultado confirmado.");
  }

  const rows: ReviewRow[] = battery.results.map((result) => ({
    fullName: result.pilot.fullName,
    uf: result.pilot.uf,
    pilotNumber: result.pilotNumber,
    position: result.position,
    status: result.status,
    bestLapNumber: result.bestLapNumber,
    bestLapTime: result.bestLapTime,
    totalTime: result.totalTime,
    gapToLeader: result.gapToLeader,
    gapToPrevious: result.gapToPrevious,
    lastLapTime: result.lastLapTime,
    totalLaps: result.totalLaps,
    averageSpeed: result.averageSpeed?.toString().replace(".", ",") ?? null,
    positionPoints: result.positionPoints,
    poleBonus: result.poleBonus,
    bestLapBonus: result.bestLapBonus,
    penaltyPoints: result.penaltyPoints,
    penaltyReason: result.penaltyReason,
    finalPoints: result.finalPoints,
    needsNameReview: false,
  }));

  const payload: ReviewPayload = {
    batteryLabel: battery.label,
    batteryNumber: battery.number,
    type: battery.type,
    category: battery.category,
    circuit: battery.locationName,
    occurredAtText: null,
    rows,
  };

  const review = await prisma.resultReview.create({
    data: {
      batteryId,
      source: "MANUAL",
      reviewPayload: payload as unknown as Prisma.InputJsonValue,
      messages: ["Revisão criada a partir do resultado confirmado atual."],
    },
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
  const review = await prisma.resultReview.findUnique({
    where: { id: reviewId },
    include: { battery: { include: { season: true } } },
  });
  if (!review) throw new Error("Revisão não encontrada.");

  let rows: ReviewRow[];
  try {
    rows = parseReviewRowsFromForm(formData);
    ensureUniqueReviewPilotNames(rows);
  } catch (error) {
    await rejectReviewConfirmation(reviewId, review.messages, readableErrorMessage(error));
    redirect(`/admin/revisoes/${reviewId}`);
  }

  const reviewPayload = review.reviewPayload as unknown as ReviewPayload;

  try {
    await prisma.$transaction(async (tx) => {
      const resolvedRows: Array<{ row: ReviewRow; pilotId: string }> = [];

      for (const row of rows) {
        const pilot = await upsertPilot(tx, row.fullName, row.uf);
        resolvedRows.push({ row, pilotId: pilot.id });
      }

      await tx.batteryResult.deleteMany({
        where: {
          batteryId: review.batteryId,
          pilotId: { notIn: resolvedRows.map(({ pilotId }) => pilotId) },
        },
      });

      for (const { row, pilotId } of resolvedRows) {
        const data = batteryResultData(row);
        await tx.batteryResult.upsert({
          where: {
            batteryId_pilotId: {
              batteryId: review.batteryId,
              pilotId,
            },
          },
          update: data,
          create: {
            batteryId: review.batteryId,
            pilotId,
            ...data,
          },
        });
      }

      await tx.resultReview.update({
        where: { id: reviewId },
        data: {
          status: "CONFIRMED",
          confirmedAt: new Date(),
          reviewPayload: { ...reviewPayload, rows } as unknown as Prisma.InputJsonValue,
          messages: review.messages.filter((message) => !message.startsWith(CONFIRMATION_ERROR_PREFIX)),
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
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      await rejectReviewConfirmation(reviewId, review.messages, "Dois resultados apontam para o mesmo piloto. Corrija os nomes antes de confirmar.");
      redirect(`/admin/revisoes/${reviewId}`);
    }

    throw error;
  }

  revalidatePath("/");
  revalidatePath("/ranking");
  revalidatePath("/pilotos");
  revalidatePath("/admin");
  redirect("/admin");
}

const CONFIRMATION_ERROR_PREFIX = "Erro na confirmação:";

async function rejectReviewConfirmation(reviewId: string, currentMessages: string[], message: string) {
  await prisma.resultReview.update({
    where: { id: reviewId },
    data: {
      messages: [
        ...currentMessages.filter((currentMessage) => !currentMessage.startsWith(CONFIRMATION_ERROR_PREFIX)),
        `${CONFIRMATION_ERROR_PREFIX} ${message}`,
      ],
    },
  });
  revalidatePath(`/admin/revisoes/${reviewId}`);
}

function readableErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Revise os dados antes de confirmar.";
}

function batteryResultData(row: ReviewRow) {
  return {
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
  };
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

export async function uploadBatteryVideoAction(formData: FormData) {
  const batteryId = required(formData.get("batteryId"), "bateria");
  const returnTo = safeReturnPath(String(formData.get("returnTo") ?? "/"));
  const password = String(formData.get("password") ?? "");

  if (!isVideomakerPasswordValid(password)) {
    redirect(videoRedirectPath(returnTo, "senha"));
  }

  const parsedLink = parseYouTubeVideoLink(String(formData.get("youtubeUrl") ?? ""));
  if (!parsedLink) {
    redirect(videoRedirectPath(returnTo, "link"));
  }

  const battery = await prisma.battery.findUnique({
    where: { id: batteryId },
    select: { id: true },
  });
  if (!battery) {
    redirect(videoRedirectPath(returnTo, "erro"));
  }

  await prisma.batteryVideo.upsert({
    where: {
      batteryId_youtubeVideoId: {
        batteryId,
        youtubeVideoId: parsedLink.videoId,
      },
    },
    update: {
      youtubeUrl: parsedLink.canonicalUrl,
    },
    create: {
      batteryId,
      youtubeVideoId: parsedLink.videoId,
      youtubeUrl: parsedLink.canonicalUrl,
    },
  });

  revalidatePath(returnTo);
  redirect(videoRedirectPath(returnTo, "enviado"));
}

function isVideomakerPasswordValid(password: string) {
  const expected = process.env.VIDEOMAKER_PASSWORD;
  return Boolean(expected) && password === expected;
}

function safeReturnPath(path: string) {
  return path.startsWith("/") && !path.startsWith("//") ? path.split(/[?#]/)[0] || "/" : "/";
}

function videoRedirectPath(path: string, status: string) {
  return `${path}?video=${status}#videos`;
}

async function upsertPilot(tx: Prisma.TransactionClient, fullName: string, uf: string | null) {
  const slug = pilotSlug(fullName);
  const existingByName = await tx.pilot.findUnique({ where: { fullName } });
  const existing = existingByName ?? await tx.pilot.findUnique({ where: { slug } });

  if (existing) {
    const nextFullName = preferredPilotName(existing.fullName, fullName);

    return tx.pilot.update({
      where: { id: existing.id },
      data: {
        active: true,
        fullName: nextFullName,
        uf: existing.uf ?? uf,
        slug: pilotSlug(nextFullName),
      },
    });
  }

  return tx.pilot.create({
    data: {
      fullName,
      uf,
      slug,
    },
  });
}
