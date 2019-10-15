import { mount, createLocalVue, shallowMount } from '@vue/test-utils';
import EpList from '../EpList.vue';
import { KieliStore } from '../../../stores/kieli';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';

Vue.use(BootstrapVue);

describe('EpList component', () => {

  const localVue = createLocalVue();
  const valueMock = [{id: 1, kentta: 'arvo1'}, {id: 2, kentta: 'arvo2'}];

  KieliStore.setup(localVue,{
    messages: {
      fi: {
        'lisaa-sisalto': 'lisaasisalto',
      }
    },
  });

  const i18n = KieliStore.i18n;

  function mountWrapper() { 
    return mount(localVue.extend({
      components: {
        EpList,
      },
      props:['isEditing'],
      data(){
        return {
          value: valueMock
        };
      },
      template: '<ep-list :is-editable="isEditing" kentta="kentta" v-model="value" />'
    }), {
      stubs: {
        fas: true
      },
      localVue,
      i18n,
    });
  };

  test('Renders list with content', async () => {
    const wrapper = mountWrapper();

    expect(wrapper.html()).toContain('arvo1');
    expect(wrapper.html()).toContain('arvo2');

  });

  test('Delete list content', async () => {
    const wrapper = mountWrapper();

    wrapper.setProps({isEditing: true});
    await localVue.nextTick();

    expect(wrapper.vm.value).toHaveLength(2);

    wrapper.findAll('button.btn-link').at(0)
      .trigger('click');  
    expect(wrapper.vm.value).toHaveLength(1);

  });

  test('Add list content', async () => {
    const wrapper = mountWrapper();

    wrapper.setProps({isEditing: true});
    await localVue.nextTick();

    expect(wrapper.vm.value).toHaveLength(2);

    wrapper.find('.ep-button button').trigger('click'); 
    expect(wrapper.vm.value).toHaveLength(3);

  });

});
