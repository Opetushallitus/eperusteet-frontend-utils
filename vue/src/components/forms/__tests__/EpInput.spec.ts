import { mount } from '@vue/test-utils';
import EpInput from '../EpInput.vue';
import { Kielet } from '../../../stores/kieli';
import { Kieli } from '@shared/tyypit';
import { Kaannos } from '@shared/plugins/kaannos';
import Vue, { nextTick } from 'vue';
import { globalStubs } from '@shared/utils/__tests__/stubs';

describe('EpInput component', () => {

  test('Renders input with content', async () => {
    const wrapper = mount(EpInput, {
      props: {
        help: 'apua',
        modelValue: 'arvo',
      },
      global: {
        ...globalStubs,
      },
    });

    await nextTick();

    expect(wrapper.html()).not.toContain('apua');

    wrapper.setProps({ isEditing: true });
    await nextTick();

    expect(wrapper.html()).toContain('apua');
  });

  test('Editing string', async () => {
    const wrapper = mount(EpInput, {
      props: {
        isEditing: false,
        modelValue: '123',
        'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
      },
      global: {
        ...globalStubs,
      },
    });

    await nextTick();
    expect(wrapper.html()).toContain('123');
    expect(wrapper.find('input[type="text"]').exists()).toBe(false);

    await wrapper.setProps({ isEditing: true });
    await nextTick();

    expect(wrapper.find('input[type="text"]').exists()).toBe(true);
    await wrapper.find('input[type="text"]').setValue('321');
    await nextTick();

    await wrapper.setProps({ isEditing: false });
    await nextTick();

    expect(wrapper.props('modelValue')).toBe('321');
    expect(wrapper.text()).toContain('321');
    expect(wrapper.text()).not.toContain('123');
  });

  test.skip('Renders input with non current lang', async () => {
    const wrapper = mount(EpInput, {
      props: {
        modelValue: {
          fi: 'arvo',
        },
      },
      attachTo: document.body,
      global: {
        ...globalStubs,
      },
    });

    await nextTick();

    expect(wrapper.html()).toContain('arvo');

    Kielet.setSisaltoKieli(Kieli.sv);

    await nextTick();
    expect(wrapper.html()).toContain('[arvo]');

    wrapper.setProps({ isEditing: true });
    await Vue.nextTick();
    expect(wrapper.html()).toContain('arvo');
    expect(wrapper.html()).not.toContain('[arvo]');

    wrapper.find('input').trigger('focus');
    await Vue.nextTick();
    expect(wrapper.html()).not.toContain('arvo');
  });
});
