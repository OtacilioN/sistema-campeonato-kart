# AGENTS

## Project

This repository contains **Velocidade Quase Máxima**, codename **Velozes**, a public PWA for an amateur kart championship at `velocidadequasemaxima.com.br`.

The app is open source under MIT and should remain compatible with Vercel Hobby. It uses Next.js App Router, TypeScript, Prisma and Neon PostgreSQL.

## Domain Language

Read `CONTEXT.md` before changing domain code. Use the canonical terms:

- Pilot in code, Piloto in UI/domain language.
- Season for `Temporada`.
- Battery for `Bateria`.
- BatteryResult for `Resultado de Bateria`.

Avoid reintroducing `Competitor`, `Race` or `RaceResult` as primary domain names.

## Structure

- `src/app/`: App Router pages and route handlers.
- `src/components/`: reusable UI components.
- `src/lib/`: server/client helpers and shared data.
- `prisma/`: Prisma schema.
- `docs/`: public documentation and ADRs.
- `references/design-system/`: Claude Design references and mockups. Treat as visual reference, not production app code.
- `.agents/`: operational guidance for future agents.

## Rules

- Do not version `.env`, `.env.local`, secrets, Neon connection strings, Vercel credentials or tokens.
- Keep `.env.example` safe and placeholder-only.
- Public screens must use only confirmed results.
- Lap-to-lap is public, complementary and does not affect ranking.
- Raw PDFs are not stored; persist only structured extracted data.
- Admin access uses `ADMIN_PASSWORD`; never add a default password.
- `npm run dev` must use the local Docker PostgreSQL database, not Neon.
- Preserve `docs/documentacao-processo.md` as historical process documentation.
- Prefer ADRs only for hard-to-reverse, surprising trade-off decisions.

## Neon

Production data is hosted in Neon. Do not paste or save the raw `DATABASE_URL` in docs, commits, chat summaries or memories because it contains database credentials.

To recover the production database connection through the Neon plugin:

1. Search for `velocidade` in Neon and select project `velocidade-quase-maxima`.
2. Confirm project ID `lucky-sound-69319320`.
3. Use the default branch `main` (`br-broad-cherry-ajrvoskf`).
4. Use database `neondb` and the owner role when a connection string is required.
5. Retrieve the URL only through the Neon plugin `get_connection_string` or the Neon console, then pass it directly as process environment for one command. Do not write it to tracked files.

For production schema changes, prefer `prisma migrate deploy` with a transient `DATABASE_URL` from Neon. If a migration is applied through Neon SQL tools instead, also keep `_prisma_migrations` consistent with the local migration name and checksum.

## Validation

Before finishing implementation tasks, run:

```bash
npm run lint
npm run build
npm run prisma:generate
```
