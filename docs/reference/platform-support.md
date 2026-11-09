---
description: Feature-by-feature platform support for react-native-universal-sheet on iOS, Android and web - placements, snap points, design props, gestures and events.
---

# Platform support

What each platform draws today. "stored" means the prop is accepted and validated, and reaches the native view, but isn't drawn yet.

## Presentation

| Feature | iOS | Android | Web |
| --- | --- | --- | --- |
| Bottom sheet | ✅ `UISheetPresentationController` | ✅ `BottomSheetDialog` | ✅ |
| Center / alert / popup / floating | as bottom sheet | as bottom sheet | ✅ |
| Side drawer (left / right) | as bottom sheet | as bottom sheet | ✅ |
| Top sheet / in-app notification | as bottom sheet | as bottom sheet | ✅ |
| Toast / snackbar | as bottom sheet | as bottom sheet | ✅ |
| Anchored (popover, tooltip, menu…) | as bottom sheet | as bottom sheet | ✅ below anchor |
| Full screen / viewer / loading | as bottom sheet | as bottom sheet | ✅ |
| Stacked sheets | ✅ | ✅ separate dialog windows | ✅ |

## Sizing and gestures

| Feature | iOS | Android | Web |
| --- | --- | --- | --- |
| Snap points | ✅ iOS 16+; iOS 15: medium/large | ✅ half and full states | ✅ |
| `'content'` height | medium detent | ✅ | ✅ |
| `snapTo` / `expand` / `collapse` | ✅ | ✅ | ✅ |
| Drag between snap points | ✅ | ✅ | — |
| Swipe to dismiss | ✅ | ✅ | — |
| `enableDrag: false` | ✅ | ✅ | ✅ |
| Backdrop tap dismisses | ✅ system | ✅ | ✅ |
| Back button / Escape | — | ✅ | ✅ Escape |

## Design props

| Prop | iOS | Android | Web |
| --- | --- | --- | --- |
| `backgroundColor` | ✅ | ✅ | ✅ |
| `cornerRadius` | ✅ iOS 16+ | ✅ | ✅ |
| `borderWidth` / `borderColor` | ✅ | ✅ | ✅ |
| `shadowRadius` / `shadowOpacity` | ✅ | stored | ✅ |
| `backdropOpacity` | system | ✅ | ✅ |
| `backdropColor` | system | stored | ✅ |
| `showHandle` | ✅ | stored | ✅ |
| `handleColor` | stored | stored | ✅ |
| `width` | stored | stored | ✅ |
| `margin` | stored | stored | ✅ |
| `styles.*` | ✅ | ✅ | ✅ |

## Behaviour

| Feature | iOS | Android | Web |
| --- | --- | --- | --- |
| Events (`onDidPresent`, `onDidDismiss`, `onSnapChange`…) | ✅ | ✅ | ✅ |
| Auto-dismiss | ✅ | ✅ | ✅ |
| `enableKeyboard` | stored (system default) | stored (system default) | browser |
| `enableNestedScroll` | stored (system default) | stored (system default) | ✅ content scrolls |
| `animation` | system motion | system motion | ✅ `durationMs` |

The status of native work is tracked in [Status & roadmap](/reference/roadmap).
