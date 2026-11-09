import type {ReactNode} from 'react';
import type {SheetConfig} from './types';

/** Defaults applied to every presentation of a named sheet. */
export type SheetDefaults = Partial<Omit<SheetConfig, 'id' | 'content'>>;

/** A named sheet definition: a render function plus defaults. */
export interface SheetDefinition<P = unknown> extends SheetDefaults {
  render: (props: P) => ReactNode;
}

export class SheetRegistry {
  // Definitions are heterogeneous in their props type; `any` is the honest type here.
  private readonly definitions = new Map<string, SheetDefinition<any>>();

  register<P>(name: string, definition: SheetDefinition<P>): this {
    if (name.length === 0) {
      throw new Error('[react-native-universal-sheet] Sheet name must be a non-empty string.');
    }
    this.definitions.set(name, definition);
    return this;
  }

  unregister(name: string): boolean {
    return this.definitions.delete(name);
  }

  has(name: string): boolean {
    return this.definitions.has(name);
  }

  get(name: string): SheetDefinition<any> | undefined {
    return this.definitions.get(name);
  }
}
