import { mount } from '@vue/test-utils';
import EpContentView from './EpContentView.vue';
import { globalStubs } from '@shared/utils/__tests__/stubs';

describe('EpContentView component', () => {
  test('Renders', async () => {
    const wrapper = mount(EpContentView, {
      global: globalStubs,
      slots: {
        default: 'DEFAULT SLOT',
        'custom-content': 'CUSTOM CONTENT',
        after: 'AFTER CONTENT',
      },
    });

    expect(wrapper.html()).toContain('DEFAULT SLOT');
    expect(wrapper.html()).toContain('CUSTOM CONTENT');
    expect(wrapper.html()).toContain('AFTER CONTENT');
  });
});
