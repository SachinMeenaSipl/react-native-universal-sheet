import {definedOnly, indexOfInitialSnap, resolveConfig} from './config';
import {SheetRegistry} from './SheetRegistry';
import type {
  ActiveSheet,
  ResolvedSheetConfig,
  SheetConfig,
  SheetConfigPatch,
  SheetErrorReason,
  SheetResult,
  SnapPoint,
} from './types';

export const DEFAULT_MAX_STACK_DEPTH = 5;

const OK: SheetResult = {ok: true};
const fail = (reason: SheetErrorReason): SheetResult => ({ok: false, reason});

/** Timer source. Injected so tests can drive auto-dismiss without real time passing. */
export interface Scheduler {
  setTimeout(callback: () => void, ms: number): unknown;
  clearTimeout(handle: unknown): void;
}

const defaultScheduler: Scheduler = {
  setTimeout: (callback, ms) => globalThis.setTimeout(callback, ms),
  clearTimeout: handle => globalThis.clearTimeout(handle as ReturnType<typeof setTimeout>),
};

export interface SheetManagerOptions {
  /** Maximum number of simultaneously presented surfaces. Default 5. */
  maxStackDepth?: number;
  registry?: SheetRegistry;
  scheduler?: Scheduler;
}

export interface PresentNamedOptions extends Partial<Omit<SheetConfig, 'id' | 'content'>> {
  id: string;
  props?: unknown;
}

export interface DismissAllOptions {
  /** Also dismiss `persistent` surfaces. Default false. */
  includePersistent?: boolean;
}

/**
 * Owns the ordered stack of presented surfaces (bottom to top). It is a plain JS store:
 * React subscribes through `subscribe` / `getSnapshot`, and the native host reports back
 * through the `handleNative*` methods.
 *
 * Dismissal is two-phase: `dismiss()` marks a surface as `dismissing` and the native host
 * animates it away; it is removed only once native reports `onDismiss`.
 */
export class SheetManager {
  readonly maxStackDepth: number;
  readonly registry: SheetRegistry;

  private entries: ActiveSheet[] = [];
  private pending: ResolvedSheetConfig | null = null;
  private snapshot: ReadonlyArray<ActiveSheet> = [];
  private readonly listeners = new Set<() => void>();
  private readonly timers = new Map<string, unknown>();
  private readonly scheduler: Scheduler;

  constructor(options: SheetManagerOptions = {}) {
    const depth = options.maxStackDepth ?? DEFAULT_MAX_STACK_DEPTH;
    if (!Number.isInteger(depth) || depth < 1) {
      throw new Error('[react-native-universal-sheet] maxStackDepth must be an integer >= 1.');
    }
    this.maxStackDepth = depth;
    this.registry = options.registry ?? new SheetRegistry();
    this.scheduler = options.scheduler ?? defaultScheduler;
  }

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = (): ReadonlyArray<ActiveSheet> => this.snapshot;

  getActive(): ReadonlyArray<ActiveSheet> {
    return this.snapshot;
  }

  getSheet(id: string): ActiveSheet | undefined {
    return this.find(id);
  }

  isPresented(id: string): boolean {
    return this.find(id)?.phase === 'presented';
  }

  // ---- Presentation -------------------------------------------------------

  present(input: SheetConfig): SheetResult {
    const resolved = resolveConfig(input);
    if (!resolved.ok) {
      return fail(resolved.reason);
    }
    const config = resolved.config;

    const existing = this.find(config.id);
    if (existing) {
      if (existing.phase === 'dismissing') {
        // Presenting an id that is animating out cancels the dismissal. This keeps
        // React StrictMode's effect replay (present -> cleanup -> present) correct.
        this.swapConfig(existing, config, indexOfInitialSnap(config), 'presented');
        return OK;
      }
      return fail('duplicate-id');
    }
    if (this.pending?.id === config.id) {
      return fail('duplicate-id');
    }

    if (config.presentation === 'replace' && this.entries.length > 0) {
      if (this.pending) {
        return fail('replace-in-progress');
      }
      this.pending = config;
      const top = this.topmostActive({skipPersistent: false});
      if (top) {
        this.beginDismiss(top);
      }
      return OK;
    }

    if (this.entries.length >= this.maxStackDepth) {
      return fail('stack-limit-reached');
    }
    this.push(config);
    return OK;
  }

