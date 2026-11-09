---
description: presentToast - show a short, auto-dismissing toast message in React Native, Expo and web, with a custom duration and style.
---

# presentToast

Shows a short message at the bottom of the screen that closes itself.

<div class="preview-row">
  <SheetPreview variant="toast" caption="variant: 'toast'" />
</div>

```tsx
import {presentToast, useNativeSheet} from 'react-native-universal-sheet';

const sheet = useNativeSheet();

presentToast(sheet, {id: 'saved', message: 'Changes saved'});
```

## Signature

```ts
presentToast(manager: SheetManager, options: ToastOptions): SheetResult
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | **required** | Sheet id |
| `message` | `string` | **required** | Text, also the accessibility label |
| `durationMs` | `number` | `3000` | Time before it closes |
| `appearance` | [`SheetAppearance`](/features/appearance) | — | Surface design |
| `styles` | [`SheetStyles`](/features/appearance#styles-content-design) | — | `contentStyle` for the box, `messageStyle` for the text |

## Examples

### Longer and styled

```tsx
presentToast(sheet, {
  id: 'offline',
  message: 'You are offline. Changes will sync later.',
  durationMs: 5000,
  styles: {
    contentStyle: {backgroundColor: '#7C2D12', borderRadius: 14},
    messageStyle: {color: '#FFEDD5'},
  },
});
```

### Avoid duplicate toasts

Ids must be unique among open sheets, so showing the same toast twice returns `duplicate-id`. Use that to avoid stacking identical messages, or make each id unique:

```tsx
presentToast(sheet, {id: `saved-${Date.now()}`, message: 'Saved'});
```

### Toast with an action (snackbar)

`presentToast` shows text only. For a button, present a `snackbar` yourself:

```tsx
sheet.present({
  id: 'undo',
  variant: 'snackbar', // closes after 4 s by default
  content: (
    <View style={{flexDirection: 'row', padding: 14, gap: 12, backgroundColor: '#222', borderRadius: 8}}>
      <Text style={{color: '#fff', flex: 1}}>Message archived</Text>
      <Text style={{color: '#93C5FD'}} onPress={() => { undo(); sheet.dismiss('undo'); }}>UNDO</Text>
    </View>
  ),
});
```

## Toast defaults

`toast` is a non-modal overlay at the bottom: no backdrop, no drag, the screen stays usable, and it closes after 3 seconds. `snackbar` closes after 4 seconds; `inAppNotification` appears at the top and closes after 5 seconds.
