---
description: Frequently asked questions about react-native-universal-sheet - native vs JavaScript sheets, stacking, Expo, React Navigation, New Architecture, Reanimated and comparisons.
---

# FAQ

### Is this a JavaScript bottom sheet or a native one?

Native. On iOS the sheet is presented by UIKit (`UISheetPresentationController`), on Android by Material's `BottomSheetDialog`. React renders only your content. On the web it is a DOM dialog.

### Do I need Reanimated or Gesture Handler?

No. Gestures and animation come from the platform.

### Can I open a bottom sheet on top of another?

Yes. That's the default (`presentation: 'stack'`). Closing the top sheet shows the one beneath with its state intact. See [Stacking](/features/stacking).

### Does it work with Expo?

Yes, in a development build or EAS build, with the config plugin in `app.json`. Not in Expo Go. See [Expo](/installation/expo).

### Does it work with React Navigation and Expo Router?

Yes. Put the provider at the root. See [React Navigation](/recipes/react-navigation).

### Does it support the New Architecture?

The library ships a codegen spec and classic view managers. Android works through the interop layer. iOS has no Fabric component view yet, so it relies on the legacy interop layer, which has not been verified on a device. See [Compatibility](/reference/compatibility).

### Does it work on the web?

Yes, with `react-native-web` and `react-dom`. Every placement is drawn on the web, including the ones not yet native. See [Web](/installation/web).

### Can I use it without the provider?

No. Hooks and components throw a clear error without it.

### Can I open a sheet from outside a component?

Yes. Create a [`SheetManager`](/components/sheet-manager), pass it to the provider, and call it from anywhere.

### What is the difference between a bottom sheet and a modal?

A bottom sheet slides up from the bottom edge and can rest at several heights. A modal is a dialog centred (or placed) over the screen. Both are available: [`NativeSheet`](/components/native-sheet) and [`NativeModal`](/components/native-modal).

### Why does `present()` return an object instead of throwing?

So a double tap or a bad config never crashes the app. Check `result.ok` when you care. See [Error reasons](/reference/errors).

### Is it production-ready?

Not yet. Version 0.1.0 has a complete, tested TypeScript API and web renderer. The native code hasn't been verified on devices. See [Status & roadmap](/reference/roadmap).
