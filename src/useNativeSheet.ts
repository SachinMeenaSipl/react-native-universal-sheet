import {useCallback, useContext, useSyncExternalStore} from 'react';
import {SheetContext} from './context';
import type {SheetManager} from './SheetManager';
import type {ActiveSheet} from './types';

/** Returns the sheet manager for imperative use: present, dismiss, snapTo, and so on. */
export function useNativeSheet(): SheetManager {
  const manager = useContext(SheetContext);
  if (manager === null) {
    throw new Error(
      '[react-native-universal-sheet] useNativeSheet() must be used inside <NativeSheetProvider>.',
    );
  }
  return manager;
}

/** Re-renders when the given sheet's state changes. Returns undefined when it is not presented. */
export function useSheetState(id: string): ActiveSheet | undefined {
  const manager = useNativeSheet();
  const select = useCallback(() => manager.getSheet(id), [manager, id]);
  return useSyncExternalStore(manager.subscribe, select, select);
}
