---
description: Android back button and web Escape key handling for React Native sheets - how the topmost sheet closes and how to block it with hardwareBackDismiss.
---

# Back button & Escape

## Android

The provider listens for the hardware back button. A press closes the **topmost** open sheet whose `hardwareBackDismiss` is `true`. If no sheet takes it, the press goes on to your app (for example, React Navigation goes back).

Native bottom sheets are dialogs, so while one is showing, the dialog itself receives the back press and closes; `onDidDismiss` fires as for a swipe.

```tsx
// Back does nothing while this is open.
sheet.present({
  id: 'uploading',
  variant: 'loadingOverlay', // hardwareBackDismiss is already false for this variant
  content: <UploadProgress />,
});
```

::: warning Android: back follows `enableDrag` for now
The native Android dialog is cancelable only when `enableDrag` is `true`. So a sheet with `enableDrag: false` also ignores the back button, and a sheet with `enableDrag: true` closes on back even with `hardwareBackDismiss: false`. Wiring `hardwareBackDismiss` straight into the dialog is on the [roadmap](/reference/roadmap).
:::

## Web

Pressing **Escape** closes the topmost sheet if its `hardwareBackDismiss` is `true`. Clicking the backdrop closes sheets with `modal` behaviour.

## iOS

iOS has no back button. Users close sheets by swiping down (when `enableDrag` is `true`).
