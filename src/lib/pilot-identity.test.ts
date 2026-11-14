import type { Pilot, Prisma } from "@prisma/client";
import { describe, expect, it, vi } from "vitest";
import { normalizeName, pilotSlug } from "./domain/text";
import { ensureUniqueResolvedPilots, resolvePilot } from "./pilot-identity";

type StoredPilot = Pilot & { aliases: Array<{ name: string; normalizedName: string }> };

function storedPilot(id: string, fullName: string, aliasNames: string[], options: Partial<Pilot> = {}): StoredPilot {
  return {
    id, fullName, slug: pilotSlug(fullName), displayName: null, uf: "PB", active: true,
    createdAt: new Date("2026-01-01"), updatedAt: new Date("2026-01-01"),
    aliases: aliasNames.map((name) => ({ name, normalizedName: normalizeName(name) })),
    ...options,
  };
}

function database(pilots: StoredPilot[]) {
  const pilot = {
    findMany: vi.fn(async ({ where }: { where: { OR: Array<{
      fullName?: string; slug?: string; aliases?: { some: { normalizedName: string } };
    }> } }) => pilots.filter((p) => where.OR.some((clause) =>
      (clause.fullName !== undefined && clause.fullName === p.fullName)
      || (clause.slug !== undefined && clause.slug === p.slug)
      || (clause.aliases !== undefined && p.aliases.some((alias) => alias.normalizedName === clause.aliases?.some.normalizedName)),
    ))),
    update: vi.fn(async ({ where, data }: { where: { id: string }; data: Partial<Pilot> }) => {
      const existing = pilots.find((p) => p.id === where.id)!;
      Object.assign(existing, data);
      return existing;
    }),
    create: vi.fn(async ({ data }: { data: {
      fullName: string; slug: string; uf: string | null; aliases: { create: { name: string; normalizedName: string } };
    } }) => {
      const created = storedPilot("new-pilot", data.fullName, [data.aliases.create.name], { uf: data.uf });
      pilots.push(created);
      return created;
    }),
  };
  const pilotAlias = {
    upsert: vi.fn(async ({ where, create }: { where: { normalizedName: string }; create: {
      name: string; normalizedName: string; pilotId: string;
    } }) => {
      const owner = pilots.find((p) => p.aliases.some((alias) => alias.normalizedName === where.normalizedName));
      if (owner) return { pilotId: owner.id };
      pilots.find((p) => p.id === create.pilotId)!.aliases.push(create);
      return { pilotId: create.pilotId };
    }),
  };
  return { tx: { pilot, pilotAlias } as unknown as Prisma.TransactionClient, pilot, pilotAlias };
}

