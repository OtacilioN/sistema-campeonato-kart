Icon-only button for chrome controls — the header admin lock, list chevrons, admin row reorder/overflow. Always pass `label` for accessibility.

```jsx
<IconButton variant="ghost" label="Admin"><LockIcon/></IconButton>
<IconButton variant="muted" label="Reordenar"><GripIcon/></IconButton>
```

Variants: `ghost` (chrome), `muted` (filled gray well), `outline`, `dark`.
