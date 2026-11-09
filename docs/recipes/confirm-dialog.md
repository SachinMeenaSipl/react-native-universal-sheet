---
description: An awaitable confirm dialog for React Native - wrap presentAlert in a promise so you can write `if (await confirm(...))`.
---

# Confirm dialog

Wrap [`presentAlert`](/components/present-alert) in a promise so confirmations read like normal code.

```tsx
import {presentAlert, useNativeSheet} from 'react-native-universal-sheet';
import type {SheetManager} from 'react-native-universal-sheet';

export function confirm(
  sheet: SheetManager,
  {title, message, confirmLabel = 'OK', destructive = false}: {
    title: string;
    message?: string;
    confirmLabel?: string;
    destructive?: boolean;
  },
): Promise<boolean> {
  return new Promise(resolve => {
    let answered = false;
    const answer = (value: boolean) => {
      if (!answered) {
        answered = true;
        resolve(value);
      }
    };

    const id = `confirm-${Date.now()}`;
    const result = presentAlert(sheet, {
      id,
      title,
      message,
      actions: [
        {label: 'Cancel', style: 'cancel', onPress: () => answer(false)},
        {label: confirmLabel, style: destructive ? 'destructive' : 'default', onPress: () => answer(true)},
      ],
    });
    if (!result.ok) {
      answer(false);
      return;
    }
    // Back button or backdrop tap counts as Cancel.
    sheet.update(id, {onDidDismiss: () => answer(false)});
  });
}
```

Use it:

```tsx
function DeleteAccount() {
  const sheet = useNativeSheet();

  const onPress = async () => {
    const ok = await confirm(sheet, {
      title: 'Delete your account?',
      message: 'All your data will be removed.',
      confirmLabel: 'Delete',
      destructive: true,
    });
    if (ok) {
      await api.deleteAccount();
    }
  };

  return <Button title="Delete account" onPress={onPress} />;
}
```

Button presses call `answer` first; the later `onDidDismiss` then does nothing because the promise is already settled.
