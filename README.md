# react-native-universal-sheet

**Universal sheets for React Native**: native bottom sheets, modals, popovers and notification sheets for iOS and Android, with stacking, snap points, and full customization.

Search terms this library answers: *react native bottom sheet*, *react native modal*, *react native popover*, *react native stacked sheets*, *react native notification sheet*, *react native native modal sheet*, *react native sheet with keyboard*, *react native bottom sheet scrollview*.

> **Status:** early release (0.1.0). The **bottom sheet** is implemented. Modal, popover and notification sheets are on the roadmap below. Native code is not yet built or tested on a device. See [Status](#status).

---

## Contents

- [Which sheet do I need?](#which-sheet-do-i-need)
- [Use cases](#use-cases)
- [Installation](#installation)
- [Quick start](#quick-start)
- [Examples](#examples)
- [Customization](#customization)
- [API reference](#api-reference)
- [Platform behaviour](#platform-behaviour)
- [Status](#status)
- [FAQ](#faq)

---

## Which sheet do I need?

| You want | Sheet type | Status |
| --- | --- | --- |
| A panel that slides up from the bottom, with drag-to-resize and snap points | **Bottom sheet** | Implemented |
| A centered dialog over the screen | **Modal** | TypeScript done; native pending |
| A small panel anchored to a button or other view | **Popover** | TypeScript done; native pending |
| A short banner or toast at the top or bottom that auto-dismisses | **Notification / toast** | TypeScript done; native pending |

Each type shares one API: present, dismiss, stack, and customize.

## Use cases

**Bottom sheet**
- Show a filter, sort or options panel that the user can drag to half or full height.
- Open an edit form over a profile screen and return to it when the form closes.
- Keep a map visible while a bottom sheet expands and collapses.
- Show a checkout step, payment method, or confirmation as a sequence of sheets.

**Stacked and nested sheets**
- A second sheet opens above the first, and dismissing it returns to the first without losing its state.
- Dismiss only the topmost sheet, with a configurable maximum depth.

**Forms and keyboard**
- Put text inputs in a sheet and keep them visible when the keyboard opens.

**Scrolling content**
- Put a `ScrollView` or `FlatList` inside a sheet. Scroll coordination with the sheet drag is under test.

**Also in the API (native presentation pending)**
- Centered confirmation or login dialogs (modal sheet).
- Action menus and tooltips anchored to a button (popover sheet).
- "Saved", "Undo" or "Connection lost" banners (notification sheet).

## Installation

```sh
npm install react-native-universal-sheet
# or
yarn add react-native-universal-sheet
```

Peer dependencies: `react >= 18.2`, `react-native >= 0.73`.

**iOS:** requires iOS 15 or later.

```sh
cd ios && pod install
```

**Android:** requires minSdk 24 and the Material Components dependency, which the library declares.

**Expo:** use a development build (`npx expo run:ios` / `npx expo run:android`). Expo Go does not include third-party native code.

## Quick start

Wrap your app once, near the navigator:

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

Open a bottom sheet from anywhere:

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
          initialSnapPoint: '50%',
        })
      }
    />
  );
}
```

Or control it declaratively:

```tsx
import {NativeSheet} from 'react-native-universal-sheet';

<NativeSheet visible={visible} snapPoints={['50%', '90%']} onDismiss={() => setVisible(false)}>
  <ProfileForm />
</NativeSheet>
```

## Examples

### Stacked sheets: child over parent

```tsx
sheet.present({id: 'profile', content: <Profile />, snapPoints: ['60%', '95%']});

// Later, from inside Profile:
sheet.present({id: 'edit', content: <EditForm />, presentation: 'stack'});
// Saving the form:
sheet.dismiss('edit'); // Profile is still open, with its state intact.
```

### Replace the current sheet

```tsx
sheet.present({id: 'confirm', content: <Confirm />, presentation: 'replace'});
// Closes the current topmost sheet, then presents this one.
```

### Named sheets

```tsx
import {SheetRegistry, SheetManager} from 'react-native-universal-sheet';

const registry = new SheetRegistry().register<{userId: string}>('user-details', {
  render: ({userId}) => <UserDetails userId={userId} />,
  snapPoints: ['70%'],
});

// Pass the registry to the provider with a manager, then:
sheet.presentNamed('user-details', {id: 'user-42', props: {userId: '42'}});
```

### Snap points

```tsx
sheet.snapTo('edit-profile', '90%'); // full height
sheet.expand('edit-profile');        // largest configured snap point
sheet.collapse('edit-profile');      // smallest configured snap point
```

### Listen for dismissal and snap changes

```tsx
sheet.present({
  id: 'filters',
  content: <Filters />,
  onDidDismiss: id => console.log('closed', id),
  onSnapChange: (id, index) => console.log('snap', index),
});
```

## Customization

Every visual and behavioural part of a surface is set with props. Nothing is hard-coded: pass what you need and the rest falls back to the platform default.

```tsx
sheet.present({
  id: "styled",
  content: <Content />,
  variant: "bottomSheet",
  sizing: "half",                 // or snapPoints: ["40%", "90%"]
  enableDrag: true,
  enableBackdrop: true,
  enableKeyboard: true,
  enableNestedScroll: true,
  hardwareBackDismiss: true,
  appearance: {
    backgroundColor: "#FFF8F0",
    cornerRadius: 28,
    borderWidth: 1,
    borderColor: "#E0B98F",
    shadowRadius: 16,
    shadowOpacity: 0.25,
    backdropColor: "#000000",
    backdropOpacity: 0.5,
    showHandle: true,
    handleColor: "#C2703D",
  },
  styles: {
    contentStyle: { padding: 20, gap: 12 },   // any React Native style
  },
});
```

### `appearance` (surface design)

| Prop | Type | Notes |
| --- | --- | --- |
| `backgroundColor` | hex | Surface fill |
| `cornerRadius` | number ≥ 0 | iOS 16+ applies; Android applies via the fill |
| `borderWidth` / `borderColor` | number ≥ 0 / hex | Border around the surface |
| `shadowRadius` / `shadowOpacity` | number ≥ 0 / 0–1 | Shadow |
| `width` | number > 0 | Fixed width for modals and floating surfaces |
| `backdropColor` | hex | Backdrop tint |
| `backdropOpacity` | 0–1 | Android applies; iOS uses the system backdrop |
| `showHandle` / `handleColor` | boolean / hex | Drag handle; iOS applies, Android pending |

Colours must be six or eight-digit hex (e.g. `#FFFFFF` or `#FFFFFF80`). Invalid values return `invalid-config` rather than failing silently.

### `styles` (content design)

| Prop | Applies to |
| --- | --- |
| `contentStyle` | Wrapper around your content |
| `titleStyle`, `messageStyle` | Title and message in `presentAlert` |
| `buttonStyle`, `buttonTextStyle` | Action buttons in `presentAlert` |

### Behaviour props

| Prop | Default |
| --- | --- |
| `enableDrag` | per variant (true for sheets) |
| `enableBackdrop` | true for modal behaviour, false for non-modal |
| `enableKeyboard` | true except alert and picker |
| `enableNestedScroll` | true except action, share, alert |
| `hardwareBackDismiss` | true (false for loading overlays) |
| `autoDismissMs` | toast 3s, snackbar 4s, in-app notification 5s |
| `margin` | 16 for floating surfaces, 0 otherwise |
| `behavior` | `modal`, `nonModal` or `persistent` |
| `animation` | `{type: "spring" | "timing", damping, stiffness, mass, durationMs}` |
| `accessibilityLabel` | Screen reader label for the surface |

## API reference

### Provider

`<NativeSheetProvider manager? maxStackDepth?>` — place above your navigator. Default `maxStackDepth` is 5.

### Hooks

`useNativeSheet()` returns the manager:

| Method | Purpose |
| --- | --- |
| `present(config)` | Present a sheet. Returns `{ok: true}` or `{ok: false, reason}`. |
| `presentNamed(name, {id, props})` | Present a registered sheet. |
| `dismiss(id?)` | Dismiss a sheet, or the topmost one when no id is given. |
| `dismissAll()` | Dismiss every sheet, topmost first. |
| `update(id, patch)` | Change content or options of a presented sheet. |
| `replace(id, config)` | Swap content and config in place, without animation. |
| `snapTo(id, point)` | Move to a configured snap point. |
| `expand(id)` / `collapse(id)` | Move to the largest / smallest snap point. |

`useSheetState(id)` re-renders when that sheet changes and returns `undefined` when it is closed.

### Components

`<NativeSheet visible id? presentation? snapPoints? initialSnapPoint? enableDrag? appearance? onDismiss? onSnapChange?>` — a declarative, controlled sheet.

### Errors

Methods never throw for user errors. They return a reason: `duplicate-id`, `not-found`, `invalid-config`, `invalid-snap-point`, `stack-limit-reached`, `replace-in-progress`, `unknown-sheet`.

### Events

`onWillPresent`, `onDidPresent`, `onWillDismiss`, `onDidDismiss`, `onSnapChange`. `onDidDismiss` fires for any dismissal: a swipe, a `dismiss()` call, or unmounting the component.

## Platform behaviour

**iOS** uses `UISheetPresentationController`. Snap points map to custom detents on iOS 16+; iOS 15 falls back to medium and large. The system backdrop is used.

**Android** uses `BottomSheetDialog`. Each sheet is its own dialog window, so stacked sheets nest and the parent Activity is untouched. Snap points map to collapsed, half-expanded and expanded states.

Sheet content lives in the React tree under the provider, so opening a child sheet never unmounts the screen that opened it.

## Status

| Area | State |
| --- | --- |
| TypeScript API for all 23 presentation types (modals, bottom sheets, overlays) | Implemented; 74 unit tests pass; typecheck clean |
| Design props (`appearance`, `styles`) and behaviour props | Implemented and validated in TypeScript |
| Overlay helpers (`presentAlert`, `presentToast`), auto-dismiss, persistent sheets, Android back button | Implemented in TypeScript |
| Native prop contract (codegen spec, Android and iOS setters) | Written; **not compiled** |
| Native presentation for bottom sheet (iOS and Android) | Written; **not run on a device** |
| Native presentation for modal, popover, notification and other placements | Pending: props are stored, not yet drawn |
| Example app | Updated; Android build not yet verified |

Nothing native has been verified on a device yet. Treat native behaviour as a draft until the example app runs on an emulator or device.

## Roadmap

1. Build and test the bottom sheet on iOS and Android, including inner `ScrollView` handoff and keyboard handling.
2. Modal sheet (centered dialog).
3. Popover sheet (anchored to a view).
4. Notification sheet (auto-dismissing banner).
5. Animation config (spring, duration, reduced motion) and pinch-to-resize.
6. Expo config plugin.

## FAQ

**Is this a JavaScript bottom sheet or a native one?**
Native. The sheet is presented by UIKit on iOS and by `BottomSheetDialog` on Android. React renders only the content.

**Can I stack one bottom sheet on top of another?**
Yes. Use `presentation: 'stack'` (the default). Dismissing the top sheet returns to the one underneath with its state intact.

**Does it work with React Navigation?**
Put `NativeSheetProvider` above the navigator. Sheets stay open when the screen that opened them unmounts.

**Does it work with Expo?**
Yes, in a development build. Expo Go does not include third-party native modules.

**Does it support Fabric (New Architecture) and Legacy architecture?**
The codegen spec covers both. Fabric on iOS needs a component view wrapper that is not included yet.

**What is the difference between this and a modal?**
A bottom sheet slides up from the edge and can rest at several heights. A modal is a centered dialog. Modal support is on the roadmap.

**Can I use it without the provider?**
No. The hooks and components need `NativeSheetProvider` above them and throw a clear error otherwise.

## Contributing

```sh
npm install
npm test          # unit tests
npm run typecheck
```

## License

MIT