  presentNamed(name: string, options: PresentNamedOptions): SheetResult {
    const definition = this.registry.get(name);
    if (!definition) {
      return fail('unknown-sheet');
    }
    const {id, props, ...overrides} = options;
    const {render, ...defaults} = definition;
    return this.present({
      ...defaults,
      ...definedOnly(overrides),
      id,
      content: render(props),
    });
  }

  /** Merges a patch into a presented surface without re-presenting it. */
  update(id: string, patch: SheetConfigPatch): SheetResult {
    const entry = this.find(id);
    if (!entry) {
      return fail('not-found');
    }
    const selected = entry.config.snapPoints[entry.snapIndex];
    const nextPoints = patch.snapPoints ?? entry.config.snapPoints;
    const merged: SheetConfig = {
      ...entry.config,
      ...definedOnly(patch),
      id,
      // Keep the currently selected detent when it still exists after the patch.
      initialSnapPoint:
        patch.initialSnapPoint ?? (nextPoints.includes(selected) ? selected : undefined),
    };
    const resolved = resolveConfig(merged);
    if (!resolved.ok) {
      return fail(resolved.reason);
    }
    this.swapConfig(entry, resolved.config, indexOfInitialSnap(resolved.config), entry.phase);
    return OK;
  }

  /**
   * Swaps a surface's content and config in place. The native presentation is kept, so
   * no animation occurs; the previous content unmounts.
   */
  replace(id: string, config: SheetConfig): SheetResult {
    const entry = this.find(id);
    if (!entry) {
      return fail('not-found');
    }
    if (config.id !== id) {
      return fail('invalid-config');
    }
    const resolved = resolveConfig(config);
    if (!resolved.ok) {
      return fail(resolved.reason);
    }
    this.swapConfig(entry, resolved.config, indexOfInitialSnap(resolved.config), entry.phase);
    return OK;
  }

  // ---- Dismissal ----------------------------------------------------------

  /**
   * Dismisses a surface. Without an id, dismisses the topmost non-persistent surface.
   */
  dismiss(id?: string): SheetResult {
    const target = id === undefined ? this.topmostActive({skipPersistent: true}) : this.find(id);
    if (!target) {
      return fail('not-found');
    }
    if (target.phase === 'presented') {
      this.beginDismiss(target);
    }
    return OK;
  }

  /** Dismisses surfaces topmost first. Persistent surfaces stay unless `includePersistent` is set. */
  dismissAll(options: DismissAllOptions = {}): SheetResult {
    this.pending = null;
    for (const entry of [...this.entries].reverse()) {
      if (entry.phase !== 'presented') {
        continue;
      }
      if (entry.config.behavior === 'persistent' && !options.includePersistent) {
        continue;
      }
      this.beginDismiss(entry);
    }
    return OK;
  }

  // ---- Snap points --------------------------------------------------------

  snapTo(id: string, point: SnapPoint): SheetResult {
    const entry = this.find(id);
    if (!entry) {
      return fail('not-found');
    }
    const index = entry.config.snapPoints.indexOf(point);
    if (index < 0) {
      return fail('invalid-snap-point');
    }
    this.setSnapIndex(entry, index);
    return OK;
  }

  expand(id: string): SheetResult {
    const entry = this.find(id);
    if (!entry) {
      return fail('not-found');
    }
    this.setSnapIndex(entry, entry.config.snapPoints.length - 1);
    return OK;
  }

