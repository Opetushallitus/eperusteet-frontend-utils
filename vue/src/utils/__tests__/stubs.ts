import { mount, RouterLinkStub } from '@vue/test-utils';
import { h, renderSlot } from 'vue';
import { createHead } from '@unhead/vue/client';
import { setAppInstance } from '../globals';
import { setPrimeVue } from '../../primevue';
import { vSticky } from '../../directives/vSticky';

const primeVuePlugin = {
  install(app: any) {
    setPrimeVue(app);
  },
};

export const testPlugin = {
  install(app) {
    // Set the app instance so useGlobalProperties() can access it
    setAppInstance(app);

    app.config.globalProperties.$kaanna = x => x ? x.fi : 'kaanna';
    app.config.globalProperties.$kaannaPlaceholder = (tKey) => tKey;
    app.config.globalProperties.$t = (tKey) => tKey;
    app.config.globalProperties.$slang = () => 'fi';
    app.config.globalProperties.$sd = (tKey) => tKey;
    app.config.globalProperties.$sdt = (tKey) => tKey;
    app.config.globalProperties.$sdm = (tKey) => tKey;
    app.config.globalProperties.$cdt = (tKey) => tKey;
    app.config.globalProperties.$kaannaOlioTaiTeksti = (tKey) => tKey;
    app.config.globalProperties.$ld = (tKey) => tKey;
    app.config.globalProperties.$ldm = (tKey) => tKey;
    app.config.globalProperties.$ldt = (tKey) => tKey;
    app.config.globalProperties.$fail = (tKey: string, text?: string, duration?: number) => tKey;
    app.config.globalProperties.$success = (tKey: string) => tKey;
    app.config.globalProperties.$ago = (date: any) => date;
    app.config.globalProperties.$confirmModal = {};
    app.config.globalProperties.$isAdmin = () => true;
    app.config.globalProperties.$hasOphCrud = () => true;
  },
};

export const globalStubs = {
  plugins: [
    testPlugin,
    primeVuePlugin,
    createHead(),
  ],
  stubs: {
    'router-link': RouterLinkStub,
    'oikeustarkastelu': true,
    // TipTap component stubs to prevent Vue 2/3 compatibility issues
    'editor-content': {
      render() {
        return h('div', { class: 'editor-content-stub' }, [
          renderSlot(this.$slots, 'default'),
        ]);
      },
    },
    'ep-content': {
      render() {
        return h('div', { class: 'ep-content-stub' }, [
          renderSlot(this.$slots, 'default'),
        ]);
      },
    },
    'ep-editor-menu-bar': true,
    'ep-editor-menu-bar-vue3': true,
  },
  directives: {
    oikeustarkastelu: {
      mounted(el, binding) {
        // Stub implementation that always passes permission check
        // This ensures elements with v-oikeustarkastelu remain visible in tests
      },
    },
    sticky: vSticky,
  },
};

export function createMount(component, options = {}) {
  return mount(component as any, {
    ...options,
    global: {
      ...globalStubs,
    },
  });
}
