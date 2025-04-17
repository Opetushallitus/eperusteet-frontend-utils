import { mount } from '@vue/test-utils';
import EpAlert from './EpAlert.vue';
import Vue from 'vue';
import { nextTick } from 'vue';

describe('EpToggle component', () => {

  test('Renders toggle and change changes value', async () => {
    const wrapper = mount(EpAlert, {
      props: {
        text: 'tässä tekstiä',
        ops: false,
      },
    });

    const old = wrapper.html();
    expect(old).toContain('tässä tekstiä');

    wrapper.setProps({
      text: 'tässä tekstiä',
      ops: true,
    });

    await nextTick();

    expect(wrapper.html()).not.toEqual(old);
  });
});
