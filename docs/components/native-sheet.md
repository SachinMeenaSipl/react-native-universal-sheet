---
description: NativeSheet - a declarative, controlled bottom sheet for React Native. Open it with visible, choose snap points, style it, and react to dismiss and snap events.
---

# NativeSheet

A declarative, controlled sheet. It presents when `visible` is `true` and dismisses when it becomes `false`. By default it is a bottom sheet; pass `variant` for any other [type](/features/variants).

<div class="preview-row">
  <SheetPreview variant="bottomSheet" :snap="0.5" caption="snapPoints ['50%']" />
  <SheetPreview variant="bottomSheet" :snap="0.9" caption="snapPoints ['90%']" />
  <SheetPreview variant="bottomSheet" :snap="0.25" caption="'small' (25%)" />
</div>

## Basic usage

```tsx
import {useState} from 'react';
import {Button, Text} from 'react-native';
import {NativeSheet} from 'react-native-universal-sheet';

export function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button title="Open" onPress={() => setOpen(true)} />
      <NativeSheet visible={open} onDismiss={() => setOpen(false)}>
        <Text style={{padding: 20}}>Hello from a bottom sheet</Text>
      </NativeSheet>
    </>
  );
}
```

`NativeSheet` renders nothing in place. The provider renders the sheet.

## Props

`NativeSheet` accepts every [sheet option](/reference/api#sheetconfig) plus these:

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `visible` | `boolean` | **required** | Presents when `true`, dismisses when `false` |
| `children` | `ReactNode` | **required** | The sheet content |
| `id` | `string` | generated | Stable id, if you want to call `snapTo` etc. on it |
| `onDismiss` | `() => void` | — | After the sheet closes for any reason: swipe, backdrop, back button, `dismiss()` or unmount |
| `onSnapChange` | `(index: number) => void` | — | The user or code moved the sheet to another snap point |
| `onPresent` | `() => void` | — | After the sheet finishes appearing |

Most used options:

| Option | Type | Default |
| --- | --- | --- |
| `variant` | [`SheetVariant`](/features/variants) | `'bottomSheet'` |
| `snapPoints` | `SnapPoint[]` | `['large']` (90%) |
| `initialSnapPoint` | `SnapPoint` | first snap point |
| `sizing` | `'peek' \| 'half' \| 'medium' \| 'expanded' \| 'full'` | — |
| `enableDrag` | `boolean` | `true` for sheets |
| `enableBackdrop` | `boolean` | `true` for modal behaviour |
| `appearance` | [`SheetAppearance`](/features/appearance) | platform defaults |
| `styles` | [`SheetStyles`](/features/appearance#styles-content-design) | — |
| `presentation` | `'stack' \| 'replace'` | `'stack'` |
| `behavior` | `'modal' \| 'nonModal' \| 'persistent'` | from variant |

## Examples

### Two heights, start at the smaller

```tsx
<NativeSheet
  visible={open}
  snapPoints={['40%', '90%']}
  initialSnapPoint="40%"
  onSnapChange={index => console.log(index === 1 ? 'expanded' : 'collapsed')}
  onDismiss={() => setOpen(false)}>
  <Comments />
</NativeSheet>
```

### Control height from code

Give it an `id` and use the manager:

```tsx
const sheet = useNativeSheet();

<NativeSheet id="details" visible={open} snapPoints={['40%', '90%']} onDismiss={() => setOpen(false)}>
  <Button title="Show more" onPress={() => sheet.expand('details')} />
</NativeSheet>
```

### Size to content

```tsx
<NativeSheet visible={open} snapPoints={['content']} onDismiss={() => setOpen(false)}>
  <ShareTargets />
</NativeSheet>
```

### Can't be swiped away

```tsx
<NativeSheet
  visible={saving}
  enableDrag={false}
  hardwareBackDismiss={false}
  onDismiss={() => setSaving(false)}>
  <SavingProgress />
</NativeSheet>
```

Close it by setting `visible` to `false`.

### Custom design

```tsx
<NativeSheet
  visible={open}
  onDismiss={() => setOpen(false)}
  snapPoints={['50%', '90%']}
  appearance={{
    backgroundColor: '#0F172A',
    cornerRadius: 24,
    handleColor: '#64748B',
    borderWidth: 1,
    borderColor: '#1E293B',
    backdropOpacity: 0.6,
  }}
  styles={{contentStyle: {padding: 24, gap: 16}}}>
  <DarkContent />
</NativeSheet>
```

## Updating while open

While the sheet is visible, changes to `children` and most options (`snapPoints`, `initialSnapPoint`, `enableDrag`, `enableBackdrop`, `enableKeyboard`, `enableNestedScroll`, `hardwareBackDismiss`, `autoDismissMs`, `margin`, `anchor`, `animation`, `appearance`, `actions`, `accessibilityLabel`) are applied in place without re-opening it.

`variant`, `presentation`, `behavior`, `side`, `sizing` and `styles` are read when the sheet opens. To change them, close and reopen the sheet.

Changing the callbacks (`onDismiss` etc.) never re-presents the sheet.

## NativeSheet or useNativeSheet?

| Use `NativeSheet` when | Use [`useNativeSheet`](/components/use-native-sheet) when |
| --- | --- |
| The sheet's open state already lives in React state | You open sheets from event handlers |
| The sheet belongs to one screen | You open the same sheet from several places |
| You like JSX | You need the result (`{ok, reason}`) of presenting |
