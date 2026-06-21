Primary action control — use `primary` (red) for the main action on a screen, `dark` for admin/premium emphasis, `secondary` for alternative actions, `danger` for destructive ones, `ghost` for low-emphasis inline actions.

```jsx
<Button variant="primary" size="lg" fullWidth>Ver calendário</Button>
<Button variant="secondary">Ver ranking completo</Button>
<Button variant="dark" iconLeft={<UploadIcon/>}>Enviar lap-to-lap</Button>
<Button variant="danger" size="sm">Rejeitar</Button>
<Button variant="ghost" size="sm">Ver detalhes</Button>
```

Sizes: `sm` 36px, `md` 44px (default), `lg` 48px. All meet the 44px touch target at md/lg. Keep button labels short and verb-led.
