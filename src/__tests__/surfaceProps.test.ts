import {resolveConfig} from '../config';
import {DEFAULT_ANIMATION_MS, describeSurface, selectedHeightFraction} from '../surfaceProps';
import type {ActiveSheet, SheetConfig} from '../types';

function activeSheet(extra: Partial<SheetConfig> = {}, snapIndex = 0): ActiveSheet {
  const resolved = resolveConfig({id: 's', content: 'c', ...extra});
  if (!resolved.ok) {
    throw new Error(`bad fixture: ${resolved.reason}`);
  }
  return {id: 's', config: resolved.config, snapIndex, phase: 'presented'};
}

describe('describeSurface (shared by native and web)', () => {
  it('converts snap points to height fractions against the viewport', () => {
    const model = describeSurface(activeSheet({snapPoints: ['50%', 300]}), 600);
    expect(model.snapFractions).toEqual([0.5, 0.5]);
  });

  it('carries every design prop through unchanged', () => {
    const model = describeSurface(
      activeSheet({
        appearance: {
          backgroundColor: '#FFF8F0',
          cornerRadius: 28,
          borderWidth: 2,
          borderColor: '#E0B98F',
          shadowRadius: 16,
          shadowOpacity: 0.25,
          width: 320,
          backdropColor: '#101010',
          backdropOpacity: 0.5,
          showHandle: false,
          handleColor: '#C2703D',
        },
      }),
      800,
    );
    expect(model).toMatchObject({
      backgroundColor: '#FFF8F0',
      cornerRadius: 28,
      borderWidth: 2,
      borderColor: '#E0B98F',
      shadowRadius: 16,
      shadowOpacity: 0.25,
      width: 320,
      backdropColor: '#101010',
      backdropOpacity: 0.5,
      showHandle: false,
      handleColor: '#C2703D',
    });
  });

  it('uses platform defaults when no design is given', () => {
    const model = describeSurface(activeSheet(), 800);
    expect(model.cornerRadius).toBe(16);
    expect(model.backdropOpacity).toBe(0.4);
    expect(model.showHandle).toBe(true);
    expect(model.width).toBe(0);
    expect(model.animationDurationMs).toBe(DEFAULT_ANIMATION_MS);
  });

  it('takes the animation duration from the config', () => {
    const model = describeSurface(activeSheet({animation: {type: 'timing', durationMs: 500}}), 800);
    expect(model.animationDurationMs).toBe(500);
  });

  it('only dismisses on backdrop tap for modal behaviour', () => {
    expect(describeSurface(activeSheet({behavior: 'modal'}), 800).dismissOnBackdrop).toBe(true);
    expect(describeSurface(activeSheet({behavior: 'nonModal'}), 800).dismissOnBackdrop).toBe(false);
    expect(describeSurface(activeSheet({behavior: 'persistent'}), 800).dismissOnBackdrop).toBe(false);
  });

  it('reports visibility from the phase', () => {
    const sheet = activeSheet();
    expect(describeSurface(sheet, 800).visible).toBe(true);
    expect(describeSurface({...sheet, phase: 'dismissing'}, 800).visible).toBe(false);
  });

  it('exposes anchor geometry for anchored placements', () => {
    const model = describeSurface(
      activeSheet({variant: 'tooltip', anchor: {x: 10, y: 20, width: 40, height: 16}}),
      800,
    );
    expect(model.placement).toBe('anchored');
    expect(model.anchor).toEqual({x: 10, y: 20, width: 40, height: 16});
  });
});

describe('selectedHeightFraction', () => {
  it('returns the selected snap fraction', () => {
    const model = describeSurface(activeSheet({snapPoints: ['30%', '80%']}, 1), 800);
    expect(selectedHeightFraction(model)).toBe(0.8);
  });

  it('returns null for content-sized surfaces', () => {
    const model = describeSurface(activeSheet({snapPoints: ['content']}), 800);
    expect(selectedHeightFraction(model)).toBeNull();
  });
});
