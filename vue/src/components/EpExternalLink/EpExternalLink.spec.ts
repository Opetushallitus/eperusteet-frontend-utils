import { mount, createLocalVue, shallowMount } from '@vue/test-utils';
import EpExternalLink from './EpExternalLink.vue';
import { KieliStore } from '../../stores/kieli';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';

Vue.use(BootstrapVue);

describe('EpExternalLink component', () => {

  const localVue = createLocalVue();

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
        EpExternalLink,
      },
      data(){
        return props;
      },
      template: '<ep-external-link v-if="teksti" :url="url">{{ teksti }}</ep-external-link> <ep-external-link v-else :url="url"></ep-external-link>'
    }), {
      stubs: {
        fas: true
      },
      localVue,
      i18n,
    });
  };

  test('Renders external link ', async () => {
    const wrapper = mountWrapper({
      url: 'www.google.com',
      teksti: 'google'
    });

    expect(wrapper.html()).toContain('google</a>');

  });

  test('Renders external link ', async () => {
    const wrapper = mountWrapper({
      url: 'www.google.com',
      teksti: undefined
    });

    expect(wrapper.html()).not.toContain('google</a>');
    expect(wrapper.html()).toContain('<span>www.google.com');
    expect(wrapper.html()).toContain('?paluuosoite');

  });

});
