import { mount } from '@vue/test-utils';
import EpSearch from '../EpSearch.vue';
import VueI18n from 'vue-i18n';
import { Kielet } from '../../../stores/kieli';
import { wrap } from '../../../utils/jestutils';
import { vi } from 'vitest';
import { nextTick } from 'vue';
import { globalStubs } from '@shared/utils/__tests__/stubs';

describe('EpSearch component', () => {

  function mountWrapper(propsit) {
    return mount(EpSearch, {
      props: {
        ...propsit,
      },
      global: {
        ...globalStubs,
      },
    });
  }

  test('Renders content with content', async () => {
    const wrapper = mountWrapper({ placeholder: null, rajain: '' });
    expect(wrapper.html()).toContain('etsi');
  });

  test('Renders content with content and props', async () => {
    const wrapper = mountWrapper({ placeholder: 'etsi-teksti', rajain: '', srOnlyLabelText: 'etsi-tietoja-sivulta-haku' });
    wrapper.setProps({ placeholder: 'etsi-teksti', srPlaceholder: 'etsi-tietoja-sivulta-haku' });
    await nextTick();

    expect(wrapper.find('input').html()).toContain('etsi-teksti');
    expect(wrapper.find('label').html()).toContain('etsi-tietoja-sivulta-haku');
  });

  test('Renders content with content and props', async () => {
    const testrajain = '';
    const wrapper = mountWrapper({ placeholder: 'etsi-teksti', rajain: testrajain });

    wrapper.find('input').setValue('arvoa');
    await nextTick();

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['arvoa']);
  });
});
