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
- Preserve `docs/documentacao-processo.md` as historical process documentation.
- Prefer ADRs only for hard-to-reverse, surprising trade-off decisions.

## Validation

Before finishing implementation tasks, run:

```bash
npm run lint
npm run build
npm run prisma:generate
```
