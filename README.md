<p align="center">
  <img src="https://raw.githubusercontent.com/SachinMeenaSipl/react-native-universal-sheet/main/docs/public/images/banner.svg" alt="react-native-universal-sheet: native bottom sheets, modals, popovers and toasts for React Native, Expo and web" width="100%" />
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/react-native-universal-sheet"><img src="https://img.shields.io/npm/v/react-native-universal-sheet.svg" alt="npm version" /></a>
  <a href="https://github.com/SachinMeenaSipl/react-native-universal-sheet/actions/workflows/ci.yml"><img src="https://github.com/SachinMeenaSipl/react-native-universal-sheet/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/npm/l/react-native-universal-sheet.svg" alt="MIT license" /></a>
  <img src="https://img.shields.io/badge/platforms-iOS%20%7C%20Android%20%7C%20Web-4f46e5.svg" alt="Platforms: iOS, Android, Web" />
  <img src="https://img.shields.io/badge/Expo-dev%20build-000020.svg" alt="Expo development builds" />
</p>

# react-native-universal-sheet

**Native bottom sheets, modals, alerts, toasts and popovers for React Native, Expo and the web.** Stack sheets on top of each other, snap between heights, and style every part, with one API on iOS, Android and the browser.

**📖 Documentation: https://sachinmeenasipl.github.io/react-native-universal-sheet/**

> **Status: early release (0.1.0).** The TypeScript API and the web renderer are complete and covered by 83 unit tests. The native iOS and Android bottom sheet is written but **not yet verified on a device**, and on native every variant is currently presented as a bottom sheet. See [Status & roadmap](https://sachinmeenasipl.github.io/react-native-universal-sheet/reference/roadmap).

## Features

- **Native presentation**: iOS `UISheetPresentationController`, Android Material `BottomSheetDialog`. React renders only your content.
- **Stacked sheets**: open a sheet over a sheet; closing it returns to the one beneath with its state intact. `stack` or `replace`, with a depth limit.
- **Snap points**: `'50%'`, `320`, `'small' | 'medium' | 'large' | 'full'` or `'content'`, with `snapTo`, `expand` and `collapse`.
- **23 presentation types**: bottom sheet, action and share sheets, center modal, alert, side drawer, top sheet, toast, snackbar, popover, tooltip, loading overlay and more.
- **Full design control**: background, corner radius, border, shadow, backdrop, drag handle, plus any React Native style on your content.
- **Declarative or imperative**: `<NativeSheet visible>` or `useNativeSheet().present(...)` from any handler.
- **No crashes on bad input**: every method returns `{ok: true}` or `{ok: false, reason}`.
- **Expo and web**: config plugin for Expo development builds; every placement renders on `react-native-web`.
- **No Reanimated or Gesture Handler required.**

## Installation

```sh
npm install react-native-universal-sheet
cd ios && pod install
```

**Expo** (development build, not Expo Go):

```sh
npx expo install react-native-universal-sheet
```

```json
{ "expo": { "plugins": ["react-native-universal-sheet"] } }
```

**Web**: also install `react-dom` and `react-native-web`.

### Requirements

| | Minimum |
| --- | --- |
| React | 18.2 |
| React Native | 0.73 |
| iOS | 15.0 (custom snap heights need iOS 16) |
| Android | API 24 (Android 7.0) |
| Expo SDK | 51, development build |
| react-native-web | 0.19 |

Full guides: [React Native CLI](https://sachinmeenasipl.github.io/react-native-universal-sheet/installation/react-native) · [Expo](https://sachinmeenasipl.github.io/react-native-universal-sheet/installation/expo) · [Web](https://sachinmeenasipl.github.io/react-native-universal-sheet/installation/web) · [Version compatibility](https://sachinmeenasipl.github.io/react-native-universal-sheet/reference/compatibility)

## Quick start

Wrap your app once:

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

Open a sheet from anywhere:

```tsx
import {useNativeSheet} from 'react-native-universal-sheet';

function ProfileScreen() {
  const sheet = useNativeSheet();

  return (
    <Button
      title="Edit profile"
      onPress={() =>
        sheet.present({
          id: 'edit-profile',
          content: <EditProfileForm />,
          snapPoints: ['50%', '90%'],
        })
      }
    />
  );
}
```

Or control it with state:

```tsx
import {NativeSheet} from 'react-native-universal-sheet';

<NativeSheet visible={open} snapPoints={['50%', '90%']} onDismiss={() => setOpen(false)}>
  <ProfileForm />
</NativeSheet>
```

Alerts and toasts:

```tsx
import {presentAlert, presentToast} from 'react-native-universal-sheet';

presentAlert(sheet, {
  id: 'delete',
  title: 'Delete item?',
  actions: [{label: 'Cancel', style: 'cancel'}, {label: 'Delete', style: 'destructive', onPress: remove}],
});

presentToast(sheet, {id: 'saved', message: 'Saved'});
```

## Documentation

| | |
| --- | --- |
| [Quick start](https://sachinmeenasipl.github.io/react-native-universal-sheet/guide/quick-start) | First sheet in five minutes |
| [Components & APIs](https://sachinmeenasipl.github.io/react-native-universal-sheet/components/native-sheet-provider) | Every component, hook and helper with examples |
| [Sheet types](https://sachinmeenasipl.github.io/react-native-universal-sheet/features/variants) | All 23 variants and their defaults |
| [Appearance & styles](https://sachinmeenasipl.github.io/react-native-universal-sheet/features/appearance) | Design props and per-platform support |
| [Recipes](https://sachinmeenasipl.github.io/react-native-universal-sheet/recipes/) | Filters, forms, confirm dialogs, checkout, React Navigation |
| [API reference](https://sachinmeenasipl.github.io/react-native-universal-sheet/reference/api) | Every type and default |
| [Platform support](https://sachinmeenasipl.github.io/react-native-universal-sheet/reference/platform-support) | What iOS, Android and web draw today |
| [Troubleshooting](https://sachinmeenasipl.github.io/react-native-universal-sheet/reference/troubleshooting) | Common errors and fixes |

## Contributing

```sh
npm install
npm test            # unit tests
npm run typecheck
npm run docs:dev    # docs site at http://localhost:5173 (run `npm install --prefix website` first)
```

The docs live in [`docs/`](./docs) and are published to GitHub Pages by [`.github/workflows/docs.yml`](./.github/workflows/docs.yml) on every push to `main`.

## License

MIT © Sachin Meena
