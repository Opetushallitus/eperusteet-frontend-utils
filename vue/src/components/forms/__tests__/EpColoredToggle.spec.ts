import { mount, createLocalVue } from '@vue/test-utils';
import EpColoredToggle from '../EpColoredToggle.vue';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';

Vue.use(BootstrapVue);

describe('EpColoredToggle component', () => {
  const localVue = createLocalVue();

  function mountWrapper() {
    return mount(localVue.extend({
      components: {
        EpColoredToggle,
      },
      data() {
        return {
          arvo: false,
        };
      },
      template: '<ep-colored-toggle v-model="arvo" />',
    }), {
      localVue,
      mocks: {
        $t: x => x,
      },
    });
  }

  test('Renders toggle and change changes value', async () => {
    const wrapper = mountWrapper();
    expect(wrapper.vm.arvo).toBe(false);
    expect(wrapper.find('button').html()).not.toContain('done');

    wrapper.find('button').trigger('click');
    expect(wrapper.vm.arvo).toBe(true);
    expect(wrapper.find('button').html()).toContain('done');

    wrapper.find('button').trigger('click');
    expect(wrapper.vm.arvo).toBe(false);
    expect(wrapper.find('button').html()).not.toContain('done');
  });
});
