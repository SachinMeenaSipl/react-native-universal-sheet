---
description: Install react-native-universal-sheet in a React Native CLI app - npm install, pod install, iOS 15 deployment target, Android minSdk 24 and rebuilding the native app.
---

# React Native CLI

For apps created with `npx @react-native-community/cli init` (or the older `npx react-native init`).

## 1. Install the package

```sh
npm install react-native-universal-sheet
```

## 2. iOS

Make sure the deployment target is 15.0 or later. In `ios/Podfile`:

```ruby
platform :ios, '15.0'
```

If your Podfile uses `min_ios_version_supported`, check that it resolves to 15.0 or later (React Native 0.76 already uses 15.1).

Install the pods:

```sh
cd ios && pod install && cd ..
```

## 3. Android

Check `minSdkVersion` in `android/build.gradle`:

```groovy
buildscript {
    ext {
        minSdkVersion = 24
        compileSdkVersion = 34   // or higher
        targetSdkVersion = 34    // or higher
    }
}
```

Nothing else is needed. Autolinking registers the native package, and the library brings its own `com.google.android.material:material` dependency.

## 4. Rebuild the app

```sh
npx react-native run-ios
npx react-native run-android
```

A JavaScript reload is not enough the first time, because the app binary must include the new native code.

## 5. Add the provider

```tsx
import {NativeSheetProvider} from 'react-native-universal-sheet';

export default function App() {
  return (
    <NativeSheetProvider>
      <RootNavigator />
    </NativeSheetProvider>
  );
}
```

Next: [Verify the install](/installation/verify).

## New Architecture

The library ships a codegen spec (`NativeSheetSpec`) and classic view managers for both platforms.

- **Android**: the view manager runs under both the old and the New Architecture (through the interop layer).
- **iOS**: there is no Fabric component view yet. On the New Architecture the view runs through React Native's legacy interop layer. This has not been verified on a device. If you hit problems on iOS with the New Architecture, please [open an issue](https://github.com/SachinMeenaSipl/react-native-universal-sheet/issues).
