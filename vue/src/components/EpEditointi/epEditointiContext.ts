import type { ComputedRef, InjectionKey } from 'vue';

export interface EpEditointiContext {
  isEditing: ComputedRef<boolean>;
}

export const epEditointiContextKey: InjectionKey<EpEditointiContext> = Symbol('epEditointiContext');
