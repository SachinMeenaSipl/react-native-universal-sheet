import {CONTENT_SNAP_FRACTION, isValidSnapPoint, resolveSnapFraction} from '../snapPoints';

describe('isValidSnapPoint', () => {
  it('accepts positive numbers, percentages and named detents', () => {
    expect(isValidSnapPoint(300)).toBe(true);
    expect(isValidSnapPoint('50%')).toBe(true);
    expect(isValidSnapPoint('100%')).toBe(true);
    expect(isValidSnapPoint('content')).toBe(true);
    expect(isValidSnapPoint('large')).toBe(true);
  });

  it('rejects malformed values', () => {
    expect(isValidSnapPoint(0)).toBe(false);
    expect(isValidSnapPoint(-1)).toBe(false);
    expect(isValidSnapPoint(Number.NaN)).toBe(false);
    expect(isValidSnapPoint('0%')).toBe(false);
    expect(isValidSnapPoint('150%')).toBe(false);
    expect(isValidSnapPoint('huge' as never)).toBe(false);
    // Inherited Object properties must not count as named detents.
    expect(isValidSnapPoint('toString' as never)).toBe(false);
  });
});

describe('resolveSnapFraction', () => {
  it('resolves percentages independent of viewport height', () => {
    expect(resolveSnapFraction('50%', 800)).toBe(0.5);
  });

  it('resolves absolute points against the viewport and clamps to 1', () => {
    expect(resolveSnapFraction(300, 600)).toBe(0.5);
    expect(resolveSnapFraction(1000, 600)).toBe(1);
  });

  it('resolves named detents', () => {
    expect(resolveSnapFraction('medium', 800)).toBe(0.5);
    expect(resolveSnapFraction('full', 800)).toBe(1);
  });

  it('maps content to the sentinel', () => {
    expect(resolveSnapFraction('content', 800)).toBe(CONTENT_SNAP_FRACTION);
  });
});
