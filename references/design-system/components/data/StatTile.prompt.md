Compact metric tile for the stat grids on profile and race-detail screens. Label + optional icon on top, big tabular value below, optional caption.

```jsx
<StatTile label="Melhor volta" value="00:48.732" icon={<TimerIcon/>} sub="8ª etapa" />
<StatTile label="Total de pontos" value={87} unit="pts" valueSize="l" />
<StatTile label="Diferença p/ anterior" value={2.318} valueTone="negative" />
```

Lay out 2–3 across in a CSS grid with `gap: var(--gap-card)`.
