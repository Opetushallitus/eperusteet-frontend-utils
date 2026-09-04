import { mount, RouterLinkStub } from '@vue/test-utils';
import EpTiedoteList from './EpTiedoteList.vue';
import { globalStubs } from '@shared/utils/__tests__/stubs';

describe('EpTiedoteList component', () => {
  test('Renders', async () => {
    const wrapper = mount(EpTiedoteList, {
      props: {
        tiedotteet: [{
        }],
      },
      global: {
        ...globalStubs,
      },
    });

    expect(wrapper.html()).toBeTruthy();
  });
});
