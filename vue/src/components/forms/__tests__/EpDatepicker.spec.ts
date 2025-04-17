import { mount } from '@vue/test-utils';
import EpDatepicker from '../EpDatepicker.vue';
import { createI18n } from 'vue-i18n';

describe.skip('EpDatepicker component', () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'fi',
    messages: {
      fi: {
        'valitse-pvm': 'valitse-pvm',
        'valitse-pvm-jana': 'valitse-pvm-jana',
        'validation-error-required': 'validation-error-required',
        'validi': 'validi',
      },
    }
  });

  it('Render component', () => {
    const wrapper = mount(EpDatepicker, {
      global: {
        plugins: [i18n],
      },
      props: {
        value: 1546870463248,
      },
    });

    expect(wrapper.find('div').text()).toBe('7.1.2019');
  });

  it('Render component in editing mode', () => {
    const wrapper = mount(EpDatepicker, {
      global: {
        plugins: [i18n],
      },
      props: {
        value: 1546870463248,
        isEditing: true,
      },
    });

    expect(wrapper.find('div').text()).toContain('2019-01-07');
  });

  it('Test Validation fail', () => {
    const wrapper = mount(EpDatepicker, {
      global: {
        plugins: [i18n],
      },
      props: {
        value: null,
        isEditing: true,
        validation: {
          required: false,
          $model: null,
          $invalid: true,
          $dirty: true,
          $anyDirty: true,
          $error: true,
          $anyError: true,
          $pending: false,
          $params: {
            required: {
              type: 'required',
            },
          },
        },
      },
    });

    expect(wrapper.find('.invalid-feedback').exists()).toBe(true);
    expect(wrapper.find('.valid-feedback').exists()).toBe(false);
  });

  it('Test validation success', () => {
    const wrapper = mount(EpDatepicker, {
      global: {
        plugins: [i18n],
      },
      props: {
        value: 1552946400000,
        isEditing: true,
        validMessage: 'validi',
        validation: {
          required: true,
          $model: 1552946400000,
          $invalid: false,
          $dirty: false,
          $anyDirty: false,
          $error: false,
          $anyError: false,
          $pending: false,
          $params: {
            required: {
              type: 'required',
            },
          },
        },
      },
    });

    expect(wrapper.find('.valid-feedback').exists()).toBe(true);
    expect(wrapper.find('.invalid-feedback').exists()).toBe(false);
  });
});
