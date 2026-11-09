---
description: Architecture of react-native-universal-sheet - a plain JavaScript sheet store, a shared surface model, and native presenters on iOS and Android with a DOM renderer on web.
---

# How it works

The library has three layers. Knowing them helps when something behaves unexpectedly.

```text
 your code ── present / dismiss / snapTo ──►  SheetManager  (plain JS store, no React)
                                                   │ subscribe
                                                   ▼
                                         NativeSheetProvider  (renders one surface per open sheet)
                                                   │
                                                   ▼
                                  describeSurface()  →  SurfaceModel  (platform-neutral props)
                                     │                                   │
                       iOS / Android ▼                                   ▼ web
                 NativeSheetHost (native view)                 DOM dialog in document.body
      UISheetPresentationController / BottomSheetDialog
```

## 1. The manager

`SheetManager` is an ordinary class. It validates each config, fills in defaults from the variant, keeps the ordered stack, runs auto-dismiss timers and calls your event callbacks. It has no React or native code, which is why it is fully unit-tested.

## 2. The provider

`NativeSheetProvider` subscribes to the manager with `useSyncExternalStore` and renders one surface per open sheet, after your `children`. Because sheet content lives here, not in the screen that opened it, closing or navigating away from that screen leaves the sheet and its state alone.

The provider also listens for the Android hardware back button and dismisses the topmost sheet that allows it.

## 3. The surface

Each sheet's config is turned into a `SurfaceModel`: snap points become fractions of screen height, defaults are filled in, colours are passed through. Both renderers read this same model, so a prop means the same thing on every platform.

**iOS.** A native view is re-parented into a view controller presented with `UISheetPresentationController`. Snap points become custom detents (iOS 16+) or medium/large (iOS 15).

**Android.** The native view is placed inside a Material `BottomSheetDialog`. Each sheet is its own dialog window, so stacked sheets nest and the Activity is untouched. Snap points map to half-expanded and expanded states.

**Web.** `SheetSurface.web.tsx` renders a fixed-position `role="dialog"` element in `document.body` through a React portal, with a backdrop, slide or scale transitions and Escape to close. Bundlers pick this file automatically through the `.web.tsx` extension.

## Events flow back

When the user swipes a sheet away or drags it to another height, the platform sends `onDismiss` or `onSnapChange` to the surface, which calls `manager.handleNativeDismiss` / `handleNativeSnapChange`. The manager updates the stack and calls your `onDidDismiss` / `onSnapChange`.
