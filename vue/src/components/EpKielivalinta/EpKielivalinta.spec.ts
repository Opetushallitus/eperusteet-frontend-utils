import { mount, RouterLinkStub } from '@vue/test-utils';
import EpKielivalinta from './EpKielivalinta.vue';
import { globalStubs } from '@shared/utils/__tests__/stubs';

describe('EpKielivalinta component', () => {

  test('Renders', async () => {
    const wrapper = mount(EpKielivalinta, {
      global: {
        ...globalStubs,
      },
      stubs: {
        'router-link': RouterLinkStub,
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
});
