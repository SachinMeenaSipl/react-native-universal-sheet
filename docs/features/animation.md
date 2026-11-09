---
description: Animation options for React Native sheets - spring or timing, damping, stiffness, mass and duration, and what each platform applies today.
---

# Animation

```tsx
sheet.present({
  id: 'details',
  content: <Details />,
  animation: {type: 'timing', durationMs: 180},
});
```

| Field | Type | Description |
| --- | --- | --- |
| `type` | `'spring' \| 'timing'` | Default `spring` |
| `damping` | number > 0 | Spring damping |
| `stiffness` | number > 0 | Spring stiffness |
| `mass` | number > 0 | Spring mass |
| `durationMs` | number > 0 | Timing duration. Default 250 ms on the web |

Zero or negative values return `invalid-config`.

## Platform support

| | iOS | Android | Web |
| --- | --- | --- | --- |
| Open/close motion | System sheet animation | System dialog animation | ✅ `durationMs` |
| Spring parameters | stored | stored | — |

Native presenters use the platform's own motion today, which also respects the system "Reduce motion" setting. Custom springs are on the [roadmap](/reference/roadmap).
