import {createContext} from 'react';
import type {SheetManager} from './SheetManager';

export const SheetContext = createContext<SheetManager | null>(null);
