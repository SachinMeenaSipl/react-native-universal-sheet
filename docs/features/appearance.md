---
description: Customize React Native sheets - background colour, corner radius, border, shadow, backdrop, drag handle and width, plus React Native styles for content, titles and buttons.
---

# Appearance & styles

Two props control the look:

- `appearance`: the **surface** (fill, corners, border, shadow, backdrop, handle, width). Drawn natively.
- `styles`: React Native **styles** for the parts rendered in JavaScript (your content wrapper, alert title, buttons).

```tsx
sheet.present({
  id: 'styled',
  content: <Content />,
  snapPoints: ['50%', '90%'],
  appearance: {
    backgroundColor: '#FFF8F0',
    cornerRadius: 28,
    borderWidth: 1,
    borderColor: '#E0B98F',
    shadowRadius: 16,
    shadowOpacity: 0.25,
    backdropColor: '#000000',
    backdropOpacity: 0.5,
    showHandle: true,
    handleColor: '#C2703D',
  },
  styles: {
    contentStyle: {padding: 20, gap: 12},
  },
});
```

## `appearance` (surface design)

| Prop | Type | Default | iOS | Android | Web |
| --- | --- | --- | --- | --- | --- |
| `backgroundColor` | hex | system background / white | ✅ | ✅ | ✅ |
| `cornerRadius` | number ≥ 0 | `16` | ✅ iOS 16+ | ✅ | ✅ |
| `borderWidth` | number ≥ 0 | `0` | ✅ | ✅ | ✅ |
| `borderColor` | hex | — | ✅ | ✅ | ✅ |
| `shadowRadius` | number ≥ 0 | `0` | ✅ | — | ✅ |
| `shadowOpacity` | 0–1 | `0` | ✅ | — | ✅ |
| `backdropOpacity` | 0–1 | `0.4` | system | ✅ | ✅ |
| `backdropColor` | hex | black | system | — | ✅ |
| `showHandle` | boolean | `true` | ✅ | — | ✅ bottom sheets |
| `handleColor` | hex | system grey | — | — | ✅ |
| `width` | number > 0 | automatic | — | — | ✅ |

"—" means the value is accepted and stored but not drawn on that platform yet. "system" means the platform's own backdrop is used.

### Colours

Colours must be hex with 6 or 8 digits: `#RRGGBB` or `#RRGGBBAA`.

```tsx
appearance: {backgroundColor: '#FFFFFFCC'} // white at 80% opacity
```

Named colours (`'white'`), `rgb()` and 3-digit hex are rejected: `present()` returns `invalid-config` instead of guessing.

### Validation

| Rule | Props |
| --- | --- |
| Hex colour | `backgroundColor`, `backdropColor`, `handleColor`, `borderColor` |
| ≥ 0 | `cornerRadius`, `borderWidth`, `shadowRadius` |
| 0–1 | `backdropOpacity`, `shadowOpacity` |
| > 0 | `width` |

## `styles` (content design)

Any React Native style, applied to the parts rendered in JavaScript.

| Prop | Applies to |
| --- | --- |
| `contentStyle` | The view wrapping your content (padding, gap, background, flex…) |
| `titleStyle` | Alert title |
| `messageStyle` | Alert message, toast text |
| `buttonStyle` | Alert buttons |
| `buttonTextStyle` | Alert button text |

```tsx
styles: {
  contentStyle: {paddingHorizontal: 24, paddingBottom: 32},
}
```

The content wrapper has `flex: 1` by default, so `contentStyle` is the place for padding rather than an extra wrapping `View`.

## Theming

There is no theme provider; build the props from your own theme:

```tsx
function useSheetAppearance(): SheetAppearance {
  const dark = useColorScheme() === 'dark';
  return dark
    ? {backgroundColor: '#1C1C1E', handleColor: '#48484A', borderColor: '#2C2C2E', borderWidth: 1}
    : {backgroundColor: '#FFFFFF', handleColor: '#C7C7CC'};
}

const appearance = useSheetAppearance();
sheet.present({id: 'x', content: <X />, appearance});
```

For named sheets, put the shared appearance in each [registry definition](/components/sheet-registry).
