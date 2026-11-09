---
description: NativeSheetProvider - the root component of react-native-universal-sheet. Owns the sheet stack, renders open sheets, and handles the Android back button.
---

# NativeSheetProvider

The root component. Place it **once**, above your navigator. Every other API needs it.

```tsx
import {NativeSheetProvider} from 'react-native-universal-sheet';

export default function App() {
  return (
    <NativeSheetProvider>
      <RootNavigator />
    </NativeSheetProvider>
  );
}
```

## What it does

- Creates a [`SheetManager`](/components/sheet-manager) (or uses the one you pass).
- Renders every open sheet after its `children`, so sheets survive screen changes.
- Listens for the Android hardware back button and dismisses the topmost sheet whose `hardwareBackDismiss` is `true`. If no sheet handles it, the press goes to your app as usual.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — | Your app |
| `maxStackDepth` | `number` | `5` | Most sheets open at once. Must be an integer ≥ 1. Ignored when `manager` is given |
| `manager` | `SheetManager` | new manager | Use your own manager, e.g. to share it or to register named sheets |

## Examples

### Allow deeper stacks

```tsx
<NativeSheetProvider maxStackDepth={8}>
  <App />
</NativeSheetProvider>
```

### With named sheets

```tsx
import {NativeSheetProvider, SheetManager, SheetRegistry} from 'react-native-universal-sheet';

const registry = new SheetRegistry().register<{orderId: string}>('order', {
  render: ({orderId}) => <OrderDetails orderId={orderId} />,
  snapPoints: ['60%', '95%'],
});

const manager = new SheetManager({registry, maxStackDepth: 6});

export default function App() {
  return (
    <NativeSheetProvider manager={manager}>
      <RootNavigator />
    </NativeSheetProvider>
  );
}
```

Create the manager **outside** the component (or in `useState`) so it isn't recreated on every render.

### Opening sheets from outside React

Because you own the manager, you can call it from anywhere, such as a push notification handler:

```ts
manager.presentNamed('order', {id: 'order-81', props: {orderId: '81'}});
```

## Placement rules

- With React Navigation, put it **inside** `NavigationContainer` and above every navigator, so sheet content can use `useNavigation()`. See [React Navigation](/recipes/react-navigation).
- Put it **inside** providers your sheet content needs (theme, Redux, React Query, i18n). Sheet content is rendered by the provider, so it sees only the context that wraps the provider.

```tsx
<ThemeProvider>
  <QueryClientProvider client={client}>
    <NavigationContainer>
      <NativeSheetProvider>{/* navigators */}</NativeSheetProvider>
    </NavigationContainer>
  </QueryClientProvider>
</ThemeProvider>
```

- Use one provider per app. Nested providers create separate stacks that don't know about each other.
