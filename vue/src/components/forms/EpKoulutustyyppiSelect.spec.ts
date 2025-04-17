import { mount } from '@vue/test-utils';
import EpKoulutustyyppiSelect from './EpKoulutustyyppiSelect.vue';
import { globalStubs } from '@shared/utils/__tests__/stubs';

describe('EpKoulutustyyppiSelect', () => {
  it('Renders', () => {
    const wrapper = mount(EpKoulutustyyppiSelect, {
      props: {
        value: null,
      },
      global: {
        ...globalStubs,
      },
    });
  });

  it('value not set', () => {
    const wrapper = mount(EpKoulutustyyppiSelect, {
      props: {
        modelValue: null,
        isEditing: true,
      },
      global: {
        ...globalStubs,
      },
    });

    expect(wrapper.find('.multiselect__placeholder').html()).toContain('kaikki');
    expect(wrapper.html()).not.toContain('.multiselect__single');
  });

  it('value set', () => {
    const wrapper = mount(EpKoulutustyyppiSelect, {
      props: {
        modelValue: 'koulutustyyppi_20',
        isEditing: true,
      },
      global: {
        ...globalStubs,
      },
    });

    expect(wrapper.find('.multiselect__single').html()).toContain('koulutustyyppi_20');
    expect(wrapper.html()).not.toContain('.multiselect__placeholder');
  });
});
