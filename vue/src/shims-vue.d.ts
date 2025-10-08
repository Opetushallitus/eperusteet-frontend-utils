// export {};

declare module 'vue' {
  import { CompatVue } from 'vue';
  const Vue: CompatVue;
  export default Vue;
  import { configureCompat } from '@vue/compat';
  export { configureCompat };
}

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
