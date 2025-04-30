import { mount, createLocalVue } from '@vue/test-utils';
import EpInput from '../EpInput.vue';
import VueI18n from 'vue-i18n';
import { Kielet } from '../../../stores/kieli';
import { Kieli } from '@shared/tyypit';
import { Kaannos } from '@shared/plugins/kaannos';
import Vue from 'vue';

describe('EpInput component', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  localVue.use(new Kaannos());

  Kielet.install(localVue, {
    messages: {
      fi: {
        'apua': 'aputarve',
      },
    },
  });

  const i18n = Kielet.i18n;

  test('Renders input with content', async () => {
    const wrapper = mount(EpInput, {
      propsData: {
        help: 'apua',
        value: 'arvo',
      },
      localVue,
      i18n,
    });

    await Vue.nextTick();

    expect(wrapper.html()).not.toContain('apua');

    wrapper.setProps({ isEditing: true });
    await Vue.nextTick();

    expect(wrapper.html()).toContain('aputarve');
  });

  test('Editing string', async () => {
    const wrapper = mount(localVue.extend({
      components: {
        EpInput,
      },
      props: ['isEditing'],
      data() {
        return {
          value: '123',
        };
      },
      template: '<ep-input :is-editing="isEditing" type="string" v-model="value" />',
    }), {
      propsData: {
        value: '123',

      },
      localVue,
      i18n,
    });

    await Vue.nextTick();
    expect(wrapper.html()).toContain('123');

    wrapper.setProps({ isEditing: true });
    await localVue.nextTick();

    wrapper.find('input[type="text"]').setValue('321');

    wrapper.setProps({ isEditing: false });
    await Vue.nextTick();

    expect(wrapper.text()).toContain('321');
    expect(wrapper.text()).not.toContain('123');
  });

  test('Renders input with non current lang', async () => {
    const wrapper = mount(EpInput, {
      propsData: {
        value: {
          fi: 'arvo',
        },
      },
      localVue,
      i18n,
      attachTo: document.body,
    });

    await localVue.nextTick();

    expect(wrapper.html()).toContain('arvo');
    Kielet.setSisaltoKieli(Kieli.sv);

    await Vue.nextTick();
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
