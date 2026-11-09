---
description: Fix common react-native-universal-sheet problems - native view not found, sheet not appearing, Expo Go crash, pod install issues, styles not changing and web bundler errors.
---

# Troubleshooting

## "Invariant Violation: requireNativeComponent: 'NativeSheetHost' was not found"

The native code isn't in your app binary.

1. iOS: `cd ios && pod install`.
2. Rebuild: `npx react-native run-ios` / `run-android`, or `npx expo run:ios` / `run:android`.
3. Expo: you're probably in Expo Go. Use a [development build](/installation/expo).

## "useNativeSheet() must be used inside &lt;NativeSheetProvider&gt;"

Add the provider at the root, above the component that calls the hook. Check that it isn't inside a screen that renders later than the caller.

## `present()` returns `{ok: false}`

Log the reason and look it up in [Error reasons](/reference/errors). The most common are `duplicate-id` (the sheet is already open) and `invalid-config` (a colour that isn't 6- or 8-digit hex).

## The sheet opens but content is empty or zero-height

- Native: the content wrapper fills the sheet with `flex: 1`. If your root view has a fixed `height: 0` or `position: 'absolute'` without size, it won't show.
- With `snapPoints: ['content']`, give your content a measurable height (no `flex: 1` on the root view).

## A context (theme, store, i18n) is missing inside the sheet

Sheet content is rendered by `NativeSheetProvider`, not by the screen that opened it. Move your context providers **above** `NativeSheetProvider`.

## `styles` or `variant` don't change while a `NativeSheet` is open

`variant`, `presentation`, `behavior`, `side`, `sizing` and `styles` are read when the sheet opens. Close and reopen it, or change `content`/`appearance`, which update in place.

## Sheet closes when I navigate on Android

The back press went to the sheet first. That's expected: the topmost sheet takes the back press. Set `enableDrag: false` to keep it open (see [Back button](/features/back-button)).

## iOS: snap points don't match the heights I asked for

On iOS 15 only the system medium and large detents exist. Custom heights need iOS 16.

## iOS: `pod install` fails with a deployment target error

Set `platform :ios, '15.0'` (or higher) in your `Podfile`. Expo users: add the config plugin to `app.json`.

## Android: build fails with "minSdkVersion 21 cannot be smaller than version 24"

Raise `minSdkVersion` to 24 in `android/build.gradle` (or `expo-build-properties`).

## Web: "Unexpected token" or "Cannot find module './SheetSurface'"

Your bundler isn't compiling TypeScript from `node_modules` or isn't resolving `.web.tsx`. See the [Web setup](/installation/web).

## Still stuck?

[Open an issue](https://github.com/SachinMeenaSipl/react-native-universal-sheet/issues) with your platform, React Native version, library version and a minimal example.
