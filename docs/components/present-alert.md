---
description: presentAlert - show a styled confirmation dialog in React Native with a title, message and action buttons, including destructive and cancel actions.
---

# presentAlert

Opens an alert dialog with a title, an optional message and action buttons. Tapping any button closes the alert, then runs that button's `onPress`.

<div class="preview-row">
  <SheetPreview variant="alert" caption="variant: 'alert'" />
</div>

```tsx
import {presentAlert, useNativeSheet} from 'react-native-universal-sheet';

function DeleteButton({onDelete}: {onDelete: () => void}) {
  const sheet = useNativeSheet();

  return (
    <Button
      title="Delete"
      onPress={() =>
        presentAlert(sheet, {
          id: 'confirm-delete',
          title: 'Delete this photo?',
          message: 'It will be removed from all your devices.',
          actions: [
            {label: 'Cancel', style: 'cancel'},
            {label: 'Delete', style: 'destructive', onPress: onDelete},
          ],
        })
      }
    />
  );
}
```

## Signature

```ts
presentAlert(manager: SheetManager, options: AlertOptions): SheetResult
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | **required** | Sheet id |
| `title` | `string` | **required** | Also used as the accessibility label |
| `message` | `string` | — | Body text |
| `actions` | `SheetAction[]` | one **OK** button | Buttons, top to bottom |
| `appearance` | [`SheetAppearance`](/features/appearance) | — | Surface colour, radius, width… |
| `styles` | [`SheetStyles`](/features/appearance#styles-content-design) | — | `contentStyle`, `titleStyle`, `messageStyle`, `buttonStyle`, `buttonTextStyle` |

### `SheetAction`

| Field | Type | Description |
| --- | --- | --- |
| `label` | `string` | Button text. Must be unique within the alert |
| `style` | `'default' \| 'destructive' \| 'cancel'` | `destructive` renders red |
| `onPress` | `() => void` | Runs after the alert starts closing |

## Styled alert

```tsx
presentAlert(sheet, {
  id: 'logout',
  title: 'Log out?',
  message: 'You will need to sign in again.',
  actions: [{label: 'Stay'}, {label: 'Log out', style: 'destructive', onPress: logout}],
  appearance: {backgroundColor: '#FFFFFF', cornerRadius: 20, width: 300},
  styles: {
    titleStyle: {fontSize: 20, textAlign: 'center'},
    messageStyle: {textAlign: 'center'},
    buttonTextStyle: {fontWeight: '600'},
  },
});
```

## Default look

| Part | Default |
| --- | --- |
| Body | `padding: 20`, `gap: 12` |
| Title | 18 pt, weight 600, `#111` |
| Message | 15 pt, `#444` |
| Button text | 16 pt, `#0a62d6`; destructive `#d62c2c` |

Every value can be overridden with `styles`.

## Alert defaults

The `alert` variant has a backdrop, no drag, no keyboard handling and no nested scrolling. The Android back button closes it.
