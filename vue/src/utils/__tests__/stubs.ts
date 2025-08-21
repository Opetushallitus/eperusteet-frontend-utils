import { mount, RouterLinkStub } from '@vue/test-utils';
import { h, renderSlot } from 'vue';
import { createHead } from '@unhead/vue/client';
import { setAppInstance } from '../globals';
import { bTableStub } from './b-table-stub';

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
    'b-modal',
    'b-pagination',
    'b-form-invalid-feedback',
    'b-popover',
    'b-tooltip',
    'b-nav-item-dropdown',
    'b-dd-item',
    'b-dd-item-button',
    'b-dropdown-divider',
    'b-dropdown-item',
    'b-dropdown-item-button',
    'b-dropdown',
    'b-container',
    'b-link',
    'b-form-checkbox-group',
    'b-tabs',
    'b-tab',
    // Add any other B components you use
  ];

  components.forEach(name => {
    // Special handling for b-table component
    if (name === 'b-table') {
      stubs[name] = bTableStub;
    }
    else {
      // Default stub for other components
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
    }
  });

  return stubs;
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
    app.config.globalProperties.$kaannaOlioTaiTeksti = (tKey) => tKey;
    app.config.globalProperties.$ld = (tKey) => tKey;
    app.config.globalProperties.$ldm = (tKey) => tKey;
    app.config.globalProperties.$ldt = (tKey) => tKey;
    app.config.globalProperties.$fail = (tKey: string, text?: string, duration?: number) => tKey;
    app.config.globalProperties.$success = (tKey: string) => tKey;
    app.config.globalProperties.$ago = (date: any) => date;
    app.config.globalProperties.$bvModal = {};
    app.config.globalProperties.$isAdmin = () => true;
    app.config.globalProperties.$hasOphCrud = () => true;
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
