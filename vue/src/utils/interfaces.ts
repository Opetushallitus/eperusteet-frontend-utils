import { Ref } from 'vue';
import { computed, ref } from 'vue';


/**
 * Allows:
 * const x: Computed<number> = computed(() => 5);
 * const y: Computed<{ x: number }[]> = computed(() => [{ x: 5 }]);
 *
 * @returns {undefined}
 */
export type Computed<T> = T extends Array<infer E>
  ? Readonly<Ref<readonly (E & any)[] | null>>
  : Readonly<Ref<T & any | null>>;

export function computedValue<T>(getter: () => T) {
  return computed(() => ({ value: getter() }));
}
