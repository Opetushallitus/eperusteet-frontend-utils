import { mount, shallowMount } from '@vue/test-utils';
import EpColorIndicator from './EpColorIndicator.vue';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import { globalStubs } from '@shared/utils/__tests__/stubs';
import { nextTick } from 'vue';

describe('EpToggle component', () => {

  test('Renders toggle and change changes value', async () => {
    const wrapper = mount(EpColorIndicator, {
      global: {
        ...globalStubs,
      },
      props: {},
    });

    expect(wrapper.html()).toContain('normaali');

    wrapper.setProps({
      kind: 'julkaistu',
      tooltip: true,
      size: 20,
    });

    await nextTick();

    expect(wrapper.html()).toContain('julkaistu');
    expect(wrapper.html()).toContain('circle');

    expect(wrapper.element.style.color).toMatchSnapshot();

    wrapper.setProps({
      kind: 'esiopetus',
      tooltip: true,
      size: 20,
    });

    await nextTick();

    expect(wrapper.element.style.color).toMatchSnapshot();
  });
});
