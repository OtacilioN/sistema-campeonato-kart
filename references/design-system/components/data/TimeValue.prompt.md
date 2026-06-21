Renders any race number with tabular monospace alignment — lap times, totals, points, deltas. Always use this for data so digits line up in lists and tables.

```jsx
<TimeValue value="00:49.352" size="l" />
<TimeValue value={87} unit="pts" size="m" tone="primary" />
<TimeValue value={2.318} sign size="s" tone="negative" />   {/* +2.318 */}
<TimeValue value="—" tone="muted" />                          {/* leader delta */}
```

Tones: primary, brand (red), positive (green), negative (red), muted.
