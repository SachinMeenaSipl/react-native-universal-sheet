import {SheetManager} from '../SheetManager';
import {SheetRegistry} from '../SheetRegistry';
import type {SheetConfig} from '../types';

const sheet = (id: string, extra: Partial<SheetConfig> = {}): SheetConfig => ({
  id,
  content: `content-${id}`,
  ...extra,
});

const ids = (m: SheetManager) => m.getActive().map(s => s.id);

describe('presentation', () => {
  it('presents sheets and rejects duplicate active ids', () => {
    const m = new SheetManager();
    expect(m.present(sheet('a'))).toEqual({ok: true});
    expect(m.present(sheet('a'))).toEqual({ok: false, reason: 'duplicate-id'});
    expect(ids(m)).toEqual(['a']);
  });

  it('stacks children above the parent and keeps the parent', () => {
    const m = new SheetManager();
    m.present(sheet('profile'));
    m.present(sheet('edit'));
    expect(ids(m)).toEqual(['profile', 'edit']);
  });

  it('enforces the maximum stack depth', () => {
    const m = new SheetManager({maxStackDepth: 2});
    m.present(sheet('a'));
    m.present(sheet('b'));
    expect(m.present(sheet('c'))).toEqual({ok: false, reason: 'stack-limit-reached'});
  });

  it('rejects a non-positive stack depth', () => {
    expect(() => new SheetManager({maxStackDepth: 0})).toThrow();
  });

  it('cancels a dismissal when the same id is presented again (StrictMode replay)', () => {
    const m = new SheetManager();
    m.present(sheet('a'));
    m.dismiss('a');
    expect(m.getSheet('a')?.phase).toBe('dismissing');
    expect(m.present(sheet('a'))).toEqual({ok: true});
    expect(m.getSheet('a')?.phase).toBe('presented');
  });

  it('returns not-found when dismissing an unknown id', () => {
    const m = new SheetManager();
    expect(m.dismiss('missing')).toEqual({ok: false, reason: 'not-found'});
  });
});

describe('dismissal', () => {
  it('keeps a sheet until native confirms the dismissal', () => {
    const m = new SheetManager();
    m.present(sheet('parent'));
    m.present(sheet('child'));

    expect(m.dismiss()).toEqual({ok: true});
    expect(m.getSheet('child')?.phase).toBe('dismissing');
    expect(ids(m)).toEqual(['parent', 'child']);

    m.handleNativeDismiss('child');
    expect(ids(m)).toEqual(['parent']);
  });

  it('dismisses the topmost active sheet first when no id is given', () => {
    const m = new SheetManager();
    m.present(sheet('a'));
    m.present(sheet('b'));
    m.dismiss();
    m.dismiss();
    expect(m.getSheet('b')?.phase).toBe('dismissing');
    expect(m.getSheet('a')?.phase).toBe('dismissing');
  });

  it('fires dismissal events in order for a native gesture dismissal', () => {
    const events: string[] = [];
    const m = new SheetManager();
    m.present(
      sheet('a', {
        onWillDismiss: id => events.push(`willDismiss:${id}`),
        onDidDismiss: id => events.push(`didDismiss:${id}`),
      }),
    );
    m.handleNativeDismiss('a');
    expect(events).toEqual(['willDismiss:a', 'didDismiss:a']);
    expect(ids(m)).toEqual([]);
  });

  it('does not fire willDismiss twice for a JS-initiated dismissal', () => {
    const events: string[] = [];
    const m = new SheetManager();
    m.present(sheet('a', {onWillDismiss: () => events.push('will'), onDidDismiss: () => events.push('did')}));
    m.dismiss('a');
    m.dismiss('a');
    m.handleNativeDismiss('a');
    m.handleNativeDismiss('a');
    expect(events).toEqual(['will', 'did']);
  });

  it('dismissAll dismisses topmost first', () => {
    const order: string[] = [];
    const m = new SheetManager();
    const track = {onWillDismiss: (x: string) => order.push(x)};
    m.present(sheet('a', track));
    m.present(sheet('b', track));
    m.present(sheet('c', track));
    m.dismissAll();
    expect(order).toEqual(['c', 'b', 'a']);
  });
});

describe('replace presentation', () => {
  it('dismisses the topmost sheet, then presents the replacement once native confirms', () => {
    const m = new SheetManager();
    m.present(sheet('a'));
    m.present(sheet('b', {presentation: 'replace'}));

    expect(m.getSheet('a')?.phase).toBe('dismissing');
    expect(ids(m)).toEqual(['a']);

    m.handleNativeDismiss('a');
    expect(ids(m)).toEqual(['b']);
  });

  it('refuses a second replacement while one is pending', () => {
    const m = new SheetManager();
    m.present(sheet('a'));
    m.present(sheet('b', {presentation: 'replace'}));
    expect(m.present(sheet('c', {presentation: 'replace'}))).toEqual({
      ok: false,
      reason: 'replace-in-progress',
    });
  });
});

