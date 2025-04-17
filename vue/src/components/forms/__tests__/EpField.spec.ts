import { mount } from '@vue/test-utils';
import EpField from '../EpField.vue';
import { nextTick } from 'vue';
import { globalStubs } from '@shared/utils/__tests__/stubs';

describe('EpInput component', () => {

  test('Renders field with content', async () => {
    const wrapper = mount(EpField, {
      props: {
        value: 'arvo',
      },
      global: {
        ...globalStubs,
      },
    });

    await nextTick();

    expect(wrapper.html()).toContain('arvo');
  });
});
