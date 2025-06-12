import { createUnhead } from "@unhead/vue";
import { mount, RouterLinkStub } from "@vue/test-utils";
import { createPinia } from "pinia";
import { h, renderSlot } from 'vue';
import { createHead } from '@unhead/vue/client';

const generateBootstrapStubs = () => {
  const stubs = {};
  const components = [
    'b-form-checkbox',
    'b-form-group',
    'b-form-input',
    'b-button',
    'b-form-select',
    'b-card',
    'b-row',
    'b-col',
    'b-input-group-append',
    'b-input-group',
    'b-table',
    'b-pagination',
    'b-modal',
    'b-form-invalid-feedback',
    'b-popover',
    'b-tooltip',
    'b-nav-item-dropdown',
    'b-dd-item',
    'b-dd-item-button',
    'b-dropdown-divider',
    'b-dropdown-item',
    'b-dropdown',
    'b-container',
    'b-link',
    // Add any other B components you use
  ];

  components.forEach(name => {
    stubs[name] = {
      render() {
        return h('div', { class: name }, [
          // Render default slot
          renderSlot(this.$slots, 'default'),
          // Dynamically render any other slots
          ...Object.keys(this.$slots)
            .filter(slotName => slotName !== 'default')
            .map(slotName =>
              h('div', { class: `${name}__slot-${slotName}` }, [
                renderSlot(this.$slots, slotName),
              ]),
            ),
        ]);
      },
    };
  });

  return stubs;
};

export const testPlugin = {
  install(app) {
    app.config.globalProperties.$kaanna = x => x ? x.fi : 'kaanna';
    app.config.globalProperties.$kaannaPlaceholder = (tKey) => tKey;
    app.config.globalProperties.$t = (tKey) => tKey;
    app.config.globalProperties.$slang = () => 'fi';
    app.config.globalProperties.$sd = (tKey) => tKey;
    app.config.globalProperties.$sdt = (tKey) => tKey;
    app.config.globalProperties.$sdm = (tKey) => tKey;
    app.config.globalProperties.$kaannaOlioTaiTeksti = (tKey) => tKey;
  },
};

export const globalStubs = {
  plugins: [
    testPlugin,
    createHead(),
  ],
  stubs: {
    'router-link': RouterLinkStub,
    'oikeustarkastelu': true,
    ...generateBootstrapStubs(),
  },
  directives: {
    oikeustarkastelu: {
      mounted(el, binding) {
        // Stub implementation that always passes permission check
        // This ensures elements with v-oikeustarkastelu remain visible in tests
      },
    },
    sticky: {
      mounted() {
        // Stub for v-sticky directive
      },
    },
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
