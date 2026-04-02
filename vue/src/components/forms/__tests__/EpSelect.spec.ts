import { mount } from '@vue/test-utils';
import EpSelect from '../EpSelect.vue';
import { globalStubs } from '@shared/utils/__tests__/stubs';
import { nextTick } from 'vue';

describe('EpSelect component', () => {
  const itemMock = ['arvo1', 'arvo2', 'arvo3'];
  const valueMock = ['arvo1'];

  function mountWrapper(props: Record<string, unknown> = {}) {
    return mount(EpSelect, {
      props: {
        isEditing: true,
        items: itemMock,
        modelValue: valueMock,
        multiple: true,
        help: 'apu-teksti',
        validation: {},
        useCheckboxes: false,
        enableEmptyOption: true,
        ...props,
      },
      global: {
        ...globalStubs,
      },
    });
  }

  test('Renders items with checkboxes', async () => {
    const wrapper = mountWrapper({
      useCheckboxes: true,
    });

    await nextTick();

    expect(wrapper.html()).toContain('arvo1');
    expect(wrapper.html()).toContain('arvo2');
    expect(wrapper.html()).toContain('arvo3');
    expect(wrapper.html()).toContain('apu-teksti');
  });

  test('Value change on checkbox clicks', async () => {
    let emittedValue: unknown[] = ['arvo1'];
    const wrapper = mountWrapper({
      useCheckboxes: true,
      multiple: true,
      modelValue: ['arvo1'],
      'onUpdate:modelValue': (e: unknown[]) => {
        emittedValue = e as unknown[]; 
      },
    });

    await nextTick();

    expect(wrapper.props('modelValue')).toEqual(['arvo1']);

    const checkboxItems = wrapper.findAll('.checkbox-item');
    const thirdCheckboxInput = checkboxItems[2].find('input[type="checkbox"]');
    (thirdCheckboxInput.element as HTMLInputElement).checked = true;
    await thirdCheckboxInput.trigger('change');
    await nextTick();

    expect(emittedValue).toEqual(['arvo1', 'arvo3']);
  });

  test.skip('Value change on list clicks (single select)', async () => {
    const wrapper = mountWrapper({
      items: itemMock,
      modelValue: 'arvo1',
      multiple: false,
      help: '',
      useCheckboxes: false,
      validation: {},
      enableEmptyOption: true,
    });

    expect(wrapper.props('modelValue')).toBe('arvo1');
    // PrimeVue Select uses overlay - would need to open dropdown and click option
  });

  test.skip('Value change on list clicks - with checkboxes', async () => {
    const wrapper = mountWrapper({
      isEditing: true,
      items: itemMock,
      modelValue: valueMock,
      multiple: false,
      help: '',
      useCheckboxes: true,
      validation: {},
      enableEmptyOption: true,
    });

    expect(wrapper.findAll('.checkbox-item')).toHaveLength(3);
    expect(wrapper.props('modelValue')).toEqual(['arvo1']);

    const checkboxes = wrapper.findAll('input[type="checkbox"]');
    await checkboxes[2].trigger('click');
    await nextTick();

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
  });

  test.skip('Empty option disabled', async () => {
    const wrapper = mountWrapper({
      isEditing: true,
      items: itemMock,
      modelValue: null,
      multiple: false,
      help: '',
      useCheckboxes: false,
      validation: {},
      enableEmptyOption: false,
    });

    await nextTick();
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
  });

  test.skip('Empty option disabled with default value', async () => {
    const wrapper = mountWrapper({
      isEditing: true,
      items: itemMock,
      modelValue: 'arvo2',
      multiple: false,
      help: '',
      useCheckboxes: false,
      validation: {},
      enableEmptyOption: false,
    });

    expect(wrapper.props('modelValue')).toBe('arvo2');
  });
});
