---
description: SheetRegistry - register named, typed sheets once and open them anywhere in your React Native app with presentNamed and per-call props.
---

# SheetRegistry

Register sheets by name, with defaults and typed props, then open them anywhere with `presentNamed`.

```tsx
import {NativeSheetProvider, SheetManager, SheetRegistry} from 'react-native-universal-sheet';

const registry = new SheetRegistry()
  .register<{userId: string}>('user-details', {
    render: ({userId}) => <UserDetails userId={userId} />,
    snapPoints: ['60%', '95%'],
  })
  .register('settings', {
    render: () => <Settings />,
    variant: 'side',
    side: 'right',
  });

const manager = new SheetManager({registry});

export default function App() {
  return (
    <NativeSheetProvider manager={manager}>
      <RootNavigator />
    </NativeSheetProvider>
  );
}
```

Open one:

```tsx
const sheet = useNativeSheet();

sheet.presentNamed('user-details', {id: 'user-42', props: {userId: '42'}});
```

## Methods

| Method | Returns | Description |
| --- | --- | --- |
| `register<P>(name, definition)` | `this` | Add or overwrite a definition. Chainable. Throws on an empty name |
| `unregister(name)` | `boolean` | Remove a definition |
| `has(name)` | `boolean` | Whether it is registered |
| `get(name)` | `SheetDefinition \| undefined` | The definition |

## `SheetDefinition<P>`

Every [sheet option](/reference/api#sheetconfig) except `id` and `content`, plus:

| Field | Type | Description |
| --- | --- | --- |
| `render` | `(props: P) => ReactNode` | Builds the content from the props passed to `presentNamed` |

## `presentNamed(name, options)`

| Option | Type | Description |
| --- | --- | --- |
| `id` | `string` | **Required.** The id of this instance |
| `props` | `P` | Passed to `render` |
| *any sheet option* | | Overrides the definition's default for this call |

```tsx
sheet.presentNamed('user-details', {
  id: 'user-7',
  props: {userId: '7'},
  initialSnapPoint: '95%', // override
});
```

Returns `{ok: false, reason: 'unknown-sheet'}` if the name isn't registered.

See the [Named sheets recipe](/recipes/named-sheets) for a typed setup.
