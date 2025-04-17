import { mount } from '@vue/test-utils';
import EpBalloonList from './EpBalloonList.vue';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';

describe.skip('EpBalloonList component', () => {
  test('Renders', async () => {
    const wrapper = mount(EpBalloonList, {
      props: {
        modelValue: ['testi1', 'testi2'],
      },
    });

    expect(wrapper.html()).toBeTruthy();
    expect(wrapper.findAll('.balloon')).toHaveLength(2);
  });
});
