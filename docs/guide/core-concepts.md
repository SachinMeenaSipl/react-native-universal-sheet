---
description: The ideas behind react-native-universal-sheet - the provider, sheet ids, the stack, variants, snap points, results instead of exceptions, and the two-phase dismissal.
---

# Core concepts

Five ideas explain how the whole library behaves.

## 1. One provider, one manager

`<NativeSheetProvider>` creates a [`SheetManager`](/components/sheet-manager). Every hook and component below the provider talks to that manager. The provider also renders each open sheet, which is why the screen that opened a sheet can unmount without closing it.

```tsx
<NativeSheetProvider maxStackDepth={5}>
  <App />
</NativeSheetProvider>
```

## 2. Every sheet has an id

The id is how you refer to a sheet later: `dismiss('filters')`, `snapTo('filters', '90%')`, `useSheetState('filters')`.

- Ids must be non-empty strings.
- Two open sheets cannot share an id. A second `present()` with the same id returns `{ok: false, reason: 'duplicate-id'}`.
- `<NativeSheet>` generates an id for you when you don't pass one.

## 3. The stack

Open sheets form an ordered stack, bottom to top.

- `presentation: 'stack'` (default) adds the new sheet on top.
- `presentation: 'replace'` dismisses the topmost sheet first, then presents the new one.
- `dismiss()` with no id closes the topmost sheet that isn't `persistent`.
- The default limit is 5 sheets; beyond that `present()` returns `stack-limit-reached`.

Details: [Stacking & replace](/features/stacking).

## 4. Variants set the defaults

A **variant** is the type of surface: `bottomSheet`, `center`, `alert`, `toast`, `popover` and so on. It decides where the surface appears and the default for every behaviour (drag, backdrop, keyboard, back button, auto-dismiss). Any default can be overridden per sheet.

```tsx
sheet.present({id: 'tip', variant: 'toast', content: <Tip />, autoDismissMs: 6000});
```

Details: [Sheet types](/features/variants).

## 5. Results, not exceptions

Methods never throw for user mistakes. They return a `SheetResult`:

```ts
type SheetResult = {ok: true} | {ok: false; reason: SheetErrorReason};
```

```tsx
const result = sheet.present({id: 'a', content: <A />, snapPoints: ['120%']});
if (!result.ok) {
  // result.reason === 'invalid-snap-point'
}
```

All reasons are listed in [Error reasons](/reference/errors). Two things *do* throw, because they are programming errors: using a hook outside the provider, and creating a manager with an invalid `maxStackDepth`.

## Dismissal has two phases

When you call `dismiss(id)`, the sheet's phase becomes `dismissing` and the platform animates it away. Only when the platform confirms the close is it removed from the stack and `onDidDismiss` fired. If you present the same id again while it is still animating out, the dismissal is cancelled and the sheet stays.

```text
present()  ──► presented ──dismiss()──► dismissing ──platform done──► removed
                    ▲                        │
                    └──── present(same id) ──┘
```

## Snap points

A snap point is a height the sheet can rest at: `'50%'`, `300` (points), `'small' | 'medium' | 'large' | 'full'`, or `'content'`. Details: [Snap points & sizing](/features/snap-points).
