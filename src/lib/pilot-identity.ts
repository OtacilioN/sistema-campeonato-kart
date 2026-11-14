import type { Pilot, Prisma } from "@prisma/client";
import { normalizeName, pilotSlug } from "./domain/text";

export function ensureUniqueResolvedPilots(rows: Array<{ pilotId: string }>) {
  const seen = new Set<string>();
  for (const { pilotId } of rows) {
    if (seen.has(pilotId)) {
      throw new Error("Dois resultados apontam para o mesmo piloto. Corrija os nomes antes de confirmar.");
    }
    seen.add(pilotId);
  }
}

/** Resolves only registered identities; similar names never create an association. */
export async function resolvePilot(
  tx: Prisma.TransactionClient,
  incomingFullName: string,
  uf: string | null,
): Promise<Pilot> {
  const fullName = incomingFullName.trim();
  const normalizedName = normalizeName(fullName);
  const slug = pilotSlug(fullName);
  if (!normalizedName || !slug) {
    throw new Error("Informe um nome válido para o piloto.");
  }

  const matches = await tx.pilot.findMany({
    where: {
      OR: [
        { fullName },
        { slug },
        { aliases: { some: { normalizedName } } },
      ],
    },
  });
  if (matches.length > 1) {
    throw new Error(`O nome ${fullName} aponta para mais de um piloto. Revise as associações antes de confirmar.`);
  }

  const existing = matches[0];
  if (!existing) {
    return tx.pilot.create({
      data: {
        fullName,
        slug,
        uf,
        aliases: { create: { name: fullName, normalizedName } },
      },
    });
  }

  const alias = await tx.pilotAlias.upsert({
    where: { normalizedName },
    create: { name: fullName, normalizedName, pilotId: existing.id },
    update: {},
  });
  // A concurrent import must not silently claim an alias belonging to another pilot.
  if (alias.pilotId !== existing.id) {
    throw new Error(`O nome ${fullName} já está associado a outro piloto. Revise as associações antes de confirmar.`);
  }

  return tx.pilot.update({
    where: { id: existing.id },
    data: { active: true, uf: existing.uf ?? uf },
  });
}
