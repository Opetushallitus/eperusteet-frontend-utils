import { mount } from '@vue/test-utils';
import EpMultiListSelect from '../EpMultiListSelect.vue';
import { createI18n } from 'vue-i18n';
import { defineComponent, nextTick } from 'vue';
import { Ongelma } from '../../../../generated/api';
import { globalStubs } from '@shared/utils/__tests__/stubs';

describe('EpMultiListSelect component', () => {
  const itemMock = [
    {
      value: 'value1',
      text: 'text1',
    },
    {
      value: 'value2',
      text: 'text2',
    }, {
      value: 'value3',
      text: 'text3',
    },
  ];
  const valueMockEmpty = [];
  const valueMock = ['value1', 'value2', 'value3'];
  const valueSingle = 'value1';

  const i18n = createI18n({
    legacy: false,
    locale: 'fi',
    messages: {
      fi: {
        'lisaa-tyyppi1': 'lisaa tyyppi',
        'ei-hakutuloksia': 'ei hakutuloksia',
        'ei-vaihtoehtoja': 'ei vaihtoehtoja',
      },
    },
  });

  function mountWrapper(props: any) {
    const TestComponent = defineComponent({
      components: {
        EpMultiListSelect,
      },
      data() {
        return props;
      },
      template: `<ep-multi-list-select
                  v-model="modelValue"
                  :tyyppi="tyyppi"
                  :items="items"
                  :isEditing="isEditing"
                  :validation="validation"
                  :multiple="multiple"
                  :required="required"/>`,
    });

    return mount(TestComponent, {
      global: {
        ...globalStubs,
      },
    });
  }

  test('Renders one list with content', async () => {
    const wrapper = mountWrapper({
      items: itemMock,
      modelValue: valueMockEmpty,
      tyyppi: 'tyyppi1',
      validation: '',
      required: true,
      isEditing: true,
      multiple: true,
      update: () => {},
    });

    expect(wrapper.html()).toContain('text1');
    expect(wrapper.html()).toContain('text2');
    expect(wrapper.html()).toContain('text3');

    expect(wrapper.findAll('.multiselect__element')).toHaveLength(3);

    expect(wrapper.html()).toContain('lisaa-tyyppi1');
  });

  test('No lists rendered when not required', async () => {
    const wrapper = mountWrapper({
      items: itemMock,
      modelValue: valueMockEmpty,
      tyyppi: 'tyyppi1',
      validation: '',
      required: false,
      isEditing: true,
      multiple: true,
      update: () => {},
    });

    expect(wrapper.findAll('.multiselect__select')).toHaveLength(0);
  });

  test('Renders list when add button pressed', async () => {
    const wrapper = mountWrapper({
      items: itemMock,
      modelValue: valueMockEmpty,
      tyyppi: 'tyyppi1',
      validation: '',
      required: true,
      isEditing: true,
      multiple: true,
      update: () => {},
    });

    expect(wrapper.findAll('.multiselect__select')).toHaveLength(1);
    expect(wrapper.findAll('.lisaa-valinta')).toHaveLength(1);
    await wrapper.find('.lisaa-valinta').trigger('click');
    await nextTick();

    expect(wrapper.findAll('.multiselect__select')).toHaveLength(2);
    await wrapper.find('.lisaa-valinta').trigger('click');
    await nextTick();
    expect(wrapper.findAll('.multiselect__select')).toHaveLength(3);
  });

  test('Renders list when lists are removed', async () => {
    const wrapper = mountWrapper({
      items: itemMock,
      modelValue: valueMock,
      tyyppi: 'tyyppi1',
      validation: '',
      required: true,
      isEditing: true,
      multiple: true,
      update: () => {},
    });

    expect(wrapper.findAll('.multiselect__select')).toHaveLength(3);

    await wrapper.find('.roskalaatikko').trigger('click');
    await nextTick();
    expect(wrapper.findAll('.multiselect__select')).toHaveLength(2);

    await wrapper.find('.roskalaatikko').trigger('click');
    await nextTick();
    expect(wrapper.findAll('.multiselect__select')).toHaveLength(1);
  });

  test('Value changed correctly with single select', async () => {
    let values = [];
    const wrapper = mountWrapper({
      items: itemMock,
      modelValue: valueMockEmpty,
      tyyppi: 'tyyppi1',
      validation: '',
      required: true,
      isEditing: true,
      multiple: true,
      update: (newValues) => {
        values = newValues;
      },
    });

    expect(wrapper.vm.modelValue).toEqual([]);

    await wrapper.findAll('.multiselect__element').at(1)
      .find('.multiselect__option')
      .trigger('click');

    expect(wrapper.vm.modelValue).toEqual(['value2']);

    await wrapper.findAll('.multiselect__element').at(2)
      .find('.multiselect__option')
      .trigger('click');

    expect(wrapper.vm.modelValue).toEqual(['value3']);
  });

  test('Value changed correctly with multiple selects', async () => {
    let values = [];
    const wrapper = mountWrapper({
      items: itemMock,
      modelValue: valueMockEmpty,
      tyyppi: 'tyyppi1',
      validation: '',
      required: true,
      isEditing: true,
      multiple: true,
      update: (newValues) => {
        values = newValues;
      },
    });

    expect(wrapper.vm.modelValue).toEqual([]);

    await wrapper.find('.lisaa-valinta').trigger('click');
    await nextTick();

    await wrapper.findAll('.multiselect').at(0)
      .findAll('.multiselect__element')
      .at(1)
      .find('.multiselect__option')
      .trigger('click');

    expect(wrapper.vm.modelValue).toEqual(['value2']);

    await wrapper.findAll('.multiselect').at(1)
      .findAll('.multiselect__element')
      .at(1)
      .find('.multiselect__option')
      .trigger('click');

    expect(wrapper.vm.modelValue).toEqual(['value2']); // already selected

    await wrapper.findAll('.multiselect').at(1)
      .findAll('.multiselect__element')
      .at(2)
      .find('.multiselect__option')
      .trigger('click');

    expect(wrapper.vm.modelValue).toEqual(['value2', 'value3']);
  });

  test('Value changed correctly when removed', async () => {
    const values = ['value1', 'value2'];
    const wrapper = mountWrapper({
      items: itemMock,
      modelValue: values,
      tyyppi: 'tyyppi1',
      validation: '',
      required: true,
      isEditing: true,
      multiple: true,
    });

    expect(values).toEqual(['value1', 'value2']);
    expect(wrapper.findAll('.multiselect__select')).toHaveLength(2);

    await wrapper.findAll('.roskalaatikko').at(0)
      .trigger('click');
    await nextTick();

    expect(wrapper.vm.modelValue).toEqual(['value1']);
  });

  test('Value changed correctly when items changed on fly', async () => {
    const values = ['value1', 'value2'];
    let itemMocks = [
      {
        value: 'value1',
        text: 'text1',
      },
      {
        value: 'value2',
        text: 'text2',
      }, {
        value: 'value3',
        text: 'text3',
      },
    ];
    const wrapper = mountWrapper({
      items: itemMocks,
      modelValue: values,
      tyyppi: 'tyyppi1',
      validation: '',
      required: true,
      isEditing: true,
      multiple: true,
    });

    expect(values).toEqual(['value1', 'value2']);
    expect(wrapper.findAll('.multiselect__select')).toHaveLength(2);
    await nextTick();

    itemMocks = itemMocks.splice(0, 1);

    await wrapper.setProps({ items: itemMocks });
    await nextTick();

    expect(wrapper.findAll('.multiselect__select')).toHaveLength(1);
    expect(wrapper.vm.modelValue).toEqual(['value1']);
  });

  test('not editable', async () => {
    const values = ['value1', 'value2'];
    const wrapper = mountWrapper({
      items: itemMock,
      modelValue: values,
      isEditing: false,
      required: false,
      tyyppi: 'tyyppi1',
      validation: '',
      multiple: true,
    });

    expect(values).toEqual(['value1', 'value2']);
    expect(wrapper.findAll('.multiselect__select')).toHaveLength(0);
    expect(wrapper.findAll('.roskalaatikko')).toHaveLength(0);
    expect(wrapper.findAll('input')).toHaveLength(0);
    expect(wrapper.findAll('button')).toHaveLength(0);

    expect(wrapper.html()).toContain('text1');
    expect(wrapper.html()).toContain('text2');
  });

  test('Value preserved correctly on editing', async () => {
    const values = 'value1';
    const wrapper = mountWrapper({
      items: itemMock,
      modelValue: values,
      tyyppi: 'tyyppi1',
      validation: '',
      required: true,
      isEditing: true,
      multiple: false,
    });

    expect(values).toEqual('value1');

    await wrapper.findAll('.multiselect__element').at(1)
      .find('.multiselect__option')
      .trigger('click');

    await nextTick();

    expect(wrapper.vm.modelValue).toEqual('value2');

    await wrapper.findAll('.multiselect__element').at(2)
      .find('.multiselect__option')
      .trigger('click');

    expect(wrapper.vm.modelValue).toEqual('value3');
  });
});
