import { mount, createLocalVue, shallowMount } from '@vue/test-utils';
import EpFormContent from '../EpFormContent.vue';
import { KieliStore } from '../../../stores/kieli';

describe('EpFormContent component', () => {

  const localVue = createLocalVue();

  KieliStore.setup(localVue,{
    messages: {
      fi: {
        'sisalto-teksti': 'sisältö teksti',
      }
    },
  });

  const i18n = KieliStore.i18n;

  function mountWrapper() { 
    return mount(localVue.extend({
      components: {
        EpFormContent,
      },
      template: '<ep-form-content name="sisalto-teksti" />'
    }), {
      localVue,
      i18n,
    });
  };

  test('Renders content with content', async () => {
    const wrapper = mountWrapper();
    expect(wrapper.html()).toContain('sisältö teksti');
  });

});
