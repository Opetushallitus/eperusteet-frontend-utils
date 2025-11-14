import { mount, RouterLinkStub } from '@vue/test-utils';
import EpNavbar from './EpNavbar.vue';
import { globalStubs } from '@shared/utils/__tests__/stubs';
import { createPinia, setActivePinia } from 'pinia';
import { useRouter } from 'vue-router/types/composables';

describe('EpNavbar component', () => {
  beforeEach(() => {
    // creates a fresh pinia and makes it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia());
  });

  vi.mock('vue-router', () => (
    {
      useRoute: vi.fn(),
      useRouter: vi.fn(),
    }));

  test('Renders toggle and change changes value', async () => {
    const wrapper = mount(EpNavbar, {
      props: {
        kayttaja: {},
      },
      global: {
        ...globalStubs,
      },
    });

    expect(wrapper.html()).toBeTruthy();
  });
});
