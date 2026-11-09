/**
 * Web surface: a DOM dialog rendered into document.body. Metro and webpack pick this file
 * over `SheetSurface.tsx` when targeting the web. It reads the same SurfaceModel as the
 * native surface, so every design prop means the same thing on every platform.
 *
 * Not yet on web: drag-to-resize gestures (snapTo / expand / collapse still work).
 */
import {useEffect, useMemo, useState} from 'react';
import type {CSSProperties} from 'react';
import {createPortal} from 'react-dom';
import {View} from 'react-native';
import {describeSurface, selectedHeightFraction} from './surfaceProps';
import type {SurfaceModel} from './surfaceProps';
import type {SheetManager} from './SheetManager';
import type {ActiveSheet, SheetPlacement} from './types';

export interface SheetSurfaceProps {
  sheet: ActiveSheet;
  manager: SheetManager;
  viewportHeight: number;
}

const ANCHOR_GAP = 8;

function heightCss(model: SurfaceModel): string {
  const fraction = selectedHeightFraction(model);
  return fraction === null ? 'auto' : `${Math.round(fraction * 100)}vh`;
}

/** Where the surface rests when open, and where it slides from when closed. */
function hiddenTransform(placement: SheetPlacement): string {
  switch (placement) {
    case 'bottom':
      return 'translateY(100%)';
    case 'top':
      return 'translateY(-100%)';
    case 'left':
      return 'translateX(-100%)';
    case 'right':
      return 'translateX(100%)';
    default:
      return 'scale(0.96)';
  }
}

function placementStyle(model: SurfaceModel, open: boolean): CSSProperties {
  const duration = `${model.animationDurationMs}ms`;
  const radius = model.cornerRadius;
  const border =
    model.borderWidth > 0 ? `${model.borderWidth}px solid ${model.borderColor ?? '#000000'}` : undefined;
  const shadow =
    model.shadowOpacity > 0
      ? `0 -2px ${model.shadowRadius}px rgba(0, 0, 0, ${model.shadowOpacity})`
      : undefined;

  const base: CSSProperties = {
    position: 'fixed',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    background: model.backgroundColor ?? '#ffffff',
    border,
    boxShadow: shadow,
    transition: `transform ${duration} ease, opacity ${duration} ease`,
    opacity: open ? 1 : 0,
    transform: open ? 'none' : hiddenTransform(model.placement),
  };

  const widthOr = (fallback: string) => (model.width > 0 ? `${model.width}px` : fallback);

  switch (model.placement) {
    case 'bottom':
      return {
        ...base,
        left: 0,
        right: 0,
        bottom: 0,
        height: heightCss(model),
        maxHeight: '100vh',
        borderTopLeftRadius: radius,
        borderTopRightRadius: radius,
      };
    case 'top':
      return {
        ...base,
        left: 0,
        right: 0,
        top: 0,
        height: heightCss(model),
        maxHeight: '100vh',
        borderBottomLeftRadius: radius,
        borderBottomRightRadius: radius,
      };
    case 'left':
    case 'right':
      return {
        ...base,
        top: 0,
        bottom: 0,
        [model.placement]: 0,
        width: widthOr('min(360px, 90vw)'),
        maxWidth: '90vw',
      };
    case 'center':
      return {
        ...base,
        top: '50%',
        left: '50%',
        width: widthOr('min(420px, 90vw)'),
        maxHeight: '80vh',
        borderRadius: radius,
        transform: open ? 'translate(-50%, -50%)' : 'translate(-50%, -50%) scale(0.96)',
      };
    case 'fullScreen':
      return {...base, top: 0, right: 0, bottom: 0, left: 0, borderRadius: 0};
    case 'floating': {
      const m = model.margin;
      return {
        ...base,
        top: m,
        left: m,
        right: m,
        bottom: m,
        height: 'auto',
        maxHeight: `calc(100vh - ${2 * m}px)`,
        borderRadius: radius,
      };
    }
    case 'anchored':
      return {
        ...base,
        left: model.anchor.x,
        top: model.anchor.y + model.anchor.height + ANCHOR_GAP,
        width: widthOr('auto'),
        minWidth: 200,
        height: 'auto',
        maxHeight: '60vh',
        borderRadius: radius,
      };
  }
}

export function SheetSurface({sheet, manager, viewportHeight}: SheetSurfaceProps) {
  const model = useMemo(() => describeSurface(sheet, viewportHeight), [sheet, viewportHeight]);
  const [open, setOpen] = useState(false);
  const {id} = sheet;

  // Open after the first paint so the CSS transition has a start state to animate from.
  useEffect(() => {
    if (!model.visible) {
      setOpen(false);
      return undefined;
    }
    const frame = setTimeout(() => setOpen(true), 16);
    manager.handleNativePresented(id);
    return () => clearTimeout(frame);
  }, [model.visible, manager, id]);

  // Report the dismissal only once the close motion has finished.
  useEffect(() => {
    if (model.visible) {
      return undefined;
    }
    const done = setTimeout(() => manager.handleNativeDismiss(id), model.animationDurationMs);
    return () => clearTimeout(done);
  }, [model.visible, model.animationDurationMs, manager, id]);

  // Escape closes the topmost surface, mirroring the Android back button.
  useEffect(() => {
    if (!model.visible || !model.hardwareBackDismiss || typeof document === 'undefined') {
      return undefined;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }
      const topmost = manager
        .getActive()
        .filter(s => s.phase === 'presented')
        .slice(-1)[0];
      if (topmost?.id === id) {
        manager.dismiss(id);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [model.visible, model.hardwareBackDismiss, manager, id]);

  if (typeof document === 'undefined') {
    return null; // Server rendering: nothing to portal into.
  }

  const backdropStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: model.backdropColor ?? '#000000',
    opacity: open ? model.backdropOpacity : 0,
    transition: `opacity ${model.animationDurationMs}ms ease`,
    pointerEvents: open && model.enableBackdrop ? 'auto' : 'none',
  };

  return createPortal(
    <>
      {model.enableBackdrop ? (
        <div
          data-testid="sheet-backdrop"
          style={backdropStyle}
          onClick={() => {
            if (model.dismissOnBackdrop) {
              manager.dismiss(id);
            }
          }}
        />
      ) : null}
      <div
        role="dialog"
        aria-modal={model.enableBackdrop}
        aria-label={model.accessibilityLabel}
        data-sheet-id={id}
        style={placementStyle(model, open)}>
        {model.showHandle && model.placement === 'bottom' ? (
          <div
            aria-hidden="true"
            style={{
              alignSelf: 'center',
              width: 36,
              height: 5,
              margin: '8px 0',
              borderRadius: 3,
              background: model.handleColor ?? '#c4c4c4',
              flexShrink: 0,
            }}
          />
        ) : null}
        <View style={[{flex: 1, overflowY: 'auto'} as never, sheet.config.styles?.contentStyle]}>
          {sheet.config.content}
        </View>
      </div>
    </>,
    document.body,
  );
}
