---
title: "React Native Universal Sheet: native bottom sheets, modals and toasts"
titleTemplate: false
description: Native bottom sheets, modals, popovers, toasts and stacked sheets for React Native, Expo and the web. Snap points, keyboard handling, design props and one API on iOS, Android and web.
layout: home

hero:
  name: Universal Sheet
  text: Native sheets for React Native, Expo and web
  tagline: Bottom sheets, modals, alerts, toasts and popovers with stacking, snap points and full design control. One API on iOS, Android and the browser.
  image:
    src: /images/hero-phones.svg
    alt: Phones showing a bottom sheet, a center modal and a toast
  actions:
    - theme: brand
      text: Get started
      link: /guide/quick-start
    - theme: alt
      text: Installation
      link: /installation/
    - theme: alt
      text: View on GitHub
      link: https://github.com/SachinMeenaSipl/react-native-universal-sheet

features:
  - icon: 📱
    title: Truly native
    details: iOS uses UISheetPresentationController, Android uses Material BottomSheetDialog. React renders only your content.
  - icon: 🧱
    title: Stacked sheets
    details: Open a sheet on top of a sheet. Dismissing the top one returns to the one beneath with its state intact.
  - icon: 📏
    title: Snap points
    details: Percentages, points, named heights or content size. Move between them with snapTo, expand and collapse.
  - icon: 🎨
    title: Full design control
    details: Background, corner radius, border, shadow, backdrop, drag handle and any React Native style on your content.
  - icon: 🧩
    title: 23 presentation types
    details: Bottom sheet, center modal, alert, side drawer, toast, snackbar, popover, tooltip, loading overlay and more, all from one config.
  - icon: 🌐
    title: Expo and web
    details: Works in Expo development builds. On the web every placement renders as an accessible DOM dialog.
---

## Install

::: code-group

```sh [npm]
npm install react-native-universal-sheet
cd ios && pod install
```

```sh [yarn]
yarn add react-native-universal-sheet
cd ios && pod install
```

```sh [Expo]
npx expo install react-native-universal-sheet
npx expo prebuild
npx expo run:ios   # or: npx expo run:android
```

:::

See [Installation](/installation/) for requirements, Expo and web setup.

## Thirty-second example

```tsx
import {Button} from 'react-native';
import {NativeSheetProvider, useNativeSheet} from 'react-native-universal-sheet';

export default function App() {
  return (
    <NativeSheetProvider>
      <Home />
    </NativeSheetProvider>
  );
}

function Home() {
  const sheet = useNativeSheet();
  return (
    <Button
      title="Open filters"
      onPress={() =>
        sheet.present({
          id: 'filters',
          content: <Filters />,
          snapPoints: ['50%', '90%'],
        })
      }
    />
  );
}
```

## What it looks like

<div class="preview-row">
  <SheetPreview variant="bottomSheet" :snap="0.5" caption="Bottom sheet" />
  <SheetPreview variant="center" caption="Center modal" />
  <SheetPreview variant="alert" caption="Alert" />
  <SheetPreview variant="side" caption="Side drawer" />
  <SheetPreview variant="toast" caption="Toast" />
  <SheetPreview variant="popover" caption="Popover" />
</div>

These are placement diagrams. See [Sheet types](/features/variants) for all 23 and [Platform support](/reference/platform-support) for what each platform draws today.

::: warning Early release (0.1.0)
The TypeScript API and the web renderer are complete and unit-tested. The native iOS and Android code has **not yet been verified on a device**, and on native every variant is currently presented as a bottom sheet. Read [Status & roadmap](/reference/roadmap) before using this in production.
:::
