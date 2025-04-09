import Vue from 'vue';
import _ from 'lodash';
import { Wrapper } from '@vue/test-utils';
import { EditointiStore, IEditoitava } from '../components/EpEditointi/EditointiStore';
import { vi } from 'vitest';
import { reactive, computed } from 'vue';

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

export function wrap<T extends object>(OriginalClass: new (...args: any[]) => T, overrides: Partial<T> = {}): T {
  const instance = new OriginalClass(); // Create a real instance to get all methods
  const result: any = {};

  // Get all methods from prototype (including inherited ones)
  let proto = OriginalClass.prototype;
  while (proto && proto !== Object.prototype) {
    for (const key of Reflect.ownKeys(proto)) {
      if (key !== 'constructor' && typeof (proto as any)[key] === 'function') {
        result[key] = vi.fn();
      }
    }
    proto = Object.getPrototypeOf(proto);
  }

  // Copy over instance properties (but not methods)
  for (const key of Object.keys(instance)) {
    result[key] = instance[key];
  }

  // Apply overrides (functions will be mocked again if overridden)
  _.forEach(overrides, (value, key) => {
    result[key] = _.isFunction(value) ? vi.fn(value) : value;
  });

  return Vue.observable(result) as T;
}

type Constructable<T> = new(...params: any[]) => T;

/**
 * Mocks given store.
 *
 * @returns {undefined}
 */
export function mock<T>(X: new (...args: any[]) => T, overrides: Partial<T> = {}): T {
  const prototypeKeys = Reflect.ownKeys(X.prototype) as (keyof T)[];
  const mocks: Partial<T> = {};

  for (const key of prototypeKeys) {
    if (key !== 'constructor') {
      mocks[key] = vi.fn();
    }
  }

  return {
    ...mocks,
    ...overrides,
  } as T;
}

// export class TestStore<T> extends T {
//   public get state() {
//     return (this as any).state;
//   }
// }
// export function exposed<T>() {
//   return new TestStore<T>();
// }

export function createMockedStore(StoreClass: any, methods: Record<string, any>) {
  const MockedStore = vi.fn();
  Object.entries(methods).forEach(([key, value]) => {
    if (typeof value === 'function') {
      MockedStore.prototype[key] = vi.fn(value);
    } else {
      MockedStore.prototype[key] = value;
    }
  });
  return new MockedStore();
}
