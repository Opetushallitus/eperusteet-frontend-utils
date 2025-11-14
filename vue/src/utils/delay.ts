import * as _ from 'lodash';
import Vue, { computed } from 'vue';

export const DEFAULT_PUBLIC_WAIT_TIME_MS = 300;


export const debounced = (fn:any, delayMs:number = 300) => _.debounce(fn, delayMs);

/**
 * Wraps a getter into a computed value
 */
export function Computed() {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if (!_.isFunction(descriptor.get)) {
      throw new Error('descriptor must have a getter');
    }
    const original = descriptor.get;
    const getter = computed(() => original);
    descriptor.value = {
      get: getter.value,
    };
  };
}

/**
 * delay
 *
 * @param ms
 */
export async function delay(ms: number = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
