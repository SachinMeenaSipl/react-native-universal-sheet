import type {ReactNode} from 'react';
import type {StyleProp, TextStyle, ViewStyle} from 'react-native';

/**
 * A sheet height: an absolute value in points, a percentage of the viewport (e.g. '50%'),
 * or a named detent.
 */
export type SnapPoint =
  | number
  | `${number}%`
  | 'content'
  | 'small'
  | 'medium'
  | 'large'
  | 'full';

/** Preset heights from feature.md, used when `snapPoints` is not given. */
export type SheetSizing = 'peek' | 'half' | 'medium' | 'expanded' | 'full';

/** Surface family. Drives defaults; every variant belongs to exactly one group. */
export type SheetGroup = 'modal' | 'sheet' | 'overlay';

/** Where the surface appears on screen. */
export type SheetPlacement =
  | 'center'
  | 'fullScreen'
  | 'floating'
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'anchored';

export type ModalVariant =
  | 'center'
  | 'fullScreen'
  | 'alert'
  | 'popup'
  | 'side'
  | 'top'
  | 'floating';

export type BottomSheetVariant = 'bottomSheet' | 'action' | 'share' | 'picker' | 'filter';

export type OverlayVariant =
  | 'toast'
  | 'snackbar'
  | 'tooltip'
  | 'popover'
  | 'contextMenu'
  | 'dropdown'
  | 'coachmark'
  | 'spotlight'
  | 'loadingOverlay'
  | 'fullScreenViewer'
  | 'inAppNotification';

/** Every presentation type the library supports. */
export type SheetVariant = ModalVariant | BottomSheetVariant | OverlayVariant;

/**
 * How the surface interacts with the screen beneath it:
 * - `modal`: blocks the screen beneath (with backdrop by default).
 * - `nonModal`: the screen beneath stays interactive.
 * - `persistent`: stays visible; excluded from `dismissAll()` and topmost dismissal.
 */
export type SheetBehavior = 'modal' | 'nonModal' | 'persistent';

/** How stacked surfaces relate: `stack` adds on top, `replace` swaps the topmost one out. */
export type SheetPresentation = 'stack' | 'replace';

/** Screen rectangle an anchored overlay points at (tooltip, popover, context menu...). */
export interface AnchorRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SheetAnimation {
  /** `spring` (default) uses damping/stiffness/mass; `timing` uses durationMs. */
  type?: 'spring' | 'timing';
  damping?: number;
  stiffness?: number;
  mass?: number;
  durationMs?: number;
}

export interface SheetAction {
  label: string;
  style?: 'default' | 'destructive' | 'cancel';
  onPress?: () => void;
}

/** Every visual setting of a surface. All fields are optional; defaults come from the platform. */
export interface SheetAppearance {
  /** Surface fill colour. Hex, e.g. '#FFFFFF' or '#FFFFFF80'. */
  backgroundColor?: string;
  /** Corner radius in points, >= 0. Applied on iOS 16+. */
  cornerRadius?: number;
  /** Backdrop dimming, 0..1. Applied on Android; iOS uses the system backdrop. */
  backdropOpacity?: number;
  /** Backdrop tint colour. Hex. */
  backdropColor?: string;
  /** Drag handle visibility. Applied on iOS; not yet on Android. */
  showHandle?: boolean;
  /** Drag handle colour. Hex. */
  handleColor?: string;
  /** Border around the surface, in points, >= 0. */
  borderWidth?: number;
  /** Border colour. Hex. */
  borderColor?: string;
  /** Shadow blur radius in points, >= 0. */
  shadowRadius?: number;
  /** Shadow opacity, 0..1. */
  shadowOpacity?: number;
  /** Fixed surface width in points, > 0. For modals and floating surfaces. Default: automatic. */
  width?: number;
}

/**
 * Style overrides for the parts the library renders around your content. Passed through
 * as React Native style objects, so any valid style property works.
 */
export interface SheetStyles {
  /** Style of the wrapper around your content (padding, flex, background...). */
  contentStyle?: StyleProp<ViewStyle>;
  /** Style of the surface's text-only defaults, e.g. the alert title. */
  titleStyle?: StyleProp<TextStyle>;
  messageStyle?: StyleProp<TextStyle>;
  /** Style of default action buttons (alert, toast actions). */
  buttonStyle?: StyleProp<ViewStyle>;
  buttonTextStyle?: StyleProp<TextStyle>;
}

export interface SheetEvents {
  onWillPresent?: (id: string) => void;
  onDidPresent?: (id: string) => void;
  onWillDismiss?: (id: string) => void;
  onDidDismiss?: (id: string) => void;
  onSnapChange?: (id: string, index: number) => void;
}

export interface SheetConfig extends SheetEvents {
  id: string;
  content: ReactNode;

  /** Presentation type. Default: `bottomSheet`. */
  variant?: SheetVariant;
  /** Side for the `side` variant. Default: `right`. */
  side?: 'left' | 'right';
  /** Stacking strategy when other surfaces are open. Default: `stack`. */
  presentation?: SheetPresentation;
  /** Interaction with the screen beneath. Default: from the variant. */
  behavior?: SheetBehavior;

  /** Preset height. Ignored when `snapPoints` is given. */
  sizing?: SheetSizing;
  snapPoints?: SnapPoint[];
  initialSnapPoint?: SnapPoint;

  enableDrag?: boolean;
  enableBackdrop?: boolean;
  enableKeyboard?: boolean;
  enableNestedScroll?: boolean;
  /** Android back button / hardware back dismisses this surface. Default: true. */
  hardwareBackDismiss?: boolean;

  /** Close automatically after this many milliseconds. */
  autoDismissMs?: number;
  /** Gap from screen edges for floating surfaces, in points. */
  margin?: number;
  /** Required for anchored variants (tooltip, popover, context menu, dropdown, coachmark, spotlight). */
  anchor?: AnchorRect;

  animation?: SheetAnimation;
  appearance?: SheetAppearance;
  styles?: SheetStyles;
  actions?: SheetAction[];
  accessibilityLabel?: string;
}

export type SheetConfigPatch = Partial<
  Omit<SheetConfig, 'id' | 'presentation' | 'variant' | 'behavior' | 'side'>
>;

export type SheetErrorReason =
  | 'invalid-config'
  | 'invalid-snap-point'
  | 'missing-anchor'
  | 'duplicate-id'
  | 'not-found'
  | 'stack-limit-reached'
  | 'replace-in-progress'
  | 'unknown-sheet';

export type SheetResult = {ok: true} | {ok: false; reason: SheetErrorReason};

/** `presented`: visible. `dismissing`: dismissal requested, waiting for native to confirm. */
export type SheetPhase = 'presented' | 'dismissing';

export interface ResolvedSheetConfig extends SheetConfig {
  variant: SheetVariant;
  placement: SheetPlacement;
  behavior: SheetBehavior;
  presentation: SheetPresentation;
  snapPoints: SnapPoint[];
  enableDrag: boolean;
  enableBackdrop: boolean;
  enableKeyboard: boolean;
  enableNestedScroll: boolean;
  hardwareBackDismiss: boolean;
  margin: number;
}

export interface ActiveSheet {
  readonly id: string;
  readonly config: ResolvedSheetConfig;
  readonly snapIndex: number;
  readonly phase: SheetPhase;
}

export type {SheetDefinition, SheetDefaults} from './SheetRegistry';
