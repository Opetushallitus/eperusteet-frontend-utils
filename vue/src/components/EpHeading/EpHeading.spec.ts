import { mount, RouterLinkStub } from '@vue/test-utils';
import EpHeading from './EpHeading.vue';

describe('EpHeading component', () => {

  test('Renders', async () => {
    const wrapper = mount(EpHeading, {
      props: {
        level: 1,
      },
      mocks: {
        $t: x => x,
      },
      stubs: {
        'router-link': RouterLinkStub,
      },
    });

    expect(wrapper.html()).toBeTruthy();
  });
});
