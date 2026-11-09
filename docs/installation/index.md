---
description: Install react-native-universal-sheet. Requirements for React, React Native, iOS, Android, Expo and web, and the checklist of what your project needs before using the library.
---

# Installation overview

Pick your setup, then check the requirements below.

| Your project | Guide |
| --- | --- |
| React Native CLI app (`npx @react-native-community/cli init`) | [React Native CLI](/installation/react-native) |
| Expo app (managed or with `ios/` and `android/` folders) | [Expo](/installation/expo) |
| Web, through `react-native-web` or Expo web | [Web](/installation/web) |

## Requirements

| Requirement | Minimum | Notes |
| --- | --- | --- |
| React | 18.2 | Uses `useSyncExternalStore` and `useId` |
| React Native | 0.73 | Peer dependency. Developed against 0.76 |
| iOS deployment target | **15.0** | `UISheetPresentationController`. Custom snap heights need iOS 16 |
| Android `minSdkVersion` | **24** (Android 7.0) | Declared by the library |
| Android `compileSdkVersion` | 34 | Used to build the library module |
| Java / Kotlin | Java 17 | The library module is written in Kotlin |
| Expo SDK | 51 | Development builds only, not Expo Go |
| `react-native-web` | 0.19 | Only for web |
| `react-dom` | 18.2 | Only for web |
| Node.js | 18 | For the React Native toolchain |

Full matrix, including what has been tested: [Version compatibility](/reference/compatibility).

## Project checklist

Before you use the library, make sure your project has these:

- [ ] **The package installed**: `npm install react-native-universal-sheet`.
- [ ] **iOS pods installed**: `cd ios && pod install` after every install or upgrade.
- [ ] **iOS deployment target of 15.0 or later** in your `Podfile` (`platform :ios, '15.0'`). Expo apps get this from the config plugin.
- [ ] **Android `minSdkVersion` of 24 or later** in `android/build.gradle`. React Native 0.73+ already uses 23 or 24; raise it if yours is lower.
- [ ] **A rebuilt native app.** The library contains native code, so a Metro reload is not enough after installing. Run `npx react-native run-ios` / `run-android` or `npx expo run:ios` / `run:android`.
- [ ] **`<NativeSheetProvider>` once at the root**, above your navigator.
- [ ] **For web only**: `react-dom` and `react-native-web` installed, and your bundler resolving `.web.tsx` files.

You do **not** need:

- `react-native-reanimated` or `react-native-gesture-handler`. Animation and gestures are native.
- A Material theme on Android. The default React Native `AppCompat` theme works.
- Any manual linking. Autolinking handles iOS and Android.

## Install

::: code-group

```sh [npm]
npm install react-native-universal-sheet
```

```sh [yarn]
yarn add react-native-universal-sheet
```

```sh [pnpm]
pnpm add react-native-universal-sheet
```

```sh [Expo]
npx expo install react-native-universal-sheet
```

:::

Then continue with the guide for your setup.
