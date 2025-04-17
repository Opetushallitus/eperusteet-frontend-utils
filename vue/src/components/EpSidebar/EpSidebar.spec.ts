import { mount } from '@vue/test-utils';
import EpSidebar from './EpSidebar.vue';
import { globalStubs } from '../../utils/__tests__/stubs';

vi.mock('vue-router', () => (
  {
    useRoute: vi.fn(),
    useRouter: vi.fn(),
  }));

describe('EpSidebar component', () => {
  test('Renders', async () => {
    const wrapper = mount(EpSidebar, {
      props: {
      },
      globalStubs: {
        ...globalStubs,
      },
    });

    expect(wrapper.html()).toBeTruthy();
  });
});
