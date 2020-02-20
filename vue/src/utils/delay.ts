import * as _ from 'lodash';
import Vue from 'vue'
import VueCompositionApi, { computed } from '@vue/composition-api';

Vue.use(VueCompositionApi);


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
  }
  return wrapper as unknown as F;
}


/**
 * Debounced that can be used for functions as a decorator
 *
 * @param {number} ms
 */
export function Debounced(ms = 300) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = asyncDebounce(async function(this: any, ...params: any[]) {
      return await original.apply(this, ...params);
    }, ms);
  };
}


/**
 * Wraps a getter into a computed value
 */
export function Computed() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if (!_.isFunction(descriptor.get)) {
      throw new Error('descriptor must have a getter');
    }
    const original = descriptor.get;
    const getter = computed(() => original);
    descriptor.value = {
      get: getter.value
    };
  };
}


/**
 * delay
 *
 * @param {number} ms
 * @returns {undefined}
 */
export async function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


