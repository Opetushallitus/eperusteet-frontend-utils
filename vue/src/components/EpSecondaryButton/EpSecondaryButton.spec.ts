import { mount } from '@vue/test-utils';
import EpSecondaryButton from './EpSecondaryButton.vue';
import { globalStubs } from '@shared/utils/__tests__/stubs';

describe('EpSecondaryButton component', () => {
  const mountWrapper = (props = {}, slots = { default: 'Button text' }) => {
    return mount(EpSecondaryButton, {
      props,
      slots,
      global: {
        ...globalStubs,
      },
    });
  };

  test('Renders div with secondary-button class when no to prop', () => {
    const wrapper = mountWrapper();

    expect(wrapper.find('.secondary-button').exists()).toBe(true);
    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.text()).toBe('Button text');
  });

  test('Emits click when clicked without to prop', async () => {
    const wrapper = mountWrapper();

    await wrapper.find('.secondary-button').trigger('click');

    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  test('Renders router-link when to prop is provided', () => {
    const wrapper = mountWrapper({
      to: { name: 'uutiset' },
    });

    expect(wrapper.find('.secondary-button').exists()).toBe(true);
    const link = wrapper.findComponent({ name: 'RouterLinkStub' });
    expect(link.exists()).toBe(true);
    expect(link.props('to')).toEqual({ name: 'uutiset' });
    expect(wrapper.text()).toBe('Button text');
  });

  test('Does not emit click when to prop is provided', async () => {
    const wrapper = mountWrapper({
      to: { name: 'uutiset' },
    });

    await wrapper.find('.secondary-button').trigger('click');

    expect(wrapper.emitted('click')).toBeUndefined();
  });
});
