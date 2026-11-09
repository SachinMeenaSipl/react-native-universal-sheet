---
description: Stack React Native bottom sheets and modals on top of each other, replace the topmost sheet, set a maximum depth, and keep persistent sheets open.
---

# Stacking & replace

Sheets form a stack. A new sheet opens on top; closing it reveals the one underneath, still mounted, with its state intact.

## Stack (default)

```tsx
sheet.present({id: 'profile', content: <Profile />, snapPoints: ['60%', '95%']});

// later, from inside Profile:
sheet.present({id: 'edit-email', content: <EditEmail />});

// after saving:
sheet.dismiss('edit-email'); // Profile is visible again, scroll position and inputs intact.
```

On iOS each sheet is presented from the one below it. On Android each is its own dialog window. On the web each is a separate layer in `document.body`.

## Replace

`presentation: 'replace'` closes the topmost sheet, waits for it to finish closing, then presents the new one.

```tsx
sheet.present({id: 'cart', content: <Cart />});

// "Checkout" button inside the cart:
sheet.present({id: 'checkout', content: <Checkout />, presentation: 'replace'});
```

- If nothing is open, `replace` behaves like `stack`.
- Only one replace can be waiting at a time; a second returns `replace-in-progress`.
- `dismissAll()` cancels a waiting replace.

To swap content **without** any animation, use [`replace(id, config)`](/components/use-native-sheet#replace-without-animation) instead.

## Depth limit

At most 5 sheets can be open (configurable):

```tsx
<NativeSheetProvider maxStackDepth={3}>
```

Opening one more returns `stack-limit-reached`.

## Dismissing

| Call | Closes |
| --- | --- |
| `dismiss('id')` | That sheet, wherever it is in the stack |
| `dismiss()` | The topmost sheet that isn't `persistent` |
| `dismissAll()` | Every sheet except `persistent` ones, topmost first |
| `dismissAll({includePersistent: true})` | Every sheet |

## Persistent sheets

`behavior: 'persistent'` keeps a sheet open through `dismiss()` and `dismissAll()`. Use it for a mini-player or an ongoing-call banner. Close it by id.

```tsx
sheet.present({
  id: 'mini-player',
  content: <MiniPlayer />,
  behavior: 'persistent',
  snapPoints: ['12%', '100%'],
});

sheet.dismissAll();                // mini-player stays
sheet.dismiss('mini-player');      // closes it
```

Persistent and non-modal sheets have no backdrop by default, so the screen underneath stays usable.

## Re-presenting a closing sheet

If you call `present()` with the id of a sheet that is still animating closed, the close is cancelled and the sheet stays with the new config. This keeps React StrictMode (which mounts effects twice in development) from flashing sheets.
