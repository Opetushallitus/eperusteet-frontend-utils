import { mount, createLocalVue, shallowMount } from '@vue/test-utils';
import EpSelect from '../EpSelect.vue';
import { Kielet } from '../../../stores/kieli';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import BootstrapVue from 'bootstrap-vue';

Vue.use(BootstrapVue);


describe('EpSelect component', () => {

  const localVue = createLocalVue();
  localVue.use(VueI18n);
  localVue.use(Kielet, {
    messages: {
      fi: {
        'apu-teksti': 'apu teksti',
      }
    },
  });

  const i18n = Kielet.i18n;
  const itemMock = ['arvo1', 'arvo2', 'arvo3'];
  const valueMock = ['arvo1'];

  function mountWrapper(props : any) {
    return mount(localVue.extend({
      components: {
        EpSelect,
      },
      data(){
        return props;
      },
      template: '<ep-select :items="items" v-model="value" :is-editing="isEditing" :multiple="multiple" :help="help" :validation="validation" :useCheckboxes="useCheckboxes"/>'
    }), {
      stubs: {
        fas: true
      },
      localVue,
      i18n,
    });
  };

  test('Renders list with content', async () => {
    const wrapper = mountWrapper({
      isEditing: false,
      items: itemMock,
      value: valueMock,
      multiple: false,
      help:'apu-teksti',
      validation:'',
      useCheckboxes: false,
    });

    expect(wrapper.html()).toContain('arvo1');
    expect(wrapper.html()).not.toContain('arvo2');
    expect(wrapper.html()).not.toContain('arvo3');

    expect(wrapper.html()).not.toContain('apu teksti');

  });

  test('Renders list with content when editable', async () => {
    const wrapper = mountWrapper({
      isEditing: true,
      items: itemMock,
      value: valueMock,
      multiple: false,
      help:'apu-teksti',
      validation:'',
      useCheckboxes: false,
    });

    expect(wrapper.html()).toContain('arvo1');
    expect(wrapper.html()).toContain('arvo2');
    expect(wrapper.html()).toContain('arvo3');

    expect(wrapper.html()).toContain('apu teksti');

  });

  test('Value change on list clicks', async () => {
    const wrapper = mountWrapper({
      isEditing: true,
      items: itemMock,
      value: valueMock,
      multiple: true,
      help:'',
      validation:'',
      useCheckboxes: false,
    });

    expect(wrapper.vm.value).toHaveLength(1);

    wrapper.findAll('option').at(3)
      .setSelected();

    expect(wrapper.vm.value).toHaveLength(2);
    expect(wrapper.vm.value[1]).toBe('arvo3');

  });

  test('Value change on list clicks', async () => {
    const wrapper = mountWrapper({
      isEditing: true,
      items: itemMock,
      value: valueMock,
      multiple: false,
      help:'',
      useCheckboxes: false,
      validation: {
        $touch:jest.fn()
      }
    });

    expect(wrapper.vm.value).toHaveLength(1);
    wrapper.findAll('option').at(3)
      .setSelected();
    expect(wrapper.vm.value).toBe('arvo3');

    expect(wrapper.vm.validation.$touch).toBeCalled();

  });

  test('Value change on list clicks - with checkboxes', async () => {
    const wrapper = mountWrapper({
      isEditing: true,
      items: itemMock,
      value: valueMock,
      multiple: false,
      help:'',
      useCheckboxes: true,
      validation: {
        $touch:jest.fn()
      }
    });

    expect(wrapper.findAll('input[type="checkbox"]')).toHaveLength(3);
    expect(wrapper.vm.value).toEqual(['arvo1']);

    wrapper.findAll('input[type="checkbox"]').at(2)
      .setChecked();
    expect(wrapper.vm.value).toEqual(['arvo1', 'arvo3']);

    expect(wrapper.vm.value).toHaveLength(2);
    expect(wrapper.vm.value[0]).toBe('arvo1');
    expect(wrapper.vm.value[1]).toBe('arvo3');

    wrapper.findAll('input[type="checkbox"]').at(0)
      .setChecked(false);
    expect(wrapper.vm.value).toHaveLength(1);
    expect(wrapper.vm.value[0]).toBe('arvo3');

    expect(wrapper.vm.validation.$touch).toBeCalled();

  });

});
