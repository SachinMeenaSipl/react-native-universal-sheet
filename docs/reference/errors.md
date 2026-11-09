---
description: Every SheetErrorReason returned by react-native-universal-sheet - invalid-config, invalid-snap-point, duplicate-id, stack-limit-reached and more - with causes and fixes.
---

# Error reasons

Methods return `{ok: false, reason}` instead of throwing.

| Reason | Returned by | Cause | Fix |
| --- | --- | --- | --- |
| `invalid-config` | `present`, `update`, `replace` | Empty id; unknown `variant`, `presentation`, `behavior`, `side` or `sizing`; empty `snapPoints`; bad `appearance` value (non-hex colour, out-of-range number); `animation` value ≤ 0; `autoDismissMs` ≤ 0; negative `margin`; non-finite `anchor`; `replace` with a different id | Check the values against [Appearance](/features/appearance#validation) and the [API](/reference/api#sheetconfig) |
| `invalid-snap-point` | `present`, `update`, `replace`, `snapTo` | Snap point ≤ 0 or > 100%, duplicate snap points, `initialSnapPoint` not in `snapPoints`, or `snapTo` with a point not in the list | See [Snap points](/features/snap-points#rules) |
| `missing-anchor` | `present` | Anchored variant without `anchor` | Measure the trigger view and pass `anchor` |
| `duplicate-id` | `present`, `presentNamed` | A sheet with that id is open (or waiting to replace) | Use a different id, or `update` the existing sheet |
| `not-found` | `dismiss`, `update`, `replace`, `snapTo`, `expand`, `collapse` | No open sheet with that id (or nothing to dismiss) | Check `isPresented(id)` first, or ignore |
| `stack-limit-reached` | `present` | `maxStackDepth` sheets are already open | Close one, use `presentation: 'replace'`, or raise `maxStackDepth` |
| `replace-in-progress` | `present` with `replace` | A previous replace is still waiting for its sheet to close | Wait for `onDidDismiss`, or use `update` |
| `unknown-sheet` | `presentNamed` | The name isn't registered | Register it in the [`SheetRegistry`](/components/sheet-registry) |

## Errors that throw

These are programming errors, so they throw immediately:

| Message | Cause |
| --- | --- |
| `useNativeSheet() must be used inside <NativeSheetProvider>.` | A hook or `NativeSheet` is rendered outside the provider |
| `maxStackDepth must be an integer >= 1.` | Invalid `maxStackDepth` on the provider or `SheetManager` |
| `Sheet name must be a non-empty string.` | `registry.register('')` |

## Logging failures in development

```ts
const result = sheet.present(config);
if (__DEV__ && !result.ok) {
  console.warn(`[sheet] ${config.id}: ${result.reason}`);
}
```
