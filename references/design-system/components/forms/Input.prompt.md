Labeled text input. Label above, optional help below, 44px min height, 12px radius, red focus ring. Set `error`/`warning` for validation states; `mono` for time fields (`mm:ss.SSS`) and numeric data.

```jsx
<Input label="Nome completo" placeholder="Lucas Almeida" />
<Input label="Melhor volta" mono placeholder="00:00.000" help="Formato mm:ss.SSS" />
<Input label="UF" error="Nome não confere com o resultado oficial" />
<Input label="Piloto" warning="Nome duplicado encontrado" />
```
