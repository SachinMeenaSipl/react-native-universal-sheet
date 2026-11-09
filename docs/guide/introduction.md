---
description: What react-native-universal-sheet is, which problems it solves, and how to choose between a bottom sheet, modal, popover or toast in React Native.
---

# Introduction

`react-native-universal-sheet` gives React Native apps one API for every surface that appears over a screen: bottom sheets, modals, alerts, side drawers, toasts, snackbars, popovers, tooltips and more. On iOS and Android the surface is presented by the platform's own sheet controller. On the web it is an accessible DOM dialog.

## Why another sheet library?

| Need | How this library handles it |
| --- | --- |
| A sheet that feels native | iOS `UISheetPresentationController` and Android `BottomSheetDialog`, not a JavaScript imitation |
| Sheets on top of sheets | A managed stack: `presentation: 'stack'` or `'replace'`, with a configurable depth limit |
| Open a sheet from anywhere | `useNativeSheet().present(...)`, without placing a component in every screen |
| Keep the parent screen alive | Sheet content is rendered by the provider, so the screen that opened it is never unmounted |
| Errors that don't crash | Every method returns `{ok: true}` or `{ok: false, reason}` instead of throwing |
| One codebase for app and web | The same config renders on iOS, Android and `react-native-web` |

## Which surface do I need?

| You want | Use | Variant |
| --- | --- | --- |
| A panel from the bottom that can be dragged between heights | [`NativeSheet`](/components/native-sheet) or `present()` | `bottomSheet` |
| A list of actions (share, delete, report) | `present()` | `action`, `share` |
| A centred dialog | [`NativeModal`](/components/native-modal) | `center` |
| A confirmation with buttons | [`presentAlert`](/components/present-alert) | `alert` |
| A short "Saved" message | [`presentToast`](/components/present-toast) | `toast`, `snackbar` |
| A menu next to a button | `present()` with `anchor` | `popover`, `dropdown`, `contextMenu` |
| A navigation drawer | [`NativeModal`](/components/native-modal) | `side` |
| A blocking spinner | `present()` | `loadingOverlay` |

All 23 are described in [Sheet types](/features/variants).

## Two ways to use it

**Declarative**: render a component and control it with `visible`.

```tsx
<NativeSheet visible={open} snapPoints={['50%', '90%']} onDismiss={() => setOpen(false)}>
  <ProfileForm />
</NativeSheet>
```

**Imperative**: call the manager from any event handler.

```tsx
const sheet = useNativeSheet();
sheet.present({id: 'profile', content: <ProfileForm />, snapPoints: ['50%', '90%']});
```

Both use the same manager and the same options. Mix them freely.

## Next steps

- [Quick start](/guide/quick-start): a working sheet in five minutes.
- [Installation](/installation/): requirements for React Native, Expo and web.
- [Core concepts](/guide/core-concepts): ids, the stack, snap points and results.
