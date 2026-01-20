/* eslint-disable vue/prefer-import-from-vue */
declare module 'vue' {
  import { CompatVue } from '@vue/compat';
  const Vue: CompatVue;
  export default Vue;
  export * from '@vue/compat';
  export * from '@vue/runtime-core';
}
/* eslint-enable vue/prefer-import-from-vue */

declare module '*.svg' {
  const value: any;
  export = value;
}

declare module '*.png' {
  const value: any;
  export = value;
}

type Ref = any;

declare module 'vue-loading-overlay';
declare module 'vue-multiselect';
declare module 'vue-progressbar';
declare module 'vue-sticky-directive';
declare module 'vue2-datepicker';
declare module 'tiptap';
declare module 'tiptap-extensions';
