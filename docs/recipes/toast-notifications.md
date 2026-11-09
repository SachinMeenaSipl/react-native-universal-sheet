---
description: Toasts, snackbars with undo and in-app notification banners in React Native with react-native-universal-sheet, plus a small app-wide toast helper.
---

# Toasts & notifications

<div class="preview-row">
  <SheetPreview variant="toast" caption="toast" />
  <SheetPreview variant="snackbar" caption="snackbar" />
  <SheetPreview variant="inAppNotification" caption="inAppNotification" />
</div>

## An app-wide `toast()` helper

```tsx
// toast.ts
import {presentToast} from 'react-native-universal-sheet';
import type {SheetManager} from 'react-native-universal-sheet';

let counter = 0;

export function toast(sheet: SheetManager, message: string, durationMs?: number) {
  return presentToast(sheet, {
    id: `toast-${++counter}`,
    message,
    durationMs,
    styles: {contentStyle: {margin: 16, borderRadius: 12}},
  });
}
```

```tsx
const sheet = useNativeSheet();
toast(sheet, 'Copied to clipboard');
```

## Snackbar with undo

```tsx
function archive(sheet: SheetManager, item: Item) {
  archiveItem(item.id);
  sheet.present({
    id: `undo-${item.id}`,
    variant: 'snackbar', // 4 s
    content: (
      <View style={{flexDirection: 'row', alignItems: 'center', padding: 14, margin: 12, borderRadius: 8, backgroundColor: '#222'}}>
        <Text style={{color: '#fff', flex: 1}}>Archived</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            unarchiveItem(item.id);
            sheet.dismiss(`undo-${item.id}`);
          }}>
          <Text style={{color: '#93C5FD', fontWeight: '600'}}>UNDO</Text>
        </Pressable>
      </View>
    ),
  });
}
```

## In-app notification banner

```tsx
function showMessageBanner(sheet: SheetManager, msg: {from: string; text: string}) {
  sheet.present({
    id: 'incoming-message',
    variant: 'inAppNotification', // top, 5 s
    accessibilityLabel: `Message from ${msg.from}`,
    content: (
      <Pressable onPress={() => openChat(msg.from)} style={{padding: 14, margin: 12, borderRadius: 14, backgroundColor: '#fff'}}>
        <Text style={{fontWeight: '600'}}>{msg.from}</Text>
        <Text numberOfLines={2}>{msg.text}</Text>
      </Pressable>
    ),
  });
}
```

If a banner with the same id is already open, `present()` returns `duplicate-id`. Use `sheet.update('incoming-message', {content: ...})` to show the newest message instead.

::: info Native status
On the web these appear at the bottom or top as shown. On iOS and Android they are currently presented as bottom sheets, and auto-dismiss still applies. See [Platform support](/reference/platform-support).
:::
