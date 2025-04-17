import { mount } from '@vue/test-utils';
import EpSpinner from './EpSpinner.vue';
import { globalStubs } from '@shared/utils/__tests__/stubs';

describe('EpSpinner component', () => {
  test('Renders', async () => {
    const wrapper = mount(EpSpinner, {
      globals: {
        ...globalStubs,
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
