---
description: react-native-universal-sheet version compatibility - supported React, React Native, iOS, Android, Expo SDK, react-native-web and Node versions, and what has been tested.
---

# Version compatibility

Every value comes from the package configuration. **Implemented** means the code exists; **tested** means it was run on that setup and checked.

## Library versions

| Library version | React Native | React | iOS | Android | Expo SDK | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 0.1.x | ≥ 0.73 | ≥ 18.2 | ≥ 15.0 | ≥ 7.0 (API 24) | ≥ 51 (dev build) | Early release |

## Requirements

| | Minimum | Where it's defined |
| --- | --- | --- |
| React | 18.2 | `peerDependencies` |
| React Native | 0.73 | `peerDependencies` |
| iOS | 15.0 | `react-native-universal-sheet.podspec` |
| Custom snap heights on iOS | iOS 16 | `UISheetPresentationController.Detent.custom` |
| Corner radius on iOS | iOS 16 | `preferredCornerRadius` |
| Android | API 24 (Android 7.0) | `android/build.gradle` `minSdk` |
| Android compile SDK | 34 | `android/build.gradle` |
| Material Components | 1.12.0 (bundled) | `android/build.gradle` dependency |
| Java | 17 | `android/build.gradle` |
| Swift | 5.0 | podspec |
| Expo | SDK 51 | optional `peerDependencies` |
| react-native-web | 0.19 | optional `peerDependencies` |
| react-dom | 18.2 | optional `peerDependencies` |
| TypeScript (for the types) | 5.0 | `export type *` in the entry file |

## Developed and tested against

| Tool | Version |
| --- | --- |
| React Native | 0.76.9 |
| React | 18.3.1 |
| react-native-web | 0.19.13 |
| TypeScript | 5.6.3 |
| Jest | 29.7 |
| Node.js | 18+ (22 in CI) |

## Platforms and frameworks

| Setup | Implemented | Tested | Notes |
| --- | --- | --- | --- |
| TypeScript API (manager, stack, validation, variants) | ✅ | ✅ 83 unit tests | Runs in CI |
| iOS 16+ bottom sheet | ✅ | ❔ not yet on a device | Custom detents |
| iOS 15 bottom sheet | ✅ | ❔ | Medium and large detents only |
| Android bottom sheet | ✅ | ❔ not yet on a device | `BottomSheetDialog` |
| Native modal / overlay placements | ⛔ pending | — | Presented as a bottom sheet for now |
| React Native old architecture | ✅ | ❔ | View managers |
| New Architecture, Android | ✅ via interop | ❔ | |
| New Architecture, iOS | ◐ via legacy interop | ❔ | No Fabric component view yet |
| Expo development build / EAS | ✅ autolinking + config plugin | ❔ | |
| Expo Go | ⛔ | — | Native code not included in Expo Go |
| Expo web | ✅ | ❔ | Metro resolves `.web.tsx` |
| Vite / webpack with react-native-web | ✅ | ❔ | Needs TypeScript in `node_modules` compiled; see [Web](/installation/web) |
| Server rendering (Next.js etc.) | ✅ renders nothing on the server | ❔ | Sheets appear after hydration |

✅ yes · ◐ partly · ❔ not tested yet · ⛔ no

Help fill this table: if you run the library on a setup marked ❔, please [report the result](https://github.com/SachinMeenaSipl/react-native-universal-sheet/issues).

## Upgrading

The library follows [semantic versioning](https://semver.org). While the version is `0.x`, a minor release (`0.1` → `0.2`) may contain breaking changes; they are listed in the [Changelog](/reference/changelog).

After every upgrade:

```sh
cd ios && pod install
```

and rebuild the native app.
