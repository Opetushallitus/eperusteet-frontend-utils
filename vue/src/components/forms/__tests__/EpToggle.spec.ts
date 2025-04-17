import { mount } from '@vue/test-utils';
import EpToggle from '../EpToggle.vue';
import Vue from 'vue';
import { describe, test, expect } from 'vitest';
import { globalStubs } from '@shared/utils/__tests__/stubs';

describe.skip('EpToggle component', () => {

  function mountWrapper() {
    return mount(EpToggle, {
      props: {
        value: false,
      },
      global: {
        ...globalStubs,
      },
    });
  }

  test('Renders toggle and change changes value', async () => {
    const wrapper = mountWrapper();
    expect(wrapper.vm.arvo).toBe(false);

    wrapper.find('input[type=checkbox]').setChecked(true);
    await Vue.nextTick();
    expect(wrapper.vm.arvo).toBe(true);

    wrapper.find('input[type=checkbox]').setChecked(false);
    await Vue.nextTick();
    expect(wrapper.vm.arvo).toBe(false);
  });
});
