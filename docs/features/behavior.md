---
description: Behaviour props for React Native sheets - drag, backdrop, keyboard, nested scroll, back button, auto-dismiss, margin and modal, non-modal or persistent behaviour.
---

# Behaviour props

These options control how a sheet behaves. Every one has a default from the [variant](/features/variants); pass a value to override it.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `behavior` | `'modal' \| 'nonModal' \| 'persistent'` | from variant | How the sheet relates to the screen beneath |
| `enableDrag` | `boolean` | `true` for sheets, `top`, `fullScreenViewer` | Drag to resize and swipe to dismiss |
| `enableBackdrop` | `boolean` | `true` for modal behaviour | Dim the screen beneath |
| `enableKeyboard` | `boolean` | `true` except `alert`, `picker` and overlays | Keep inputs above the keyboard |
| `enableNestedScroll` | `boolean` | `true` except `action`, `share`, `alert` and overlays | Let inner scroll views scroll before the sheet drags |
| `hardwareBackDismiss` | `boolean` | `true` (`false` for `loadingOverlay`) | Android back button / web Escape closes it |
| `autoDismissMs` | `number > 0` | toast 3000, snackbar 4000, in-app notification 5000 | Close automatically |
| `margin` | `number ≥ 0` | `16` for floating placements, else `0` | Gap from the screen edges |
| `anchor` | `{x, y, width, height}` | — | Required for anchored overlays |
| `side` | `'left' \| 'right'` | `'right'` | For the `side` variant |
| `accessibilityLabel` | `string` | — | Screen-reader label of the surface |

## `behavior`

| Value | Screen beneath | Backdrop default | `dismiss()` / `dismissAll()` | Backdrop tap closes |
| --- | --- | --- | --- | --- |
| `modal` | blocked | on | closes it | yes |
| `nonModal` | usable | off | closes it | — |
| `persistent` | usable | off | **skips it** | — |

```tsx
// A filter panel the user can keep open while scrolling the list behind it.
sheet.present({
  id: 'filters',
  variant: 'filter',
  behavior: 'nonModal',
  snapPoints: ['30%', '70%'],
  content: <Filters />,
});
```

## `enableDrag`

With `enableDrag: false` the sheet can't be dragged or swiped away. On iOS it also can't be pulled down. Close it from code.

```tsx
sheet.present({id: 'terms', content: <Terms onAccept={accept} />, enableDrag: false});
```

## `autoDismissMs`

```tsx
sheet.present({id: 'hint', variant: 'tooltip', anchor, content: <Hint />, autoDismissMs: 4000});
```

The timer restarts when you `update` or `replace` the sheet, and stops when it is dismissed.

## Platform notes

`enableKeyboard` and `enableNestedScroll` are part of the shared contract and are honoured on the web. On iOS and Android the platform's default keyboard and scroll handling applies for now. See [Keyboard & scrolling](/features/keyboard-and-scroll).
