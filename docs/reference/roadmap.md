---
description: Current status of react-native-universal-sheet and the roadmap - device testing, native modal, popover and toast presenters, keyboard handling, animation and a compiled build.
---

# Status & roadmap

## Current status (0.1.0)

| Area | State |
| --- | --- |
| TypeScript API for all 23 presentation types | ✅ Implemented; 83 unit tests; typecheck clean |
| Design props (`appearance`, `styles`) and behaviour props | ✅ Implemented and validated |
| Alert and toast helpers, auto-dismiss, persistent sheets, Android back button | ✅ Implemented |
| Web renderer for every placement | ✅ Implemented |
| Expo config plugin | ✅ Implemented |
| Native prop contract (codegen spec, iOS and Android setters) | ✅ Written; not yet compiled in CI |
| Native bottom sheet (iOS and Android) | ◐ Written; **not yet run on a device** |
| Native modal, popover, toast and other placements | ⛔ Pending: props are stored, presented as a bottom sheet |
| Example app | ◐ Written; build not yet verified |

::: warning
Treat native behaviour as a preview until the example app has been run on iOS and Android devices. Pin the exact version (`"react-native-universal-sheet": "0.1.0"`) if you try it.
:::

## Roadmap

1. **Device testing** of the bottom sheet on iOS and Android, including inner `ScrollView` handoff and keyboard handling. Compile native code in CI.
2. **Compiled build**: ship JavaScript and type declarations, so web bundlers don't need to compile TypeScript from `node_modules`.
3. **Native modal presenter**: `center`, `alert`, `fullScreen`, `popup`, `floating`.
4. **Side and top sheets** natively.
5. **Overlays** natively: toast, snackbar, in-app notification.
6. **Anchored overlays** natively: popover, tooltip, context menu, dropdown, coachmark, spotlight.
7. **Keyboard handling** driven by `enableKeyboard`; `hardwareBackDismiss` wired straight into the Android dialog.
8. **Animation**: custom springs and durations on native; reduced-motion on the web.
9. **Fabric component view** on iOS for the New Architecture.
10. **Drag gestures** on the web.

Want to help? See the repository's [issues](https://github.com/SachinMeenaSipl/react-native-universal-sheet/issues).