  collapse(id: string): SheetResult {
    const entry = this.find(id);
    if (!entry) {
      return fail('not-found');
    }
    this.setSnapIndex(entry, 0);
    return OK;
  }

  // ---- Native callbacks ---------------------------------------------------

  handleNativePresented(id: string): void {
    this.find(id)?.config.onDidPresent?.(id);
  }

  /**
   * Called when native finishes a dismissal, whether it was requested by JS or by a
   * gesture. Idempotent: unknown ids are ignored.
   */
  handleNativeDismiss(id: string): void {
    const entry = this.find(id);
    if (!entry) {
      return;
    }
    this.clearTimer(id);
    if (entry.phase === 'presented') {
      entry.config.onWillDismiss?.(id);
    }
    this.entries = this.entries.filter(e => e.id !== id);
    entry.config.onDidDismiss?.(id);

    const next = this.pending;
    if (next && !this.entries.some(e => e.phase === 'dismissing')) {
      this.pending = null;
      this.push(next);
      return;
    }
    this.commit();
  }

  handleNativeSnapChange(id: string, index: number): void {
    const entry = this.find(id);
    if (!entry || index < 0 || index >= entry.config.snapPoints.length) {
      return;
    }
    this.setSnapIndex(entry, index);
  }

  // ---- Internals ----------------------------------------------------------

  private find(id: string): ActiveSheet | undefined {
    return this.entries.find(e => e.id === id);
  }

  private topmostActive(options: {skipPersistent: boolean}): ActiveSheet | undefined {
    for (let i = this.entries.length - 1; i >= 0; i--) {
      const entry = this.entries[i];
      if (entry.phase !== 'presented') {
        continue;
      }
      if (options.skipPersistent && entry.config.behavior === 'persistent') {
        continue;
      }
      return entry;
    }
    return undefined;
  }

  private push(config: ResolvedSheetConfig): void {
    config.onWillPresent?.(config.id);
    this.entries = [
      ...this.entries,
      {id: config.id, config, snapIndex: indexOfInitialSnap(config), phase: 'presented'},
    ];
    this.scheduleAutoDismiss(config);
    this.commit();
  }

  private beginDismiss(entry: ActiveSheet): void {
    this.clearTimer(entry.id);
    this.replaceEntry({...entry, phase: 'dismissing'});
    entry.config.onWillDismiss?.(entry.id);
    this.commit();
  }

  private setSnapIndex(entry: ActiveSheet, index: number): void {
    if (entry.snapIndex === index) {
      return;
    }
    this.replaceEntry({...entry, snapIndex: index});
    entry.config.onSnapChange?.(entry.id, index);
    this.commit();
  }

  private swapConfig(
    entry: ActiveSheet,
    config: ResolvedSheetConfig,
    snapIndex: number,
    phase: ActiveSheet['phase'],
  ): void {
    this.replaceEntry({...entry, config, snapIndex, phase});
    this.clearTimer(entry.id);
    if (phase === 'presented') {
      this.scheduleAutoDismiss(config);
    }
    this.commit();
  }

  private scheduleAutoDismiss(config: ResolvedSheetConfig): void {
    if (config.autoDismissMs === undefined) {
      return;
    }
    const id = config.id;
    const handle = this.scheduler.setTimeout(() => {
      this.timers.delete(id);
      this.dismiss(id);
    }, config.autoDismissMs);
    this.timers.set(id, handle);
  }

  private clearTimer(id: string): void {
    const handle = this.timers.get(id);
    if (handle !== undefined) {
      this.scheduler.clearTimeout(handle);
      this.timers.delete(id);
    }
  }

  private replaceEntry(next: ActiveSheet): void {
    this.entries = this.entries.map(e => (e.id === next.id ? next : e));
  }

  private commit(): void {
    this.snapshot = this.entries;
    for (const listener of this.listeners) {
      listener();
    }
  }
}
