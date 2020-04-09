import { mount, createLocalVue, shallowMount } from '@vue/test-utils';
import EpSearch from '../EpSearch.vue';
import VueI18n from 'vue-i18n';
import { Kielet } from '../../../stores/kieli';

describe('EpFormContent component', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  Kielet.install(localVue, {
    messages: {
      fi: {
        'etsi': 'Etsi',
      },
    },
  });

  const i18n = Kielet.i18n;

  function mountWrapper(updateSearch, propsit) {
    return mount(localVue.extend({
      components: {
        EpSearch,
      },
      methods: {
        updateSearch,
      },
      data() {
        return propsit;
      },
      template: '<ep-search v-model="rajain" @input="updateSearch" :placeholder="placeholder"/>',
    }), {
      localVue,
      i18n,
      stubs: {
        fas: true,
      },
    });
  };

  test('Renders content with content', async () => {
    const testMethod = jest.fn();
    const wrapper = mountWrapper(testMethod, { placeholder: null, rajain: '' });
    expect(wrapper.html()).toContain('Etsi');
  });

  test('Renders content with content and props', async () => {
    const testMethod = jest.fn();
    const wrapper = mountWrapper(testMethod, { placeholder: 'etsi-teksti', rajain: '' });
    wrapper.setProps({ placeholder: 'etsi-teksti' });
    await localVue.nextTick();
    expect(wrapper.find('input').html()).toContain('etsi-teksti');
  });

  test('Renders content with content and props', async () => {
    const testMethod = jest.fn();
    const testrajain = '';
    const wrapper = mountWrapper(testMethod, { placeholder: 'etsi-teksti', rajain: testrajain });

    wrapper.find('input').setValue('arvoa');
    await localVue.nextTick();
    expect(testMethod).toBeCalled();
  });
});
