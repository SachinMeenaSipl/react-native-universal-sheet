---
description: Register typed, named bottom sheets once in React Native and open them from any screen, deep link or push notification with presentNamed.
---

# Named sheets

Define every reusable sheet in one file, with typed props, and open it by name anywhere.

```tsx
// sheets.tsx
import {SheetManager, SheetRegistry} from 'react-native-universal-sheet';
import {OrderDetails} from './OrderDetails';
import {ShareMenu} from './ShareMenu';

type SheetProps = {
  order: {orderId: string};
  share: {url: string; title: string};
};

const registry = new SheetRegistry()
  .register<SheetProps['order']>('order', {
    render: ({orderId}) => <OrderDetails orderId={orderId} />,
    snapPoints: ['60%', '95%'],
    accessibilityLabel: 'Order details',
  })
  .register<SheetProps['share']>('share', {
    render: props => <ShareMenu {...props} />,
    variant: 'share',
    snapPoints: ['content'],
  });

export const sheets = new SheetManager({registry});

/** Typed wrapper: the props must match the sheet name. */
export function openSheet<N extends keyof SheetProps>(name: N, id: string, props: SheetProps[N]) {
  return sheets.presentNamed(name, {id, props});
}
```

```tsx
// App.tsx
import {NativeSheetProvider} from 'react-native-universal-sheet';
import {sheets} from './sheets';

export default function App() {
  return (
    <NativeSheetProvider manager={sheets}>
      <RootNavigator />
    </NativeSheetProvider>
  );
}
```

```tsx
// Anywhere: a screen, a deep-link handler, a push notification listener
openSheet('order', 'order-1042', {orderId: '1042'});
openSheet('share', 'share-post', {url: post.url, title: post.title});
```

TypeScript rejects `openSheet('order', 'x', {url: '…'})` because the props don't match.

## Overriding defaults per call

```tsx
sheets.presentNamed('order', {
  id: 'order-1042',
  props: {orderId: '1042'},
  initialSnapPoint: '95%',
});
```
