import {resolveSnapFraction} from './snapPoints';
import type {ActiveSheet, SheetPlacement, SnapPoint} from './types';

/**
 * Platform-neutral description of one surface. Native and web renderers both consume this,
 * so the two platforms cannot drift apart in what a prop means.
 */
export interface SurfaceModel {
  sheetId: string;
  visible: boolean;
  /** Fractions of viewport height. -1 means "size to content". */
  snapFractions: number[];
  snapIndex: number;
  placement: SheetPlacement;
  margin: number;
  anchor: {x: number; y: number; width: number; height: number};

  enableDrag: boolean;
  enableBackdrop: boolean;
  enableKeyboard: boolean;
  enableNestedScroll: boolean;
  /** Tap on the backdrop dismisses; only for modal behaviour. */
  dismissOnBackdrop: boolean;
  hardwareBackDismiss: boolean;

  backgroundColor?: string;
  cornerRadius: number;
  borderWidth: number;
  borderColor?: string;
  shadowRadius: number;
  shadowOpacity: number;
  width: number;
  backdropOpacity: number;
  backdropColor?: string;
  showHandle: boolean;
  handleColor?: string;

  accessibilityLabel?: string;
  /** Duration of open/close motion in milliseconds. */
  animationDurationMs: number;
}

export const DEFAULT_ANIMATION_MS = 250;

/** Builds the surface description for one active sheet. Pure: no React or native access. */
export function describeSurface(
  sheet: Pick<ActiveSheet, 'id' | 'config' | 'snapIndex' | 'phase'>,
  viewportHeight: number,
): SurfaceModel {
  const {config} = sheet;
  const appearance = config.appearance;
  const anchor = config.anchor;
  const snapFractions = config.snapPoints.map((point: SnapPoint) =>
    resolveSnapFraction(point, viewportHeight),
  );

  return {
    sheetId: sheet.id,
    visible: sheet.phase === 'presented',
    snapFractions,
    snapIndex: sheet.snapIndex,
    placement: config.placement,
    margin: config.margin,
    anchor: {
      x: anchor?.x ?? 0,
      y: anchor?.y ?? 0,
      width: anchor?.width ?? 0,
      height: anchor?.height ?? 0,
    },

    enableDrag: config.enableDrag,
    enableBackdrop: config.enableBackdrop,
    enableKeyboard: config.enableKeyboard,
    enableNestedScroll: config.enableNestedScroll,
    dismissOnBackdrop: config.behavior === 'modal',
    hardwareBackDismiss: config.hardwareBackDismiss,

    backgroundColor: appearance?.backgroundColor,
    cornerRadius: appearance?.cornerRadius ?? 16,
    borderWidth: appearance?.borderWidth ?? 0,
    borderColor: appearance?.borderColor,
    shadowRadius: appearance?.shadowRadius ?? 0,
    shadowOpacity: appearance?.shadowOpacity ?? 0,
    width: appearance?.width ?? 0,
    backdropOpacity: appearance?.backdropOpacity ?? 0.4,
    backdropColor: appearance?.backdropColor,
    showHandle: appearance?.showHandle ?? true,
    handleColor: appearance?.handleColor,

    accessibilityLabel: config.accessibilityLabel,
    animationDurationMs: config.animation?.durationMs ?? DEFAULT_ANIMATION_MS,
  };
}

/**
 * Height fraction of the selected snap point, or null when the surface sizes to its content.
 */
export function selectedHeightFraction(model: SurfaceModel): number | null {
  const fraction = model.snapFractions[model.snapIndex] ?? 1;
  return fraction < 0 ? null : fraction;
}
