import {DEFAULT_FLOATING_MARGIN, SIZING_SNAP_POINTS, VARIANTS, isSheetVariant} from './variants';
import {isValidSnapPoint} from './snapPoints';
import type {
  ResolvedSheetConfig,
  SheetAnimation,
  SheetAppearance,
  SheetBehavior,
  SheetConfig,
  SheetErrorReason,
  SheetPlacement,
  SheetPresentation,
  SheetSizing,
  SnapPoint,
} from './types';

export type ResolveResult =
  | {ok: true; config: ResolvedSheetConfig}
  | {ok: false; reason: SheetErrorReason};

const PRESENTATIONS: ReadonlyArray<SheetPresentation> = ['stack', 'replace'];
const BEHAVIORS: ReadonlyArray<SheetBehavior> = ['modal', 'nonModal', 'persistent'];
const SIZINGS: ReadonlyArray<SheetSizing> = ['peek', 'half', 'medium', 'expanded', 'full'];

const invalid = (reason: SheetErrorReason): ResolveResult => ({ok: false, reason});
const isPositive = (value: number) => Number.isFinite(value) && value > 0;
const isNonNegative = (value: number) => Number.isFinite(value) && value >= 0;

const HEX_COLOR = /^#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const isUnit = (value: number) => Number.isFinite(value) && value >= 0 && value <= 1;

const COLOR_KEYS = ['backgroundColor', 'backdropColor', 'handleColor', 'borderColor'] as const;
const NON_NEGATIVE_KEYS = ['cornerRadius', 'borderWidth', 'shadowRadius'] as const;

/** Checks every appearance value. Colours must be hex; numbers must be in range. */
export function validateAppearance(appearance: SheetAppearance | undefined): boolean {
  if (!appearance) {
    return true;
  }
  for (const key of COLOR_KEYS) {
    const value = appearance[key];
    if (value !== undefined && !HEX_COLOR.test(value)) {
      return false;
    }
  }
  for (const key of NON_NEGATIVE_KEYS) {
    const value = appearance[key];
    if (value !== undefined && !isNonNegative(value)) {
      return false;
    }
  }
  if (appearance.backdropOpacity !== undefined && !isUnit(appearance.backdropOpacity)) {
    return false;
  }
  if (appearance.shadowOpacity !== undefined && !isUnit(appearance.shadowOpacity)) {
    return false;
  }
  if (appearance.width !== undefined && !isPositive(appearance.width)) {
    return false;
  }
  return true;
}

function validateAnimation(animation: SheetAnimation | undefined): boolean {
  if (!animation) {
    return true;
  }
  const positives = [animation.damping, animation.stiffness, animation.mass, animation.durationMs];
  return positives.every(value => value === undefined || isPositive(value));
}

/**
 * Validates a config and fills in defaults from its variant. Pure: no React or native access.
 */
export function resolveConfig(input: SheetConfig): ResolveResult {
  if (typeof input.id !== 'string' || input.id.length === 0) {
    return invalid('invalid-config');
  }

  const variant = input.variant ?? 'bottomSheet';
  if (!isSheetVariant(variant)) {
    return invalid('invalid-config');
  }
  const spec = VARIANTS[variant];

  const presentation = input.presentation ?? 'stack';
  if (!PRESENTATIONS.includes(presentation)) {
    return invalid('invalid-config');
  }

  const behavior = input.behavior ?? spec.defaultBehavior;
  if (!BEHAVIORS.includes(behavior)) {
    return invalid('invalid-config');
  }

  let placement: SheetPlacement = spec.placement;
  if (variant === 'side') {
    if (input.side !== undefined && input.side !== 'left' && input.side !== 'right') {
      return invalid('invalid-config');
    }
    placement = input.side ?? 'right';
  }

  if (input.sizing !== undefined && !SIZINGS.includes(input.sizing)) {
    return invalid('invalid-config');
  }
  const snapPoints: SnapPoint[] = input.snapPoints
    ? [...input.snapPoints]
    : [input.sizing ? SIZING_SNAP_POINTS[input.sizing] : 'large'];
  if (snapPoints.length === 0) {
    return invalid('invalid-config');
  }
  if (!snapPoints.every(point => isValidSnapPoint(point))) {
    return invalid('invalid-snap-point');
  }
  if (new Set(snapPoints).size !== snapPoints.length) {
    return invalid('invalid-snap-point');
  }
  if (input.initialSnapPoint !== undefined && !snapPoints.includes(input.initialSnapPoint)) {
    return invalid('invalid-snap-point');
  }

  if (spec.requiresAnchor && !input.anchor) {
    return invalid('missing-anchor');
  }
  if (input.anchor) {
    const {x, y, width, height} = input.anchor;
    if (![x, y].every(Number.isFinite) || !isNonNegative(width) || !isNonNegative(height)) {
      return invalid('invalid-config');
    }
  }

  if (input.autoDismissMs !== undefined && !isPositive(input.autoDismissMs)) {
    return invalid('invalid-config');
  }
  const autoDismissMs = input.autoDismissMs ?? spec.defaultAutoDismissMs;

  const margin =
    input.margin ?? (placement === 'floating' ? DEFAULT_FLOATING_MARGIN : 0);
  if (!isNonNegative(margin)) {
    return invalid('invalid-config');
  }

  if (!validateAppearance(input.appearance) || !validateAnimation(input.animation)) {
    return invalid('invalid-config');
  }

  // Non-modal and persistent surfaces leave the screen beneath interactive, so no backdrop by default.
  const defaultBackdrop = behavior === 'modal' ? spec.backdrop : false;

  const config: ResolvedSheetConfig = {
    ...input,
    variant,
    placement,
    behavior,
    presentation,
    snapPoints,
    enableDrag: input.enableDrag ?? spec.drag,
    enableBackdrop: input.enableBackdrop ?? defaultBackdrop,
    enableKeyboard: input.enableKeyboard ?? spec.keyboard,
    enableNestedScroll: input.enableNestedScroll ?? spec.nestedScroll,
    hardwareBackDismiss: input.hardwareBackDismiss ?? spec.hardwareBack,
    margin,
    autoDismissMs,
  };
  return {ok: true, config};
}

/** Index of the initial snap point within the resolved config. */
export function indexOfInitialSnap(config: ResolvedSheetConfig): number {
  const initial = config.initialSnapPoint ?? config.snapPoints[0];
  return Math.max(0, config.snapPoints.indexOf(initial));
}

/** Drops keys whose value is undefined, so optional props never overwrite defaults. */
export function definedOnly<T extends object>(value: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter(([, v]) => v !== undefined),
  ) as Partial<T>;
}
