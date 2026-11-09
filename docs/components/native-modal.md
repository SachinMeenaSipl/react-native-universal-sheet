---
description: NativeModal - centered dialogs, full-screen modals, alerts, popups, side drawers, top sheets and floating panels for React Native with one declarative component.
---

# NativeModal

A declarative modal. It is [`NativeSheet`](/components/native-sheet) with a modal `presentation` instead of a bottom sheet.

<div class="preview-row">
  <SheetPreview variant="center" caption="center" />
  <SheetPreview variant="fullScreen" caption="fullScreen" />
  <SheetPreview variant="alert" caption="alert" />
  <SheetPreview variant="popup" caption="popup" />
  <SheetPreview variant="side" caption="side" />
  <SheetPreview variant="top" caption="top" />
  <SheetPreview variant="floating" caption="floating" />
</div>

::: info Native status
On the web every presentation above is drawn as shown. On iOS and Android these are currently presented as a bottom sheet while the native modal presenters are built. See [Platform support](/reference/platform-support).
:::

## Basic usage

```tsx
import {useState} from 'react';
import {Button, Text, View} from 'react-native';
import {NativeModal} from 'react-native-universal-sheet';

export function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button title="Open modal" onPress={() => setOpen(true)} />
      <NativeModal
        visible={open}
        presentation="center"
        appearance={{width: 320, cornerRadius: 16}}
        styles={{contentStyle: {padding: 20, gap: 8}}}
        onDismiss={() => setOpen(false)}>
        <Text style={{fontSize: 18, fontWeight: '600'}}>Welcome back</Text>
        <Button title="Close" onPress={() => setOpen(false)} />
      </NativeModal>
    </>
  );
}
```

## Props

All [`NativeSheet` props](/components/native-sheet#props) except `variant`, plus:

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `presentation` | `'center' \| 'fullScreen' \| 'alert' \| 'popup' \| 'side' \| 'top' \| 'floating'` | `'center'` | Where and how the modal appears |
| `side` | `'left' \| 'right'` | `'right'` | Only for `presentation="side"` |

::: tip `presentation` means something different here
On `NativeSheet` and `present()`, `presentation` is the stacking mode (`'stack' | 'replace'`). On `NativeModal` it chooses the modal type. A `NativeModal` always stacks.
:::

## Presentation defaults

| `presentation` | Backdrop | Drag | Behaviour | Typical use |
| --- | --- | --- | --- | --- |
| `center` | yes | no | modal | Login, forms, details |
| `fullScreen` | no | no | modal | Onboarding, editors |
| `alert` | yes | no | modal | Confirmations (see [`presentAlert`](/components/present-alert)) |
| `popup` | no | no | non-modal | Promotions, small panels; screen stays usable |
| `side` | yes | no | modal | Navigation drawer, filters |
| `top` | yes | yes | modal | Search, banners from the top |
| `floating` | no | no | modal | Card floating above content with a margin |

## Examples

### Side drawer from the left

```tsx
<NativeModal
  visible={menuOpen}
  presentation="side"
  side="left"
  appearance={{width: 280}}
  onDismiss={() => setMenuOpen(false)}>
  <DrawerMenu />
</NativeModal>
```

### Full-screen editor

```tsx
<NativeModal visible={editing} presentation="fullScreen" onDismiss={() => setEditing(false)}>
  <PhotoEditor onDone={() => setEditing(false)} />
</NativeModal>
```

### Floating card with a margin

```tsx
<NativeModal
  visible={open}
  presentation="floating"
  margin={24}
  appearance={{cornerRadius: 20, shadowRadius: 20, shadowOpacity: 0.2}}
  onDismiss={() => setOpen(false)}>
  <PromoCard />
</NativeModal>
```
