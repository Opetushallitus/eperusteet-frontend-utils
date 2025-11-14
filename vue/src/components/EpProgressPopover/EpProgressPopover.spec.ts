import { mount, RouterLinkStub } from '@vue/test-utils';
import EpProgressPopover from './EpProgressPopover.vue';
import { globalStubs } from '@shared/utils/__tests__/stubs';

describe('EpProgressPopover component', () => {
  test('Renders', async () => {
    const wrapper = mount(EpProgressPopover, {
      props: {
        slices: [1, 2],
      },
      global: {
        ...globalStubs,
      },
    });

    expect(wrapper.html()).toBeTruthy();
  });
});
