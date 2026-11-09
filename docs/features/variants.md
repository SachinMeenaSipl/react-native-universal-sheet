---
description: All 23 sheet types in react-native-universal-sheet - bottom sheets, action and share sheets, modals, alerts, drawers, toasts, snackbars, popovers, tooltips, overlays - with their defaults.
---

# Sheet types (variants)

Set `variant` on `present()` or `NativeSheet` to choose the surface. Each variant has its own defaults, and you can override any of them.

```tsx
sheet.present({id: 'menu', variant: 'action', content: <ActionList />});
```

::: info Native status
These placements are all drawn on the **web**. On **iOS and Android** every variant is currently presented as a bottom sheet; the variant's behaviour defaults (drag, backdrop, auto-dismiss, back button) still apply. See [Platform support](/reference/platform-support).
:::

## Bottom sheets

<div class="preview-row">
  <SheetPreview variant="bottomSheet" :snap="0.6" caption="bottomSheet" />
  <SheetPreview variant="action" :snap="0.35" caption="action" />
  <SheetPreview variant="share" :snap="0.3" caption="share" />
  <SheetPreview variant="picker" :snap="0.4" caption="picker" />
  <SheetPreview variant="filter" :snap="0.7" caption="filter" />
</div>

| Variant | Drag | Backdrop | Keyboard | Nested scroll | Use for |
| --- | --- | --- | --- | --- | --- |
| `bottomSheet` (default) | ✅ | ✅ | ✅ | ✅ | Any panel from the bottom |
| `action` | ✅ | ✅ | ✅ | — | Lists of actions |
| `share` | ✅ | ✅ | ✅ | — | Share targets |
| `picker` | ✅ | ✅ | — | ✅ | Date, option or wheel pickers |
| `filter` | ✅ | ✅ | ✅ | ✅ | Filter and sort panels |

All are modal, slide from the bottom and close with the back button.

## Modals

<div class="preview-row">
  <SheetPreview variant="center" caption="center" />
  <SheetPreview variant="fullScreen" caption="fullScreen" />
  <SheetPreview variant="alert" caption="alert" />
  <SheetPreview variant="popup" caption="popup" />
  <SheetPreview variant="side" caption="side" />
  <SheetPreview variant="top" caption="top" />
  <SheetPreview variant="floating" caption="floating" />
</div>

| Variant | Placement | Drag | Backdrop | Behaviour | Notes |
| --- | --- | --- | --- | --- | --- |
| `center` | center | — | ✅ | modal | |
| `fullScreen` | full screen | — | — | modal | |
| `alert` | center | — | ✅ | modal | No keyboard or nested scroll. See [`presentAlert`](/components/present-alert) |
| `popup` | floating | — | — | **non-modal** | Screen beneath stays usable |
| `side` | right (or left) | — | ✅ | modal | Set `side: 'left'` |
| `top` | top | ✅ | ✅ | modal | |
| `floating` | floating | — | — | modal | 16 pt margin by default |

[`NativeModal`](/components/native-modal) is a shortcut for these.

## Overlays

<div class="preview-row">
  <SheetPreview variant="toast" caption="toast" />
  <SheetPreview variant="snackbar" caption="snackbar" />
  <SheetPreview variant="inAppNotification" caption="inAppNotification" />
  <SheetPreview variant="tooltip" caption="tooltip" />
  <SheetPreview variant="popover" caption="popover" />
  <SheetPreview variant="contextMenu" caption="contextMenu" />
  <SheetPreview variant="dropdown" caption="dropdown" />
  <SheetPreview variant="coachmark" caption="coachmark" />
  <SheetPreview variant="spotlight" caption="spotlight" />
  <SheetPreview variant="loadingOverlay" caption="loadingOverlay" />
  <SheetPreview variant="fullScreenViewer" caption="fullScreenViewer" />
</div>

| Variant | Placement | Backdrop | Behaviour | Auto-dismiss | Needs `anchor` |
| --- | --- | --- | --- | --- | --- |
| `toast` | bottom | — | non-modal | 3 s | — |
| `snackbar` | bottom | — | non-modal | 4 s | — |
| `inAppNotification` | top | — | non-modal | 5 s | — |
| `tooltip` | anchored | ✅ | non-modal | — | ✅ |
| `popover` | anchored | ✅ | non-modal | — | ✅ |
| `contextMenu` | anchored | ✅ | non-modal | — | ✅ |
| `dropdown` | anchored | ✅ | non-modal | — | ✅ |
| `coachmark` | anchored | ✅ | non-modal | — | ✅ |
| `spotlight` | anchored | ✅ | non-modal | — | ✅ |
| `loadingOverlay` | full screen | ✅ | modal | — | — |
| `fullScreenViewer` | full screen | ✅ | modal, draggable | — | — |

::: tip Backdrop on non-modal overlays
For non-modal and persistent behaviour the backdrop defaults to **off**, even when the table shows ✅. The ✅ applies if you set `behavior: 'modal'`. You can always pass `enableBackdrop` yourself.
:::

`loadingOverlay` ignores the back button by default (`hardwareBackDismiss: false`).

## Anchored overlays

Tooltips, popovers, context menus, dropdowns, coachmarks and spotlights need an `anchor`: the screen rectangle of the view they point at. Without it `present()` returns `missing-anchor`.

```tsx
import {useRef} from 'react';
import {Pressable, Text, View} from 'react-native';

function MoreButton() {
  const sheet = useNativeSheet();
  const ref = useRef<View>(null);

  const open = () =>
    ref.current?.measureInWindow((x, y, width, height) => {
      sheet.present({
        id: 'more-menu',
        variant: 'popover',
        anchor: {x, y, width, height},
        content: <MoreMenu />,
      });
    });

  return (
    <Pressable ref={ref} onPress={open}>
      <Text>More</Text>
    </Pressable>
  );
}
```

On the web the surface is placed 8 px below the anchor, aligned to its left edge.

## Overriding defaults

Any variant default can be changed per sheet:

```tsx
sheet.present({
  id: 'new-message',
  variant: 'inAppNotification',
  autoDismissMs: 8000,      // longer than the 5 s default
  enableDrag: true,         // let the user swipe it away
  content: <MessageBanner />,
});
```

Auto-dismiss applies to every behaviour, including `persistent`: an auto-dismiss timer closes the sheet by id. Omit `autoDismissMs` on a variant without a default to keep a sheet open.

The defaults table is exported as `VARIANTS` if you want to read it in code:

```ts
import {VARIANTS} from 'react-native-universal-sheet';
VARIANTS.toast.defaultAutoDismissMs; // 3000
```
