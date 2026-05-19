import { mount, RouterLinkStub } from '@vue/test-utils';
import EpPerustietoData from './EpPerustietoData.vue';
import { globalStubs } from '@shared/utils/__tests__/stubs';

describe('EpPerustietoData component', () => {
  test('Renders', async () => {
    const wrapper = mount(EpPerustietoData, {
      props: {
        icon: 'chevron-left',
        topic: 'topic',
      },
      global: {
        ...globalStubs,
      },
    });

    expect(wrapper.html()).toBeTruthy();
  });
});
