---
description: A React Native bottom sheet form with TextInput, keyboard avoidance, validation and a content-sized height using react-native-universal-sheet.
---

# Form with keyboard

An "Add address" form in a sheet that sizes to its content and keeps inputs above the keyboard.

```tsx
import {useState} from 'react';
import {Button, KeyboardAvoidingView, Platform, Text, TextInput} from 'react-native';
import {useNativeSheet} from 'react-native-universal-sheet';

export function AddressButton({onSave}: {onSave: (a: string) => void}) {
  const sheet = useNativeSheet();

  const open = () =>
    sheet.present({
      id: 'add-address',
      snapPoints: ['content', 'large'],
      accessibilityLabel: 'Add address',
      content: (
        <AddressForm
          onSave={address => {
            onSave(address);
            sheet.dismiss('add-address');
          }}
        />
      ),
    });

  return <Button title="Add address" onPress={open} />;
}

function AddressForm({onSave}: {onSave: (a: string) => void}) {
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (!street.trim() || !city.trim()) {
      setError('Street and city are required.');
      return;
    }
    onSave(`${street}, ${city}`);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{padding: 20, gap: 12}}>
      <Text style={{fontSize: 20, fontWeight: '600'}}>New address</Text>
      <TextInput placeholder="Street" value={street} onChangeText={setStreet} autoFocus style={input} />
      <TextInput placeholder="City" value={city} onChangeText={setCity} style={input} returnKeyType="done" onSubmitEditing={submit} />
      {error ? <Text style={{color: '#d62c2c'}}>{error}</Text> : null}
      <Button title="Save" onPress={submit} />
    </KeyboardAvoidingView>
  );
}

const input = {borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12} as const;
```

## Notes

- `'content'` sizes the sheet to the form; `'large'` lets the user drag it taller.
- The form keeps its own state, so the parent screen doesn't re-render while typing.
- See [Keyboard & scrolling](/features/keyboard-and-scroll) for platform behaviour.
