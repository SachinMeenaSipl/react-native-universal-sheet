---
description: useNativeSheet hook - open, dismiss, update, replace and resize React Native sheets imperatively from any event handler, with typed results instead of exceptions.
---

# useNativeSheet

Returns the [`SheetManager`](/components/sheet-manager) from the nearest provider, so you can open and control sheets from event handlers.

```tsx
import {useNativeSheet} from 'react-native-universal-sheet';

function Screen() {
  const sheet = useNativeSheet();
  // sheet.present(...), sheet.dismiss(...), ...
}
```

It throws if there is no `<NativeSheetProvider>` above the component.

## Methods

| Method | Returns | Description |
| --- | --- | --- |
| `present(config)` | `SheetResult` | Open a sheet. See [`SheetConfig`](/reference/api#sheetconfig) |
| `presentNamed(name, {id, props, ...overrides})` | `SheetResult` | Open a sheet registered in a [`SheetRegistry`](/components/sheet-registry) |
| `dismiss(id?)` | `SheetResult` | Close a sheet; without an id, the topmost non-persistent one |
| `dismissAll({includePersistent?})` | `SheetResult` | Close every sheet, topmost first |
| `update(id, patch)` | `SheetResult` | Change content or options of an open sheet |
| `replace(id, config)` | `SheetResult` | Swap content and config in place, without animation |
| `snapTo(id, point)` | `SheetResult` | Move to one of the sheet's snap points |
| `expand(id)` | `SheetResult` | Move to the last (largest) snap point |
| `collapse(id)` | `SheetResult` | Move to the first (smallest) snap point |
| `isPresented(id)` | `boolean` | Whether the sheet is open and not closing |
| `getSheet(id)` | `ActiveSheet \| undefined` | Current state of one sheet |
| `getActive()` | `ActiveSheet[]` | All open sheets, bottom to top |

`SheetResult` is `{ok: true}` or `{ok: false, reason}`. See [Error reasons](/reference/errors).

## Examples

### Present

```tsx
sheet.present({
  id: 'comments',
  content: <Comments postId={post.id} />,
  snapPoints: ['50%', '95%'],
  onDidDismiss: () => refetch(),
});
```

### Dismiss from inside the sheet

```tsx
function CommentsHeader() {
  const sheet = useNativeSheet();
  return <Button title="Close" onPress={() => sheet.dismiss('comments')} />;
}
```

Content rendered in a sheet is inside the provider, so `useNativeSheet()` works there too.

### Update content while open

```tsx
sheet.present({id: 'upload', content: <Progress value={0} />, snapPoints: ['content']});

onProgress(value => {
  sheet.update('upload', {content: <Progress value={value} />});
});
```

### Replace without animation

```tsx
// Turn a "loading" sheet into the result, keeping the same native sheet.
sheet.replace('payment', {
  id: 'payment',
  content: <PaymentSuccess />,
  snapPoints: ['40%'],
});
```

### Snap

```tsx
sheet.snapTo('comments', '95%');
sheet.collapse('comments');
```

`snapTo` only accepts a point that is in the sheet's `snapPoints`; anything else returns `invalid-snap-point`.

### Handle errors

```tsx
const result = sheet.present({id: 'filters', content: <Filters />});
if (!result.ok && result.reason === 'duplicate-id') {
  sheet.expand('filters'); // Already open: bring it to full height instead.
}
```
