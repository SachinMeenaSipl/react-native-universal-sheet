import type {
  SheetBehavior,
  SheetGroup,
  SheetPlacement,
  SheetSizing,
  SheetVariant,
  SnapPoint,
} from './types';

export interface VariantSpec {
  group: SheetGroup;
  placement: SheetPlacement;
  defaultBehavior: SheetBehavior;
  backdrop: boolean;
  drag: boolean;
  nestedScroll: boolean;
  keyboard: boolean;
  hardwareBack: boolean;
  requiresAnchor: boolean;
  defaultAutoDismissMs?: number;
}

const MODAL: VariantSpec = {
  group: 'modal',
  placement: 'center',
  defaultBehavior: 'modal',
  backdrop: true,
  drag: false,
  nestedScroll: true,
  keyboard: true,
  hardwareBack: true,
  requiresAnchor: false,
};

const SHEET: VariantSpec = {
  group: 'sheet',
  placement: 'bottom',
  defaultBehavior: 'modal',
  backdrop: true,
  drag: true,
  nestedScroll: true,
  keyboard: true,
  hardwareBack: true,
  requiresAnchor: false,
};

const OVERLAY: VariantSpec = {
  group: 'overlay',
  placement: 'top',
  defaultBehavior: 'nonModal',
  backdrop: false,
  drag: false,
  nestedScroll: false,
  keyboard: false,
  hardwareBack: true,
  requiresAnchor: false,
};

const ANCHORED: VariantSpec = {...OVERLAY, placement: 'anchored', backdrop: true, requiresAnchor: true};

/** Defaults for every presentation type in feature.md. Overrides are applied per variant. */
export const VARIANTS: Readonly<Record<SheetVariant, VariantSpec>> = {
  // Modals
  center: {...MODAL},
  fullScreen: {...MODAL, placement: 'fullScreen', backdrop: false},
  alert: {...MODAL, nestedScroll: false, keyboard: false},
  popup: {...MODAL, placement: 'floating', backdrop: false, defaultBehavior: 'nonModal'},
  side: {...MODAL, placement: 'right'},
  top: {...MODAL, placement: 'top', drag: true},
  floating: {...MODAL, placement: 'floating', backdrop: false},

  // Bottom sheets (including specialised content presets)
  bottomSheet: {...SHEET},
  action: {...SHEET, nestedScroll: false},
  share: {...SHEET, nestedScroll: false},
  picker: {...SHEET, keyboard: false},
  filter: {...SHEET},

  // Overlays
  toast: {...OVERLAY, placement: 'bottom', defaultAutoDismissMs: 3000},
  snackbar: {...OVERLAY, placement: 'bottom', defaultAutoDismissMs: 4000},
  tooltip: {...ANCHORED},
  popover: {...ANCHORED},
  contextMenu: {...ANCHORED},
  dropdown: {...ANCHORED},
  coachmark: {...ANCHORED},
  spotlight: {...ANCHORED},
  loadingOverlay: {...OVERLAY, placement: 'fullScreen', backdrop: true, defaultBehavior: 'modal', hardwareBack: false},
  fullScreenViewer: {...OVERLAY, placement: 'fullScreen', backdrop: true, drag: true, defaultBehavior: 'modal'},
  inAppNotification: {...OVERLAY, placement: 'top', defaultAutoDismissMs: 5000},
};

export const isSheetVariant = (value: unknown): value is SheetVariant =>
  typeof value === 'string' && Object.prototype.hasOwnProperty.call(VARIANTS, value);

/** feature.md sizing presets, as fractions of screen height. */
export const SIZING_SNAP_POINTS: Readonly<Record<SheetSizing, SnapPoint>> = {
  peek: '15%',
  half: '50%',
  medium: '70%',
  expanded: '90%',
  full: '100%',
};

/** Default gap from screen edges for floating placements, in points. */
export const DEFAULT_FLOATING_MARGIN = 16;
