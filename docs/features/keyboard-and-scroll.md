---
description: Text inputs and scrolling inside React Native bottom sheets - keyboard handling, ScrollView and FlatList inside a sheet, and current platform behaviour.
---

# Keyboard & scrolling

## Text inputs

Put inputs in a sheet as usual:

```tsx
sheet.present({
  id: 'rename',
  content: <RenameForm />,
  snapPoints: ['content'],
  enableKeyboard: true, // default for bottom sheets
});
```

Current behaviour:

| | Behaviour |
| --- | --- |
| iOS | The system sheet stays where it is; use `KeyboardAvoidingView` inside your content if an input is hidden |
| Android | The dialog window resizes with the keyboard (system default) |
| Web | The browser handles it |

A portable pattern that works today on all platforms:

```tsx
import {KeyboardAvoidingView, Platform, TextInput} from 'react-native';

function RenameForm() {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{padding: 20}}>
      <TextInput placeholder="Name" autoFocus style={{borderWidth: 1, padding: 12, borderRadius: 8}} />
    </KeyboardAvoidingView>
  );
}
```

Built-in keyboard handling driven by `enableKeyboard` is on the [roadmap](/reference/roadmap).

## Scrolling content

`ScrollView`, `FlatList` and `SectionList` work inside a sheet. Give the list `flex: 1` (the content wrapper already fills the sheet):

```tsx
sheet.present({
  id: 'countries',
  snapPoints: ['50%', '95%'],
  content: (
    <FlatList
      style={{flex: 1}}
      data={countries}
      keyExtractor={c => c.code}
      renderItem={({item}) => <CountryRow country={item} />}
    />
  ),
});
```

On iOS, scrolling to the top and pulling down then drags the sheet, which is the system behaviour. On Android, `BottomSheetDialog` coordinates nested scrolling for lists that support it. Fine-tuning this handoff through `enableNestedScroll` is still being tested on devices.
