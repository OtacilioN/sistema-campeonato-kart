# Velozes — Design System

**Velozes** is a mobile-first web app for following an **amateur kart championship**. It is a public companion for competitors and fans: public ranking, race calendar, competitor profiles, lap-by-lap race analysis, lap-to-lap uploads, and an admin panel for importing official race result PDFs.

The visual identity is derived from the championship logo **"Velocidade Máxima ou Quase"** (Maximum Speed, or Almost) — a kart racer, checkered flag, speedometer, heavy red/black/white contrast and an aggressive sporting feel. The product **translates that energy into a clean, legible, modern interface** — a sporting performance dashboard, not a race poster or a t-shirt graphic. Race motifs (diagonal lines, checkered pattern, flag, stopwatch, speedometer, trophy) appear only as small accents.

## Sources given
- `uploads/logoVelocidadeQuaseMax.jpeg` — the championship logo (copied to `assets/velozes-logo.jpeg`).
- 6 grayscale ChatGPT wireframe mockups of the real app screens: **Home, Calendário, Ranking, Perfil do Competidor, Detalhe da Corrida (lap-by-lap), Admin.** These define the exact layout structure recreated in the UI kit. The wireframes are grayscale; this system supplies the red/black/white color layer on top of those layouts.
- A complete written token + component brief (Portuguese). All tokens below come from that brief verbatim.

No codebase or Figma was provided — the system is built from the brief, the logo, and the wireframes.

> **Language:** the product is in **Brazilian Portuguese (pt-BR)**. All UI copy, labels and examples are in Portuguese.

---

## CONTENT FUNDAMENTALS

**Tone:** confident, sporting, factual. The product reports competition data, so copy is **precise and trustworthy** — never hype, never marketing fluff. Think race engineer / timing screen, not influencer.

**Voice & person:** speaks **to the competitor** using *você* / *seu* ("Seu ritmo foi consistente", "Você acelerou nas últimas voltas", "Enviar lap-to-lap"). Section and data labels are **neutral nouns** ("Próximo evento", "Pódio atual", "Total de pontos", "Diferença p/ líder").

**Casing:**
- Screen titles & section headers: **Title-ish sentence case** in Portuguese ("Próximos eventos", "Como funciona a pontuação", "Insights da corrida").
- Small overlines / status tags: **UPPERCASE** with letter-spacing ("PRÓXIMO EVENTO", "PROCESSADO", "VALIDADO").
- Data labels above values: small, secondary color, sentence case ("Melhor volta", "Tempo total", "Última volta").

**Numbers & timing — the heart of the product:**
- Lap / total times use `mm:ss.SSS` → `00:49.352`, `14:32.184`.
- Positions: `1º`, `2º` (ordinal, masculine).
- Points: integer + lowercase `pts` unit set smaller and muted → **`87` pts**.
- Deltas carry an explicit sign: `+2.318`, `-0.412`; em-dash `—` when not applicable ("Diferença p/ líder —" for the leader).
- Always **tabular / monospace** so digits align in lists and tables.

**Abbreviations:** Brazilian state UF (PR, SP, RS, MG, GO). Months abbreviated 3-letter uppercase (JUN, JUL, AGO). Weekday 3-letter (QUA, SEG).

**Microcopy examples:**
- Empty / neutral: "Ranking ainda não iniciado.", "Nenhuma corrida anterior.", "Sem lap-to-lap enviado."
- Helper: "Datas e locais sujeitos a alteração."
- Admin status: "Autenticado como administrador", "Processado", "Aguardando revisão".

**Emoji:** none. The brand uses **line icons and small race glyphs**, never emoji.

---

## VISUAL FOUNDATIONS

**Overall feel:** a clean sporting **dashboard on a light base**. White cards float on an off-white app background with subtle 1px borders and soft shadows. Red is the energy; black is the strength; gray carries the data.

