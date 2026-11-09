import {resolveConfig, validateAppearance} from '../config';
import {SheetManager} from '../SheetManager';
import {SIZING_SNAP_POINTS, VARIANTS} from '../variants';
import type {SheetConfig, SheetVariant} from '../types';

const base = (extra: Partial<SheetConfig> = {}): SheetConfig => ({id: 'x', content: 'c', ...extra});

const ALL_VARIANTS = Object.keys(VARIANTS) as SheetVariant[];

describe('variant coverage (feature.md)', () => {
  it('defines all 23 presentation types', () => {
    expect(ALL_VARIANTS.sort()).toEqual(
      [
        'action', 'alert', 'bottomSheet', 'center', 'contextMenu', 'coachmark', 'dropdown',
        'filter', 'floating', 'fullScreen', 'fullScreenViewer', 'inAppNotification',
        'loadingOverlay', 'picker', 'popover', 'popup', 'share', 'side', 'snackbar',
        'spotlight', 'toast', 'tooltip', 'top',
      ].sort(),
    );
  });

  it.each(ALL_VARIANTS.filter(v => VARIANTS[v].requiresAnchor))('%s requires an anchor', variant => {
    expect(resolveConfig(base({variant}))).toEqual({ok: false, reason: 'missing-anchor'});
    const anchor = {x: 10, y: 20, width: 40, height: 40};
    expect(resolveConfig(base({variant, anchor})).ok).toBe(true);
  });

  it('places modals, sheets and overlays by group', () => {
    expect(VARIANTS.center.group).toBe('modal');
    expect(VARIANTS.bottomSheet.group).toBe('sheet');
    expect(VARIANTS.toast.group).toBe('overlay');
  });
});

describe('defaults per variant', () => {
  it('bottom sheet is draggable with backdrop and nested scroll', () => {
    const r = resolveConfig(base());
    expect(r.ok && r.config.variant).toBe('bottomSheet');
    expect(r.ok && r.config.placement).toBe('bottom');
    expect(r.ok && r.config.enableDrag).toBe(true);
    expect(r.ok && r.config.enableBackdrop).toBe(true);
    expect(r.ok && r.config.enableNestedScroll).toBe(true);
  });

  it('alert does not nest-scroll or accept the keyboard', () => {
    const r = resolveConfig(base({variant: 'alert'}));
    expect(r.ok && r.config.enableNestedScroll).toBe(false);
    expect(r.ok && r.config.enableKeyboard).toBe(false);
  });

  it('side surfaces default to the right edge, and honour left', () => {
    const right = resolveConfig(base({variant: 'side'}));
    const left = resolveConfig(base({variant: 'side', side: 'left'}));
    expect(right.ok && right.config.placement).toBe('right');
    expect(left.ok && left.config.placement).toBe('left');
    expect(resolveConfig(base({variant: 'side', side: 'top' as never}))).toEqual({
      ok: false,
      reason: 'invalid-config',
    });
  });

  it('floating surfaces get a default margin; others get none', () => {
    const floating = resolveConfig(base({variant: 'floating'}));
    const center = resolveConfig(base({variant: 'center'}));
    expect(floating.ok && floating.config.margin).toBe(16);
    expect(center.ok && center.config.margin).toBe(0);
  });

  it('toast and snackbar auto-dismiss by default; an explicit duration overrides it', () => {
    const toast = resolveConfig(base({variant: 'toast'}));
    expect(toast.ok && toast.config.autoDismissMs).toBe(3000);
    const custom = resolveConfig(base({variant: 'toast', autoDismissMs: 1200}));
    expect(custom.ok && custom.config.autoDismissMs).toBe(1200);
  });

  it('non-modal behaviour turns the backdrop off unless explicitly enabled', () => {
    const nonModal = resolveConfig(base({behavior: 'nonModal'}));
    expect(nonModal.ok && nonModal.config.enableBackdrop).toBe(false);
    const forced = resolveConfig(base({behavior: 'nonModal', enableBackdrop: true}));
    expect(forced.ok && forced.config.enableBackdrop).toBe(true);
  });

  it('loading overlay cannot be dismissed by the back button by default', () => {
    const r = resolveConfig(base({variant: 'loadingOverlay'}));
    expect(r.ok && r.config.hardwareBackDismiss).toBe(false);
  });

  it('every explicit option overrides the variant default', () => {
    const r = resolveConfig(
      base({variant: 'bottomSheet', enableDrag: false, enableKeyboard: false, enableNestedScroll: false}),
    );
    expect(r.ok && r.config.enableDrag).toBe(false);
    expect(r.ok && r.config.enableKeyboard).toBe(false);
    expect(r.ok && r.config.enableNestedScroll).toBe(false);
  });
});

