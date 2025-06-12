import { mount, RouterLinkStub } from '@vue/test-utils';
import EpJarjesta from './EpJarjesta.vue';
import { globalStubs } from '@shared/utils/__tests__/stubs';

describe.skip('EpJarjesta component', () => {
  test('Renders', async () => {
    const wrapper = mount(EpJarjesta, {
      modelValue: [],
      global: {
        ...globalStubs,
      },
    });

    expect(wrapper.html()).toBeTruthy();
  });
});
