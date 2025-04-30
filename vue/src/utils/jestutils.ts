import Vue from 'vue';
import _ from 'lodash';
import { Wrapper } from '@vue/test-utils';
import { EditointiStore, IEditoitava } from '../components/EpEditointi/EditointiStore';
import { vi } from 'vitest';
import  { reactive, computed } from '@vue/composition-api';

import '../config/bootstrap';

export function mockEditointiStore<T>(config: Partial<IEditoitava> = {}) {
  const editointi = {
    acquire: vi.fn(async () => {
      const vanhentuu = new Date();
      vanhentuu.setMinutes(vanhentuu.getMinutes() + 10);
      return {
        haltijaOid: 'haltijaOid',
        haltijaNimi: 'haltijaNimi',
        luotu: new Date(),
        vanhentuu,
        oma: true,
        revisio: 1,
      };
    }),
    cancel: vi.fn(),
    editAfterLoad: vi.fn(async () => false),
    history: vi.fn(),
    load: vi.fn(),
    lock: vi.fn(async () => null),
    preview: vi.fn(async () => null),
    release: vi.fn(),
    remove: vi.fn(),
    restore: vi.fn(),
    revisions: vi.fn(),
    save: vi.fn(),
    start: vi.fn(),
    validator: computed(() => ({})),
    ...config,
  };
  return {
    store: new EditointiStore(editointi),
    config: editointi,
  };
}

export function findAllContaining<T extends Vue>(wrapper: Wrapper<T>, selector: string, text: string) {
  return wrapper.findAll(selector).filter(r => r.text().includes(text));
}

export function findContaining<T extends Vue>(wrapper: Wrapper<T>, selector: string, text: string) {
  const results = findAllContaining(wrapper, selector, text);
  if (results.length > 1) {
    throw new Error('Multiple results: ' + selector + ' ' + text);
  }
  else if (results.length === 0) {
    return null;
  }
  return results.at(0);
}

export const mocks = Object.freeze({
  $t: x => x,
  $kaanna: x => x ? x.fi : 'kaanna',
  $sd: x => x,
  $ld: x => x,
  $sdt: x => x,
  $kaannaPlaceholder: x => x,
}) as any;

export const stubs = Object.freeze({
  RouterLink: true,
  EpPdfLink: true,
}) as any;

export function wrap<T extends object>(original: T, value: T) {
  const result: any = {};

  // Get original implementations
  for (const k in original) {
    if (_.isFunction(original[k])) {
      result[k] = vi.fn(original[k] as any);
    }
    else {
      result[k] = original[k];
    }
  }

  // Overwrite with default mocks
  _.forEach(value, (v, k) => {
    if (_.isFunction(v)) {
      result[k] = vi.fn(v);
    }
    else {
      result[k] = Vue.observable(v);
    }
  });

  const Mock = vi.fn(() => Vue.observable(result) as T);
  return new Mock();
}

type Constructable<T> = new(...params: any[]) => T;

/**
 * Mocks given store.
 *
 * @returns {undefined}
 */
export function mock<T>(X: Constructable<T>, overrides: Partial<T> = {}): T {
  const mocks: any = new X();
  for (const key of _.keys(X.prototype)) {
    mocks[key] = vi.fn();
  }
  return {
    ...mocks,
    ...overrides,
  };
}

// export class TestStore<T> extends T {
//   public get state() {
//     return (this as any).state;
//   }
// }
// export function exposed<T>() {
//   return new TestStore<T>();
// }

export function createMockedStore<T extends { new(...args: any[]): any }>(
  StoreClass: T,
  methods: Partial<InstanceType<T>> = {},
): InstanceType<T> {
  // Create an actual instance of the StoreClass
  const storeInstance = new StoreClass();

  // Create a new object that inherits from the real store instance
  const mockedStore = Object.create(storeInstance);

  // Preserve reactivity for `state` and allow partial overwriting
  if (Object.prototype.hasOwnProperty.call(storeInstance, 'state')) {
    mockedStore.state = reactive({
      ...(storeInstance as any).state, // Copy the original state
      ...methods.state, // Allow overriding the state properties
    });
  }

  // Override only the methods passed in the `methods` argument
  Object.entries(methods).forEach(([key, value]) => {
    if (typeof value === 'function') {
      mockedStore[key] = vi.fn(value);
    }
    else {
      mockedStore[key] = value;
    }
  });

  return mockedStore;
}
