import EpSteps from './EpSteps.vue';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { Kaannos } from '../../plugins/kaannos';
import { Kielet } from '../../stores/kieli';
import { findContaining } from '../../utils/jestutils';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { vi } from 'vitest';
import { globalStubs } from '@shared/utils/__tests__/stubs';
import { nextTick } from 'vue';

describe('EpSteps component', () => {
  const props = {
    steps: [{
      key: 'first',
      name: 'First step',
      description: 'First description',
      isValid: vi.fn(() => true),
    }, {
      key: 'second',
      name: 'Second step',
      description: 'Second description',
      isValid: vi.fn(() => true),
    }],
    onSave: vi.fn(),
  };

  test('Renders', async () => {
    const wrapper = mount(EpSteps, {
      props,
      global: {
        ...globalStubs,
      },
    });

    expect(wrapper.html()).toContain('First step');
    expect(wrapper.html()).toContain('First description');
    expect(findContaining(wrapper, '.b-button', 'edellinen')).toBeFalsy();

    findContaining(wrapper, '.b-button', 'seuraava')!.trigger('click');

    await nextTick();

    expect(props.steps[0].isValid).toHaveBeenCalledTimes(2);

    findContaining(wrapper, '.b-button', 'edellinen')!.trigger('click');

    await nextTick();

    findContaining(wrapper, '.b-button', 'seuraava')!.trigger('click');

    await nextTick();

    expect(wrapper.html()).toContain('Second step');
    expect(wrapper.html()).toContain('Second description');
    findContaining(wrapper, '.b-button', 'tallenna')!.trigger('click');

    await nextTick();

    expect(props.steps[1].isValid).toHaveBeenCalledTimes(3);
    expect(props.onSave).toHaveBeenCalledTimes(1);
  });
});
