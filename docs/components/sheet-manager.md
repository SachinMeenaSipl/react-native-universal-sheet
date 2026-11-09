---
description: SheetManager - the plain JavaScript store behind react-native-universal-sheet. Create your own to share it, open sheets outside React, or test sheet logic.
---

# SheetManager

The store that holds the sheet stack. `useNativeSheet()` returns the provider's manager. You only create one yourself to:

- open sheets from outside React (navigation listeners, push notifications, Redux middleware),
- register [named sheets](/components/sheet-registry),
- test sheet logic without rendering.

```tsx
import {NativeSheetProvider, SheetManager} from 'react-native-universal-sheet';

export const sheets = new SheetManager({maxStackDepth: 5});

export default function App() {
  return (
    <NativeSheetProvider manager={sheets}>
      <RootNavigator />
    </NativeSheetProvider>
  );
}

// anywhere:
sheets.present({id: 'promo', variant: 'center', content: <Promo />});
```

## Constructor

```ts
new SheetManager(options?: SheetManagerOptions)
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `maxStackDepth` | `number` | `5` | Integer ≥ 1. Throws otherwise |
| `registry` | `SheetRegistry` | empty registry | Named sheets for `presentNamed` |
| `scheduler` | `{setTimeout, clearTimeout}` | global timers | Inject fake timers in tests |

## Methods

All methods from [`useNativeSheet`](/components/use-native-sheet#methods), plus:

| Member | Description |
| --- | --- |
| `subscribe(listener)` | Call `listener` on every change. Returns an unsubscribe function |
| `getSnapshot()` | Current list of open sheets (stable reference between changes) |
| `maxStackDepth` | The configured limit |
| `registry` | The `SheetRegistry` in use |

`handleNativePresented`, `handleNativeDismiss` and `handleNativeSnapChange` are called by the platform surface. Call them yourself only in tests, to simulate the platform.

## Testing sheet logic

```ts
import {SheetManager} from 'react-native-universal-sheet';

test('confirm replaces the cart sheet', () => {
  const manager = new SheetManager();
  manager.present({id: 'cart', content: null});
  manager.present({id: 'confirm', content: null, presentation: 'replace'});

  // The cart is closing; the confirm sheet waits for it.
  expect(manager.getSheet('cart')?.phase).toBe('dismissing');

  manager.handleNativeDismiss('cart'); // simulate the platform finishing the animation
  expect(manager.getActive().map(s => s.id)).toEqual(['confirm']);
});
```

### Fake timers for auto-dismiss

```ts
const timers: Array<() => void> = [];
const manager = new SheetManager({
  scheduler: {
    setTimeout: cb => timers.push(cb),
    clearTimeout: () => {},
  },
});
manager.present({id: 't', variant: 'toast', content: null});
timers[0](); // fire the 3 s timer now
expect(manager.getSheet('t')?.phase).toBe('dismissing');
```
