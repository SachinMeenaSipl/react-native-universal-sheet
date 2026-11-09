/**
 * Native surface (iOS and Android). Metro resolves `SheetSurface.web.tsx` instead on web.
 */
import {memo, useCallback, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import NativeSheetHostNativeComponent from './specs/NativeSheetHostNativeComponent';
import {describeSurface} from './surfaceProps';
import type {SheetManager} from './SheetManager';
import type {ActiveSheet} from './types';

export interface SheetSurfaceProps {
  sheet: ActiveSheet;
  manager: SheetManager;
  viewportHeight: number;
}

interface SnapChangeEvent {
  nativeEvent: {index: number};
}

export const SheetSurface = memo(function SheetSurface({sheet, manager, viewportHeight}: SheetSurfaceProps) {
  const {id, config} = sheet;
  const model = useMemo(() => describeSurface(sheet, viewportHeight), [sheet, viewportHeight]);

  const handlePresent = useCallback(() => manager.handleNativePresented(id), [manager, id]);
  const handleDismiss = useCallback(() => manager.handleNativeDismiss(id), [manager, id]);
  const handleSnapChange = useCallback(
    (event: SnapChangeEvent) => manager.handleNativeSnapChange(id, event.nativeEvent.index),
    [manager, id],
  );

  return (
    <NativeSheetHostNativeComponent
      style={styles.host}
      sheetId={model.sheetId}
      visible={model.visible}
      snapPoints={model.snapFractions}
      snapIndex={model.snapIndex}
      enableDrag={model.enableDrag}
      enableBackdrop={model.enableBackdrop}
      enableKeyboard={model.enableKeyboard}
      enableNestedScroll={model.enableNestedScroll}
      placement={model.placement}
      margin={model.margin}
      anchorX={model.anchor.x}
      anchorY={model.anchor.y}
      anchorWidth={model.anchor.width}
      anchorHeight={model.anchor.height}
      sheetBackgroundColor={model.backgroundColor}
      cornerRadius={model.cornerRadius}
      borderWidth={model.borderWidth}
      borderColor={model.borderColor}
      shadowRadius={model.shadowRadius}
      shadowOpacity={model.shadowOpacity}
      width={model.width}
      backdropOpacity={model.backdropOpacity}
      backdropColor={model.backdropColor}
      showHandle={model.showHandle}
      handleColor={model.handleColor}
      onPresent={handlePresent}
      onDismiss={handleDismiss}
      onSnapChange={handleSnapChange}>
      <View
        style={[styles.content, config.styles?.contentStyle]}
        accessibilityLabel={model.accessibilityLabel}>
        {config.content}
      </View>
    </NativeSheetHostNativeComponent>
  );
});

const styles = StyleSheet.create({
  // The host is laid out by native once it is re-parented into the presentation.
  host: {
    position: 'absolute',
    width: 0,
    height: 0,
  },
  content: {
    flex: 1,
  },
});
