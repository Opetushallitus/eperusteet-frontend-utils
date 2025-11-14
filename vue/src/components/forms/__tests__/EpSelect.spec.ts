import { mount } from '@vue/test-utils';
import EpSelect from '../EpSelect.vue';
import { vi } from 'vitest';
import { globalStubs } from '@shared/utils/__tests__/stubs';
import { nextTick } from 'vue';

describe('EpSelect component', () => {
  const itemMock = ['arvo1', 'arvo2', 'arvo3'];
  const valueMock = ['arvo1'];

  function mountWrapper(props : any) {
    const wrapper = mount(EpSelect, {
      data() {
        return props;
      },
      props: {
        ...props,
        'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
      },
      global: {
        ...globalStubs,
      },
    });

    return wrapper;
  }

  test('Renders list with content', async () => {
    const wrapper = mountWrapper({
      isEditing: false,
      items: itemMock,
      modelValue: valueMock,
      multiple: false,
      help: 'apu-teksti',
      validation: '',
      useCheckboxes: false,
      enableEmptyOption: true,
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
      modelValue: valueMock,
      multiple: false,
      help: 'apu-teksti',
      validation: '',
      useCheckboxes: false,
      enableEmptyOption: true,
    });

    expect(wrapper.html()).toContain('arvo1');
    expect(wrapper.html()).toContain('arvo2');
    expect(wrapper.html()).toContain('arvo3');

    expect(wrapper.html()).toContain('apu-teksti');
  });

  test('Value change on list clicks', async () => {
    const wrapper = mountWrapper({
      isEditing: true,
      items: itemMock,
      modelValue: valueMock,
      multiple: true,
      help: '',
      validation: '',
      useCheckboxes: false,
      enableEmptyOption: true,
    });

    expect(wrapper.props('modelValue')).toEqual(['arvo1']);
    wrapper.findAll('option').at(3)
      .setSelected();
    await nextTick();
    expect(wrapper.props('modelValue')).toEqual(['arvo1', 'arvo3']);

  });

  test.skip('Value change on list clicks', async () => {
    const wrapper = mountWrapper({
      isEditing: true,
      items: itemMock,
      modelValue: valueMock,
      multiple: false,
      help: '',
      useCheckboxes: false,
      validation: {
        $touch: vi.fn(),
      },
      enableEmptyOption: true,
    });

    expect(wrapper.vm.value).toHaveLength(1);
    wrapper.findAll('option').at(3)
      .setSelected();
    expect(wrapper.vm.value).toBe('arvo3');

    expect(wrapper.vm.validation.$touch).toBeCalled();
  });

  test.skip('Value change on list clicks - with checkboxes', async () => {
    const wrapper = mountWrapper({
      isEditing: true,
      items: itemMock,
      modelValue: valueMock,
      multiple: false,
      help: '',
      useCheckboxes: true,
      validation: {
        $touch: vi.fn(),
      },
      enableEmptyOption: true,
    });

    expect(wrapper.findAll('b-form-checkbox')).toHaveLength(3);
    expect(wrapper.props('modelValue')).toEqual(['arvo1']);

    wrapper.findAll('input[type="checkbox"]').at(2)
      .setChecked();
    await localVue.nextTick();
    expect(wrapper.vm.value).toEqual(['arvo1', 'arvo3']);

    expect(wrapper.vm.value).toHaveLength(2);
    expect(wrapper.vm.value[0]).toBe('arvo1');
    expect(wrapper.vm.value[1]).toBe('arvo3');

    wrapper.findAll('input[type="checkbox"]').at(0)
      .setChecked(false);
    await localVue.nextTick();
    expect(wrapper.vm.value).toHaveLength(1);
    expect(wrapper.vm.value[0]).toBe('arvo3');

    expect(wrapper.vm.validation.$touch).toBeCalled();
  });

  test.skip('Empty option disabled', async () => {
    const singleValue = null;

    const wrapper = mountWrapper({
      isEditing: true,
      items: itemMock,
      modelValue: singleValue,
      multiple: false,
      help: '',
      useCheckboxes: false,
      validation: {
        $touch: vi.fn(),
      },
      enableEmptyOption: false,
    });

    await localVue.nextTick();
    expect(wrapper.vm.value).toBe('arvo1');
    wrapper.findAll('option').at(2)
      .setSelected();
    expect(wrapper.vm.value).toBe('arvo3');

    expect(wrapper.vm.validation.$touch).toBeCalled();
  });

  test.skip('Empty option disabled with default value', async () => {
    const singleValue = 'arvo2';

    const wrapper = mountWrapper({
      isEditing: true,
      items: itemMock,
      modelValue: singleValue,
      multiple: false,
      help: '',
      useCheckboxes: false,
      validation: {
        $touch: vi.fn(),
      },
      enableEmptyOption: false,
    });

    expect(wrapper.vm.value).toBe('arvo2');
    wrapper.findAll('option').at(2)
      .setSelected();
    expect(wrapper.vm.value).toBe('arvo3');

    expect(wrapper.vm.validation.$touch).toBeCalled();
  });
});
