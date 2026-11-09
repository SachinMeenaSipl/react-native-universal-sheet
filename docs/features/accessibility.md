---
description: Accessibility in react-native-universal-sheet - screen reader labels, dialog roles on the web, and tips for accessible bottom sheets and alerts in React Native.
---

# Accessibility

## Labels

Give every sheet a label so screen readers announce it:

```tsx
sheet.present({
  id: 'filters',
  content: <Filters />,
  accessibilityLabel: 'Filters',
});
```

`presentAlert` uses the title as the label, and `presentToast` uses the message.

## What each platform provides

| | iOS | Android | Web |
| --- | --- | --- | --- |
| System sheet semantics (VoiceOver / TalkBack focus moves into the sheet) | ✅ | ✅ | — |
| `accessibilityLabel` on the content | ✅ | ✅ | ✅ `aria-label` |
| `role="dialog"`, `aria-modal` when there is a backdrop | — | — | ✅ |
| Escape / back closes the topmost sheet | — | ✅ | ✅ |
| Reduce-motion respected | ✅ system animation | ✅ system animation | — |

## Tips

- Always provide a visible **Close** button when `enableDrag` is `false`, because there is no gesture to close the sheet.
- Alert buttons get `accessibilityRole="button"` and their label automatically.
- Toasts disappear on their own. Keep important messages in an alert or snackbar with an action, or give them a longer `durationMs`.
- Keep focusable content inside `contentStyle` padding so it isn't hidden behind the drag handle.
