import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import EpSteps from './EpSteps.vue';
import { Kaannos } from '../../plugins/kaannos';
import VueI18n from 'vue-i18n';
import { findContaining } from '../../utils/jestutils';
import { Kielet } from '../../stores/kieli';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';

Vue.use(BootstrapVue);

describe('EpSteps component', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  Kielet.install(localVue);
  localVue.use(new Kaannos());

  const propsData = {
    steps: [{
      key: 'first',
      name: 'First step',
      description: 'First description',
      isValid: jest.fn(() => true),
    }, {
      key: 'second',
      name: 'Second step',
      description: 'Second description',
      isValid: jest.fn(() => true),
    }],
    onSave: jest.fn(),
  };

  test('Renders', async () => {
    const wrapper = mount(EpSteps, {
      localVue,
      propsData,
      mocks: {
        $t: x => x,
      },
      stubs: {
        fas: '<div />',
        'router-link': RouterLinkStub,
      },
    });

    expect(wrapper.html()).toContain('First step');
    expect(wrapper.html()).toContain('First description');
    expect(findContaining(wrapper, 'button', 'edellinen')).toBeFalsy();
    findContaining(wrapper, 'button', 'seuraava')!.trigger('click');
    expect(propsData.steps[0].isValid).toHaveBeenCalledTimes(1);

    findContaining(wrapper, 'button', 'edellinen')!.trigger('click');
    findContaining(wrapper, 'button', 'seuraava')!.trigger('click');

    expect(wrapper.html()).toContain('Second step');
    expect(wrapper.html()).toContain('Second description');
    findContaining(wrapper, 'button', 'tallenna')!.trigger('click');
    expect(propsData.steps[1].isValid).toHaveBeenCalledTimes(1);
    expect(propsData.onSave).toHaveBeenCalledTimes(1);
  });
});