**Color usage (strict — avoid an "all red" interface):**
- **Red (`--brand-red` #E10600)** = primary action, competitive highlight, the active/important accent, chart line. Used sparingly and deliberately.
- **Black (`--racing-black` #070707 / `--carbon`)** = headers, top bars, primary text, secondary/dark buttons, premium & admin emphasis.
- **White + light grays** = the dominant base — `--off-white` app background, white cards, `--surface-muted` chips/wells.
- **Green** only for positive validation (lap-to-lap validado, salvo). **Amber** only for attention (nome duplicado, dados pendentes). **Error red `--danger`** for import failures, penalties, rejections — a *different* red token from brand red, used with an icon + label.

**Typography:** three families. **Barlow Condensed** for headings — condensed, strong, sporting presence; tight tracking. **Inter** for all interface text — calm and highly legible. **JetBrains Mono** with tabular numbers for every time, position, point and delta. Headings never below their scale; essential body text never below 14px.

**Spacing & layout:** 4px scale. Mobile-first, single column, `--content-max` ~440px. 16px lateral and card padding, 24px between sections, 12–16px between cards. Fixed **bottom navigation** 64–72px; fixed compact **header** on top. Min 44px touch targets.

**Backgrounds:** flat. Off-white app field, white surfaces. **No big gradients, no dark full-screen washes, no 3D.** A single subtle diagonal-stripe or faint checkered accent is allowed in small decorative spots (e.g. a podium header strip) — never behind data.

**Corners:** moderate. Cards 16px, buttons 12px, inputs 10–12px, chips full pill, modals 20–24px, lists/tables 12–16px. Nothing excessively round.

**Borders:** 1px `--border-light` default; 1px `--border-strong` for emphasis. Borders do most of the separation work; shadows are a light secondary cue.

**Shadows / depth:** light only. `--shadow-card` `0 4px 12px rgba(0,0,0,.06)` for resting cards; `--shadow-floating` `0 8px 24px rgba(0,0,0,.10)` for floating elements (bottom-nav lift, modals, dropdowns). No heavy or colored drop shadows.

**Hover / press:** desktop hover darkens fills slightly (red → red-dark) or tints ghost backgrounds with `--surface-muted`. Press = subtle scale-down (~0.98) and/or a darker step. Focus = red focus ring `--shadow-focus`.

**Animation:** restrained and functional — short fades/slides (~150–200ms, ease-out) for sheets, dropdowns, tab changes. Countdown digits tick. **No bouncy or infinite decorative motion** near data.

**Accessibility:** never status-by-color-alone — always **color + icon + text** (✓ Validado, ⚠ Nome duplicado, ✕ Erro). Adequate contrast, 44px targets, critical data legible at a glance on a phone.

---

## ICONOGRAPHY

**System:** **Lucide** line icons (loaded from CDN), stroke weight **1.75–2px**, default size **20px** (24px for primary nav / emphasis). Lucide matches the brief's "ícones lineares simples" requirement and ships the full needed set.

**Core icons used:** `home`, `calendar` / `calendar-clock`, `trophy`, `user` / `users`, `lock`, `upload-cloud`, `file-text` (PDF), `timer` (cronômetro), `flag` / checkered flag, `gauge` (velocímetro), `triangle-alert`, `check` / `circle-check`, `pencil` (editar), `trash-2`, `chevron-right` / `chevron-down`, `arrow-left`, `bar-chart-3`, `gavel` (aplicar punição), `calculator` (salvar e recalcular), `shield-check`, `crown`, `map-pin`, `info`, `star`.

**Race glyphs:** the **checkered flag** is the one bespoke brand motif — rendered as a small CSS/SVG checkered square where a flag is needed (nav, race-detail switcher). Trophy/podium, stopwatch and speedometer come straight from Lucide.

**Emoji / unicode:** not used as icons. The only non-Lucide marks are the ordinal `º` and arithmetic signs in data.

**Logo:** `assets/velozes-logo.jpeg` is the full emblem (kart + speedometer + wordmark) for splash / about contexts. In compact product chrome, **"Velozes" is set as a wordmark** in Barlow Condensed italic-bold, not the full emblem — the emblem is too detailed for a header.

---

## INDEX — what's in this system

**Root**
- `styles.css` — global entry; `@import`s every token + font file. Consumers link this.
- `readme.md` — this guide.
- `SKILL.md` — Agent Skill wrapper.

**`tokens/`** — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `radius.css`, `shadows.css`.

**`assets/`** — `velozes-logo.jpeg` (championship emblem).

**`guidelines/`** — foundation specimen cards (Type, Colors, Spacing, Brand) shown in the Design System tab.

**`components/`** — reusable primitives (Namespace `Velozes`):
- `core/` — `Button`, `IconButton`, `Badge`, `Chip`, `Card`
- `forms/` — `Input`
- `data/` — `StatTile`, `RankRow`, `TimeValue`

**`ui_kits/velozes-app/`** — high-fidelity click-through recreation of the app: Home, Calendário, Ranking, Perfil do Competidor, Detalhe da Corrida, Admin. Matches the provided wireframe layouts with the brand color layer applied.
