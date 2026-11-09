---
description: Snap points and sizing for React Native bottom sheets - percentages, fixed heights, named detents and content size, plus snapTo, expand and collapse.
---

# Snap points & sizing

A snap point is a height a sheet can rest at. The user drags between them; your code moves between them with `snapTo`, `expand` and `collapse`.

<div class="preview-row">
  <SheetPreview variant="bottomSheet" :snap="0.25" caption="'small' / 25%" />
  <SheetPreview variant="bottomSheet" :snap="0.5" caption="'medium' / 50%" />
  <SheetPreview variant="bottomSheet" :snap="0.9" caption="'large' / 90%" />
  <SheetPreview variant="bottomSheet" :snap="1" caption="'full' / 100%" />
</div>

## Formats

| Value | Meaning |
| --- | --- |
| `'50%'` | Percentage of screen height, `0 < n ≤ 100` |
| `320` | Height in points, clamped to the screen height |
| `'small'` | 25% |
| `'medium'` | 50% |
| `'large'` | 90% |
| `'full'` | 100% |
| `'content'` | Fit the content's height |

```tsx
sheet.present({
  id: 'comments',
  content: <Comments />,
  snapPoints: ['small', '50%', 'full'],
  initialSnapPoint: '50%',
});
```

## Rules

- At least one snap point; without `snapPoints` or `sizing`, the default is `['large']`.
- No duplicates.
- `initialSnapPoint` must be one of `snapPoints`; it defaults to the first.
- List them smallest first: `collapse()` goes to the first and `expand()` to the last.

Breaking a rule returns `invalid-snap-point` (or `invalid-config` for an empty list).

## Sizing presets

If you only need one height, use `sizing` instead of `snapPoints`:

| `sizing` | Height |
| --- | --- |
| `peek` | 15% |
| `half` | 50% |
| `medium` | 70% |
| `expanded` | 90% |
| `full` | 100% |

```tsx
<NativeSheet visible={open} sizing="half" onDismiss={close}>…</NativeSheet>
```

`sizing` is ignored when `snapPoints` is set. Note that `sizing: 'medium'` (70%) differs from the snap point `'medium'` (50%).

## Moving between snap points

```tsx
sheet.snapTo('comments', 'full');
sheet.expand('comments');   // last snap point
sheet.collapse('comments'); // first snap point
```

`snapTo` with a point that isn't in the list returns `invalid-snap-point`.

## Listening for changes

```tsx
sheet.present({
  id: 'player',
  content: <Player />,
  snapPoints: ['15%', '100%'],
  onSnapChange: (id, index) => setMiniPlayer(index === 0),
});
```

Read the current index any time with [`useSheetState`](/components/use-sheet-state).

## Platform notes

| | iOS 16+ | iOS 15 | Android | Web |
| --- | --- | --- | --- | --- |
| Any number of snap points | ✅ custom detents | Medium and large only | Two resting states (half and full) | ✅ |
| `'content'` | Uses the medium detent | Medium | ✅ wraps content | ✅ auto height |
| Drag between snap points | ✅ | ✅ | ✅ | — (use `snapTo`) |

On Android, a snap point between 10% and 90% becomes the half-expanded height and anything 90% or above becomes fully expanded, so two or three snap points work best there.
