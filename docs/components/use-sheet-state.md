---
description: useSheetState hook - subscribe to one sheet's state in React Native. Re-renders when it opens, closes or changes snap point, and returns undefined when closed.
---

# useSheetState

Subscribes to one sheet. The component re-renders when that sheet opens, closes, changes snap point or is updated.

```tsx
import {useSheetState} from 'react-native-universal-sheet';

const state = useSheetState('cart');
```

## Returns

`ActiveSheet | undefined`. `undefined` means the sheet is not open.

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | The sheet id |
| `phase` | `'presented' \| 'dismissing'` | `dismissing` while the close animation runs |
| `snapIndex` | `number` | Index into `config.snapPoints` |
| `config` | `ResolvedSheetConfig` | The full config, with defaults filled in |

## Examples

### Show a badge while a sheet is open

```tsx
function CartButton() {
  const sheet = useNativeSheet();
  const cart = useSheetState('cart');

  return (
    <Button
      title={cart ? 'Close cart' : 'Open cart'}
      onPress={() =>
        cart ? sheet.dismiss('cart') : sheet.present({id: 'cart', content: <Cart />})
      }
    />
  );
}
```

### React to the current height

```tsx
function MapScreen() {
  const details = useSheetState('place-details');
  const expanded = details?.snapIndex === (details?.config.snapPoints.length ?? 0) - 1;

  return <Map style={{opacity: expanded ? 0.4 : 1}} />;
}
```

### Hide UI while closing

```tsx
const state = useSheetState('editor');
const isClosing = state?.phase === 'dismissing';
```
