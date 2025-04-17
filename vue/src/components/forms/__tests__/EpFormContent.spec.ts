import { mount } from '@vue/test-utils';
import EpFormContent from '../EpFormContent.vue';
import VueI18n from 'vue-i18n';
import { Kielet } from '../../../stores/kieli';

describe('EpFormContent component', () => {
  const i18n = Kielet.i18n;

  function mountWrapper() {
    return mount(EpFormContent, {
      props: {
        name: 'sisalto-teksti',
      },
    });
  }

  test('Renders content with content', async () => {
    const wrapper = mountWrapper();
    expect(wrapper.html()).toContain('sisalto-teksti');
  });
});
