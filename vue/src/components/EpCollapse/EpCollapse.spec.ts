import EpCollapse from './EpCollapse.vue';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';

describe('EpCollapse component', () => {

  function createOptions(options = {}) {
    return {
      slots: {
        header: '<h3>Hello world</h3>',
        default: '<b>Foobar</b>',
      },
      props: {
        expandedByDefault: true,
        ...options,
      },
    };
  }

  const expects = {
    header: '>Hello world</h3>',
    default: '>Foobar</b>',
  };

  it('Renders header and content with alternative default state', async () => {
    const options = createOptions({
      expandedByDefault: false,
    });
    const wrapper = mount(EpCollapse, options);
    await nextTick();
    expect(wrapper.html()).toContain(expects.header);
    expect(wrapper.html()).not.toContain(expects.default);
  });

  it('Renders header and content', async () => {
    const options = createOptions();
    const wrapper = mount(EpCollapse, options);
    await nextTick();
    expect(wrapper.html()).toContain(expects.header);
    expect(wrapper.html()).toContain(expects.default);
  });

  it('Renders header only when collapsed', async () => {
    const options = createOptions();
    const wrapper = mount(EpCollapse, options);
    wrapper.find('.collapse-button').trigger('click');
    expect(wrapper.html()).toContain(expects.header);
    expect(wrapper.html()).not.toContain(expects.default);
  });
});
