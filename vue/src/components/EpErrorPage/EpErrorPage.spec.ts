import { mount, RouterLinkStub } from '@vue/test-utils';
import { vi } from 'vitest'; // Import vi from vitest for mocking
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import EpErrorPage from '@/components/EpErrorPage/EpErrorPage.vue';
import { globalStubs } from '@shared/utils/__tests__/stubs';

// Mock the useHead function from @unhead/vue
vi.mock('@unhead/vue', () => ({
  useHead: vi.fn(),
}));

describe('EpExternalLink component', () => {
  function mountWrapper(props : any) {
    return mount(EpErrorPage, {
      props,
      global: {
        ...globalStubs,
      },
    });
  }

  test('Renders 404 page', async () => {
    const wrapper = mountWrapper({
      virhekoodi: '404',
    });

    expect(wrapper.html()).toContain('virhe-sivua-ei-loytynyt');
  });

  test('Renders 401 page', async () => {
    const wrapper = mountWrapper({
      virhekoodi: '401',
    });

    expect(wrapper.html()).toContain('virhe-sivua-ei-loytynyt');
  });

  test('Renders 500 page', async () => {
    const wrapper = mountWrapper({
      virhekoodi: '500',
    });

    expect(wrapper.html()).toContain('virhe-palvelu-virhe');
  });

  test('Renders 401 page with kohde text', async () => {
    const wrapper = mountWrapper({
      virhekoodi: '401',
      kohdeUrl: 'peruste',
    });

    expect(wrapper.html()).toContain('peruste-esikatselu-ei-mahdollista');
  });
});
