---
description: Sheet lifecycle events in react-native-universal-sheet - onWillPresent, onDidPresent, onWillDismiss, onDidDismiss and onSnapChange, and when each one fires.
---

# Events

Pass callbacks in the sheet config. Each receives the sheet id.

| Event | Fires |
| --- | --- |
| `onWillPresent(id)` | Just before the sheet is added to the stack |
| `onDidPresent(id)` | When the platform has finished showing it |
| `onWillDismiss(id)` | When closing starts: `dismiss()`, auto-dismiss, back button, or a user swipe |
| `onDidDismiss(id)` | After it is gone, for **any** reason |
| `onSnapChange(id, index)` | It moved to another snap point, by drag or by code |

```tsx
sheet.present({
  id: 'filters',
  content: <Filters />,
  snapPoints: ['40%', '90%'],
  onWillPresent: id => analytics.track('sheet_open', {id}),
  onDidDismiss: id => applyFilters(),
  onSnapChange: (id, index) => setExpanded(index === 1),
});
```

## Order

```text
present()            → onWillPresent → (platform shows) → onDidPresent
snapTo()/drag        → onSnapChange
dismiss()/swipe      → onWillDismiss → (platform hides) → onDidDismiss
```

`onDidDismiss` always fires once per presentation, so it's the right place to clean up and to set `visible` back to `false`.

## On `NativeSheet`

`NativeSheet` uses shorter names without the id:

| `NativeSheet` prop | Equivalent |
| --- | --- |
| `onPresent()` | `onDidPresent` |
| `onDismiss()` | `onDidDismiss` |
| `onSnapChange(index)` | `onSnapChange` |
