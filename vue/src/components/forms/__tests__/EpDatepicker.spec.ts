import { createLocalVue, mount } from '@vue/test-utils';
import EpDatepicker from '../EpDatepicker.vue';
import VueI18n from 'vue-i18n';
import { Kaannos } from '../../../plugins/kaannos';
import { Kielet } from '../../../stores/kieli';
import { Aikaleima } from '../../../plugins/aikaleima';

describe('EpDatepicker component', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  localVue.use(new Kaannos());
  localVue.use(new Aikaleima());
  Kielet.install(localVue, {
    messages: {
      fi: {
        'valitse-pvm': 'valitse-pvm',
        'valitse-pvm-jana': 'valitse-pvm-jana',
        'validation-error-required': 'validation-error-required',
      }
    },
  });
  const i18n = Kielet.i18n;

  const stubs = ['fas'];

  it('Render component', () => {
    const wrapper = mount(EpDatepicker, {
      localVue,
      propsData: {
        value: 1546870463248,
      },
      i18n,
      stubs,
    });

    expect(wrapper.find('div').text()).toBe('7. tammikuuta 2019');
  });

  it('Render component in editing mode', () => {
    const wrapper = mount(EpDatepicker, {
      localVue,
      i18n,
      stubs,
      propsData: {
        value: 1546870463248,
        isEditing: true,
      },
    });
  });

  it('Test Validation fail', () => {
    const wrapper = mount(EpDatepicker, {
      localVue,
      stubs,
      i18n,
      propsData: {
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
    expect(wrapper.find('.is-invalid').exists()).toBe(true);
    expect(wrapper.find('.valid-feedback').exists()).toBe(false);
    expect(wrapper.find('.is-valid').exists()).toBe(false);
  });

  it('Test validation success', () => {
    const wrapper = mount(EpDatepicker, {
      localVue,
      stubs,
      propsData: {
        value: 1552946400000,
        isEditing: true,
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

    expect(wrapper.find('.is-valid').exists()).toBe(true);
    expect(wrapper.find('.is-invalid').exists()).toBe(false);

    expect(wrapper.find('.invalid-feedback').exists()).toBe(false);
  });
});
