---
description: Use react-native-universal-sheet with React Navigation and Expo Router - where to put the provider, navigating from a sheet, and closing sheets on navigation.
---

# React Navigation

## Provider placement

Put the provider inside `NavigationContainer` and above your navigators. Sheets then survive screen changes and their content can use navigation hooks:

```tsx
import {NavigationContainer} from '@react-navigation/native';
import {NativeSheetProvider} from 'react-native-universal-sheet';

export default function App() {
  return (
    <NavigationContainer>
      <NativeSheetProvider>
        <RootStack />
      </NativeSheetProvider>
    </NavigationContainer>
  );
}
```

Placing the provider **inside** `NavigationContainer` (as here) lets sheet content call `useNavigation()`. Placing it outside works too, but then sheet content can't use navigation hooks.

With Expo Router, put the provider in `app/_layout.tsx` around `<Stack />` (see [Expo](/installation/expo#_4-add-the-provider)).

## Navigate from a sheet

Close the sheet, then navigate:

```tsx
function OrderSheet({orderId}: {orderId: string}) {
  const sheet = useNativeSheet();
  const navigation = useNavigation();

  return (
    <Button
      title="Track order"
      onPress={() => {
        sheet.dismiss('order');
        navigation.navigate('Tracking', {orderId});
      }}
    />
  );
}
```

## Close sheets when the screen changes

Sheets stay open across navigation by design. If a sheet belongs to one screen, close it when the screen loses focus:

```tsx
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';

function ProductScreen() {
  const sheet = useNativeSheet();

  useFocusEffect(
    useCallback(() => () => {
      sheet.dismiss('product-options');
    }, [sheet]),
  );
  // …
}
```

Or close everything on every navigation:

```tsx
<NavigationContainer onStateChange={() => sheets.dismissAll()}>
```

(`sheets` being a [`SheetManager`](/components/sheet-manager) you passed to the provider.)

## Sheets vs. native modal screens

React Navigation's `presentation: 'modal'` / `'formSheet'` screens are routes: they have URLs, back history and deep links. Use them for full flows. Use this library for transient UI that shouldn't be a route: pickers, menus, confirmations, quick edits.
