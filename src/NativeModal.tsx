import {NativeSheet} from './NativeSheet';
import type {NativeSheetProps} from './NativeSheet';
import type {ModalVariant} from './types';

export interface NativeModalProps extends Omit<NativeSheetProps, 'variant' | 'presentation'> {
  /**
   * Where the modal appears: `center`, `fullScreen`, `alert`, `popup`, `side`, `top`, `floating`.
   * Default: `center`. For `side`, set `side="left"` or `side="right"`.
   */
  presentation?: ModalVariant;
}

/** Modal surface (center, full screen, alert, popup, side, top, floating). */
export function NativeModal({presentation = 'center', ...props}: NativeModalProps) {
  return <NativeSheet {...props} variant={presentation} />;
}
