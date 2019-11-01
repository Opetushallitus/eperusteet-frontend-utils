import { mount, createLocalVue, shallowMount } from '@vue/test-utils';
import EpSelect from '../EpSelect.vue';
import { KieliStore } from '../../../stores/kieli';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';

Vue.use(BootstrapVue);

describe('EpSelect component', () => {

  const localVue = createLocalVue();
  const itemMock = ['arvo1', 'arvo2', 'arvo3'];
  const valueMock = ['arvo1'];

  KieliStore.setup(localVue,{
    messages: {
      fi: {
        'apu-teksti': 'apu teksti',
      }
    },
  });

  const i18n = KieliStore.i18n;

  function mountWrapper(props : any) { 
    return mount(localVue.extend({
      components: {
        EpSelect,
      },
      data(){
        return props;
      },
      template: '<ep-select :items="items" v-model="value" :is-editing="isEditing" :multiple="multiple" :help="help" :validation="validation"/>'
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

});
