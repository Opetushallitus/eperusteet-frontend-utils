import _ from 'lodash';
import { findDeep } from 'deepdash-es/standalone';

export function domAttrsGetter(...fields: string[]) {
  return (dom: any) => _.reduce(fields, (acc: any, field: string) => {
    return ({
      ...acc,
      [field]: dom.getAttribute(field),
    });
  }, {});
}

export function mapNodeAttrs(...fields: string[]) {
  return _.reduce(fields, (acc: any, field: string) => ({
    ...acc,
    [field]: {
      get() {
        return (this as any).node.attrs[field];
      },
      set(value: any) {
        (this as any).updateAttrs({
          [field]: value,
        });
      },
    },
  }), {});
}

export function deepFind(filterObject: any, searchObject: any) {
  return _.get(findDeep(searchObject, (value, key) => {
    if (_.keys(filterObject)[0] === key && _.values(filterObject)[0] === value) return true;
    return false;
  }), 'parent');
}
