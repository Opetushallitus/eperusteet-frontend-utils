import EpButton from '@shared/components/EpButton/EpButton.vue';
import { mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import { describe, it, expect } from 'vitest';
import Vue from 'vue';

Vue.use(BootstrapVue);

describe('Vue.extend', () => {
  it('should exist in Vue', () => {
    expect(Vue).toBeDefined();
    expect('extend' in Vue).toBe(true);

    const wrapper = mount(EpButton, {
      slots: {
        default: 'Test',
      },
    });
    expect(wrapper.html()).toContain('Test');
  });
});
