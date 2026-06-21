The base container for every grouped block — next event, podium, ranking list, stat groups. White surface, 16px radius, 1px border, soft card shadow.

```jsx
<Card>…content…</Card>
<Card interactive onClick={openProfile}>…tappable row group…</Card>
<Card elevated>…dropdown / sheet…</Card>
```

Use `interactive` for tappable cards (adds hover lift), `elevated` for floating surfaces.
