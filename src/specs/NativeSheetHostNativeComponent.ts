import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';
import type {
  DirectEventHandler,
  Double,
  Int32,
  WithDefault,
} from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

/**
 * Codegen spec for the native host. Used by both the Legacy and Fabric architectures.
 * Native component name: "NativeSheetHost".
 */
export interface NativeSheetHostProps extends ViewProps {
  sheetId: string;
  visible: boolean;
  /** Fractions of viewport height (0..1). -1 means "size to content". */
  snapPoints: ReadonlyArray<Double>;
  snapIndex: Int32;

  enableDrag?: WithDefault<boolean, true>;
  enableBackdrop?: WithDefault<boolean, true>;
  enableKeyboard?: WithDefault<boolean, true>;
  enableNestedScroll?: WithDefault<boolean, true>;

  /** Surface placement: center, fullScreen, floating, left, right, top, bottom, anchored. */
  placement?: string;
  margin?: WithDefault<Double, 0>;
  /** Anchor rectangle in screen points, for anchored placements. */
  anchorX?: WithDefault<Double, 0>;
  anchorY?: WithDefault<Double, 0>;
  anchorWidth?: WithDefault<Double, 0>;
  anchorHeight?: WithDefault<Double, 0>;

  /** Design: surface fill, corner radius, border, shadow, width. 0 width means automatic. */
  sheetBackgroundColor?: string;
  cornerRadius?: WithDefault<Double, 16>;
  borderWidth?: WithDefault<Double, 0>;
  borderColor?: string;
  shadowRadius?: WithDefault<Double, 0>;
  shadowOpacity?: WithDefault<Double, 0>;
  width?: WithDefault<Double, 0>;

  /** Design: backdrop dimming and tint. */
  backdropOpacity?: WithDefault<Double, 0.4>;
  backdropColor?: string;

  /** Design: drag handle. */
  showHandle?: WithDefault<boolean, true>;
  handleColor?: string;

  onPresent?: DirectEventHandler<null>;
  onDismiss?: DirectEventHandler<null>;
  onSnapChange?: DirectEventHandler<Readonly<{index: Int32}>>;
}

export default codegenNativeComponent<NativeSheetHostProps>('NativeSheetHost');
