---
name: velozes-design
description: Use this skill to generate well-branded interfaces and assets for Velozes — a mobile-first amateur kart championship app (public ranking, race calendar, competitor profiles, lap-by-lap analysis, admin panel). Use for production work or throwaway prototypes/mocks. Contains design guidelines, colors, type, fonts, the logo, and reusable UI kit components.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick map
- `styles.css` — global entry; `@import`s all tokens + fonts. Link this one file.
- `tokens/` — colors, typography, spacing, radius, shadows, fonts (CSS custom properties).
- `assets/velozes-logo.jpeg` — championship emblem.
- `guidelines/` — foundation specimen cards (colors, type, spacing, brand).
- `components/` — React primitives, namespace `VelozesDesignSystem_32dd15` (Button, IconButton, Badge, Chip, Card, Input, StatTile, RankRow, TimeValue).
- `ui_kits/velozes-app/` — interactive recreation of the full app (Home, Calendário, Ranking, Perfil, Corrida, Admin).

## Non-negotiables
- Language is **pt-BR**. Tone: precise, sporting, factual — never hype. Speak to the competitor (você/seu).
- Light theme by default: off-white app field, white cards, 1px borders, light shadows. **Use red sparingly** — it is the action/highlight color, not a background.
- All times/points/positions use **JetBrains Mono tabular numbers** (`00:49.352`, `87 pts`, `1º`, `+2.318`).
- Status is always **color + icon + text**, never color alone. 44px minimum touch targets.
- Icons: **Lucide**, 1.75–2px stroke, 20–24px. No emoji.
