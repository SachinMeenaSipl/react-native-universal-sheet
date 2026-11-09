import {useEffect, useState, useSyncExternalStore} from 'react';
import type {ReactNode} from 'react';
import {BackHandler, useWindowDimensions} from 'react-native';
import {SheetContext} from './context';
import {SheetManager} from './SheetManager';
import {SheetSurface} from './SheetSurface';

export interface NativeSheetProviderProps {
  children?: ReactNode;
  /** Supply a manager to share one across roots or to inject it in tests. */
  manager?: SheetManager;
  /** Maximum simultaneously presented surfaces. Default 5. */
  maxStackDepth?: number;
}

/**
 * Place this above your navigator. Sheet content is rendered by the provider, not by the
 * screen that opened it, so presenting or dismissing a surface never unmounts the parent
 * screen or its React state.
 *
 * Renders natively on iOS and Android, and as a DOM dialog on web (`SheetSurface.web.tsx`).
 */
export function NativeSheetProvider({children, manager: external, maxStackDepth}: NativeSheetProviderProps) {
  const [manager] = useState(() => external ?? new SheetManager({maxStackDepth}));
  const active = useSyncExternalStore(manager.subscribe, manager.getSnapshot);
  const {height} = useWindowDimensions();

  // Android back button (and web Escape, handled by the surface): dismiss the topmost
  // surface that allows it. Returning false lets the app handle the press.
  useEffect(() => {
    // react-native-web provides no BackHandler on every version; guard the call.
    if (!BackHandler?.addEventListener) {
      return undefined;
    }
    const onBack = () => {
      const top = [...manager.getActive()]
        .reverse()
        .find(sheet => sheet.phase === 'presented' && sheet.config.hardwareBackDismiss);
      if (!top) {
        return false;
      }
      manager.dismiss(top.id);
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => subscription.remove();
  }, [manager]);

  return (
    <SheetContext.Provider value={manager}>
      {children}
      {active.map(sheet => (
        <SheetSurface key={sheet.id} sheet={sheet} manager={manager} viewportHeight={height} />
      ))}
    </SheetContext.Provider>
  );
}
