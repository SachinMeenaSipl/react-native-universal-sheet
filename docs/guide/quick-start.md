---
description: Build your first native bottom sheet in React Native in five minutes, with the provider, the useNativeSheet hook and the declarative NativeSheet component.
---

# Quick start

This page takes you from install to a working bottom sheet. If you have not installed the package yet, follow [Installation](/installation/) first.

## 1. Add the provider

Wrap your app once, above your navigator. The provider owns the sheet stack and renders the sheets.

```tsx
// App.tsx
import {NativeSheetProvider} from 'react-native-universal-sheet';
import {RootNavigator} from './RootNavigator';

export default function App() {
  return (
    <NativeSheetProvider>
      <RootNavigator />
    </NativeSheetProvider>
  );
}
```

## 2. Open a sheet from a button

```tsx
import {Button, Text, View} from 'react-native';
import {useNativeSheet} from 'react-native-universal-sheet';

export function ProfileScreen() {
  const sheet = useNativeSheet();

  const openEditor = () => {
    const result = sheet.present({
      id: 'edit-profile',
      content: (
        <View style={{padding: 20, gap: 12}}>
          <Text style={{fontSize: 18, fontWeight: '600'}}>Edit profile</Text>
          <Button title="Done" onPress={() => sheet.dismiss('edit-profile')} />
        </View>
      ),
      snapPoints: ['50%', '90%'],
      initialSnapPoint: '50%',
    });

    if (!result.ok) {
      console.warn('Sheet not shown:', result.reason);
    }
  };

  return <Button title="Edit profile" onPress={openEditor} />;
}
```

The sheet opens at half height. The user can drag it to 90% or swipe it away.

## 3. Or control it with state

```tsx
import {useState} from 'react';
import {Button, Text} from 'react-native';
import {NativeSheet} from 'react-native-universal-sheet';

export function Filters() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button title="Filters" onPress={() => setOpen(true)} />
      <NativeSheet
        visible={open}
        snapPoints={['40%', '90%']}
        onDismiss={() => setOpen(false)}>
        <Text>Filter options</Text>
      </NativeSheet>
    </>
  );
}
```

::: tip Always reset state in `onDismiss`
`onDismiss` fires for every kind of close: a swipe, a backdrop tap, the back button, or `dismiss()`. Setting `visible` to `false` there keeps your state in sync.
:::

## 4. Style it

```tsx
<NativeSheet
  visible={open}
  onDismiss={() => setOpen(false)}
  snapPoints={['50%']}
  appearance={{
    backgroundColor: '#FFF8F0',
    cornerRadius: 28,
    handleColor: '#C2703D',
    backdropOpacity: 0.5,
  }}
  styles={{contentStyle: {padding: 20}}}>
  <Text>Warm sheet</Text>
</NativeSheet>
```

See [Appearance & styles](/features/appearance) for every option.

## 5. Show an alert and a toast

```tsx
import {presentAlert, presentToast, useNativeSheet} from 'react-native-universal-sheet';

const sheet = useNativeSheet();

presentAlert(sheet, {
  id: 'delete',
  title: 'Delete item?',
  message: 'This cannot be undone.',
  actions: [
    {label: 'Cancel', style: 'cancel'},
    {label: 'Delete', style: 'destructive', onPress: deleteItem},
  ],
});

presentToast(sheet, {id: 'saved', message: 'Saved', durationMs: 2000});
```

## Where next

- [Core concepts](/guide/core-concepts) explains ids, stacking and results.
- [Recipes](/recipes/) has complete screens: filters, forms, checkout, navigation.
- [API reference](/reference/api) lists every type.
