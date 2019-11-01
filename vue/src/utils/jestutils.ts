import Vue from 'vue';
import _ from 'lodash';

import { Wrapper } from '@vue/test-utils';

import '@/config/bootstrap';
import '@/config/fontawesome';


export function findAllContaining<T extends Vue>(wrapper: Wrapper<T>, selector: string, text: string) {
  return wrapper.findAll(selector).filter(r => r.text().includes(text));
}

export function findContaining<T extends Vue>(wrapper: Wrapper<T>, selector: string, text: string) {
  const results = findAllContaining(wrapper, selector, text);
  if (results.length !== 1) {
    throw new Error('Multiple results: ' + selector + ' ' + text);
  }
  return results.at(0);
}

export const mocks = Object.freeze({
  $t: x => x,
  $kaanna: x => x ? x.fi : 'kaanna',
  $sd: x => x,
  $ld: x => x,
}) as any;

export const stubs = Object.freeze({
  RouterLink: true,
}) as any;

export function wrap<T extends object>(original: T, value: T) {
  const result: any = {};

  // Get original implementations
  for (const k in original) {
    if (_.isFunction(original[k])) {
      result[k] = jest.fn(original[k] as any);
    }
    else {
      result[k] = original[k];
    }
  }

  // Overwrite with default mocks
  _.forEach(value, (v, k) => {
    if (_.isFunction(v)) {
      result[k] = jest.fn(v);
    }
    else {
      result[k] = Vue.observable(v);
    }
  });

  const Mock = jest.fn(() => Vue.observable(result) as T);
  return new Mock();
}