describe('validation', () => {
  it('rejects invalid snap points', () => {
    const m = new SheetManager();
    expect(m.present(sheet('x', {snapPoints: ['50%', 'bogus' as never]}))).toEqual({
      ok: false,
      reason: 'invalid-snap-point',
    });
  });

  it('rejects an initial snap point that is not in snapPoints', () => {
    const m = new SheetManager();
    expect(
      m.present(sheet('y', {snapPoints: ['50%', '90%'], initialSnapPoint: '20%'})),
    ).toEqual({ok: false, reason: 'invalid-snap-point'});
  });

  it('rejects an empty id and an unknown presentation', () => {
    const m = new SheetManager();
    expect(m.present(sheet(''))).toEqual({ok: false, reason: 'invalid-config'});
    expect(m.present(sheet('z', {presentation: 'overlay' as never}))).toEqual({
      ok: false,
      reason: 'invalid-config',
    });
  });

  it('rejects out-of-range appearance values', () => {
    const m = new SheetManager();
    expect(m.present(sheet('o', {appearance: {backdropOpacity: 2}}))).toEqual({
      ok: false,
      reason: 'invalid-config',
    });
  });
});

describe('snap points', () => {
  it('defaults to a single large detent and applies the initial snap point', () => {
    const m = new SheetManager();
    m.present(sheet('a'));
    expect(m.getSheet('a')?.config.snapPoints).toEqual(['large']);

    m.present(sheet('b', {snapPoints: ['50%', '90%'], initialSnapPoint: '90%'}));
    expect(m.getSheet('b')?.snapIndex).toBe(1);
  });

  it('snapTo, expand and collapse move between detents and fire onSnapChange', () => {
    const changes: number[] = [];
    const m = new SheetManager();
    m.present(sheet('a', {snapPoints: ['30%', '60%', '90%'], onSnapChange: (_, i) => changes.push(i)}));

    expect(m.snapTo('a', '60%')).toEqual({ok: true});
    expect(m.expand('a')).toEqual({ok: true});
    expect(m.collapse('a')).toEqual({ok: true});
    expect(changes).toEqual([1, 2, 0]);
    expect(m.getSheet('a')?.snapIndex).toBe(0);
  });

  it('snapTo rejects points that are not configured', () => {
    const m = new SheetManager();
    m.present(sheet('a', {snapPoints: ['50%']}));
    expect(m.snapTo('a', '80%')).toEqual({ok: false, reason: 'invalid-snap-point'});
  });

  it('handleNativeSnapChange updates state and ignores repeats and out-of-range indices', () => {
    const changes: number[] = [];
    const m = new SheetManager();
    m.present(sheet('a', {snapPoints: ['50%', '90%'], onSnapChange: (_, i) => changes.push(i)}));
    m.handleNativeSnapChange('a', 1);
    m.handleNativeSnapChange('a', 1);
    m.handleNativeSnapChange('a', 7);
    expect(changes).toEqual([1]);
  });

  it('keeps the selected detent across an update when it still exists', () => {
    const m = new SheetManager();
    m.present(sheet('a', {snapPoints: ['50%', '90%'], initialSnapPoint: '90%'}));
    m.update('a', {snapPoints: ['40%', '90%']});
    expect(m.getSheet('a')?.snapIndex).toBe(1);
  });
});

describe('update and replace in place', () => {
  it('update merges content without re-presenting', () => {
    const m = new SheetManager();
    m.present(sheet('a'));
    expect(m.update('a', {content: 'new'})).toEqual({ok: true});
    expect(m.getSheet('a')?.config.content).toBe('new');
    expect(m.getSheet('a')?.phase).toBe('presented');
  });

  it('update returns not-found for unknown ids', () => {
    const m = new SheetManager();
    expect(m.update('nope', {content: 'x'})).toEqual({ok: false, reason: 'not-found'});
  });

  it('replace swaps the config in place and requires a matching id', () => {
    const m = new SheetManager();
    m.present(sheet('a'));
    expect(m.replace('a', sheet('b'))).toEqual({ok: false, reason: 'invalid-config'});
    expect(m.replace('a', sheet('a', {content: 'swapped'}))).toEqual({ok: true});
    expect(m.getSheet('a')?.config.content).toBe('swapped');
  });
});

describe('registry', () => {
  it('presents a named sheet with its defaults and props', () => {
    const registry = new SheetRegistry().register<{name: string}>('greeting', {
      render: ({name}) => `hi ${name}`,
      snapPoints: ['50%'],
    });
    const m = new SheetManager({registry});

    expect(m.presentNamed('greeting', {id: 'g1', props: {name: 'Ada'}})).toEqual({ok: true});
    expect(m.getSheet('g1')?.config.content).toBe('hi Ada');
    expect(m.getSheet('g1')?.config.snapPoints).toEqual(['50%']);
  });

  it('returns unknown-sheet for an unregistered name', () => {
    const m = new SheetManager();
    expect(m.presentNamed('missing', {id: 'x'})).toEqual({ok: false, reason: 'unknown-sheet'});
  });

  it('rejects an empty name', () => {
    expect(() => new SheetRegistry().register('', {render: () => null})).toThrow();
  });
});

describe('subscriptions', () => {
  it('notifies subscribers on every change and stops after unsubscribe', () => {
    const m = new SheetManager();
    let calls = 0;
    const unsubscribe = m.subscribe(() => {
      calls++;
    });
    m.present(sheet('a'));
    expect(calls).toBe(1);
    unsubscribe();
    m.present(sheet('b'));
    expect(calls).toBe(1);
  });

  it('returns a new snapshot identity only when something changed', () => {
    const m = new SheetManager();
    m.present(sheet('a'));
    const before = m.getSnapshot();
    m.present(sheet('a'));
    expect(m.getSnapshot()).toBe(before);
  });
});
