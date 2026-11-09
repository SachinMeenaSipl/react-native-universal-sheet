---
description: Check that react-native-universal-sheet is installed correctly with a small test screen that opens a sheet, logs events and shows any error reason.
---

# Verify the install

Drop this screen into your app. It opens a sheet, logs every event and prints any error reason.

```tsx
import {useState} from 'react';
import {Button, SafeAreaView, Text} from 'react-native';
import {NativeSheetProvider, useNativeSheet} from 'react-native-universal-sheet';

function Check() {
  const sheet = useNativeSheet();
  const [log, setLog] = useState<string[]>([]);
  const add = (line: string) => setLog(prev => [...prev, line]);

  const open = () => {
    const result = sheet.present({
      id: 'install-check',
      content: <Text style={{padding: 24}}>It works. Drag me or swipe down.</Text>,
      snapPoints: ['40%', '90%'],
      onDidPresent: () => add('presented'),
      onSnapChange: (_, index) => add(`snap ${index}`),
      onDidDismiss: () => add('dismissed'),
    });
    add(result.ok ? 'present: ok' : `present failed: ${result.reason}`);
  };

  return (
    <SafeAreaView style={{flex: 1, padding: 24, gap: 12}}>
      <Button title="Open test sheet" onPress={open} />
      {log.map((line, i) => (
        <Text key={i}>{line}</Text>
      ))}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <NativeSheetProvider>
      <Check />
    </NativeSheetProvider>
  );
}
```

## What you should see

1. Tap **Open test sheet**: the log shows `present: ok`, a sheet slides up to 40%, then `presented`.
2. Drag it up: `snap 1`.
3. Swipe it down: `dismissed`.

## If it fails

| Symptom | Fix |
| --- | --- |
| Red screen: *must be used inside `<NativeSheetProvider>`* | The provider is missing or below the component |
| *Requires a view named NativeSheetHost* / *View config not found* | Native code isn't in the binary. Run `pod install` and rebuild; in Expo, use a development build |
| `present failed: invalid-snap-point` | A snap point is out of range or duplicated |
| Nothing appears, no error | Check that the provider isn't inside a view with `display: 'none'` or zero size |

More in [Troubleshooting](/reference/troubleshooting).
