import * as _ from 'lodash';
import Vue, { computed } from 'vue';

export const DEFAULT_PUBLIC_WAIT_TIME_MS = 300;

/**
 * Asyncronic debounce that supports awaiting. Useful when need to wait
 * for the actual event to happen.
 *
 * @param {async function} fn Function to be called after debounce
 * @param {number} ms Time to wait in milliseconds
 * @returns {Promise} Is resolved after the actual debounce function runs
 */
export function asyncDebounce<T, F>(fn: F & any, ms: number): F & any {
  let tid = null as number | null;
  const wrapper = function(this: any, ...params: any[]) {
    if (_.isNumber(tid)) {
      clearTimeout(tid);
    }
    const self = this;
    return new Promise((resolve, reject) => {
      tid = setTimeout(async () => {
        tid = null;
        try {
          const bound = fn.bind(self);
          resolve(await bound(params));
        }
        catch (err) {
          reject(err);
        }
      }, ms);
    });
  };
  return wrapper as unknown as F;
}

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
