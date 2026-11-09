---
description: Complete API reference for react-native-universal-sheet - every export, SheetConfig option, type, and default value.
---

# API reference

Everything is imported from the package root:

```ts
import {
  NativeSheetProvider, NativeSheet, NativeModal,
  useNativeSheet, useSheetState,
  presentAlert, presentToast,
  SheetManager, SheetRegistry, DEFAULT_MAX_STACK_DEPTH,
  VARIANTS, SIZING_SNAP_POINTS,
  resolveSnapFraction, isValidSnapPoint, CONTENT_SNAP_FRACTION,
} from 'react-native-universal-sheet';
```

## Exports

| Export | Kind | Page |
| --- | --- | --- |
| `NativeSheetProvider` | component | [NativeSheetProvider](/components/native-sheet-provider) |
| `NativeSheet` | component | [NativeSheet](/components/native-sheet) |
| `NativeModal` | component | [NativeModal](/components/native-modal) |
| `useNativeSheet()` | hook | [useNativeSheet](/components/use-native-sheet) |
| `useSheetState(id)` | hook | [useSheetState](/components/use-sheet-state) |
| `presentAlert(manager, options)` | function | [presentAlert](/components/present-alert) |
| `presentToast(manager, options)` | function | [presentToast](/components/present-toast) |
| `SheetManager` | class | [SheetManager](/components/sheet-manager) |
| `SheetRegistry` | class | [SheetRegistry](/components/sheet-registry) |
| `DEFAULT_MAX_STACK_DEPTH` | `5` | |
| `VARIANTS` | `Record<SheetVariant, VariantSpec>` | [Sheet types](/features/variants) |
| `SIZING_SNAP_POINTS` | `Record<SheetSizing, SnapPoint>` | [Snap points](/features/snap-points#sizing-presets) |
| `resolveSnapFraction(point, viewportHeight)` | function | Snap point → fraction of height (`-1` for content) |
| `isValidSnapPoint(point)` | function | Validates one snap point |
| `CONTENT_SNAP_FRACTION` | `-1` | |

## `SheetConfig`

The object passed to `present()`. `NativeSheet` takes the same options as props (without `id`/`content`, which it fills in).

| Option | Type | Default |
| --- | --- | --- |
| `id` | `string` | **required**, non-empty, unique among open sheets |
| `content` | `ReactNode` | **required** |
| `variant` | `SheetVariant` | `'bottomSheet'` |
| `presentation` | `'stack' \| 'replace'` | `'stack'` |
| `behavior` | `'modal' \| 'nonModal' \| 'persistent'` | from variant |
| `side` | `'left' \| 'right'` | `'right'` (only `side` variant) |
| `snapPoints` | `SnapPoint[]` | `[SIZING_SNAP_POINTS[sizing]]` or `['large']` |
| `initialSnapPoint` | `SnapPoint` | first snap point |
| `sizing` | `'peek' \| 'half' \| 'medium' \| 'expanded' \| 'full'` | — |
| `enableDrag` | `boolean` | from variant |
| `enableBackdrop` | `boolean` | variant value if modal, else `false` |
| `enableKeyboard` | `boolean` | from variant |
| `enableNestedScroll` | `boolean` | from variant |
| `hardwareBackDismiss` | `boolean` | from variant (`true` except `loadingOverlay`) |
| `autoDismissMs` | `number > 0` | from variant |
| `margin` | `number ≥ 0` | `16` for floating placements, else `0` |
| `anchor` | `AnchorRect` | required for anchored variants |
| `animation` | `SheetAnimation` | — |
| `appearance` | `SheetAppearance` | — |
| `styles` | `SheetStyles` | — |
| `actions` | `SheetAction[]` | — |
| `accessibilityLabel` | `string` | — |
| `onWillPresent` | `(id) => void` | — |
| `onDidPresent` | `(id) => void` | — |
| `onWillDismiss` | `(id) => void` | — |
| `onDidDismiss` | `(id) => void` | — |
| `onSnapChange` | `(id, index) => void` | — |

## Types

```ts
type SnapPoint = number | `${number}%` | 'content' | 'small' | 'medium' | 'large' | 'full';

type SheetSizing = 'peek' | 'half' | 'medium' | 'expanded' | 'full';

type ModalVariant = 'center' | 'fullScreen' | 'alert' | 'popup' | 'side' | 'top' | 'floating';
type BottomSheetVariant = 'bottomSheet' | 'action' | 'share' | 'picker' | 'filter';
type OverlayVariant =
  | 'toast' | 'snackbar' | 'tooltip' | 'popover' | 'contextMenu' | 'dropdown'
  | 'coachmark' | 'spotlight' | 'loadingOverlay' | 'fullScreenViewer' | 'inAppNotification';
type SheetVariant = ModalVariant | BottomSheetVariant | OverlayVariant;

type SheetBehavior = 'modal' | 'nonModal' | 'persistent';
type SheetPresentation = 'stack' | 'replace';

interface AnchorRect { x: number; y: number; width: number; height: number }

interface SheetAnimation {
  type?: 'spring' | 'timing';
  damping?: number;
  stiffness?: number;
  mass?: number;
  durationMs?: number;
}

interface SheetAction {
  label: string;
  style?: 'default' | 'destructive' | 'cancel';
  onPress?: () => void;
}

interface SheetAppearance {
  backgroundColor?: string;   // '#RRGGBB' or '#RRGGBBAA'
  cornerRadius?: number;      // >= 0
  backdropOpacity?: number;   // 0..1
  backdropColor?: string;
  showHandle?: boolean;
  handleColor?: string;
  borderWidth?: number;       // >= 0
  borderColor?: string;
  shadowRadius?: number;      // >= 0
  shadowOpacity?: number;     // 0..1
  width?: number;             // > 0
}

interface SheetStyles {
  contentStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  messageStyle?: StyleProp<TextStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  buttonTextStyle?: StyleProp<TextStyle>;
}

type SheetConfigPatch = Partial<Omit<SheetConfig, 'id' | 'presentation' | 'variant' | 'behavior' | 'side'>>;

type SheetErrorReason =
  | 'invalid-config' | 'invalid-snap-point' | 'missing-anchor' | 'duplicate-id'
  | 'not-found' | 'stack-limit-reached' | 'replace-in-progress' | 'unknown-sheet';

type SheetResult = {ok: true} | {ok: false; reason: SheetErrorReason};

interface ActiveSheet {
  readonly id: string;
  readonly config: ResolvedSheetConfig; // SheetConfig with every default filled in
  readonly snapIndex: number;
  readonly phase: 'presented' | 'dismissing';
}
```

Other exported types: `NativeSheetProviderProps`, `NativeSheetProps`, `SheetOptions`, `NativeModalProps`, `AlertOptions`, `ToastOptions`, `SheetManagerOptions`, `PresentNamedOptions`, `DismissAllOptions`, `Scheduler`, `SheetDefinition`, `SheetDefaults`, `VariantSpec`, `SheetGroup`, `SheetPlacement`, `SheetEvents`, `SheetPhase`, `ResolvedSheetConfig`.
