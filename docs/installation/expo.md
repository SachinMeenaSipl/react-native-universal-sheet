---
description: Use react-native-universal-sheet with Expo - install, add the config plugin to app.json, and run in a development build. Expo Go is not supported because the library has native code.
---

# Expo

The library contains native iOS and Android code, so it runs in an Expo **development build** or an EAS build, not in Expo Go.

## 1. Install

```sh
npx expo install react-native-universal-sheet
```

## 2. Add the config plugin

The plugin sets the iOS deployment target to 15.0 if it is lower. Add it to `app.json` (or `app.config.js`):

```json
{
  "expo": {
    "plugins": ["react-native-universal-sheet"]
  }
}
```

Android needs `minSdkVersion` 24, which current Expo SDKs already use. If you have lowered it, raise it with `expo-build-properties`:

```json
{
  "expo": {
    "plugins": [
      "react-native-universal-sheet",
      ["expo-build-properties", {"android": {"minSdkVersion": 24}}]
    ]
  }
}
```

## 3. Build and run

```sh
npx expo run:ios
npx expo run:android
```

These commands run `expo prebuild` for you and compile the native code. With EAS:

```sh
eas build --profile development --platform all
```

## 4. Add the provider

With Expo Router, put it in your root layout:

```tsx
// app/_layout.tsx
import {Stack} from 'expo-router';
import {NativeSheetProvider} from 'react-native-universal-sheet';

export default function RootLayout() {
  return (
    <NativeSheetProvider>
      <Stack />
    </NativeSheetProvider>
  );
}
```

Without Expo Router, wrap the component exported from `App.tsx`.

## Expo Go

Expo Go only contains the native modules that ship with Expo. Opening an app that uses this library in Expo Go fails, because the native `NativeSheetHost` view isn't there. Use a development build instead.

## Expo web

`npx expo start --web` works. Metro picks the web renderer automatically. See [Web](/installation/web).