describe('sizing presets', () => {
  it.each(Object.entries(SIZING_SNAP_POINTS))('%s maps to a snap point', (sizing, point) => {
    const r = resolveConfig(base({sizing: sizing as keyof typeof SIZING_SNAP_POINTS}));
    expect(r.ok && r.config.snapPoints).toEqual([point]);
  });

  it('explicit snapPoints take precedence over sizing', () => {
    const r = resolveConfig(base({sizing: 'peek', snapPoints: ['30%', '80%']}));
    expect(r.ok && r.config.snapPoints).toEqual(['30%', '80%']);
  });

  it('rejects an unknown sizing preset', () => {
    expect(resolveConfig(base({sizing: 'tiny' as never}))).toEqual({ok: false, reason: 'invalid-config'});
  });
});

describe('behaviour', () => {
  it('rejects an unknown behaviour', () => {
    expect(resolveConfig(base({behavior: 'sticky' as never}))).toEqual({
      ok: false,
      reason: 'invalid-config',
    });
  });

  it('rejects unknown variants', () => {
    expect(resolveConfig(base({variant: 'carousel' as never}))).toEqual({
      ok: false,
      reason: 'invalid-config',
    });
  });

  it('persistent surfaces survive dismissAll and topmost dismissal', () => {
    const m = new SheetManager();
    m.present(base({id: 'player', behavior: 'persistent'}));
    m.present(base({id: 'filters'}));

    m.dismiss(); // topmost non-persistent: filters
    expect(m.getSheet('filters')?.phase).toBe('dismissing');
    expect(m.getSheet('player')?.phase).toBe('presented');

    m.dismissAll();
    expect(m.getSheet('player')?.phase).toBe('presented');
    m.dismissAll({includePersistent: true});
    expect(m.getSheet('player')?.phase).toBe('dismissing');
  });

  it('dismiss with no id returns not-found when only persistent surfaces are open', () => {
    const m = new SheetManager();
    m.present(base({id: 'player', behavior: 'persistent'}));
    expect(m.dismiss()).toEqual({ok: false, reason: 'not-found'});
  });
});

describe('auto-dismiss', () => {
  function fakeScheduler() {
    const timers = new Map<number, () => void>();
    let next = 1;
    return {
      timers,
      scheduler: {
        setTimeout: (callback: () => void) => {
          const handle = next++;
          timers.set(handle, callback);
          return handle;
        },
        clearTimeout: (handle: unknown) => {
          timers.delete(handle as number);
        },
      },
      fire: () => {
        for (const [handle, callback] of [...timers]) {
          timers.delete(handle);
          callback();
        }
      },
    };
  }

  it('dismisses after the configured duration', () => {
    const clock = fakeScheduler();
    const m = new SheetManager({scheduler: clock.scheduler});
    m.present(base({id: 'toast', variant: 'toast'}));
    expect(clock.timers.size).toBe(1);
    clock.fire();
    expect(m.getSheet('toast')?.phase).toBe('dismissing');
  });

  it('cancels the timer when the surface is dismissed early', () => {
    const clock = fakeScheduler();
    const m = new SheetManager({scheduler: clock.scheduler});
    m.present(base({id: 'toast', variant: 'toast'}));
    m.dismiss('toast');
    expect(clock.timers.size).toBe(0);
  });

  it('cancels the timer when native reports the dismissal', () => {
    const clock = fakeScheduler();
    const m = new SheetManager({scheduler: clock.scheduler});
    m.present(base({id: 'toast', variant: 'toast'}));
    m.handleNativeDismiss('toast');
    expect(clock.timers.size).toBe(0);
  });
});

describe('appearance validation', () => {
  it('accepts a full, valid design', () => {
    expect(
      validateAppearance({
        backgroundColor: '#FFFFFF',
        backdropColor: '#00000080',
        handleColor: '#999999',
        borderColor: '#dddddd',
        borderWidth: 1,
        cornerRadius: 24,
        shadowRadius: 12,
        shadowOpacity: 0.3,
        backdropOpacity: 0.5,
        width: 320,
        showHandle: true,
      }),
    ).toBe(true);
  });

  it.each([
    ['named colour', {backgroundColor: 'red'}],
    ['short hex', {handleColor: '#fff'}],
    ['negative radius', {cornerRadius: -1}],
    ['negative border', {borderWidth: -2}],
    ['opacity above 1', {shadowOpacity: 1.5}],
    ['backdrop below 0', {backdropOpacity: -0.1}],
    ['zero width', {width: 0}],
  ])('rejects %s', (_label, appearance) => {
    expect(validateAppearance(appearance)).toBe(false);
    expect(resolveConfig(base({appearance}))).toEqual({ok: false, reason: 'invalid-config'});
  });
});
