import {useEffect, useId, useRef} from 'react';
import type {ReactNode} from 'react';
import {definedOnly} from './config';
import {useNativeSheet} from './useNativeSheet';
import type {SheetConfig, SheetConfigPatch, SheetEvents} from './types';

/** Every option a sheet accepts, without its id, content or event callbacks. */
export type SheetOptions = Partial<Omit<SheetConfig, 'id' | 'content' | keyof SheetEvents>>;

export interface NativeSheetProps extends SheetOptions {
  /** Presents when true, dismisses when false. */
  visible: boolean;
  /** Optional stable id. A unique id is generated when omitted. */
  id?: string;
  children: ReactNode;
  /** Called after the surface is dismissed for any reason: gesture, programmatic, or unmount. */
  onDismiss?: () => void;
  onSnapChange?: (index: number) => void;
  onPresent?: () => void;
}

/**
 * Declarative, controlled surface. Defaults to a bottom sheet; pass `variant` for any other
 * presentation type. Use `useNativeSheet()` for imperative flows.
 */
export function NativeSheet({
  visible,
  id: customId,
  children,
  onDismiss,
  onSnapChange,
  onPresent,
  ...options
}: NativeSheetProps) {
  const manager = useNativeSheet();
  const generatedId = useId();
  const id = customId ?? `universal-sheet${generatedId}`;

  // Callbacks are read through a ref so a changing handler never re-presents the surface.
  const callbacks = useRef({onDismiss, onSnapChange, onPresent});
  callbacks.current = {onDismiss, onSnapChange, onPresent};

  useEffect(() => {
    if (!visible) {
      return undefined;
    }
    manager.present({
      ...definedOnly(options),
      id,
      content: children,
      onDidDismiss: () => callbacks.current.onDismiss?.(),
      onSnapChange: (_sheetId, index) => callbacks.current.onSnapChange?.(index),
      onDidPresent: () => callbacks.current.onPresent?.(),
    });
    return () => {
      manager.dismiss(id);
    };
    // Content and option changes are applied by the update effect below, not by re-presenting.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, id, manager]);

  useEffect(() => {
    if (!visible) {
      return;
    }
    const patch: SheetConfigPatch = definedOnly({
      content: children,
      snapPoints: options.snapPoints,
      initialSnapPoint: options.initialSnapPoint,
      enableDrag: options.enableDrag,
      enableBackdrop: options.enableBackdrop,
      enableKeyboard: options.enableKeyboard,
      enableNestedScroll: options.enableNestedScroll,
      hardwareBackDismiss: options.hardwareBackDismiss,
      autoDismissMs: options.autoDismissMs,
      margin: options.margin,
      anchor: options.anchor,
      animation: options.animation,
      appearance: options.appearance,
      actions: options.actions,
      accessibilityLabel: options.accessibilityLabel,
    });
    manager.update(id, patch);
  });

  return null;
}