describe("pilot identity resolution", () => {
  it.each([
    ["Antonio Carlos De Carvalho S...", "Antonio Carlos De Carvalho Segundo"],
    ["Robério Rosa Barbalho De Oli...", "Robério Rosa Barbalho De Oliveira"],
    ["Jaime Antonio De Albuquerque...", "Jaime Antonio De Albuquerque Filho"],
    ["Bruno Marcos Santos Lima", "Bruno Marcos"],
  ])("resolves the registered alias for %s without creating another pilot", async (canonical, alias) => {
    const saved = storedPilot("historical", canonical, [alias]);
    const { tx, pilot } = database([saved]);
    const resolved = await resolvePilot(tx, alias, "PE");

    expect(resolved.id).toBe("historical");
    expect(resolved.fullName).toBe(canonical);
    expect(resolved.slug).toBe(pilotSlug(canonical));
    expect(resolved.uf).toBe("PB");
    expect(pilot.create).not.toHaveBeenCalled();
  });

  it("matches accents, case and repeated whitespace through a registered alias", async () => {
    const saved = storedPilot("historical", "Robério Rosa Barbalho De Oli...", ["Robério Rosa Barbalho De Oliveira"]);
    const { tx, pilot } = database([saved]);

    expect((await resolvePilot(tx, "  ROBERIO  ROSA BARBALHO DE OLIVEIRA  ", null)).id).toBe("historical");
    expect(pilot.create).not.toHaveBeenCalled();
  });

  it("keeps the canonical name, public URL and display name when an abbreviation is uploaded", async () => {
    const saved = storedPilot("historical", "Jaime Antonio De Albuquerque...", ["Jaime Filho"], {
      slug: "historical-public-url", displayName: "Jaiminho Karteiro", active: false, uf: null,
    });
    const { tx } = database([saved]);

    expect(await resolvePilot(tx, "Jaime Filho", "PE")).toMatchObject({
      id: "historical", fullName: "Jaime Antonio De Albuquerque...", slug: "historical-public-url",
      displayName: "Jaiminho Karteiro", active: true, uf: "PE",
    });
  });

  it("still finds an existing pilot with no aliases by its normalized slug", async () => {
    const saved = storedPilot("historical", "Otacílio Saraiva Maia Neto", []);
    const { tx, pilotAlias, pilot } = database([saved]);

    expect((await resolvePilot(tx, "OTACILIO SARAIVA MAIA NETO", null)).id).toBe("historical");
    expect(pilot.create).not.toHaveBeenCalled();
    expect(pilotAlias.upsert).toHaveBeenCalled();
  });

  it("does not infer an unregistered abbreviation or associate the father with the son", async () => {
    const son = storedPilot("son", "Jaime Antonio De Albuquerque...", ["Jaime Antonio De Albuquerque Filho"]);
    const father = storedPilot("father", "Jaime (pai) Antonio De Albuquerque", []);
    const { tx, pilot } = database([son, father]);

    expect((await resolvePilot(tx, father.fullName, "PB")).id).toBe("father");
    expect((await resolvePilot(tx, "Jaime Antonio", "PE")).id).toBe("new-pilot");
    expect(pilot.create).toHaveBeenCalledTimes(1);
  });

  it("rejects a name whose direct identity and alias point to different pilots", async () => {
    const original = storedPilot("original", "Bruno Marcos Santos Lima", ["Bruno Marcos"]);
    const duplicate = storedPilot("duplicate", "Bruno Marcos", []);
    const { tx, pilot, pilotAlias } = database([original, duplicate]);

    await expect(resolvePilot(tx, "Bruno Marcos", "PE")).rejects.toThrow("aponta para mais de um piloto");
    expect(pilot.create).not.toHaveBeenCalled();
    expect(pilot.update).not.toHaveBeenCalled();
    expect(pilotAlias.upsert).not.toHaveBeenCalled();
  });

  it("rejects two different registered aliases that resolve to the same result identity", async () => {
    const saved = storedPilot("historical", "Bruno Marcos Santos Lima", ["Bruno Marcos", "B. Marcos"]);
    const { tx } = database([saved]);
    const first = await resolvePilot(tx, "Bruno Marcos", "PE");
    const second = await resolvePilot(tx, "B. Marcos", "PB");

    expect(() => ensureUniqueResolvedPilots([{ pilotId: first.id }, { pilotId: second.id }])).toThrow(
      "Dois resultados apontam para o mesmo piloto. Corrija os nomes antes de confirmar.",
    );
    expect(saved.aliases.map((alias) => alias.name)).toEqual(["Bruno Marcos", "B. Marcos"]);
    expect(saved.fullName).toBe("Bruno Marcos Santos Lima");
  });

  it("accepts distinct resolved pilots and an empty result set", () => {
    expect(() => ensureUniqueResolvedPilots([{ pilotId: "first" }, { pilotId: "second" }])).not.toThrow();
    expect(() => ensureUniqueResolvedPilots([])).not.toThrow();
  });

  it("does not overwrite the original spelling of an existing alias", async () => {
    const saved = storedPilot("historical", "Robério Rosa Barbalho De Oli...", ["Robério Rosa Barbalho De Oliveira"]);
    const { tx } = database([saved]);

    await resolvePilot(tx, "ROBERIO ROSA BARBALHO DE OLIVEIRA", null);

    expect(saved.aliases).toEqual([{
      name: "Robério Rosa Barbalho De Oliveira", normalizedName: "roberio rosa barbalho de oliveira",
    }]);
    expect(saved.fullName).toBe("Robério Rosa Barbalho De Oli...");
  });

  it("rejects an alias claimed concurrently by a different pilot", async () => {
    const saved = storedPilot("historical", "Bruno Marcos", []);
    const { tx, pilotAlias, pilot } = database([saved]);
    pilotAlias.upsert.mockResolvedValueOnce({ pilotId: "another-pilot" });

    await expect(resolvePilot(tx, "Bruno Marcos", "PE")).rejects.toThrow("já está associado a outro piloto");
    expect(pilot.update).not.toHaveBeenCalled();
  });

  it("creates an unknown pilot together with its normalized alias", async () => {
    const { tx, pilot } = database([]);
    const created = await resolvePilot(tx, "  Nyclas Queiroz  ", "PE");

    expect(created).toMatchObject({ fullName: "Nyclas Queiroz", slug: "nyclas-queiroz", uf: "PE" });
    expect(pilot.create).toHaveBeenCalledWith({ data: {
      fullName: "Nyclas Queiroz", slug: "nyclas-queiroz", uf: "PE",
      aliases: { create: { name: "Nyclas Queiroz", normalizedName: "nyclas queiroz" } },
    } });
  });

  it("rejects an empty identity before reading or writing the database", async () => {
    const { tx, pilot } = database([]);

    await expect(resolvePilot(tx, "---", null)).rejects.toThrow("nome válido");
    expect(pilot.findMany).not.toHaveBeenCalled();
    expect(pilot.create).not.toHaveBeenCalled();
  });
});
