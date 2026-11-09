import type {SnapPoint} from './types';

/** Sentinel fraction meaning "size to content". */
export const CONTENT_SNAP_FRACTION = -1;

const NAMED_FRACTIONS: Readonly<Record<'small' | 'medium' | 'large' | 'full', number>> = {
  small: 0.25,
  medium: 0.5,
  large: 0.9,
  full: 1,
};

const PERCENT_RE = /^(\d+(?:\.\d+)?)%$/;

export function isValidSnapPoint(point: SnapPoint): boolean {
  if (typeof point === 'number') {
    return Number.isFinite(point) && point > 0;
  }
  if (typeof point !== 'string') {
    return false;
  }
  if (point === 'content') {
    return true;
  }
  if (Object.prototype.hasOwnProperty.call(NAMED_FRACTIONS, point)) {
    return true;
  }
  const match = PERCENT_RE.exec(point);
  if (match) {
    const value = Number(match[1]);
    return value > 0 && value <= 100;
  }
  return false;
}

/**
 * Converts a snap point into a fraction of the viewport height (0..1), or
 * CONTENT_SNAP_FRACTION for content-sized sheets. Absolute numbers are clamped to 1.
 */
export function resolveSnapFraction(point: SnapPoint, viewportHeight: number): number {
  if (point === 'content') {
    return CONTENT_SNAP_FRACTION;
  }
  if (typeof point === 'number') {
    return Math.min(1, point / Math.max(viewportHeight, 1));
  }
  const percent = PERCENT_RE.exec(point);
  if (percent) {
    return Number(percent[1]) / 100;
  }
  return NAMED_FRACTIONS[point as keyof typeof NAMED_FRACTIONS];
}
