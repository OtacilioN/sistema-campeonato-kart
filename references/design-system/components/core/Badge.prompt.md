Status / state pill. Always combine color + icon + text per the accessibility rule.

```jsx
<Badge tone="success" icon={<CheckIcon/>}>Validado</Badge>
<Badge tone="warning" icon={<AlertIcon/>}>Nome duplicado</Badge>
<Badge tone="danger" icon={<XIcon/>}>Erro de arquivo</Badge>
<Badge tone="brand">Próximo evento</Badge>
```

Tones: success, warning, danger, info, neutral, brand, dark. Use `neutral` for empty states, `brand` for competitive highlights.
